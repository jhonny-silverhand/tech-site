'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, TrendingDown, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    manufacturer: string | null;
    model: string | null;
    image_url: string | null;
    category_slug: string;
    retailers: Array<{
      price_cents: number | null;
      retailer: { name: string; logo_url: string | null };
      price_updated_at?: string;
    }>;
    label?: string;
    reasoning?: string;
    pros?: string[];
    cons?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  laptop: { label: 'Laptop', icon: '💻' },
  smartphone: { label: 'Smartphone', icon: '📱' },
  headphones: { label: 'Headphones', icon: '🎧' },
  tablet: { label: 'Tablet', icon: '📟' },
  earbuds: { label: 'Earbuds', icon: '🎧' },
  monitor: { label: 'Monitor', icon: '🖥️' },
  keyboard: { label: 'Keyboard', icon: '⌨️' },
  mouse: { label: 'Mouse', icon: '🖱️' },
  smartwatch: { label: 'Smartwatch', icon: '⌚' },
  camera: { label: 'Camera', icon: '📷' },
  tv: { label: 'TV', icon: '📺' },
  gaming: { label: 'Gaming', icon: '🎮' },
  components: { label: 'Components', icon: '🔧' },
  accessories: { label: 'Accessories', icon: '🔌' },
};

function getBestPrice(retailers: Array<{ price_cents: number | null; retailer: { name: string } }>) {
  return retailers
    .filter(r => r.price_cents !== null)
    .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))[0];
}

function getCategoryInfo(slug: string) {
  return CATEGORY_LABELS[slug] || { label: slug, icon: '📦' };
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

function getRetailerUrl(retailerName: string, productName: string): string {
  const query = encodeURIComponent(productName);
  const name = retailerName.toLowerCase();
  if (name.includes('flipkart')) return `https://www.flipkart.com/search?q=${query}`;
  if (name.includes('amazon')) return `https://www.amazon.in/s?k=${query}`;
  if (name.includes('croma')) return `https://www.croma.com/searchB?q=${query}`;
  if (name.includes('reliance')) return `https://www.reliancedigital.in/search?q=${query}`;
  return `https://www.google.com/search?q=${query}+buy+online+india`;
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const catInfo = getCategoryInfo(product.category_slug);
  const bestPrice = getBestPrice(product.retailers);
  const hasTradeoffs = product.pros && product.pros.length > 0 || product.cons && product.cons.length > 0;

  const cardStyles = {
    default: 'rounded-folder border border-line bg-paper p-4 hover:border-ink/30 hover:bg-ink/5 transition-colors',
    compact: 'rounded-folder border border-line bg-paper p-3 hover:border-ink/30 hover:bg-ink/5 transition-colors',
    featured: 'group relative rounded-folder border border-line bg-paper p-4 hover:border-ink/30 hover:bg-ink/5 transition-colors',
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cardStyles[variant]}
    >
      {product.image_url && (
        <div className="relative aspect-[4/3] mb-3 rounded-md overflow-hidden bg-line">
          <Image
            src={product.image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}
      {!product.image_url && (
        <div className="relative aspect-[4/3] mb-3 rounded-md bg-line flex items-center justify-center">
          <span className="font-display text-3xl text-muted">{product.name.charAt(0)}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
          {product.category_slug.charAt(0).toUpperCase() + product.category_slug.slice(1)}
        </span>
        {product.label && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
            {product.label}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg text-ink truncate mb-1">
        {product.name}
      </h3>

      {product.manufacturer && product.model && (
        <p className="font-mono text-[11px] text-muted mb-2">{product.manufacturer} {product.model}</p>
      )}

      {/* Price */}
      <div className="mb-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-muted mb-1">Best Price</p>
        <p className="font-display text-xl text-ink">
          {product.retailers.some(r => r.price_cents !== null) ? (
            <>
              ₹{Math.min(...product.retailers.filter(r => r.price_cents !== null).map(r => r.price_cents! / 100)).toLocaleString()}
              <span className="font-mono text-[11px] text-muted"> at {product.retailers.filter(r => r.price_cents !== null).sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))[0].retailer.name}</span>
            </>
          ) : (
            <span className="text-muted">Price not available</span>
          )}
        </p>
      </div>

      {/* Recommendation reasoning */}
      {product.reasoning && (
        <div className="mb-3 p-3 rounded-md bg-accent/5 border border-accent/10">
          <p className="text-[13px] leading-relaxed text-ink">{product.reasoning}</p>
        </div>
      )}

      {/* Trade-offs */}
      {hasTradeoffs && (
        <div className="space-y-1">
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

      {/* Retailer count */}
      {product.retailers.filter(r => r.price_cents !== null).length > 1 && (
        <p className="mt-3 font-mono text-[10px] text-muted">
          {product.retailers.filter(r => r.price_cents !== null).length} retailers · See all on product page
        </p>
      )}

      {/* Price tracking & comparison links */}
      <div className="mt-3 pt-3 border-t border-line flex gap-2">
        <a
          href={getPriceHistoryUrl(product.name, product.category_slug)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted hover:text-accent transition-colors"
        >
          <TrendingDown size={10} />
          Price History
        </a>
        <span className="text-muted/30">·</span>
        <a
          href={getComparisonUrl(product.name, product.category_slug)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted hover:text-accent transition-colors"
        >
          <BarChart3 size={10} />
          Compare
        </a>
      </div>
    </Link>
  );
}