export function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <span className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
