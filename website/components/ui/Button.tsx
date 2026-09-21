import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white border border-transparent hover:brightness-[1.07] hover:shadow-lift active:translate-y-px active:brightness-95 shadow-card',
  secondary:
    'bg-paper text-ink border border-line hover:border-linestrong hover:bg-sunken active:translate-y-px shadow-card',
  dark: 'bg-void text-white border border-transparent hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-void dark:hover:bg-zinc-200',
  outline:
    'bg-transparent text-ink border border-linestrong hover:border-ink hover:bg-sunken active:translate-y-px',
  ghost: 'bg-transparent text-muted hover:text-ink hover:bg-sunken border border-transparent',
  danger:
    'bg-danger text-white border border-transparent hover:brightness-110 active:translate-y-px',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-md gap-2',
  lg: 'h-11 px-5 text-[15px] rounded-lg gap-2',
  icon: 'h-9 w-9 rounded-md gap-0',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center font-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100 disabled:active:translate-y-0',
        variants[variant],
        sizes[size],
        loading && 'cursor-wait opacity-80',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size={14} className="-ml-0.5" aria-hidden />}
      {children}
    </button>
  );
}
