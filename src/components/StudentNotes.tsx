import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import type { RiasecCategory, RiasecScores } from '@/data/questions';
import { getStudentNotes, getAptitudeTestResult, getRegistration, sendAptitudeReportToWhatsapp } from '@/api/educine';
import type { CounselorNote } from '@/api/educine';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AptitudeTopProfiles } from './AptitudeTopProfiles';
import { generateResultsPdfBlob } from './ResultsPdfDocument';
import { CounselorNoteCard } from '@/components/CounselorNoteCard';
import { BookOpen, User, CheckCircle2, AlertTriangle, Download, Languages, MessageCircle } from 'lucide-react';
import { parseAptitudeResult } from '@/lib/riasec';

export function StudentNotes() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registration, language, toggleLanguage, setRegistration } = useApp();
  const [notes, setNotes] = useState<CounselorNote[]>([]);
  const [aptitude, setAptitude] = useState<{ scores: RiasecScores; topCategories: RiasecCategory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReattemptWarning, setShowReattemptWarning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!participantId) return;

    Promise.all([
      registration?.id === participantId ? Promise.resolve(registration) : getRegistration(participantId),
      getStudentNotes(participantId),
      getAptitudeTestResult(participantId),
    ])
      .then(([participant, notesData, resultData]) => {
        if (participant && participant.id !== registration?.id) {
          setRegistration(participant);
        }
        setNotes(notesData);
        if (resultData?.result) {
          const parsed = parseAptitudeResult(resultData.result);
          if (parsed) setAptitude(parsed);
        }
      })
      .catch(() => setError('Could not load data. Please try again.'))
      .finally(() => setLoading(false));
  }, [participantId, registration, setRegistration]);

  const handleDownloadResult = async () => {
    if (!registration || !aptitude) {
      return;
    }

    setDownloading(true);
    try {
      const blob = await generateResultsPdfBlob({
        registration,
        scores: aptitude.scores,
        topCategories: aptitude.topCategories,
        language,
      });
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
    if (!registration || !aptitude || !participantId) {
      return;
    }

    setSendError('');
    setSendSuccess('');
    setSendingWhatsapp(true);
    try {
      const blob = await generateResultsPdfBlob({
        registration,
        scores: aptitude.scores,
        topCategories: aptitude.topCategories,
        language,
      });
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

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Counselor Notes</h2>
            <p className="text-xs text-gray-400">
              Advice &amp; guidance from your counselor
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          <Languages className="h-3.5 w-3.5" />
          {language === 'malayalam' ? 'English' : 'മലയാളം'}
        </button>
      </div>

      {/* Already checked-in banner + student name */}
      {registration && (
        <Card className="space-y-3 p-4!">
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Assessment profile ready</span>
            {registration.updatedAt && (
              <span className="ml-auto text-xs text-green-600 font-normal">
                {new Date(registration.updatedAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{registration.name}</p>
              <p className="text-xs text-gray-500">{registration.mobile}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Aptitude result (if available) */}
      {aptitude && (
        <div className="space-y-3">
          <AptitudeTopProfiles
            scores={aptitude.scores}
            topCategories={aptitude.topCategories}
            language={language}
            title="Aptitude Test Result"
          />
          <Button
            onClick={handleDownloadResult}
            loading={downloading}
            variant="primary"
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
          <Button
            onClick={handleSendWhatsapp}
            loading={sendingWhatsapp}
            variant="ghost"
            className="w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Send to WhatsApp
          </Button>
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
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
          <p className="text-sm">Loading notes…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Empty state */}
      {!loading && !error && notes.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-7 w-7 text-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">No notes yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your counselor hasn't added any notes for you yet. Check back after your counseling session.
            </p>
          </div>
        </div>
      )}

      {/* Notes list */}
      {!loading && !error && notes.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium px-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
          {notes.map((note) => (
            <CounselorNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Reattempt aptitude test */}
      {!loading && (
        <div className="pt-2">
          {!showReattemptWarning ? (
            <button
              onClick={() => setShowReattemptWarning(true)}
              className="w-full text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors py-1"
            >
              Reattempt aptitude test
            </button>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Reattempting will overwrite your existing aptitude test results. This is{' '}
                  <strong>not recommended</strong> unless advised by a counselor.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/test/${participantId}${location.search}`)}
                >
                  Proceed Anyway
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowReattemptWarning(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
