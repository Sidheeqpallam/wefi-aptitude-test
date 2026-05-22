import React, { useEffect, useRef, useState } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  Phone,
  ScanLine,
  Search,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/CounselorAuthContext';
import { CounselorNoteCard } from '@/components/CounselorNoteCard';
import { SsfLogo } from '@/components/SsfLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import CounselorQRScanner from '@/components/CounselorQRScanner';
import type { Student } from '@/types/counselor';
import http from '@/lib/counselorHttp';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatKey = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

const parseArrayVal = (value: unknown): string[] | null => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch {
        return null;
      }
    }
  }

  return null;
};

const isDateString = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}(T|\s|$)/.test(value.trim()) && !Number.isNaN(new Date(value).getTime());

const formatDetailValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return '—';
  }

  const list = parseArrayVal(value);
  if (list !== null) {
    if (list.length === 0) {
      return '—';
    }

    return (
      <ul style={{ margin: '0.2rem 0 0', paddingLeft: '1.2rem' }}>
        {list.map((item, index) => (
          <li key={index} style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.55 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    return Object.entries(value).map(([key, nestedValue]) => `${formatKey(key)}: ${nestedValue}`).join(', ');
  }

  if (typeof value === 'string') {
    if (isDateString(value)) {
      const date = new Date(value);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }
    return value || '—';
  }

  return String(value) || '—';
};

export default function Dashboard() {
  const { counselor, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchDebounce = useRef<number | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const fetchStudentById = async (id: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await http.get(`/counselors/participant?id=${id}`);
      if (response.data?.data) {
        setStudent(response.data.data as Student);
      }
    } catch {
      setError('Failed to load participant details');
    } finally {
      setIsLoading(false);
    }
  };

  const searchStudent = async (queryOverride?: string) => {
    const query = (queryOverride ?? searchQuery).trim();
    if (!query) {
      setError('Please enter a name or mobile number');
      return;
    }

    setIsLoading(true);
    setError('');
    setStudent(null);
    setCandidates([]);

    try {
      const response = await http.post('/counselors/search', {
        query,
        counselorId: counselor?.id,
      });

      const data = response.data?.data;
      if (data.length) {
        setCandidates(data as Student[]);
      } else {
        setError('No participants found matching your search');
      }
    } catch {
      setError('Failed to search students. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = async (value: string) => {
    setShowScanner(false);
    const id = value.trim();
    if (!id) {
      return;
    }

    setSearchQuery('');
    setCandidates([]);
    await fetchStudentById(id);
  };

  const saveNote = async () => {
    if (!note.trim() || !student) {
      return;
    }

    setIsSavingNote(true);
    try {
      await http.post('/counselors/notes', {
        counselorId: counselor?.id,
        participantId: student.id,
        note: note.trim(),
      });

      try {
        const refreshed = await http.get(`/counselors/participant?id=${student.id}`);
        if (refreshed.data?.data) {
          setStudent(refreshed.data.data as Student);
        }
      } catch {
        try {
          const fallback = await http.post('/counselors/search', {
            query: student.id,
            counselorId: counselor?.id,
          });
          const data = fallback.data?.data;
          if (Array.isArray(data) && data.length) {
            setStudent(data[0] as Student);
          }
        } catch {
          return;
        }
      }

      setNote('');
    } catch {
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setError('');

    if (searchDebounce.current) {
      window.clearTimeout(searchDebounce.current);
    }

    if (value.trim()) {
      searchDebounce.current = window.setTimeout(() => {
        void searchStudent(value);
      }, 450);
    } else {
      setCandidates([]);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchDebounce.current) {
        window.clearTimeout(searchDebounce.current);
      }
      void searchStudent();
    }
  };

  const aptitudeAnswers: Array<{ question: string; answer: number; category: string }> = (() => {
    const aptitudePayload = typeof student?.aptitudeTest === 'string'
      ? student.aptitudeTest
      : student?.aptitudeTest?.aptitudeTest;

    if (!aptitudePayload) {
      return [];
    }

    try {
      return JSON.parse(aptitudePayload) as Array<{
        question: string;
        answer: number;
        category: string;
      }>;
    } catch {
      return [];
    }
  })();

  const resultText = typeof student?.aptitudeTest === 'object' && student?.aptitudeTest?.result
    ? student.aptitudeTest.result
    : student?.result;

  const resultLines = resultText
    ? resultText.split('\n').filter(Boolean)
    : [];

  const detailEntries = student
    ? Object.entries(student).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !['id', 'notes', 'aptitudeTest', 'result'].includes(key),
    )
    : [];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #f5f5f7 100%)' }}>
      <header className="sticky top-0 z-10 border-b border-[#dbe7f7] bg-[linear-gradient(135deg,#ffffff_0%,#f3f8ff_48%,#fff6f3_100%)] shadow-[0_12px_30px_rgba(17,88,168,0.08)] backdrop-blur">
        <div className="mx-auto max-w-7xl px-4" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <div className="flex items-center justify-between" style={{ height: '3.9rem' }}>
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              <SsfLogo className="h-9 sm:h-10 shrink-0" />
              <div className="hidden sm:block">
                <div className="font-bold" style={{ color: '#16345f', fontSize: '0.95rem', lineHeight: 1.2 }}>
                  Career Counselor Portal
                </div>
              </div>
            </div>

            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="User menu"
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: menuOpen ? 'rgba(17,88,168,0.12)' : 'rgba(255,255,255,0.85)',
                  border: '1px solid #c9daf1',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <User className="w-4 h-4" style={{ color: '#1d4f86' }} />
              </button>

              {menuOpen && (
                <div className="user-menu-popup">
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #e7f0ff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                    }}
                  >
                    <div
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #e7f0ff, #d7e6fb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <User className="w-4 h-4" style={{ color: '#1158a8' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#16345f', lineHeight: 1.2 }}>
                        {counselor?.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {counselor?.mobile}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.375rem' }}>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="user-menu-item"
                    >
                      <LogOut className="w-4 h-4" style={{ color: '#dc2626' }} />
                      <span style={{ color: '#dc2626' }}>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl" style={{ padding: '1.5rem', width: '100%' }}>
        <section className="dashboard-intro">
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #e7f0ff, #d7e6fb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User className="w-4 h-4" style={{ color: '#1158a8' }} />
          </div>
          <div>
            <div className="font-bold" style={{ color: '#16345f', fontSize: '1rem' }}>
              Welcome, {counselor?.name}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.15rem' }}>
              {counselor?.mobile} · {counselor?.place}
            </div>
          </div>
        </section>

        <section className="dashboard-section dashboard-search-section">
          <div className="dashboard-section-head">
            <h2 className="dashboard-section-title">
              <Search className="w-4 h-4" style={{ color: '#1158a8' }} />
              Find Student
            </h2>
          </div>
          <div className="dashboard-section-body">
            <div className="flex" style={{ gap: '0.625rem' }}>
              <button
                onClick={() => setShowScanner(true)}
                title="Scan QR Code"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0 0.875rem',
                  background: 'linear-gradient(135deg, #1158a8 0%, #0e4c8c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <ScanLine className="w-4 h-4" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
              <div style={{ position: 'relative', flex: 1 }}>
                {isLoading ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#1158a8',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <Search
                    className="w-4 h-4"
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <Input
                  placeholder="Search by name or mobile number..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {error && (
              <div
                className="text-sm"
                style={{
                  marginTop: '0.75rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  borderRadius: '0.75rem',
                  padding: '0.65rem 0.875rem',
                }}
              >
                {error}
              </div>
            )}

            {candidates.length > 0 && (
              <div style={{ marginTop: '0.875rem', minWidth: 0, overflowX: 'hidden' }}>
                <p
                  className="text-xs"
                  style={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {candidates.length} result{candidates.length !== 1 ? 's' : ''} found
                </p>
                <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '16rem', overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
                  {candidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      onClick={() => {
                        setCandidates([]);
                        setSearchQuery('');
                        void fetchStudentById(candidate.id);
                      }}
                      className="candidate-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '9999px',
                            background: '#e7f0ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <User className="w-4 h-4" style={{ color: '#1158a8' }} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <div className="font-medium truncate" style={{ color: '#1e293b' }}>
                            {candidate.name}
                          </div>
                          <div className="text-xs truncate" style={{ color: '#64748b' }}>
                            {candidate.mobile}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: '#94a3b8', flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {student ? (
          <section className="dashboard-section dashboard-student-section">
            <div className="dashboard-section-head dashboard-student-head">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 className="dashboard-section-title">
                  <User className="w-4 h-4" style={{ color: '#1158a8' }} />
                  Student Overview
                </h2>
              </div>
            </div>
            <div className="dashboard-section-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="student-summary-panel">
                  <div className="student-summary-grid">
                    <div className="student-summary-item student-summary-item-full">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16345f' }}>
                        {student.name}
                      </span>
                      <span className="detail-label">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone className="w-3 h-3" /> Mobile
                        </span>
                      </span>
                      <span className="detail-value">{student.mobile}</span>
                    </div>

                    {student.place && (
                      <div className="student-summary-item student-summary-item-full">
                        <span className="detail-label">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin className="w-3 h-3" /> Place
                          </span>
                        </span>
                        <span className="detail-value">{student.place}</span>
                      </div>
                    )}
                  </div>
                </div>

                {student.aptitudeTest && (
                  <section className="dashboard-subsection">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#16345f', fontSize: '0.95rem' }}>
                        <Brain className="w-4 h-4" style={{ color: '#1158a8' }} />
                        Aptitude Test Results
                      </div>
                    </div>

                    {resultLines.length > 0 && (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #f8fbff, #e7f0ff)',
                          border: '1px solid #bfd7ff',
                          borderRadius: '0.75rem',
                          padding: '1rem 1.25rem',
                          marginBottom: aptitudeAnswers.length > 0 ? '1rem' : 0,
                        }}
                      >
                        <div className="detail-label" style={{ marginBottom: '0.5rem', color: '#1158a8' }}>
                          Career Profile Rankings
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {resultLines.map((line, index) => (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: index < 3 ? 'white' : 'rgba(255,255,255,0.5)',
                                border: index < 3 ? '1px solid #d7e6fb' : '1px solid rgba(148,163,184,0.2)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem 0.875rem',
                                opacity: index < 3 ? 1 : 0.68,
                              }}
                            >
                              <span
                                style={{
                                  width: '1.5rem',
                                  height: '1.5rem',
                                  borderRadius: '9999px',
                                  background:
                                    index === 0
                                      ? '#0e4c8c'
                                      : index === 1
                                        ? '#1158a8'
                                        : index === 2
                                          ? '#3b82f6'
                                          : '#e2e8f0',
                                  color: index < 3 ? 'white' : '#64748b',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {index + 1}
                              </span>
                              <span
                                style={{
                                  color: index < 3 ? '#1e293b' : '#64748b',
                                  fontWeight: index < 3 ? 600 : 500,
                                  fontSize: '0.9rem',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {line.replace(/^#\d+\s*/, '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aptitudeAnswers.length > 0 && (
                      <div>
                        <button
                          onClick={() => setQaOpen((open) => !open)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f8fbff',
                            border: '1px solid #d7e6fb',
                            borderRadius: '0.5rem',
                            padding: '0.6rem 0.875rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: '#1158a8',
                          }}
                        >
                          <span>View Question &amp; Answer Details ({aptitudeAnswers.length} questions)</span>
                          <ChevronDown
                            className="w-4 h-4"
                            style={{
                              transition: 'transform 0.2s',
                              transform: qaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </button>

                        {qaOpen && (
                          <div
                            style={{
                              marginTop: '0.5rem',
                              border: '1px solid #d7e6fb',
                              borderRadius: '0.5rem',
                              overflow: 'hidden',
                            }}
                          >
                            <div style={{ maxHeight: '22rem', overflowY: 'auto' }}>
                              {aptitudeAnswers.map((item, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '0.75rem',
                                    padding: '0.625rem 0.875rem',
                                    borderBottom: index < aptitudeAnswers.length - 1 ? '1px solid #e7f0ff' : undefined,
                                    alignItems: 'center',
                                    background: index % 2 === 0 ? 'white' : '#f8fbff',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', minWidth: 0 }}>
                                    <div
                                      style={{
                                        width: '2rem',
                                        height: '2rem',
                                        borderRadius: '9999px',
                                        background: 'linear-gradient(135deg, #e7f0ff, #d7e6fb)',
                                        border: '1px solid #bfd7ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.72rem',
                                        color: '#1158a8',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {item.category}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
                                      {item.question}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      width: '2rem',
                                      height: '2rem',
                                      borderRadius: '9999px',
                                      background: 'linear-gradient(135deg, #e7f0ff, #d7e6fb)',
                                      border: '1px solid #bfd7ff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 700,
                                      fontSize: '0.9rem',
                                      color: '#1158a8',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {item.answer}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}

                <section className="dashboard-subsection">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#16345f', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    <MessageSquare className="w-4 h-4" style={{ color: '#1158a8' }} />
                    Counseling Notes
                  </div>

                  <div
                    style={{
                      background: '#f8fbff',
                      border: '1px solid #d7e6fb',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Add New Note</div>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder="Enter your counseling notes here..."
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                    <Button onClick={saveNote} disabled={!note.trim() || isSavingNote} className="w-full" style={{ marginTop: '0.625rem' }}>
                      {isSavingNote ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Note'
                      )}
                    </Button>
                  </div>

                  <div>
                    <div className="detail-label" style={{ marginBottom: '0.625rem' }}>
                      Previous Notes
                      {student.notes?.length ? (
                        <span
                          style={{
                            marginLeft: '0.4rem',
                            background: '#e7f0ff',
                            color: '#1158a8',
                            borderRadius: '9999px',
                            padding: '0.1rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {student.notes.length}
                        </span>
                      ) : null}
                    </div>

                    {student.notes && student.notes.length > 0 ? (
                      <div style={{ maxHeight: '22rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {[...student.notes].reverse().map((noteItem) => (
                          <CounselorNoteCard key={noteItem.id} note={noteItem} formatDate={formatDate} />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state" style={{ padding: '1.5rem' }}>
                        <div className="empty-state-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <p style={{ fontSize: '0.85rem' }}>No counseling notes yet</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </section>
        ) : (
          <section className="dashboard-empty-panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search className="w-6 h-6" />
              </div>
              <h3 style={{ color: '#1e293b', fontWeight: 700, marginBottom: '0.375rem', fontSize: '1rem' }}>
                No Student Selected
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '22rem' }}>
                Search by name or mobile number above, then open a student profile to review aptitude results and save counseling notes.
              </p>
            </div>
          </section>
        )}
      </main>

      {showScanner && <CounselorQRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}