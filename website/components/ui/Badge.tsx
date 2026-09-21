import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark';

const tones: Record<Tone, string> = {
  default: 'border-line bg-paper text-ink2',
  neutral: 'border-line bg-sunken text-muted',
  success:
    'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  warning: 'border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger: 'border-red-600/25 bg-red-500/10 text-red-700 dark:text-red-400',
  info: 'border-accent/30 bg-accentsoft text-accentink',
  dark: 'border-transparent bg-void text-white dark:bg-white dark:text-void',
};

export function Badge({
  tone = 'default',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium leading-4 tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
