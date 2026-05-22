import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return digits;
}

export function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    student: 'Student',
    madrasa_student: 'Madrasa Student',
    job_seeker: 'Job Seeker',
    entrepreneur: 'Entrepreneur',
    employer: 'Employer',
    launchpad: 'Launchpad',
  };
  return labels[type] ?? type;
}
