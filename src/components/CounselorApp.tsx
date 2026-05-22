import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/CounselorAuthContext';
import CounselorDashboard from '@/components/CounselorDashboard';
import CounselorLogin from '@/components/CounselorLogin';

function CounselorContent() {
  const { counselor, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return counselor ? <CounselorDashboard /> : <CounselorLogin />;
}

function CounselorShell() {
  return (
    <div className="min-h-screen">
      <CounselorContent />
    </div>
  );
}

export default function CounselorApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<CounselorShell />} />
        <Route path="*" element={<Navigate to="/counselor" replace />} />
      </Routes>
    </AuthProvider>
  );
}