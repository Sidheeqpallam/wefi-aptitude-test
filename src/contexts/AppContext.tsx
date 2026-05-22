import React, { createContext, useContext, useState } from 'react';
import type { RegistrationDetail } from '@/api/educine';
import type { RiasecScores, RiasecCategory } from '@/data/questions';

interface AppState {
  registration: RegistrationDetail | null;
  scores: RiasecScores | null;
  topCategories: RiasecCategory[];
  language: 'malayalam' | 'english';
}

interface AppContextType extends AppState {
  setRegistration: (r: RegistrationDetail | null) => void;
  setScores: (s: RiasecScores, top: RiasecCategory[]) => void;
  clearScores: () => void;
  toggleLanguage: () => void;
  reset: () => void;
}

const defaultState: AppState = {
  registration: null,
  scores: null,
  topCategories: [],
  language: 'malayalam',
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const setRegistration = (r: RegistrationDetail | null) =>
    setState((s) => ({ ...s, registration: r }));
  const setScores = (scores: RiasecScores, top: RiasecCategory[]) =>
    setState((s) => ({ ...s, scores, topCategories: top }));
  const clearScores = () =>
    setState((s) => ({ ...s, scores: null, topCategories: [] }));
  const toggleLanguage = () =>
    setState((s) => ({
      ...s,
      language: s.language === 'malayalam' ? 'english' : 'malayalam',
    }));
  const reset = () => setState(defaultState);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRegistration,
        setScores,
        clearScores,
        toggleLanguage,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
