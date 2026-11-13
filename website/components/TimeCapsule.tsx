import { History } from 'lucide-react';
import { getTodaysCapsule } from '@/lib/time-capsule';
import { formatDate } from '@/lib/utils';

/** "From the archive" — daily time capsule of a documented tech milestone.
 *  Server component: deterministic pick per UTC day, zero client JS. */
export function TimeCapsule() {
  const entry = getTodaysCapsule();
  const year = entry.date.slice(0, 4);

  return (
    <section aria-label="From the tech archive" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        <span
          aria-hidden
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line bg-sunken text-accent"
        >
          <History size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">
            From the archive · <span className="t-numeric">{formatDate(entry.date)}</span>
          </p>
          <h2 className="t-section mt-1.5 text-[19px] leading-snug text-ink sm:text-[21px]">{entry.title}</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{entry.detail}</p>
        </div>
        <span
          aria-hidden
          className="t-numeric flex flex-none items-center rounded-full border border-line bg-paper px-3 py-1 font-mono text-[12px] font-semibold tracking-wide text-accentink"
        >
          {year}
        </span>
      </div>
    </section>
  );
}
