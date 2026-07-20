import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90 focus-visible:outline-accent',
  secondary: 'bg-ink text-white hover:bg-ink/90 focus-visible:outline-ink',
  ghost: 'bg-transparent text-ink border border-line hover:bg-black/[0.03] focus-visible:outline-accent',
  danger: 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50 focus-visible:outline-red-500',
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-folder px-4 py-2 font-mono text-[13px] font-medium tracking-tight transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
