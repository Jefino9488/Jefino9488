export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-[#050708]"
      role="status"
      aria-label="Loading"
    >
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-fg-muted">
          Jefino
        </span>
      </div>
      <div className="skeleton h-px w-36 rounded-full" />
    </div>
  );
}
