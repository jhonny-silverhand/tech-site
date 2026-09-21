import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5', className)}
      {...props}
    />
  );
}

const fieldStyles =
  'w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldStyles, 'font-mono text-[13.5px] leading-relaxed', className)} {...props} />;
}

export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
