import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown, BarChart3, ExternalLink } from 'lucide-react';
import { getNiche } from '@/lib/niches';
import { formatDate } from '@/lib/utils';
import { getProductWithRetailers, getBuyingGuidesForProduct } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NICHES } from '@/lib/niches';
import { PostCard } from '@/components/PostCard';
import { NicheTag } from '@/components/NicheTag';
import { TopicFollowButton } from '@/components/TopicFollowButton';
import { WishlistButton } from '@/components/WishlistButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function getPriceHistoryUrl(name: string, category: string): string {
  const query = encodeURIComponent(name);
  if (category === 'smartphone') return `https://pricebefore.com/search/?q=${query}`;
  return `https://pricehistory.in/search?q=${query}`;
}

function getComparisonUrl(name: string, category: string): string {
  const query = encodeURIComponent(name);
  if (category === 'smartphone') return `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${query}`;
  return `https://versus.com/en/?q=${query}`;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: 'Product' };

  const product = await getProductWithRetailers(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name} — tech//site`,
    description: product.description || `View details, specs, and prices for ${product.name}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Product</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Products need a connected Supabase project. Follow Guides/01-database-setup.md, then this page will work.
        </p>
      </div>
    );
  }

  const product = await getProductWithRetailers(slug);
  if (!product) notFound();

  const category = NICHES.find(n => n.slug === product.category_slug);
  const buyingGuides = await getBuyingGuidesForProduct(product.id);

  // Find best price
  const availableRetailers = product.retailers
    .filter(r => r.price_cents !== null && r.availability !== 'out_of_stock')
    .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity));

  const bestPrice = availableRetailers[0];
  const priceRange = availableRetailers.length > 1
    ? `₹${(availableRetailers[0].price_cents! / 100).toLocaleString()} – ₹${(availableRetailers[availableRetailers.length - 1].price_cents! / 100).toLocaleString()}`
    : bestPrice
    ? `₹${(bestPrice.price_cents! / 100).toLocaleString()}`
    : 'Price not available';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      {/* Breadcrumb */}
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">
        <Link href="/" className="hover:text-ink transition-colors">
          tech<span className="text-accent">//</span>site
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category_slug}`} className="hover:text-accent transition-colors">
          {category?.label || product.category_slug}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/60">{product.name}</span>
      </p>

      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-1">
          {product.image_url && (
            <div className="relative aspect-[4/3] rounded-folder overflow-hidden bg-line sticky top-24">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          )}
          {!product.image_url && (
            <div className="relative aspect-[4/3] rounded-folder bg-line flex items-center justify-center sticky top-24">
              <span className="font-display text-3xl text-muted">{product.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {category && <NicheTag slug={category.slug} />}
            <h1 className="mt-2 font-display text-3xl sm:text-4xl leading-tight text-ink">{product.name}</h1>
            {product.manufacturer && product.model && (
              <p className="mt-1 font-mono text-[13px] text-muted">{product.manufacturer} {product.model}</p>
            )}
            {product.release_date && (
              <p className="mt-1 font-mono text-[11px] text-muted">Released {formatDate(product.release_date)}</p>
            )}
          </div>

          {/* Price & Buy */}
          <div className="rounded-folder border border-line bg-paper p-6 space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted">Best Price</p>
              <p className="mt-1 font-display text-3xl text-ink">{priceRange}</p>
            </div>

            {bestPrice && (
              <Link
                href={bestPrice.affiliate_url || bestPrice.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-folder bg-accent text-white py-3 font-mono text-[13px] hover:bg-accent/90 transition-colors"
              >
                Buy from {bestPrice.retailer.name}
              </Link>
            )}

            {availableRetailers.length > 1 && (
              <p className="font-mono text-[11px] text-muted text-center">
                {availableRetailers.length} retailers · See all below
              </p>
            )}

            {/* Price tracking & comparison */}
            <div className="flex gap-3 pt-2">
              <a
                href={getPriceHistoryUrl(product.name, product.category_slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-folder border border-line py-2.5 font-mono text-[11px] text-muted hover:border-accent/50 hover:text-accent transition-colors"
              >
                <TrendingDown size={14} />
                Price History
              </a>
              <a
                href={getComparisonUrl(product.name, product.category_slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-folder border border-line py-2.5 font-mono text-[11px] text-muted hover:border-accent/50 hover:text-accent transition-colors"
              >
                <BarChart3 size={14} />
                Compare on {product.category_slug === 'smartphone' ? 'GSMArena' : 'Versus'}
              </a>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {product.specs.slice(0, 8).map((spec) => (
              <div key={spec.spec_key} className="rounded-folder bg-paper/50 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{spec.spec_key.replace(/_/g, ' ')}</p>
                <p className="font-display text-[15px] text-ink">{spec.spec_value} {spec.unit || ''}</p>
              </div>
            ))}
          </div>

          {/* Topic Follow & Wishlist */}
          {category && (
            <div className="flex gap-3">
              <TopicFollowButton nicheSlug={category.slug} initialFollowing={false} />
              <WishlistButton productId={product.id} />
            </div>
          )}
        </div>
      </div>

      {/* Where to Buy */}
      {availableRetailers.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Where to buy</h2>
          <div className="rounded-folder border border-line overflow-hidden">
            <table className="w-full">
              <thead className="bg-ink/5">
                <tr>
                  <th className="text-left p-4 font-mono text-[11px] uppercase tracking-wide text-muted">Retailer</th>
                  <th className="text-right p-4 font-mono text-[11px] uppercase tracking-wide text-muted">Price</th>
                  <th className="text-center p-4 font-mono text-[11px] uppercase tracking-wide text-muted">Availability</th>
                  <th className="text-center p-4 font-mono text-[11px] uppercase tracking-wide text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {availableRetailers.map((pr) => (
                  <tr key={pr.retailer.id} className="hover:bg-ink/5">
                    <td className="p-4">
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
                        <span className="font-display text-[15px] text-ink">{pr.retailer.name}</span>
                        {pr.retailer.is_official && (
                          <span className="font-mono text-[9px] uppercase tracking-wide text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">Official</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right font-display text-lg text-ink">
                      ₹{(pr.price_cents! / 100).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] ${
                        pr.availability === 'in_stock' ? 'bg-green-500/10 text-green-600' :
                        pr.availability === 'limited' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-muted/10 text-muted'
                      }`}>
                        {pr.availability?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={pr.affiliate_url || pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-accent hover:bg-accent/10 transition-colors"
                      >
                        Buy
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Full Specifications */}
      {product.specs.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.specs.map((spec) => (
              <div key={spec.spec_key} className="flex justify-between py-2 border-b border-line/50">
                <span className="font-mono text-[13px] text-muted capitalize">{spec.spec_key.replace(/_/g, ' ')}</span>
                <span className="font-display text-[15px] text-ink">{spec.spec_value} {spec.unit || ''}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Buying Guides */}
      {buyingGuides.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Related buying guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyingGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="rounded-folder border border-line bg-paper p-4 hover:border-ink/30 transition-colors"
              >
                <h3 className="font-display text-lg text-ink truncate">{guide.title}</h3>
                <p className="mt-1 font-mono text-[11px] text-muted">Buying Guide</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Products (same category) */}
      <section className="mt-16 pt-10 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Similar products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {/* Would fetch related products here */}
          <div className="col-span-full text-center py-12">
            <p className="font-mono text-[13px] text-muted">More products coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}