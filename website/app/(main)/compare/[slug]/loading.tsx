import { Scale, Sparkles } from 'lucide-react';

export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-xl text-center">
        <Scale size={32} aria-hidden className="mx-auto text-accent" />
        <h1 className="t-page mt-4 text-3xl">Comparing live…</h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[15px] text-muted">
          <Sparkles size={14} aria-hidden className="text-accent" />
          Fetching fresh specs, prices and verdict from Gemini — takes 15–30 seconds.
        </p>
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-12 w-full" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
