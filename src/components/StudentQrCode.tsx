import type { RegistrationDetail } from '@/api/educine';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, User } from 'lucide-react';

type StudentQrCodeProps = {
  registration: RegistrationDetail;
  size?: number;
  className?: string;
  helperText?: string;
};

export function StudentQrCode({
  registration,
  size = 100,
  className,
  helperText = 'Counselor can scan this QR to view your profile',
}: StudentQrCodeProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-900">{registration.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {registration.mobile}
            </span>
            {registration.place && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {registration.place}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-5 text-center">
        <div className="rounded-[1.75rem] border border-primary/15 bg-white p-4 shadow-sm">
          <QRCodeSVG
            value={registration.id}
            size={size}
            level="M"
            includeMargin={false}
          />
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-gray-500">{helperText}</p>
      </div>
    </div>
  );
}