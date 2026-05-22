import React, { useState } from 'react';
import { Loader2, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/CounselorAuthContext';
import { SsfLogo } from '@/components/SsfLogo';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      await login(mobile.trim());
    } catch {
      setError('Login failed. Please check your mobile number and try again.');
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: 'linear-gradient(135deg, #f8fbff 0%, #eaf2ff 45%, #f5f5f7 100%)',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '-6rem',
          right: '-6rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(17,88,168,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-6rem',
          left: '-6rem',
          width: '22rem',
          height: '22rem',
          background: 'radial-gradient(circle, rgba(238,45,46,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div className="mx-auto w-full max-w-5xl" style={{ position: 'relative', zIndex: 1 }}>
        <header className="mb-8 border border-[#dbe7f7] bg-[linear-gradient(135deg,#ffffff_0%,#f3f8ff_48%,#fff6f3_100%)] shadow-[0_12px_30px_rgba(17,88,168,0.08)] backdrop-blur rounded-[1.75rem]">
          <div className="flex items-center justify-center gap-3 px-4 py-4 sm:justify-start sm:px-5">
            <SsfLogo className="h-10 sm:h-11" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight" style={{ color: '#16345f', marginBottom: '0.15rem' }}>
                Career Counselor Portal
              </h1>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full" style={{ maxWidth: '26rem' }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#16345f', marginBottom: '0.25rem' }}>
              Counselor Login
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>Sign in with your registered mobile number</p>
          </div>

          <Card style={{ border: '1px solid rgba(17,88,168,0.14)' }}>
            <CardHeader className="text-center">
              <div
                className="mx-auto mb-3 flex items-center justify-center"
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#e7f0ff',
                  borderRadius: '9999px',
                }}
              >
                <Phone className="w-5 h-5" style={{ color: '#1158a8' }} />
              </div>
              <CardTitle style={{ fontSize: '1.25rem', justifyContent: 'center' }}>
                Counselor Login
              </CardTitle>
              <CardDescription>
                Enter your registered mobile number to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium" style={{ color: '#374151' }}>
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(value);
                        if (error) {
                          setError('');
                        }
                      }}
                      style={{ paddingLeft: '3rem' }}
                      disabled={isLoading}
                      inputMode="numeric"
                      autoComplete="tel"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="text-sm"
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      borderRadius: '0.75rem',
                      padding: '0.65rem 0.875rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ marginTop: '1px' }}>!</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading} style={{ marginTop: '0.25rem' }}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-4 text-xs" style={{ color: '#94a3b8' }}>
            © 2026 Educine · SSF Keralam
          </p>
        </div>
      </div>
    </div>
  );
}