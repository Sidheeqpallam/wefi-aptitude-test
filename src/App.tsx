import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { SsfLogo } from '@/components/SsfLogo';
import { StudentQrCode } from '@/components/StudentQrCode.tsx';
import { RegistrationForm } from '@/components/RegistrationForm';
import { AptitudeTest } from '@/components/AptitudeTest';
import { Results } from '@/components/Results';
import { StudentNotes } from '@/components/StudentNotes';
import CounselorApp from '@/components/CounselorApp';
import { QrCode, X } from 'lucide-react';
import { getProductRouteConfig } from '@/lib/productParams';
import LandingPage from './components/LandingPage';
import { Footer } from './components/Footer';

const queryClient = new QueryClient();



function Layout() {
  const { registration } = useApp();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const config = getProductRouteConfig(searchParams);

  const canShowQr = !!registration?.id && config.showQr && location.pathname !== '/register';

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="sticky top-0 z-10 border-b border-[#dbe7f7] bg-[linear-gradient(135deg,#ffffff_0%,#f3f8ff_48%,#fff6f3_100%)] shadow-[0_12px_30px_rgba(17,88,168,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center justify-center">
            <SsfLogo className="h-9 sm:h-10" />
          </div>

          {canShowQr && registration && (
            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9daf1] bg-white/85 px-3 py-2 text-sm font-semibold text-[#1d4f86] shadow-sm transition hover:border-[#aac4e6] hover:bg-white"
              aria-label="Show my QR code"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">My QR</span>
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/test/:participantId" element={<AptitudeTest />} />
          <Route path="/results/:participantId" element={<Results />} />
          <Route path="/notes/:participantId" element={<StudentNotes />} />
          <Route path="*" element={<Navigate to={`/register${location.search}`} replace />} />
        </Routes>
      </main>

      <div className="mx-auto w-full max-w-xl px-4 pb-6">
        <Footer />
      </div>

      {canShowQr && registration && isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close QR popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Student QR</p>
            </div>

            <StudentQrCode
              registration={registration}
              size={220}
              helperText='Show this to your counselor'
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PublicApp() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/counselor/*" element={<CounselorApp />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<PublicApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
