import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getNiche } from '@/lib/niches';

export function NicheTag({ slug, size = 'sm' }: { slug: string; size?: 'sm' | 'md' }) {
  const niche = getNiche(slug);
  if (!niche) return null;
  return (
    <Link
      href={`/niche/${niche.slug}`}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono uppercase tracking-wide hover:opacity-70 transition-opacity',
        size === 'sm' ? 'text-[11px]' : 'text-[12px]'
      )}
      style={{ color: niche.color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: niche.color }} />
      {niche.label}
    </Link>
  );
}
