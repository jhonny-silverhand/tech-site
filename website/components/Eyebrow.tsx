import { cn } from '@/lib/utils';

/** Ledger numbered section label: "01 · Featured" */
export function Eyebrow({ index, children, className }: { index?: string; children?: React.ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow', className)}>
      {index && <span aria-hidden>{index} ·&nbsp;</span>}
      {children}
    </p>
  );
}
