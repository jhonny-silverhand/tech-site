import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-md border border-line bg-paper px-3 text-sm text-ink placeholder:text-faint shadow-card ' +
  'hover:border-linestrong ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring ' +
  'disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted disabled:hover:border-line ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:border-danger aria-[invalid=true]:focus:ring-danger/25 ' +
  'read-only:bg-sunken read-only:text-ink2';

export function FieldGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn('text-[13px] font-semibold text-ink', className)}>
      {children}
      {required && (
        <span aria-hidden className="ml-1 text-danger">
          *
        </span>
      )}
    </label>
  );
}

export function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[13px] leading-relaxed text-muted', className)}>{children}</p>;
}

export function FieldError({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} role="alert" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-danger">
      {children}
    </p>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      aria-invalid={props['aria-invalid']}
      className={cn(controlBase, 'h-10 py-2', props.className)}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      aria-invalid={props['aria-invalid']}
      className={cn(controlBase, 'min-h-[88px] py-2.5 leading-relaxed', props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      aria-invalid={props['aria-invalid']}
      className={cn(controlBase, 'h-10 cursor-pointer appearance-none bg-[right_0.65rem_center] pr-8', props.className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        ...props.style,
      }}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
}) {
  const errorId = error ? `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-error` : undefined;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label required={required}>{label}</Label>
      {children}
      {error ? <FieldError id={errorId}>{error}</FieldError> : hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}
