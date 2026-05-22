import { CATEGORY_LABELS } from '@/data/questions';
import type { RiasecCategory, RiasecScores } from '@/data/questions';

export function parseAptitudeResult(resultStr: string): { scores: RiasecScores; topCategories: RiasecCategory[] } | null {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const topCategories: RiasecCategory[] = [];

  const categoryMap: Record<string, RiasecCategory> = {};
  Object.entries(CATEGORY_LABELS).forEach(([code, label]) => {
    categoryMap[label.english] = code as RiasecCategory;
  });

  const matches = resultStr.matchAll(/#\d+\s+([\w\s]+?):\s*(\d+)\/\d+/g);
  for (const match of matches) {
    const code = categoryMap[match[1].trim()];
    const score = Number.parseInt(match[2], 10);
    if (code) {
      scores[code] = score;
      if (!topCategories.includes(code)) {
        topCategories.push(code);
      }
    }
  }

  return topCategories.length > 0 ? { scores, topCategories } : null;
}