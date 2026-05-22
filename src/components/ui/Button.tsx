import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]';

  const variants = {
    primary: 'bg-[#1158a8] text-white hover:bg-[#0e4c8c] focus-visible:ring-[#1158a8]',
    secondary: 'bg-[#ee2d2e] text-white hover:bg-[#d41e1f] focus-visible:ring-[#ee2d2e]',
    ghost: 'bg-white text-[#1158a8] border border-[#d2d2d7] hover:bg-gray-50 focus-visible:ring-[#1158a8]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
