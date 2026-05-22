// RIASEC Questions – 7 per category (42 total)
// Categories: R (Realistic), I (Investigative), A (Artistic), S (Social), E (Enterprising), C (Conventional)
// Scale: 1 (Strongly Disagree) → 5 (Strongly Agree)

export type RiasecCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  malayalam: string;
  english: string;
  category: RiasecCategory;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    malayalam: "എനിക്ക് കാറുകൾ റിപ്പയർ ചെയ്യാനോ അവയുമായി ബന്ധപ്പെട്ട ജോലികൾ ചെയ്യാനോ ഇഷ്ടമാണ്.",
    english: "I am able to repair cars.",
    category: "R"
  },
  {
    id: 2,
    malayalam: "എനിക്ക് പസിലുകൾ (Puzzles) പരിഹരിക്കാൻ ഇഷ്ടമാണ്.",
    english: "I enjoy solving puzzles.",
    category: "I"
  },
  {
    id: 3,
    malayalam: "ഒറ്റക്ക് (Independently) ജോലി ചെയ്യാൻ എനിക്ക് താല്പര്യം.",
    english: "I work well independently.",
    category: "A"
  },
  {
    id: 4,
    malayalam: "മറ്റുള്ളവരുമായി ചേർന്ന് ഒരു ടീമായി ജോലി ചെയ്യാൻ എനിക്ക് ഇഷ്ടമാണ്.",
    english: "I collaborate effectively in team settings.",
    category: "S"
  },
  {
    id: 5,
    malayalam: "ഞാൻ ലക്ഷ്യബോധമുള്ള (Ambitious) വ്യക്തിയാണ്. എന്റെ ലക്ഷ്യങ്ങൾ ഞാൻ സ്വയം സെറ്റ് ചെയ്യും.",
    english: "I set my own goals.",
    category: "E"
  },
  {
    id: 6,
    malayalam: "കാര്യങ്ങൾ അടുക്കും ചിട്ടയോടും കൂടി ക്രമീകരിക്കാൻ (Organize) എനിക്ക് ഇഷ്ടമാണ് (ഉദാഹരണത്തിന്: ഫയലുകൾ, ഡെസ്ക്, ഓഫീസ്).",
    english: "I tend to keep things organized and tidy.",
    category: "C"
  },
  {
    id: 7,
    malayalam: "പുതിയ സാധനങ്ങൾ നിർമ്മിക്കാൻ എനിക്ക് താൽപ്പര്യമുണ്ട്.",
    english: "I am interested in construction work.",
    category: "R"
  },
  {
    id: 8,
    malayalam: "ആർട്ട്, കൾച്ചർ എന്നിവയെ കുറിച്ച് വായിക്കാൻ എനിക്കിഷ്ടമാണ്.",
    english: "I enjoy reading about art and music.",
    category: "A"
  },
  {
    id: 9,
    malayalam: "കാര്യങ്ങൾ ചെയ്യുമ്പോൾ അത് ചെയ്യാൻ വ്യക്തമായ നിർദ്ദേശങ്ങൾ ലഭിക്കുന്നത് എനിക്ക് ഇഷ്ടമാണ്.",
    english: "I prefer having clear instructions to follow.",
    category: "C"
  },
  {
    id: 10,
    malayalam: "ആളുകളെ സ്വാധീനിക്കാനും കാര്യങ്ങൾ ബോധ്യപ്പെടുത്താനും ശ്രമിക്കുന്നത് എനിക്ക് ഇഷ്ടമാണ്.",
    english: "I am skilled at influencing and motivating people.",
    category: "E"
  },
  {
    id: 11,
    malayalam: "എനിക്ക് പരീക്ഷണങ്ങൾ ചെയ്യുന്നത് ഇഷ്ടമാണ്.",
    english: "I am interested in experiments.",
    category: "I"
  },
  {
    id: 12,
    malayalam: "എനിക്ക് ആളുകളെ പഠിപ്പിക്കാനും പരിശീലിപ്പിക്കാനും ഇഷ്ടമാണ്.",
    english: "I enjoy teaching and training others.",
    category: "S"
  },
  {
    id: 13,
    malayalam: "എനിക്ക് ആളുകളെ അവരുടെ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നതിൽ സഹായിക്കാൻ ഇഷ്ടമാണ്.",
    english: "I like helping people solve problems.",
    category: "S"
  },
  {
    id: 14,
    malayalam: "എനിക്ക് മൃഗങ്ങളെ പരിപാലിക്കാൻ ഇഷ്ടമാണ്.",
    english: "I am comfortable caring for animals.",
    category: "R"
  },
  {
    id: 15,
    malayalam: "ഒരു ഓഫീസിൽ ദിവസേന എട്ട് മണിക്കൂർ വീതം ജോലി ചെയ്യുന്നത് എനിക്ക് പ്രശ്നമല്ല.",
    english: "I can work in an office environment for extended periods.",
    category: "C"
  },
  {
    id: 16,
    malayalam: "സാധനങ്ങൾ വിൽക്കുന്നത് എന്നെ സംബന്ധിച്ച് രസകരമായ പരിപാടിയാണ്.",
    english: "I find sales activities enjoyable.",
    category: "E"
  },
  {
    id: 17,
    malayalam: "ക്രിയേറ്റീവ് റൈറ്റിങ് ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
    english: "I have an interest in creative writing.",
    category: "A"
  },
  {
    id: 18,
    malayalam: "സയൻസ് (Science) വിഷയങ്ങൾ എനിക്ക് താത്പര്യമുള്ള മേഖലയാണ്.",
    english: "Science is an area of interest for me.",
    category: "I"
  },
  {
    id: 19,
    malayalam: "ഞാൻ വേഗത്തിൽ പുതിയ ചുമതലകൾ/ റെസ്പോൺസിബിലിറ്റിസ് ഏറ്റെടുക്കാറുണ്ട്.",
    english: "I am able to take on new responsibilities quickly.",
    category: "E"
  },
  {
    id: 20,
    malayalam: "രോഗികളെ ശുശ്രൂഷിക്കുന്നതിലോ സുഖപ്പെടുത്തുന്നതിലോ (Healing) എനിക്ക് താൽപ്പര്യമുണ്ട്.",
    english: "I derive satisfaction from serving others.",
    category: "S"
  },
  {
    id: 21,
    malayalam: "എനിക്ക് സാധനങ്ങൾ പ്രവർത്തിക്കുന്നത് എങ്ങനെയെന്ന് കണ്ടെത്താൻ ഇഷ്ടമാണ്.",
    english: "I am curious about how things work.",
    category: "I"
  },
  {
    id: 22,
    malayalam: "നിർമാണപ്രവർത്തനങ്ങൾ, സാധനങ്ങൾ യോജിപ്പിക്കാനോ കൂട്ടിച്ചേർക്കാനോ (Assembling) എനിക്ക് ഇഷ്ടമാണ്.",
    english: "I enjoy assembling and putting things together.",
    category: "R"
  },
  {
    id: 23,
    malayalam: "ഞാൻ ഒരു ക്രിയേറ്റിവ് ആയ വ്യക്തിയാണ്.",
    english: "I consider myself a creative person.",
    category: "A"
  },
  {
    id: 24,
    malayalam: "കാര്യങ്ങളുടെ സൂക്ഷ്മശകലങ്ങളിൽ പോലും (Details) ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്.",
    english: "I pay attention to details.",
    category: "C"
  },
  {
    id: 25,
    malayalam: "എനിക്ക് ഫയലിംഗ്, ടൈപ്പിംഗ് എന്നിവ ഇഷ്ടമാണ്.",
    english: "I have skills in filing and typing.",
    category: "C"
  },
  {
    id: 26,
    malayalam: "എനിക്ക് കാര്യങ്ങൾ വിശകലനം ചെയ്യുന്നത് ഇഷ്ടമാണ് (പ്രശ്നങ്ങൾ, സാഹചര്യങ്ങൾ എന്നിവ).",
    english: "I like to analyze problems and situations.",
    category: "I"
  },
  {
    id: 27,
    malayalam: "എനിക്ക് വാദ്യോപകരണങ്ങൾ വായിക്കാനും പാടാനും ഇഷ്ടമാണ്.",
    english: "I have an interest in playing instruments and singing.",
    category: "A"
  },
  {
    id: 28,
    malayalam: "വിവിധ സംസ്കാരങ്ങളെക്കുറിച്ച് (Cultures) പഠിക്കാൻ എനിക്ക് താൽപ്പര്യമുണ്ട്.",
    english: "I am interested in learning about other cultures.",
    category: "S"
  },
  {
    id: 29,
    malayalam: "സ്വന്തമായി ബിസിനസ്സ് തുടങ്ങാൻ ഞാൻ ആഗ്രഹിക്കുന്നു.",
    english: "I aspire to start my own business.",
    category: "E"
  },
  {
    id: 30,
    malayalam: "എനിക്ക് പാചകം ചെയ്യാൻ ഇഷ്ടമാണ്.",
    english: "I enjoy cooking.",
    category: "R"
  },
  {
    id: 31,
    malayalam: "എനിക്ക് സ്റ്റേജിൽ കയറി അവതരണങ്ങൾ നടത്തുക, വ്ലോഗ്ഗിംഗ് എന്നിവ ഇഷ്ടമാണ്.",
    english: "I am interested in acting.",
    category: "A"
  },
  {
    id: 32,
    malayalam: "പ്രായോഗികമായി ചിന്തിക്കുന്ന (Practical) വ്യക്തിയാണ് ഞാൻ.",
    english: "I am a practical person.",
    category: "R"
  },
  {
    id: 33,
    malayalam: "എനിക്ക് നമ്പറുകളും ചാർട്ടുകളും ഉപയോഗിച്ച് ജോലി ചെയ്യുന്നത് ഇഷ്ടമാണ്.",
    english: "I have skills working with numbers and charts.",
    category: "A"
  },
  {
    id: 34,
    malayalam: "വിവിധ വിഷയങ്ങളെക്കുറിച്ച് ചർച്ചകളിൽ ഏർപ്പെടാൻ ഞാൻ ആഗ്രഹിക്കുന്നു.",
    english: "I like to engage in discussions about issues.",
    category: "S"
  },
  {
    id: 35,
    malayalam: "ഞാൻ ചെയ്യുന്ന ജോലികളുടെ വിവരങ്ങൾ (Records) കൃത്യമായി സൂക്ഷിക്കാൻ എനിക്ക് കഴിവുണ്ട്.",
    english: "I am able to keep detailed records of my activities.",
    category: "C"
  },
  {
    id: 36,
    malayalam: "നേതൃത്വം നൽകാൻ (Lead) എനിക്ക് ഇഷ്ടമാണ്.",
    english: "I have leadership abilities.",
    category: "E"
  },
  {
    id: 37,
    malayalam: "എനിക്ക് പുറത്തിറങ്ങി ചെയ്യേണ്ട ജോലികൾ ഇഷ്ടമാണ്.",
    english: "I prefer working in open spaces.",
    category: "I"
  },
  {
    id: 38,
    malayalam: "ഓഫീസിലിരുന്നുള്ള ജോലി‌യാണ് ഞാനാഗ്രഹിക്കുന്നത്.",
    english: "I am interested in office-based work.",
    category: "C"
  },
  {
    id: 39,
    malayalam: "ഞാൻ കണക്കിൽ മിടുക്കനാണ്/മിടുക്കിയാണ്.",
    english: "I have strong math skills.",
    category: "I"
  },
  {
    id: 40,
    malayalam: "മറ്റുള്ളവരെ സഹായിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
    english: "I enjoy helping others.",
    category: "S"
  },
  {
    id: 41,
    malayalam: "എനിക്ക് ചിത്രം വരക്കാൻ ഇഷ്ടമാണ്.",
    english: "I have skills in drawing.",
    category: "A"
  },
  {
    id: 42,
    malayalam: "എനിക്ക് പ്രസംഗിക്കാൻ ഇഷ്ടമാണ്.",
    english: "I am comfortable with public speaking.",
    category: "E"
  }
];

export const CATEGORY_LABELS: Record<RiasecCategory, { malayalam: string; english: string; color: string }> = {
  R: { malayalam: 'യഥാർഥ്യബോധം', english: 'Realistic', color: '#16a34a' },
  I: { malayalam: 'അന്വേഷണം', english: 'Investigative', color: '#2563eb' },
  A: { malayalam: 'കലാത്മകം', english: 'Artistic', color: '#9333ea' },
  S: { malayalam: 'സാമൂഹ്യം', english: 'Social', color: '#ea580c' },
  E: { malayalam: 'സംരംഭകത്വം', english: 'Enterprising', color: '#dc2626' },
  C: { malayalam: 'ക്രമബദ്ധം', english: 'Conventional', color: '#0891b2' },
};

export type RiasecScores = Record<RiasecCategory, number>;

export const CATEGORY_MAX_SCORES = QUESTIONS.reduce<Record<RiasecCategory, number>>(
  (acc, question) => {
    acc[question.category] += 5;
    return acc;
  },
  { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
);

export function calculateScores(answers: Record<number, number>): RiasecScores {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 0;
    scores[q.category] += val;
  });
  return scores;
}

export function getScorePercentage(category: RiasecCategory, score: number): number {
  return Math.round((score / (CATEGORY_MAX_SCORES[category] || 1)) * 100);
}

export function getTopCategories(scores: RiasecScores): RiasecCategory[] {
  return (Object.entries(scores) as [RiasecCategory, number][])
    .sort(([leftCategory, leftScore], [rightCategory, rightScore]) => {
      const percentageDelta = getScorePercentage(rightCategory, rightScore)
        - getScorePercentage(leftCategory, leftScore);

      if (percentageDelta !== 0) {
        return percentageDelta;
      }

      return rightScore - leftScore;
    })
    .map(([cat]) => cat);
}

export const SCORE_LABELS: Record<number, { malayalam: string; english: string }> = {
  1: { malayalam: 'തീർത്തും ഇല്ല', english: 'Not at all' },
  2: { malayalam: 'കുറവ്', english: 'Slightly' },
  3: { malayalam: 'ഇടത്തരം', english: 'Moderately' },
  4: { malayalam: 'ഏറെ', english: 'Quite a bit' },
  5: { malayalam: 'വളരെ ഏറെ', english: 'Very much' },
};
