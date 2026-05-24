import { CAREER_APTITUDE_API_BASE_URL } from '@/lib/apiConfig';
import { createHttpClient, HttpError } from '@/lib/httpClient';

export const COUNSELOR_AUTH_ERROR_KEY = 'counselorAuthError';

const clearCounselorAuth = () => {
  localStorage.removeItem('counselorInfo');
};

const getCounselorId = () => {
  const rawCounselorInfo = localStorage.getItem('counselorInfo');
  if (!rawCounselorInfo) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawCounselorInfo) as { id?: string };
    return parsed.id ?? null;
  } catch {
    localStorage.removeItem('counselorInfo');
    return null;
  }
};

const forceCounselorLogout = (message: string) => {
  clearCounselorAuth();
  sessionStorage.setItem(COUNSELOR_AUTH_ERROR_KEY, message);

  if (window.location.pathname !== '/counselor/login') {
    window.location.replace('/counselor/login');
  }
};
const http = createHttpClient({
  baseURL: CAREER_APTITUDE_API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const counselorId = getCounselorId();
  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      ...(counselorId ? { 'x-counselor-id': counselorId } : {}),
    },
  };
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof HttpError && error.status === 401) {
      forceCounselorLogout('Your session has expired. Please sign in again.');
    }

    if (error instanceof HttpError && error.status === 403) {
      forceCounselorLogout('Forbidden');
    }

    throw error;
  },
);

export default http;