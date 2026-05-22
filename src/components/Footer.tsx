export function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`pt-6 text-center text-sm text-[#61708a] ${className}`.trim()}>
      <p>Copyright © {new Date().getFullYear()} SSF Kerala</p>
    </footer>
  );
}