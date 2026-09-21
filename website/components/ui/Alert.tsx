import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'error' | 'warning' | 'success' | 'info';

const config: Record<Tone, { icon: typeof Info; classes: string }> = {
  error: {
    icon: AlertCircle,
    classes: 'border-red-600/25 bg-red-500/[0.07] text-red-700 dark:text-red-300',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'border-amber-600/25 bg-amber-500/[0.08] text-amber-800 dark:text-amber-300',
  },
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300',
  },
  info: {
    icon: Info,
    classes: 'border-accent/30 bg-accentsoft text-accentink',
  },
};

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { icon: Icon, classes } = config[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed', classes, className)}
    >
      <Icon size={17} className="mt-0.5 flex-none" aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}
