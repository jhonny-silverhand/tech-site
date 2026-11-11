import Link from 'next/link';
import Image from 'next/image';
import { Store, TrendingDown, BarChart3 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { lowestPrice } from '@/lib/products-client';

const CATEGORY_LABELS: Record<string, string> = {
  laptops: 'Laptop',
  smartphones: 'Smartphone',
  headphones: 'Headphones',
  'pc-components': 'PC Parts',
};

function getPriceHistoryUrl(name: string, category: string | null): string {
  const query = encodeURIComponent(name);
  if (category === 'smartphones') return `https://pricebefore.com/search/?q=${query}`;
  return `https://pricehistory.in/search?q=${query}`;
}

function getComparisonUrl(name: string, category: string | null): string {
  const query = encodeURIComponent(name);
  if (category === 'smartphones') return `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${query}`;
  return `https://versus.com/en/?q=${query}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { price_cents, currency } = lowestPrice(product);
  const best = product.retailers
    .filter((r) => r.price_cents != null)
    .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))[0];
  const img = product.image_url || `https://picsum.photos/seed/${product.slug}/640/480`;
  const catLabel = (product.category_slug && CATEGORY_LABELS[product.category_slug]) || product.category_slug;

  return (
    <div className="card card-interactive group flex h-full flex-col overflow-hidden focus-within:border-linestrong">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={product.name}
      >
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-2">
          <Image
            src={img}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </span>
        <span className="flex flex-1 flex-col gap-1.5 p-4">
          <span className="flex items-center gap-1.5">
            {catLabel && (
              <span className="rounded bg-accentsoft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accentink">
                {catLabel}
              </span>
            )}
            {product.live && (
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">
                Live AI
              </span>
            )}
          </span>
          <span className="t-section text-[15px] leading-snug text-ink group-hover:text-accentink">
            <span className="clamp-2">{product.name}</span>
          </span>
          {(product.manufacturer || product.model) && (
            <span className="font-mono text-[11px] text-muted">
              {[product.manufacturer, product.model].filter(Boolean).join(' ')}
            </span>
          )}
          {product.description && <span className="clamp-2 text-[13px] leading-relaxed text-muted">{product.description}</span>}
          <span className="t-numeric mt-auto pt-3 text-[15px] font-semibold text-ink">
            {price_cents != null ? (
              <>
                {formatINR(price_cents, currency)}
                {best && <span className="ml-1 font-mono text-[11px] font-normal text-muted">at {best.retailer_name}</span>}
              </>
            ) : (
              <span className="text-sm font-normal text-muted">Price unavailable</span>
            )}
          </span>
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-muted">
            <Store size={11} aria-hidden className="text-faint" />
            {product.retailers.length} retailer{product.retailers.length === 1 ? '' : 's'} · See all
          </span>
        </span>
      </Link>
      <span className="mx-4 flex gap-2 border-t border-line py-2.5">
        <a
          href={getPriceHistoryUrl(product.name, product.category_slug)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-accentink"
        >
          <TrendingDown size={10} aria-hidden />
          Price History
        </a>
        <span className="text-faint" aria-hidden>·</span>
        <a
          href={getComparisonUrl(product.name, product.category_slug)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-accentink"
        >
          <BarChart3 size={10} aria-hidden />
          Compare
        </a>
      </span>
    </div>
  );
}
