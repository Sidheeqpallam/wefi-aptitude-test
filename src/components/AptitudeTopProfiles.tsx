import { CATEGORY_LABELS, CATEGORY_MAX_SCORES, getScorePercentage } from '@/data/questions';
import { RESULT_DESCRIPTIONS } from '@/data/results';
import type { RiasecCategory, RiasecScores } from '@/data/questions';

type AptitudeTopProfilesProps = {
  scores: RiasecScores;
  topCategories: RiasecCategory[];
  language: 'english' | 'malayalam';
  title: string;
  className?: string;
};

export function AptitudeTopProfiles({
  scores,
  topCategories,
  language,
  title,
  className,
}: AptitudeTopProfilesProps) {
  const ml = language === 'malayalam';

  return (
    <div className={className ?? 'space-y-3'}>
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      {topCategories.slice(0, 3).map((cat, index) => {
        const desc = RESULT_DESCRIPTIONS[cat];
        const catInfo = CATEGORY_LABELS[cat];
        const max = CATEGORY_MAX_SCORES[cat];
        const percentage = getScorePercentage(cat, scores[cat]);

        return (
          <div
            key={cat}
            className="rounded-xl border-2 p-4"
            style={{ borderColor: `${catInfo.color}40`, background: `${catInfo.color}08` }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: catInfo.color }}
              >
                #{index + 1}
              </span>
              <span className="font-bold text-gray-900">
                {ml ? desc.title.malayalam : desc.title.english}
              </span>
              <span className="ml-auto text-xs text-gray-400">{scores[cat]}/{max} ({percentage}%)</span>
            </div>
            <p className={`text-sm leading-relaxed text-gray-700 ${ml ? 'font-malayalam' : ''}`}>
              {ml ? desc.summary.malayalam : desc.summary.english}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {(ml ? desc.careers.malayalam : desc.careers.english).map((career) => (
                <span
                  key={career}
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: `${catInfo.color}18`, color: catInfo.color }}
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}