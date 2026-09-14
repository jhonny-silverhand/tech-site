import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, BarChart3, ExternalLink } from 'lucide-react';
import { getProductWithRetailers } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NICHES } from '@/lib/niches';
import { getNiche } from '@/lib/niches';
import type { ProductWithRetailers } from '@/lib/products';

interface ComparePageProps {
  searchParams: Promise<{ products?: string | string[] }>;
}

interface ProductWithRecommendation extends ProductWithRetailers {
  reasoning?: string;
  pros?: string[];
  cons?: string[];
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: ComparePageProps) {
  const { products } = await searchParams;
  const productSlugs = Array.isArray(products) ? products : products ? [products] : [];
  
  if (productSlugs.length === 0) return { title: 'Compare Products — tech//site' };
  
  const names = productSlugs.slice(0, 3).join(', ');
  return {
    title: `Compare: ${names}${productSlugs.length > 3 ? ` +${productSlugs.length - 3} more` : ''} — tech//site`,
    description: `Compare specifications, prices, and features of ${productSlugs.length} products side by side.`,
  };
}

function getSpecDisplayValue(product: Awaited<ReturnType<typeof getProductWithRetailers>>, specKey: string): string {
  const spec = product?.specs.find(s => s.spec_key === specKey);
  if (!spec) return '—';
  return `${spec.spec_value} ${spec.unit || ''}`;
}

function getAllSpecKeys(products: (Awaited<ReturnType<typeof getProductWithRetailers>> | null)[]): string[] {
  const keys = new Set<string>();
  products.forEach(p => {
    if (p) p.specs.forEach(s => keys.add(s.spec_key));
  });
  return Array.from(keys);
}

function getExternalComparisonUrl(productName: string, category: string): string {
  const query = encodeURIComponent(productName);
  if (category === 'smartphone') return `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${query}`;
  return `https://versus.com/en/?q=${query}`;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { products: productsParam } = await searchParams;
  const productSlugs = Array.isArray(productsParam) ? productsParam : productsParam ? [productsParam] : [];

  if (productSlugs.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Compare Products</h1>
        <p className="mt-4 text-[15px] text-muted">
          Select at least two products to compare. Use the &quot;Compare&quot; button on product pages or add
          <code className="bg-paper px-1.5 py-0.5 rounded font-mono text-[13px]">?products=slug1&amp;products=slug2</code> to the URL.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block font-mono text-[11px] text-accent hover:underline"
        >
          Browse products →
        </Link>
      </div>
    );
  }

  // Fetch all products (works with seed data)
  const products = await Promise.all(
    productSlugs.slice(0, 4).map(slug => getProductWithRetailers(slug))
  );

  const validProducts = products.filter((p): p is ProductWithRecommendation => Boolean(p));
  
  if (validProducts.length < 2) notFound();

  const specKeys = getAllSpecKeys(validProducts);
  const primaryCategory = getNiche(validProducts[0]?.category_slug || '');
  const categoryColor = primaryCategory?.color || '#4F7DFF';

  // TypeScript narrowing
  const productNames = validProducts.map(p => p.name).join(' vs ');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-2">Product Comparison</p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
          Comparing {validProducts.length} products
        </h1>
        <p className="mt-2 font-mono text-[13px] text-muted">
          {productNames}
        </p>
      </div>

      {/* Product Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {validProducts.map((product, index) => (
          <div
            key={product.id}
            className="relative rounded-folder border border-line bg-paper p-4 hover:border-ink/30 transition-colors"
            style={{ borderLeft: `4px solid ${categoryColor}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded">
                {index + 1}
              </span>
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
              )}
            </div>
            <h3 className="font-display text-lg text-ink truncate">{product.name}</h3>
            {product.manufacturer && product.model && (
              <p className="mt-1 font-mono text-[12px] text-muted">{product.manufacturer} {product.model}</p>
            )}
            
            {/* Best Price */}
            <div className="mt-3 pt-3 border-t border-line">
              {product.retailers.filter(r => r.price_cents !== null).length > 0 && (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-muted">Best price</p>
                  <p className="font-display text-xl text-ink">
                    ₹{Math.min(...product.retailers.filter(r => r.price_cents !== null).map(r => r.price_cents! / 100)).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Specs Comparison Table */}
      <section className="rounded-folder border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-ink/5">
              <tr>
                <th className="sticky left-0 z-10 text-left p-4 font-mono text-[11px] uppercase tracking-wide text-muted bg-ink/5 border-r border-line">
                  Specification
                </th>
                {validProducts.map((product, index) => (
                  <th key={product.id} className="text-center p-4 font-mono text-[11px] uppercase tracking-wide text-muted border-r border-line last:border-r-0"
                    style={{ borderColor: categoryColor }}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] text-white"
                        style={{ backgroundColor: categoryColor }}>
                        {index + 1}
                      </span>
                      <span className="text-[12px] truncate max-w-[140px]">{product.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {specKeys.map((specKey, i) => (
                <tr key={specKey} className={i % 2 === 0 ? 'bg-paper/50' : ''}>
                  <td className="sticky left-0 z-10 text-left p-4 font-mono text-[13px] text-muted capitalize bg-paper border-r border-line"
                    style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    {specKey.replace(/_/g, ' ')}
                  </td>
                  {validProducts.map((product) => (
                    <td key={product.id} className="text-center p-4 font-display text-[14px] text-ink border-r border-line last:border-r-0"
                      style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      {getSpecDisplayValue(product, specKey)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="mt-8 rounded-folder border border-line overflow-hidden">
        <div className="p-6 border-b border-line bg-ink/5">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Price Comparison</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {validProducts.map((product) => (
              <div key={product.id} className="rounded-folder border border-line p-4">
                <h3 className="font-display text-lg text-ink truncate">{product.name}</h3>
                <div className="mt-3 space-y-2">
                  {product.retailers
                    .filter(r => r.price_cents !== null)
                    .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))
                    .slice(0, 3)
                    .map((pr) => (
                      <Link
                        key={pr.retailer.id}
                        href={pr.affiliate_url || pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md border border-line hover:bg-ink/5 transition-colors"
                      >
                        <span className="font-mono text-[12px] text-muted">{pr.retailer.name}</span>
                        <span className="font-display text-lg text-ink">
                          ₹{(pr.price_cents! / 100).toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  {product.retailers.filter(r => r.price_cents === null).length === product.retailers.length && (
                    <p className="font-mono text-[12px] text-muted">No price data available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Verdict */}
      <section className="mt-8">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Quick Verdict</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {validProducts.map((product, index) => (
            <div key={product.id} className="rounded-folder border border-line bg-paper p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[12px] text-white"
                  style={{ backgroundColor: categoryColor }}>
                  {index + 1}
                </span>
                <h3 className="font-display text-xl text-ink truncate">{product.name}</h3>
              </div>
              
              {/* Recommendation reasoning */}
              <div className="mb-4 p-3 rounded-md bg-accent/5 border border-accent/10">
                <p className="text-[13px] leading-relaxed text-ink">
                  {product.reasoning || 'Strong contender in its category with competitive specs and pricing.'}
                </p>
              </div>

              {/* Trade-offs */}
              {(product.pros && product.pros.length > 0) || (product.cons && product.cons.length > 0) && (
                <div className="space-y-2 mb-4">
                  {product.pros && product.pros.length > 0 && (
                    <div className="space-y-1">
                      {product.pros.slice(0, 2).map((pro, i) => (
                        <div key={i} className="inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-500/10 px-2 py-0.5 rounded">
                          ✓ {pro}
                        </div>
                      ))}
                    </div>
                  )}
                  {product.cons && product.cons.length > 0 && (
                    <div className="space-y-1">
                      {product.cons.slice(0, 1).map((con, i) => (
                        <div key={i} className="inline-flex items-center gap-1 text-[11px] text-red-700 bg-red-500/10 px-2 py-0.5 rounded">
                          ⚠ {con}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Link
                href={`/products/${product.slug}`}
                className="mt-4 inline-block font-mono text-[11px] text-accent hover:underline"
              >
                View full details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* External Comparison Links */}
      <section className="mt-8 pt-8 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Compare on external sites</h2>
        <div className="flex flex-wrap gap-3">
          {validProducts.map((product) => (
            <a
              key={product.id}
              href={getExternalComparisonUrl(product.name, product.category_slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-folder border border-line px-4 py-2.5 font-mono text-[12px] text-muted hover:border-accent/50 hover:text-accent transition-colors"
            >
              <BarChart3 size={14} />
              {product.name}
              <span className="text-muted/50">on {product.category_slug === 'smartphone' ? 'GSMArena' : 'Versus'}</span>
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}