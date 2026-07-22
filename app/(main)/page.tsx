import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { getRecentPosts } from '@/lib/data';
import { KnowledgeOrbit } from '@/components/KnowledgeOrbit';
import { BentoGrid } from '@/components/BentoGrid';
import { HorizontalRail } from '@/components/HorizontalRail';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const posts = await getRecentPosts(12);
  const bentoPosts = posts.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Hero + section nav share one fold: text on the left, the orbit
          (or its compact mobile fallback) on the right, so Featured
          follows immediately rather than after a whole separate nav
          section. */}
      <section className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-wide text-accent mb-3">tech/site</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
            Practical answers, not filler — across code, devices, and money.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Nine sections, one publishing system: an admin desk that drafts with AI and edits before it ever
            publishes, and a writer community that publishes the old-fashioned way — no AI shortcuts, just
            people who know the subject.
          </p>
        </div>

        <div className="lg:shrink-0">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4 text-center lg:text-left">
            Explore the sections
          </p>

          <div className="hidden lg:flex justify-center">
            <KnowledgeOrbit />
          </div>

          <div className="lg:hidden flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
            {NICHES.map((niche) => (
              <Link
                key={niche.slug}
                href={`/niche/${niche.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 hover:border-ink/30 transition-colors"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
                <span className="font-mono text-[11px] text-ink">{niche.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Featured</h2>
        <BentoGrid posts={bentoPosts} />
      </section>

      <section className="mt-20">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Keep exploring</h2>
        <HorizontalRail posts={posts} />
      </section>
    </div>
  );
}
