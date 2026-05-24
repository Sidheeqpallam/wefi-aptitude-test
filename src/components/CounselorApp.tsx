import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/CounselorAuthContext';
import CounselorDashboard from '@/components/CounselorDashboard';
import CounselorLogin from '@/components/CounselorLogin';

function CounselorLoading() {
  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedCounselorRoute() {
  const { counselor, isLoading } = useAuth();

  if (isLoading) {
    return <CounselorLoading />;
  }

  return counselor ? <CounselorDashboard /> : <Navigate to="/counselor/login" replace />;
}

function PublicCounselorRoute() {
  const { counselor, isLoading } = useAuth();

  if (isLoading) {
    return <CounselorLoading />;
  }

  return counselor ? <Navigate to="/counselor/dashboard" replace /> : <CounselorLogin />;
}

export default function CounselorApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/counselor/login" replace />} />
        <Route path="/login" element={<PublicCounselorRoute />} />
        <Route path="/dashboard" element={<ProtectedCounselorRoute />} />
        <Route path="*" element={<Navigate to="/counselor/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}