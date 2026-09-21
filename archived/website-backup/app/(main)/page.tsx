import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NICHES } from '@/lib/niches';
import { getRecentPosts } from '@/lib/data';
import { KnowledgeOrbit } from '@/components/KnowledgeOrbit';
import { BentoGrid } from '@/components/BentoGrid';
import { HorizontalRail } from '@/components/HorizontalRail';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { getLibrarySummary } from '@/lib/library';
import { getRecommendations, RecommendationInput } from '@/lib/products';
import { getBuyingGuides } from '@/lib/products';
import { getUserFollowedTopics, getUserFollowedAuthors } from '@/lib/library';
import { PostCard } from '@/components/PostCard';
import { ShoppingIntelligenceHeroLazy } from '@/components/ShoppingIntelligenceHeroLazy';
import { getFeaturedProductsForHero } from '@/lib/products';
import { NicheTag } from '@/components/NicheTag';

export const dynamic = 'force-dynamic';

async function getPersonalizedData() {
  if (!isSupabaseConfigured()) return null;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [followedTopics, followedAuthors, librarySummary] = await Promise.all([
    getUserFollowedTopics(user.id),
    getUserFollowedAuthors(user.id),
    getLibrarySummary(),
  ]);

  // Get reading history for "Because you read..." section
  const historyPosts = librarySummary.history.slice(0, 5);

  const categoryMap: Record<string, string> = {
    'ai-tools': 'laptop',
    'programming': 'laptop',
    'android': 'smartphone',
    'windows-linux': 'laptop',
    'buying-guides': 'laptop',
    'gaming': 'laptop',
    'career-jobs': 'laptop',
    'finance': 'smartphone',
    'productivity': 'laptop',
  };
  
  // Get followed authors' recent posts AND recommendations in parallel
  const followedAuthorIds = followedAuthors.map(f => f.author_id);
  const [followedAuthorsPosts, recommendations] = await Promise.all([
    // Get followed authors' recent posts
    followedAuthorIds.length > 0
      ? supabase
          .from('posts')
          .select('id, slug, title, excerpt, niche, author_id, author_name, cover_image_url, published_at')
          .in('author_id', followedAuthorIds)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6)
          .then(({ data }) => (data as unknown as import('@/lib/types').Post[]) ?? [])
      : Promise.resolve([] as import('@/lib/types').Post[]),
    // Get recommendations based on followed topics
    followedTopics.length > 0
      ? getRecommendations({
          categorySlug: categoryMap[followedTopics[0].niche_slug] || 'laptop',
          priorities: followedTopics.slice(0, 3).map(t => t.niche_slug),
          useCases: ['programming', 'gaming'],
        })
      : Promise.resolve([] as import('@/lib/products').ProductRecommendation[]),
  ]);

  return {
    user,
    followedTopics,
    followedAuthors,
    librarySummary,
    historyPosts,
    followedAuthorsPosts,
    recommendations,
  };
}

async function getShoppingIntelligenceHero() {
  // Works with both Supabase and local demo data
  return getFeaturedProductsForHero();
}

async function getBuyingGuidesForHomepage() {
  if (!isSupabaseConfigured()) return [];
  try {
    const guides = await getBuyingGuides();
    return guides.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Run all independent data fetches in parallel
  const [posts, personalized, shoppingHero, buyingGuides] = await Promise.all([
    getRecentPosts(12),
    getPersonalizedData(),
    getShoppingIntelligenceHero(),
    getBuyingGuidesForHomepage(),
  ]);
  const bentoPosts = posts.slice(0, 6);

  return (
    <div>
      {/* Hero — dark editorial banner, copied from the improved UI reference.
          Left: eyebrow + headline + tagline + CTAs. Right: topic constellation. */}
      <section className="bg-void text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-zinc-500">TECH//SITE – EST. 2026</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Practical answers, <span className="text-accent">not filler</span> — across code, devices, and money.
            </h1>
            <p className="mt-5 font-tagline text-2xl italic leading-snug text-zinc-400">
              In-depth guides, honest product intelligence, and AI tools that respect your time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex h-11 items-center rounded-[10px] bg-accent px-6 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-[#3d68e0]"
              >
                Personalize your feed
              </Link>
              <Link
                href="/shopping"
                className="inline-flex h-11 items-center rounded-[10px] border border-zinc-700 px-6 text-[15px] text-zinc-200 transition-colors hover:border-zinc-400 hover:text-white"
              >
                Try AI Shopping
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              {NICHES.map((n) => (
                <Link key={n.slug} href={`/niche/${n.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                  <span className="h-2 w-2 rounded-full" style={{ background: n.color }} />
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <KnowledgeOrbit />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">

      {/* Shopping Intelligence Hero — prominent, works for all users */}
      {shoppingHero && shoppingHero.length > 0 && (
        <section className="mt-20" aria-labelledby="shopping-intelligence-heading">
          <ShoppingIntelligenceHeroLazy featuredProducts={shoppingHero} />
        </section>
      )}

      {/* Personalized sections for logged-in users */}
      {personalized && (
        <>
          {/* Continue Reading */}
          {personalized.librarySummary.continueReading && (
            <section className="mt-20">
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Continue reading</h2>
              <div className="max-w-sm">
                <PostCard post={personalized.librarySummary.continueReading} />
              </div>
            </section>
          )}

          {/* Because you read... */}
          {personalized.historyPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Because you read {personalized.historyPosts[0]?.niche}…</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {personalized.historyPosts.slice(1, 4).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Your Topics */}
          {personalized.followedTopics.length > 0 && (
            <section className="mt-20">
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Your topics</h2>
              <div className="flex flex-wrap gap-2">
                {personalized.followedTopics.map((topic) => {
                  const niche = NICHES.find(n => n.slug === topic.niche_slug);
                  return niche ? (
                    <Link
                      key={niche.slug}
                      href={`/niche/${niche.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 hover:border-ink/30 transition-colors"
                      style={{ borderColor: niche.color }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
                      <span className="font-mono text-[11px]">{niche.label}</span>
                    </Link>
                  ) : null;
                })}
              </div>
            </section>
          )}

          {/* From Authors You Follow */}
          {personalized.followedAuthorsPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">From authors you follow</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {personalized.followedAuthorsPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Recommended For You - Shopping Intelligence */}
          {personalized.recommendations.length > 0 && (
            <section className="mt-20">
              <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Recommended for you</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalized.recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.product.id} className="rounded-folder border border-line bg-paper p-4 hover:border-ink/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded">
                        {rec.label}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-ink truncate">{rec.product.name}</h3>
                    <p className="mt-1 font-mono text-[11px] text-muted">{rec.product.manufacturer} {rec.product.model}</p>
                    <p className="mt-2 text-[13px] text-muted line-clamp-2">{rec.reasoning}</p>
                    <Link
                      href={`/products/${rec.product.slug}`}
                      className="mt-3 inline-block font-mono text-[11px] text-accent hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Buying Guides */}
      {buyingGuides.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">Buying Guides</h2>
            <Link
              href="/guides"
              className="font-mono text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              View all guides <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyingGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group rounded-folder border border-line bg-paper hover:border-ink/30 transition-colors overflow-hidden"
              >
                {guide.cover_image_url && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={guide.cover_image_url}
                      alt=""
                      fill
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  {guide.category_slug && (
                    <NicheTag key={guide.category_slug} slug={guide.category_slug} />
                  )}
                  <h3 className="font-display text-xl leading-snug text-ink group-hover:text-accent transition-colors">
                    {guide.title}
                  </h3>
                  {guide.excerpt && (
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted line-clamp-2">{guide.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted">Buying Guide</span>
                    <span className="font-mono text-[11px] text-accent group-hover:underline">Read guide →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-20">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Featured</h2>
        <BentoGrid posts={bentoPosts} />
      </section>

      <section className="mt-20">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Keep exploring</h2>
        <HorizontalRail posts={posts} />
      </section>
      </div>
    </div>
  );
}
