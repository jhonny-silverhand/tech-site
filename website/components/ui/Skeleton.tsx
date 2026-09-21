import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton', className)} />;
}

export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="card p-4" aria-label="Loading" role="status">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-5 w-full" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="mt-2 h-3.5 w-full last:w-2/3" />
      ))}
      <Skeleton className="mt-4 h-3 w-40" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="card h-40 animate-pulse p-4" role="status" aria-label="Loading section">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}
