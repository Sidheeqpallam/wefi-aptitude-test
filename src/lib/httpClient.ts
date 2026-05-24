type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type PrimitiveParam = string | number | boolean;
type QueryParamValue = PrimitiveParam | PrimitiveParam[] | null | undefined;

export type RequestHeaders = Record<string, string>;

export type RequestConfig = {
  headers?: RequestHeaders;
  body?: BodyInit | object | unknown[] | null;
  params?: Record<string, QueryParamValue>;
  signal?: AbortSignal;
  timeout?: number;
};

type InternalRequestConfig = RequestConfig & {
  method: HttpMethod;
  url: string;
};

export type HttpResponse<T = any> = {
  data: T;
  status: number;
  headers: Headers;
};

export class HttpError<T = any> extends Error {
  status: number;
  data: T | null;
  headers: Headers;

  constructor(message: string, status: number, data: T | null, headers: Headers) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
    this.headers = headers;
  }
}

type RequestInterceptor = (config: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>;
type ResponseSuccessInterceptor = (response: HttpResponse<unknown>) => HttpResponse<unknown> | Promise<HttpResponse<unknown>>;
type ResponseErrorInterceptor = (error: unknown) => unknown;

type CreateHttpClientOptions = {
  baseURL: string;
  defaultHeaders?: RequestHeaders;
  timeout?: number;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//.test(value);

export const extractMessageFromPayload = (payload: unknown): string | null => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if ('message' in payload && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  if ('error' in payload && typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }

  return null;
};

const appendQueryParams = (url: URL, params?: Record<string, QueryParamValue>) => {
  if (!params) {
    return;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        url.searchParams.append(key, String(item));
      });
      return;
    }

    url.searchParams.set(key, String(value));
  });
};

const getContentTypeHeaderKey = (headers: RequestHeaders) =>
  Object.keys(headers).find((key) => key.toLowerCase() === 'content-type');

const normalizeBody = (body: RequestConfig['body'], headers: RequestHeaders) => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData) {
    const contentTypeKey = getContentTypeHeaderKey(headers);
    if (contentTypeKey) {
      delete headers[contentTypeKey];
    }
    return body;
  }

  if (body instanceof URLSearchParams || body instanceof Blob || typeof body === 'string') {
    return body;
  }

  const contentTypeKey = getContentTypeHeaderKey(headers) ?? 'Content-Type';
  headers[contentTypeKey] = headers[contentTypeKey] ?? 'application/json';
  return JSON.stringify(body);
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
};

const buildUrl = (baseURL: string, path: string, params?: Record<string, QueryParamValue>) => {
  const rawUrl = isAbsoluteUrl(path)
    ? new URL(path)
    : new URL(path.startsWith('/') ? `${baseURL}${path}` : `${baseURL}/${path}`, window.location.origin);

  appendQueryParams(rawUrl, params);

  if (isAbsoluteUrl(path) || isAbsoluteUrl(baseURL)) {
    return rawUrl.toString();
  }

  return `${rawUrl.pathname}${rawUrl.search}`;
};

export const createHttpClient = ({ baseURL, defaultHeaders = {}, timeout = 10000 }: CreateHttpClientOptions) => {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseSuccessInterceptors: ResponseSuccessInterceptor[] = [];
  const responseErrorInterceptors: ResponseErrorInterceptor[] = [];

  const applyRequestInterceptors = async (config: InternalRequestConfig) => {
    let nextConfig = config;
    for (const interceptor of requestInterceptors) {
      nextConfig = await interceptor(nextConfig);
    }
    return nextConfig;
  };

  const applyResponseSuccessInterceptors = async <T,>(response: HttpResponse<T>) => {
    let nextResponse = response as HttpResponse<unknown>;
    for (const interceptor of responseSuccessInterceptors) {
      nextResponse = await interceptor(nextResponse);
    }
    return nextResponse as HttpResponse<T>;
  };

  const applyResponseErrorInterceptors = async (error: unknown): Promise<never> => {
    let nextError = error;
    for (const interceptor of responseErrorInterceptors) {
      try {
        const maybeError = await interceptor(nextError);
        if (maybeError !== undefined) {
          nextError = maybeError;
        }
      } catch (interceptedError) {
        nextError = interceptedError;
      }
    }
    throw nextError;
  };

  const request = async <T,>(method: HttpMethod, path: string, config: RequestConfig = {}): Promise<HttpResponse<T>> => {
    const preparedConfig = await applyRequestInterceptors({
      method,
      url: buildUrl(baseURL, path, config.params),
      ...config,
    });

    const headers: RequestHeaders = {
      ...defaultHeaders,
      ...(preparedConfig.headers ?? {}),
    };

    const controller = new AbortController();
    const abortExternalSignal = () => controller.abort(preparedConfig.signal?.reason);
    if (preparedConfig.signal) {
      if (preparedConfig.signal.aborted) {
        abortExternalSignal();
      } else {
        preparedConfig.signal.addEventListener('abort', abortExternalSignal, { once: true });
      }
    }

    const timeoutId = window.setTimeout(() => controller.abort(), preparedConfig.timeout ?? timeout);

    try {
      const response = await fetch(preparedConfig.url, {
        method: preparedConfig.method,
        headers,
        body: normalizeBody(preparedConfig.body, headers),
        signal: controller.signal,
      });

      const data = await parseResponseBody(response);

      if (!response.ok) {
        throw new HttpError(
          (extractMessageFromPayload(data) ?? response.statusText) || 'Request failed',
          response.status,
          data,
          response.headers,
        );
      }

      return applyResponseSuccessInterceptors({
        data: data as T,
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return applyResponseErrorInterceptors(new HttpError('Request timed out', 408, null, new Headers()));
      }

      if (error instanceof HttpError) {
        return applyResponseErrorInterceptors(error);
      }

      return applyResponseErrorInterceptors(
        new HttpError(error instanceof Error && error.message ? error.message : 'Network request failed', 0, null, new Headers()),
      );
    } finally {
      window.clearTimeout(timeoutId);
      preparedConfig.signal?.removeEventListener('abort', abortExternalSignal);
    }
  };

  return {
    interceptors: {
      request: {
        use(interceptor: RequestInterceptor) {
          requestInterceptors.push(interceptor);
        },
      },
      response: {
        use(onSuccess: ResponseSuccessInterceptor, onError?: ResponseErrorInterceptor) {
          responseSuccessInterceptors.push(onSuccess);
          if (onError) {
            responseErrorInterceptors.push(onError);
          }
        },
      },
    },
    get<T = any>(path: string, config?: Omit<RequestConfig, 'body'>) {
      return request<T>('GET', path, config);
    },
    post<T = any>(path: string, body?: RequestConfig['body'], config?: Omit<RequestConfig, 'body'>) {
      return request<T>('POST', path, { ...config, body });
    },
    put<T = any>(path: string, body?: RequestConfig['body'], config?: Omit<RequestConfig, 'body'>) {
      return request<T>('PUT', path, { ...config, body });
    },
    patch<T = any>(path: string, body?: RequestConfig['body'], config?: Omit<RequestConfig, 'body'>) {
      return request<T>('PATCH', path, { ...config, body });
    },
    delete<T = any>(path: string, config?: Omit<RequestConfig, 'body'>) {
      return request<T>('DELETE', path, config);
    },
  };
};
