export function SsfLogo({ className = 'h-16' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src="/logo.png" alt="Educine" className="h-full w-auto object-contain" />
    </div>
  );
}
