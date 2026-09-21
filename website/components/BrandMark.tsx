import { cn } from '@/lib/utils';

/**
 * The one and only tech//site wordmark.
 * JetBrains Mono ExtraBold, tight tracking, accent slashes — use this
 * everywhere the brand appears (header, footer, hero, auth, admin).
 */
export function BrandMark({
  name = 'site',
  className,
}: {
  name?: string;
  className?: string;
}) {
  return (
    <span className={cn('font-mono font-extrabold tracking-tight', className)}>
      tech<span className="text-accent">//</span>
      {name}
    </span>
  );
}
