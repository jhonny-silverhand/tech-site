import Link from 'next/link';
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
import { ShoppingIntelligenceHero } from '@/components/ShoppingIntelligenceHero';
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
  
  // Get followed authors' recent posts
  const followedAuthorIds = followedAuthors.map(f => f.author_id);
  let followedAuthorsPosts: import('@/lib/types').Post[] = [];
  if (followedAuthorIds.length > 0) {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .in('author_id', followedAuthorIds)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6);
    followedAuthorsPosts = (data as import('@/lib/types').Post[]) ?? [];
  }

  // Get recommendations based on followed topics
  let recommendations: import('@/lib/products').ProductRecommendation[] = [];
  if (followedTopics.length > 0) {
    // Use first followed topic as primary category for recommendations
    const primaryTopic = followedTopics[0].niche_slug;
    const categoryMap: Record<string, string> = {
      'ai-tools': 'laptop', // map niches to product categories
      'programming': 'laptop',
      'android': 'smartphone',
      'windows-linux': 'laptop',
      'buying-guides': 'laptop',
      'gaming': 'laptop',
      'career-jobs': 'laptop',
      'finance': 'smartphone',
      'productivity': 'laptop',
    };
    const productCategory = categoryMap[primaryTopic] || 'laptop';
    recommendations = await getRecommendations({
      categorySlug: productCategory,
      priorities: followedTopics.slice(0, 3).map(t => t.niche_slug),
      useCases: ['programming', 'gaming'],
    });
  }

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
  const posts = await getRecentPosts(12);
  const bentoPosts = posts.slice(0, 6);
  const personalized = await getPersonalizedData();
  const shoppingHero = await getShoppingIntelligenceHero();
  const buyingGuides = await getBuyingGuidesForHomepage();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Hero + section nav share one fold: text on the left, the orbit
          (or its compact mobile fallback) on the right, so Featured
          follows immediately rather than after a whole separate nav
          section. */}
      <section className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-8">
        <div className="max-w-2xl">
          <p className="font-display text-[15px] text-accent mb-3">tech // site</p>
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

      {/* Shopping Intelligence Hero — prominent, works for all users */}
      {shoppingHero && shoppingHero.length > 0 && (
        <section className="mt-20" aria-labelledby="shopping-intelligence-heading">
          <ShoppingIntelligenceHero featuredProducts={shoppingHero} />
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
  );
}
