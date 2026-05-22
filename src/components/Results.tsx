import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { CATEGORY_LABELS, CATEGORY_MAX_SCORES, getScorePercentage, getTopCategories } from '@/data/questions';
import type { RiasecCategory } from '@/data/questions';
import { AptitudeTopProfiles } from './AptitudeTopProfiles';
import { generateResultsPdfBlob } from './ResultsPdfDocument';
import { Button } from '@/components/ui/Button';
import { RefreshCw, User, ArrowRight, MessageCircle } from 'lucide-react';
import { getAptitudeTestResult, getRegistration, sendAptitudeReportToWhatsapp } from '@/api/educine';
import { parseAptitudeResult } from '@/lib/riasec';
import { getProductRouteConfig } from '@/lib/productParams';

// Score bar component
function ScoreBar({ category, score }: { category: RiasecCategory; score: number }) {
  const info = CATEGORY_LABELS[category];
  const pct = getScorePercentage(category, score);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span style={{ color: info.color }}>{info.english}</span>
        <span className="text-gray-500">{score}/{CATEGORY_MAX_SCORES[category]} ({pct}%)</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: info.color }}
        />
      </div>
    </div>
  );
}

export function Results() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const config = getProductRouteConfig(searchParams);
  const { registration, scores, topCategories, language, toggleLanguage, reset, setRegistration, setScores } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!participantId) {
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([
      registration?.id === participantId ? Promise.resolve(registration) : getRegistration(participantId),
      scores ? Promise.resolve(null) : getAptitudeTestResult(participantId),
    ])
      .then(([participant, result]) => {
        if (!isMounted) return;

        if (participant && participant.id !== registration?.id) {
          setRegistration(participant);
        }

        if (!scores && result?.result) {
          const parsed = parseAptitudeResult(result.result);
          if (parsed) {
            setScores(parsed.scores, parsed.topCategories);
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [participantId, registration, scores, setRegistration, setScores]);

  if (!scores || !registration) return null;

  const top3 = topCategories.slice(0, 3) as RiasecCategory[];
  const rankedCategories = getTopCategories(scores);

  const generatePdfBlob = async (): Promise<Blob> =>
    generateResultsPdfBlob({
      registration,
      scores,
      topCategories: topCategories as RiasecCategory[],
      language,
    });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RIASEC-Result-${registration.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleSendWhatsapp = async () => {
    if (!participantId) {
      return;
    }

    setSendError('');
    setSendSuccess('');
    setSendingWhatsapp(true);
    try {
      const blob = await generatePdfBlob();
      const filename = `RIASEC-Result-${registration.name.replace(/\s+/g, '_')}.pdf`;
      await sendAptitudeReportToWhatsapp(participantId, blob, filename);
      setSendSuccess(`PDF report sent to ${registration.mobile} on WhatsApp.`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSendError(message ?? 'Could not send the PDF to WhatsApp. Please try again.');
    } finally {
      setSendingWhatsapp(false);
    }
  };

  const ml = language === 'malayalam';

  return (
    <div className="animate-fade-in space-y-5">
      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Your Results
        </h2>
        <button
          onClick={toggleLanguage}
          className="text-xs text-primary font-medium underline underline-offset-2"
        >
          {ml ? 'English' : 'മലയാളം'}
        </button>
      </div>

      {/* ── Printable / PDF area ── */}
      <div className="bg-white rounded-2xl p-5 space-y-5 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <User className="h-14 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">RIASEC Career Aptitude</p>
            <p className="font-bold text-gray-900 text-lg leading-tight">{registration.name}</p>
            <p className="text-xs text-gray-500">{registration.mobile}{registration.place ? ` · ${registration.place}` : ''}</p>
          </div>
        </div>

        {/* Top 3 categories */}
        <AptitudeTopProfiles
          scores={scores}
          topCategories={top3}
          language={language}
          title="Top 3 Career Profiles"
        />

        {/* Score breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Score Breakdown
          </p>
          {rankedCategories.map((category) => (
            <ScoreBar key={category} category={category} score={scores[category]} />
          ))}
        </div>

      </div>

      {/* Action buttons */}
      <div className="grid gap-3">
        <Button onClick={handleDownload} loading={downloading} variant="primary" className="w-full">
          Download PDF
        </Button>
        <Button onClick={handleSendWhatsapp} loading={sendingWhatsapp} variant="ghost" className="w-full">
          <MessageCircle className="h-4 w-4" />
          Send to WhatsApp
        </Button>
        {config.showQr && participantId && (
          <Link
            to={`/notes/${participantId}${location.search}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#c9daf1] bg-white px-4 py-3 text-sm font-semibold text-[#1d4f86] shadow-sm transition hover:border-[#aac4e6]"
          >
            Counselor Notes
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {sendSuccess && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {sendSuccess}
        </p>
      )}

      {sendError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sendError}
        </p>
      )}

      {loading && (
        <p className="text-center text-sm text-slate-500">Loading result...</p>
      )}

      <button
        onClick={() => {
          reset();
          navigate(`/register${location.search}`);
        }}
        className="flex w-full items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Start over
      </button>
    </div>
  );
}
