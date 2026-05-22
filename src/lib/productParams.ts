export interface ProductRouteConfig {
  source: string | null;
  sourceContext: string | null;
  entityId: string | null;
  showQr: boolean;
}

export const getProductRouteConfig = (searchParams: URLSearchParams): ProductRouteConfig => {
  const qrParam = searchParams.get('qr');
  const showQr = qrParam !== null && qrParam !== '0' && qrParam !== 'false';

  return {
    source: searchParams.get('source') || searchParams.get('utm_source') || searchParams.get('ref'),
    sourceContext:
      searchParams.get('sourceContext') ||
      searchParams.get('event') ||
      searchParams.get('utm_campaign'),
    entityId: searchParams.get('entityId'),
    showQr,
  };
};