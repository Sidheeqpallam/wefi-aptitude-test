import { Navigate, useLocation } from 'react-router-dom';

export function MobileEntry() {
  const location = useLocation();
  return <Navigate to={`/register${location.search}`} replace />;
}
