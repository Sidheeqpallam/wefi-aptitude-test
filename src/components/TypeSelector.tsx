import { Navigate, useLocation } from 'react-router-dom';

export function TypeSelector() {
  const location = useLocation();
  return <Navigate to={`/register${location.search}`} replace />;
}
