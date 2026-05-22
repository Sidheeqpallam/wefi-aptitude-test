import { Navigate, useLocation } from 'react-router-dom';

export function ConfirmCheckin() {
  const location = useLocation();
  return <Navigate to={`/register${location.search}`} replace />;
}
