import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { CameraOff, Loader2, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<'initializing' | 'scanning' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState('');

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code?.data) {
      stopCamera();
      onScan(code.data);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [onScan, stopCamera]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }

        setStatus('scanning');
        rafRef.current = requestAnimationFrame(tick);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.name === 'NotAllowedError'
              ? 'Camera permission denied. Please allow camera access and try again.'
              : error.message
            : 'Unable to access camera.';

        setErrorMessage(message);
        setStatus('error');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera, tick]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15,23,42,0.84)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '24rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            borderBottom: '1px solid #dbeafe',
            background: 'linear-gradient(135deg, #1158a8 0%, #0e4c8c 100%)',
          }}
        >
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
            Scan Student QR Code
          </span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '9999px',
              width: '2rem',
              height: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
            aria-label="Close scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div style={{ position: 'relative', background: '#111', aspectRatio: '4/3', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: status === 'scanning' ? 'block' : 'none',
            }}
            muted
            playsInline
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {status === 'scanning' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  mask: 'radial-gradient(ellipse 65% 65% at center, transparent 0%, black 100%)',
                  WebkitMask: 'radial-gradient(ellipse 65% 65% at center, transparent 0%, black 100%)',
                }}
              />
              {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
                <div
                  key={corner}
                  style={{
                    position: 'absolute',
                    width: '2.5rem',
                    height: '2.5rem',
                    border: '3px solid #60a5fa',
                    borderRadius: '2px',
                    ...(corner === 'tl' && { top: '18%', left: '18%', borderRight: 'none', borderBottom: 'none' }),
                    ...(corner === 'tr' && { top: '18%', right: '18%', borderLeft: 'none', borderBottom: 'none' }),
                    ...(corner === 'bl' && { bottom: '18%', left: '18%', borderRight: 'none', borderTop: 'none' }),
                    ...(corner === 'br' && { bottom: '18%', right: '18%', borderLeft: 'none', borderTop: 'none' }),
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: '18%',
                  right: '18%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)',
                  animation: 'scanline 2s ease-in-out infinite',
                }}
              />
            </div>
          )}

          {status === 'initializing' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                color: 'white',
              }}
            >
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#93c5fd' }} />
              <p style={{ fontSize: '0.85rem', color: '#dbeafe' }}>Starting camera...</p>
            </div>
          )}

          {status === 'error' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <CameraOff className="w-10 h-10" style={{ color: '#fca5a5' }} />
              <p style={{ fontSize: '0.85rem', color: '#fecaca', lineHeight: 1.5 }}>{errorMessage}</p>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#eff6ff',
            borderTop: '1px solid #dbeafe',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.78rem', color: '#1158a8', fontWeight: 500, margin: 0 }}>
            Point the camera at a student's QR code to load their profile
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 20%; }
          50% { top: 76%; }
          100% { top: 20%; }
        }
      `}</style>
    </div>
  );
}