import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { getRegistration, submitAptitudeTest, saveTestResult } from '@/api/educine';
import {
  QUESTIONS,
  CATEGORY_LABELS,
  CATEGORY_MAX_SCORES,
  SCORE_LABELS,
  calculateScores,
  getScorePercentage,
  getTopCategories,
} from '@/data/questions';
import type { RiasecCategory } from '@/data/questions';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';

// Questions are used in the exact order provided in `QUESTIONS` (Excel order)

export function AptitudeTest() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registration, language, toggleLanguage, setScores, setRegistration } = useApp();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  useEffect(() => {
    if (!participantId || registration?.id === participantId) {
      return;
    }

    setLoadingRegistration(true);
    getRegistration(participantId)
      .then((data) => setRegistration(data))
      .catch(() => setError('Could not load participant details. Please start again.'))
      .finally(() => setLoadingRegistration(false));
  }, [participantId, registration?.id, setRegistration]);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const allAnswered = answeredCount === QUESTIONS.length;

  const setAnswer = useCallback((qId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  }, []);

  const handleSubmit = async () => {
    if (!registration || !participantId) return;

    setError('');
    setSubmitting(true);
    try {
      const scores = calculateScores(answers);
      const top = getTopCategories(scores);

      // Build aptitude array for API using exact data from the sheet
      const aptitudeTest = QUESTIONS.map((q) => ({
        question: q.english,
        answer: answers[q.id] ?? 0,
        category: q.category, // send the exact category code from the sheet
      }));

      await submitAptitudeTest(participantId, aptitudeTest);

      const resultStr = top
        .map((c, i) => {
          const max = CATEGORY_MAX_SCORES[c];
          const percentage = getScorePercentage(c, scores[c]);
          const categoryName = CATEGORY_LABELS[c].english;
          return `#${i + 1} ${categoryName}: ${scores[c]}/${max} (${percentage}%)`;
        })
        .join('\n');
      await saveTestResult(participantId, resultStr);

      setScores(scores, top as RiasecCategory[]);
      navigate(`/results/${participantId}${location.search}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      {loadingRegistration && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Loading participant details...
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Career Aptitude Test</h2>
          <p className="text-xs text-gray-400 mt-0.5">{answeredCount}/{QUESTIONS.length} answered</p>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Languages className="h-3.5 w-3.5" />
          {language === 'malayalam' ? 'English' : 'മലയാളം'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="sticky top-18 z-20 -mx-2 rounded-2xl border border-blue-100 bg-white/95 px-2 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/85">
        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-800">
        <span className="font-malayalam">
          {language === 'malayalam'
            ? 'ഓരോ പ്രസ്‌താവനകളും വായിക്കുക. 1 (തീർത്തും ഇല്ല) മുതൽ 5 (വളരെ ഏറെ) വരെ തിരഞ്ഞെടുക്കുക.'
            : 'Read each statement and rate it from 1 (Not at all) to 5 (Very much).'}
        </span>
      </div>

      {/* All Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div
              key={q.id}
              className={cn(
                'rounded-2xl border-2 p-4 transition-all',
                selected !== undefined
                  ? 'border-primary/30 bg-blue-50/50'
                  : 'border-gray-200 bg-white',
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-[11px] font-semibold text-primary">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium text-gray-800 leading-relaxed',
                      language === 'malayalam' && 'font-malayalam',
                    )}
                  >
                    {language === 'malayalam' ? q.malayalam : q.english}
                  </p>
                </div>
              </div>

              {/* 1-5 Scale */}
              <div className="flex gap-2 justify-between">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setAnswer(q.id, score)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 rounded-xl py-2 border-2 transition-all active:scale-95',
                      selected === score
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:bg-blue-50',
                    )}
                  >
                    <span className="text-base font-bold">{score}</span>
                    <span
                      className={cn(
                        'text-[9px] leading-tight text-center hidden sm:block',
                        language === 'malayalam' && 'font-malayalam',
                      )}
                    >
                      {language === 'malayalam'
                        ? SCORE_LABELS[score].malayalam
                        : SCORE_LABELS[score].english}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Submit */}
      <div className="space-y-2">
        <Button
          className="w-full"
          variant="secondary"
          loading={submitting}
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          See My Results
        </Button>
        {!allAnswered && (
          <p className="text-center text-xs text-amber-600">
            Please answer all questions before submitting ({QUESTIONS.length - answeredCount} remaining).
          </p>
        )}
      </div>
    </div>
  );
}
