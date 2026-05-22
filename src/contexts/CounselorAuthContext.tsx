import React, { createContext, useContext, useEffect, useState } from 'react';
import { counselorLogin } from '@/api/educine';
import type { Counselor } from '@/types/counselor';

interface AuthContextType {
  counselor: Counselor | null;
  login: (mobile: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const counselorInfo = localStorage.getItem('counselorInfo');

    if (counselorInfo) {
      try {
        setCounselor(JSON.parse(counselorInfo) as Counselor);
      } catch {
        localStorage.removeItem('counselorInfo');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (mobile: string) => {
    const data = await counselorLogin(mobile);

    if (!data?.id) {
      throw new Error('Login failed');
    }

    const counselorInfo: Counselor = {
      id: data.id,
      name: data.name,
      mobile,
    };

    setCounselor(counselorInfo);
    localStorage.setItem('counselorInfo', JSON.stringify(counselorInfo));
  };

  const logout = () => {
    setCounselor(null);
    localStorage.removeItem('counselorInfo');
  };

  return (
    <AuthContext.Provider value={{ counselor, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}