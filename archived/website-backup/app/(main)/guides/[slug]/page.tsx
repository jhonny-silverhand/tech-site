import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getNiche } from '@/lib/niches';
import { formatDate } from '@/lib/utils';
import { getBuyingGuideBySlug, getProductWithRetailers } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NICHES } from '@/lib/niches';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { NicheTag } from '@/components/NicheTag';
import { PostCard } from '@/components/PostCard';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: 'Buying Guide' };

  const guide = await getBuyingGuideBySlug(slug);
  if (!guide) return { title: 'Guide not found' };

  return {
    title: `${guide.title} — tech//site`,
    description: guide.excerpt || guide.seo_description || `Read our expert buying guide: ${guide.title}.`,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Buying Guide</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Guides need a connected Supabase project. Follow Guides/01-database-setup.md, then this page will work.
        </p>
      </div>
    );
  }

  const guide = await getBuyingGuideBySlug(slug);
  if (!guide) notFound();

  const category = NICHES.find(n => n.slug === guide.category_slug);
  const ambientColor = category?.color || '#4F7DFF';

  // Fetch full product data for recommendations
  const recommendationsWithProducts = await Promise.all(
    guide.recommendations.map(async (rec) => {
      const product = await getProductWithRetailers(rec.product_id);
      return product ? { ...rec, product } : null;
    })
  );

const validRecommendations = recommendationsWithProducts.filter(
  (r): r is NonNullable<typeof r> => Boolean(r)
) as Array<{
  label: string;
  reason: string | null;
  pros: string[];
  cons: string[];
  display_order: number;
  product: NonNullable<Awaited<ReturnType<typeof getProductWithRetailers>>>;
}>;

  return (
    <article className="relative mx-auto max-w-4xl px-4 sm:px-6 py-14">
      {/* Breadcrumb */}
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">
        <Link href="/" className="hover:text-ink transition-colors">
          tech<span className="text-accent">//</span>site
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-accent transition-colors">Guides</Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link
              href={`/guides?category=${category.slug}`}
              style={{ color: category.color }}
              className="hover:opacity-70 transition-opacity"
            >
              {category.label}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-ink/60">{guide.slug}</span>
      </p>

      {/* Hero */}
      <div className="mb-10">
        {category && <NicheTag slug={category.slug} />}
        <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">{guide.title}</h1>
        {guide.excerpt && (
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{guide.excerpt}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[12px] text-muted">
          <span>{guide.author_name}</span>
          <span>·</span>
          <span>{formatDate(guide.published_at || guide.created_at)}</span>
          {guide.is_ai_assisted && (
            <>
              <span>·</span>
              <span className="text-accent">AI-assisted draft, edited by {guide.author_name}</span>
            </>
          )}
        </div>
      </div>

      {guide.cover_image_url && (
        <div className="relative aspect-[16/9] mb-12 rounded-folder overflow-hidden bg-line">
          <Image
            src={guide.cover_image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      )}

      {/* Quick Recommendations */}
      {validRecommendations.length > 0 && (
        <section className="mb-16 pt-8 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Quick recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {validRecommendations.sort((a, b) => a.display_order - b.display_order).map((rec) => (
              <div key={rec.product.id} className="rounded-folder border border-line bg-paper p-5 hover:border-ink/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded">
                    {rec.label}
                  </span>
                </div>
                {rec.product.image_url && (
                  <div className="relative aspect-[4/3] mb-3 rounded-md overflow-hidden bg-line">
                    <Image
                      src={rec.product.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="font-display text-lg text-ink truncate mb-1">{rec.product.name}</h3>
                <p className="font-mono text-[12px] text-muted mb-2">{rec.product.manufacturer} {rec.product.model}</p>
                {rec.reason && <p className="text-[13px] text-muted mb-3">{rec.reason}</p>}
                
                {/* Price */}
                {rec.product.retailers.filter(r => r.price_cents !== null).length > 0 && (
                  <p className="font-display text-xl text-ink mb-3">
                    ₹{Math.min(...rec.product.retailers.filter(r => r.price_cents !== null).map(r => r.price_cents! / 100)).toLocaleString()}
                  </p>
                )}

                <div className="space-y-1 mb-3">
                  {rec.pros.slice(0, 3).map((pro, i) => (
                    <p key={i} className="flex items-center gap-2 text-[12px] text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {pro}
                    </p>
                  ))}
                  {rec.cons.slice(0, 2).map((con, i) => (
                    <p key={i} className="flex items-center gap-2 text-[12px] text-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {con}
                    </p>
                  ))}
                </div>

                <Link
                  href={`/products/${rec.product.slug}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
                >
                  View details →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full Guide Content */}
      <div className="prose-tech max-w-none">
        <TableOfContents content={guide.content} />
        <MarkdownContent
          content={guide.content}
          accentColor={ambientColor}
          highlightFigures={guide.category_slug === 'finance'}
          citationStyle={guide.category_slug === 'ai-tools'}
        />
      </div>

      {/* Detailed Recommendations */}
      {validRecommendations.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-8">Detailed analysis</h2>
          
          {validRecommendations.sort((a, b) => a.display_order - b.display_order).map((rec, index) => (
            <article key={rec.product.id} className="mb-16 pb-12 border-b border-line last:border-0 last:pb-0">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-xl text-white"
                  style={{ backgroundColor: ambientColor }}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{rec.label}</p>
                  <h3 className="font-display text-2xl text-ink">{rec.product.name}</h3>
                </div>
              </div>

              {rec.product.image_url && (
                <div className="relative aspect-[16/9] mb-8 rounded-folder overflow-hidden bg-line">
                  <Image
                    src={rec.product.image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 768px, 100vw"
                  />
                </div>
              )}

              {rec.reason && (
                <div className="mb-8 p-6 rounded-folder bg-accent/5 border border-accent/20">
                  <h4 className="font-mono text-[11px] uppercase tracking-wide text-accent mb-2">Why we recommend it</h4>
                  <p className="text-[15px] leading-relaxed text-ink">{rec.reason}</p>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {rec.pros.length > 0 && (
                  <div className="rounded-folder border border-green-500/30 bg-green-500/5 p-5">
                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-green-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Pros
                    </h4>
                    <ul className="space-y-2">
                      {rec.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {rec.cons.length > 0 && (
                  <div className="rounded-folder border border-red-500/30 bg-red-500/5 p-5">
                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-red-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Cons
                    </h4>
                    <ul className="space-y-2">
                      {rec.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Specs Summary */}
              <div className="mb-8">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Key specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rec.product.specs.slice(0, 8).map((spec) => (
                    <div key={spec.spec_key} className="rounded-folder bg-paper/50 p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{spec.spec_key.replace(/_/g, ' ')}</p>
                      <p className="font-display text-[14px] text-ink">{spec.spec_value} {spec.unit || ''}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Buy */}
              <div className="rounded-folder border border-line bg-paper p-5">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Where to buy</h4>
                <div className="space-y-2">
                  {rec.product.retailers
                    .filter(r => r.price_cents !== null)
                    .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))
                    .slice(0, 3)
                    .map((pr) => (
                      <Link
                        key={pr.retailer.id}
                        href={pr.affiliate_url || pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-md border border-line hover:bg-ink/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {pr.retailer.logo_url && (
                            <Image
                              src={pr.retailer.logo_url}
                              alt=""
                              width={32}
                              height={32}
                              className="rounded"
                            />
                          )}
                          <span className="font-mono text-[13px] text-ink">{pr.retailer.name}</span>
                          {pr.retailer.is_official && (
                            <span className="font-mono text-[9px] uppercase tracking-wide text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">Official</span>
                          )}
                        </div>
                        <span className="font-display text-xl text-ink">
                          ₹{(pr.price_cents! / 100).toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  {rec.product.retailers.filter(r => r.price_cents === null).length === rec.product.retailers.length && (
                    <p className="font-mono text-[12px] text-muted">No current price data available</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Who should buy what */}
      <section className="mt-16 pt-10 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-8">Who should buy what</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {validRecommendations.map((rec) => (
            <div key={rec.product.id} className="rounded-folder border border-line bg-paper p-5">
              <h3 className="font-display text-lg text-ink mb-1">{rec.label}: {rec.product.name}</h3>
              <p className="text-[14px] text-muted">{rec.reason || 'Solid choice for this category.'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Things to consider */}
      <section className="mt-16 pt-10 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-8">Things to consider</h2>
        <div className="prose-tech max-w-none">
          <ul>
            <li><strong>Budget vs. needs:</strong> The most expensive option isn't always the best for your specific use case.</li>
            <li><strong>Future-proofing:</strong> Consider whether you need headroom for future software/games.</li>
            <li><strong>Ecosystem:</strong> If you're invested in a particular ecosystem (Apple, Samsung, etc.), compatibility matters.</li>
            <li><strong>Warranty & support:</strong> Check warranty terms and service center availability in your region.</li>
          </ul>
        </div>
      </section>

      {/* Related Guides */}
      <section className="mt-16 pt-10 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Related guides</h2>
        <div className="flex flex-wrap gap-4">
          {NICHES.filter(n => n.slug !== guide.category_slug).slice(0, 4).map((niche) => (
            <Link
              key={niche.slug}
              href={`/guides?category=${niche.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors hover:border-ink/30"
              style={{ borderColor: niche.color }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
              {niche.label} guides
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}