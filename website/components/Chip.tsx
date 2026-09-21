import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';

export function Chip({
  tone = 'default',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span data-tone={tone === 'default' ? undefined : tone} className={cn('chip', className)}>
      {children}
    </span>
  );
}
