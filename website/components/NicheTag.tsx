import Link from 'next/link';
import { getNiche } from '@/lib/niches';

export function NicheTag({ slug, color }: { slug: string; color?: string | null }) {
  const niche = getNiche(slug);
  return (
    <Link
      href={`/niche/${slug}`}
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: color || niche.color }} aria-hidden />
      {niche.name}
    </Link>
  );
}
