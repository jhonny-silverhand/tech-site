import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import {
  getRecentPosts,
  getFeaturedPosts,
  getPersonalizedData,
  getShoppingIntelligenceHero,
  getBuyingGuidesForHomepage,
} from '@/lib/data';
import { KnowledgeOrbit } from '@/components/KnowledgeOrbit';
import { ShoppingIntelligenceHeroLazy } from '@/components/ShoppingIntelligenceHeroLazy';
import { BentoGrid } from '@/components/BentoGrid';
import { HorizontalRail } from '@/components/HorizontalRail';
import { PostCard } from '@/components/PostCard';
import { NICHES } from '@/lib/niches';

function SectionHead({
  index,
  title,
  meta,
  href,
  linkLabel,
}: {
  index: string;
  title: string;
  meta?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">
          {index} · {meta || linkLabel}
        </p>
        <h2 className="t-section mt-1 text-[22px] text-ink sm:text-2xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="inline-flex flex-none items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-accentink hover:bg-accentsoft hover:underline hover:underline-offset-4"
      >
        {linkLabel} <ArrowRight size={14} aria-hidden />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [posts, personalized, shoppingHero, buyingGuides] = await Promise.all([
    getRecentPosts(12),
    getPersonalizedData(),
    getShoppingIntelligenceHero(),
    getBuyingGuidesForHomepage(3),
  ]);
  const featured = await getFeaturedPosts(6);

  return (
    <div>
      {/* Hero — adaptive: warm paper in light, deep charcoal in dark */}
      <section className="relative overflow-hidden border-b border-line bg-paper text-ink dark:bg-void dark:text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl dark:bg-accent/15"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="min-w-0">
            <h1 className="t-display text-[38px] sm:text-[52px]">
              Practical answers, <span className="text-accent">not filler</span> — across code, devices, and money.
            </h1>
            <p className="t-dek mt-4 max-w-xl text-[21px] text-muted dark:text-zinc-400">
              In-depth guides, honest product intelligence, and AI tools that respect your time.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-white shadow-card hover:brightness-110 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Sparkles size={15} aria-hidden />
                Personalize your feed
              </Link>
              <Link
                href="/shopping"
                className="inline-flex h-11 items-center gap-1.5 rounded-md border border-line bg-paper px-5 text-sm text-ink-2 hover:border-linestrong hover:text-ink active:translate-y-px dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:border-white/40 dark:hover:text-white"
              >
                Try AI Shopping <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
            <dl className="t-numeric mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] text-muted dark:text-zinc-500">
              <div>
                <dt className="sr-only">Articles</dt>
                <dd>
                  <span className="text-[15px] font-semibold text-ink dark:text-white">{posts.length}+</span> fresh guides
                </dd>
              </div>
              <div>
                <dt className="sr-only">Topics</dt>
                <dd>
                  <span className="text-[15px] font-semibold text-ink dark:text-white">{NICHES.length}</span> topics
                </dd>
              </div>
              <div>
                <dt className="sr-only">Prices</dt>
                <dd>
                  <span className="text-[15px] font-semibold text-ink dark:text-white">₹</span> India-first pricing
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-1.5 lg:hidden">
              {NICHES.map((n) => (
                <Link
                  key={n.slug}
                  href={`/niche/${n.slug}`}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-2 hover:border-linestrong dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/30"
                >
                  <span className="h-[7px] w-[7px] rounded-full" style={{ background: n.color }} aria-hidden />
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
          <KnowledgeOrbit />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 lg:py-14">
        {/* Shopping hero (lazy, below fold) */}
        {shoppingHero && shoppingHero.products.length > 0 && (
          <ShoppingIntelligenceHeroLazy products={shoppingHero.products} />
        )}

        {/* Personalized sections */}
        {personalized && (
          <>
            {personalized.continueReading.length > 0 && (
              <section aria-label="Continue reading">
                <SectionHead index="01" title="Continue reading" meta={`${personalized.continueReading.length} saved`} href="/library?tab=history" linkLabel="History" />
                <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {personalized.continueReading.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}
            {personalized.becauseYouRead.length > 0 && (
              <section aria-label="Recommended for you">
                <SectionHead index="02" title="Because you read…" meta="For you" href="/library" linkLabel="Library" />
                <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {personalized.becauseYouRead.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}
            {personalized.yourTopics.length > 0 && (
              <section aria-label="Your topics">
                <SectionHead index="03" title="Your topics" meta="Following" href="/library/settings" linkLabel="Manage" />
                <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {personalized.yourTopics.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}
            {personalized.fromFollowedAuthors.length > 0 && (
              <section aria-label="From authors you follow">
                <SectionHead index="04" title="From authors you follow" meta="Following" href="/dashboard" linkLabel="Dashboard" />
                <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {personalized.fromFollowedAuthors.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Buying guides */}
        {buyingGuides.length > 0 && (
          <section aria-label="Buying guides">
            <SectionHead index="05" title="Buying guides" meta={`${buyingGuides.length} curated`} href="/guides" linkLabel="All guides" />
            <div className="grid items-stretch gap-4 md:grid-cols-3">
              {buyingGuides.map((g) => (
                <Link
                  key={g.id}
                  href={`/guides/${g.slug}`}
                  className="card card-interactive group flex flex-col p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <p className="t-meta text-muted">{g.category_slug}</p>
                  <h3 className="t-section mt-2 text-[17px] leading-snug group-hover:text-accentink">
                    <span className="clamp-2">{g.title}</span>
                  </h3>
                  {g.excerpt && <p className="clamp-2 mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>}
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-medium text-accentink">
                    Read guide <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section aria-label="Featured">
          <SectionHead index="06" title="Featured" meta="Editors' picks" href="/guides" linkLabel="More" />
          <BentoGrid posts={featured} />
        </section>

        {/* Keep exploring rail */}
        <section aria-label="Keep exploring">
          <SectionHead index="07" title="Keep exploring" meta="Latest" href="/guides" linkLabel="Browse" />
          <HorizontalRail posts={posts} />
        </section>
      </div>
    </div>
  );
}
