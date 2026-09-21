import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'success' | 'warning' | 'info' | 'danger';

/** Halo signature tile: mono metric + 2px top accent hairline. */
export function StatTile({
  label,
  value,
  hint,
  tone = 'default',
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div data-tone={tone === 'default' ? undefined : tone} className={cn('stat-tile', className)}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="stat-metric">{value}</p>
      {hint && <div className="text-sm text-muted">{hint}</div>}
    </div>
  );
}
