'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, Shield, Search, ChevronRight, Keyboard } from 'lucide-react';

interface FeaturedProduct {
  category: string;
  product: {
    id: string;
    name: string;
    slug: string;
    manufacturer: string | null;
    model: string | null;
    image_url: string | null;
    retailers: Array<{
      price_cents: number | null;
      retailer: { name: string; logo_url: string | null };
    }>;
  };
}

interface ShoppingIntelligenceHeroProps {
  featuredProducts: FeaturedProduct[];
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  laptop: { label: 'Laptops', icon: '💻' },
  smartphone: { label: 'Smartphones', icon: '📱' },
  headphones: { label: 'Headphones', icon: '🎧' },
};

export function ShoppingIntelligenceHero({ featuredProducts }: ShoppingIntelligenceHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Navigate to shopping page with search query
    window.location.href = `/shopping?q=${encodeURIComponent(searchQuery.trim())}`;
  }

  return (
    <section className="relative" style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgb(79 125 255 / 0.08), transparent 70%)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 mb-4 mx-auto">
            <Sparkles size={18} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-wide text-accent">Shopping Intelligence</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] text-ink mb-3">
            tech//site helps you decide what to buy
          </h2>
          <p className="text-[16px] leading-relaxed text-muted max-w-2xl mx-auto">
            Tell us what you need. We analyze specs, prices, and reviews across retailers — then explain the trade-offs so you can choose with confidence.
          </p>
        </div>

        {/* Interactive Search */}
        <div className="mx-auto max-w-2xl mb-12">
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="shopping-search" className="sr-only">
              Search products, guides, and reviews
            </label>
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="shopping-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for? e.g., 'best laptop under 80k for programming'"
                className="w-full rounded-folder border border-line bg-paper px-14 py-4 pr-12 text-[16px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                autoComplete="off"
              />
              <Keyboard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/50 hidden sm:block" aria-hidden="true" />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="absolute right-12 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-folder bg-accent text-white px-4 py-2 font-mono text-[13px] uppercase tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <Zap size={14} />
                Search
              </button>
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted text-center">
              Press <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">⌘K</kbd> or <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">/</kbd> to open command palette
            </p>
          </form>
        </div>

        {/* Quick Category Links */}
        <div className="mx-auto max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4 text-center">Start with a category</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['laptop', 'smartphone', 'headphones'].map((cat) => {
              let catInfo = { label: 'Laptops', icon: '💻' } as any;
              if (cat === 'smartphone') catInfo = { label: 'Smartphones', icon: '📱' };
              if (cat === 'headphones') catInfo = { label: 'Headphones', icon: '🎧' };
              
              return (
                <Link
                  key={cat}
                  href={`/shopping?category=${cat}`}
                  className="group relative rounded-folder border border-line bg-paper p-5 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="text-3xl mb-2">{catInfo.icon}</div>
                  <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors">{catInfo.label}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">Explore {catInfo.label.toLowerCase()} →</p>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/20 group-hover:bg-accent transition-colors duration-200" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link
            href="/shopping"
            className="inline-flex items-center gap-2 rounded-folder bg-accent text-white px-6 py-3 font-mono text-[13px] uppercase tracking-wide hover:bg-accent/90 transition-colors"
          >
            <Zap size={16} />
            Start a guided search
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-folder border border-line bg-paper text-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide hover:border-ink/30 hover:bg-ink/5 transition-colors"
          >
            Browse buying guides
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-folder border border-line bg-paper text-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide hover:border-ink/30 hover:bg-ink/5 transition-colors"
          >
            Compare products
          </Link>
        </div>

        {/* Featured Product Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {['laptop', 'smartphone', 'headphones'].map((cat) => {
            let catInfo = { label: 'Laptops', icon: '💻' } as any;
            if (cat === 'smartphone') catInfo = { label: 'Smartphones', icon: '📱' };
            if (cat === 'headphones') catInfo = { label: 'Headphones', icon: '🎧' };
            
            return (
              <Link
                key={cat}
                href={`/shopping?category=${cat}`}
                className="group relative rounded-folder border border-line bg-paper p-5 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
              >
                <div className="text-3xl mb-2">{catInfo.icon}</div>
                <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors">{catInfo.label}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">Explore {catInfo.label.toLowerCase()} →</p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/20 group-hover:bg-accent transition-colors duration-200" />
              </Link>
            );
          })}
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6 text-center">On Our Radar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.slice(0, 3).map(({ category, product }) => {
                const bestPrice = product.retailers
                  .filter(r => r.price_cents !== null)
                  .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity))[0];
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group rounded-folder border border-line bg-paper p-4 hover:border-ink/30 hover:bg-ink/5 transition-colors"
                  >
                    <div className="relative aspect-[4/3] mb-3 rounded-md overflow-hidden bg-line">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        {CATEGORY_LABELS[category]?.label || category}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors truncate mb-1">{product.name}</h3>
                    <p className="font-mono text-[11px] text-muted mb-2">{product.manufacturer} {product.model}</p>
                    {bestPrice && (
                      <p className="font-display text-xl text-ink">
                        ₹{(bestPrice.price_cents! / 100).toLocaleString()}
                        <span className="font-mono text-[11px] text-muted"> at {bestPrice.retailer.name}</span>
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-line">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="py-2">
              <Sparkles size={24} className="text-accent mx-auto mb-2" />
              <h4 className="font-display text-lg text-ink">Editorial independence</h4>
              <p className="mt-1 text-[13px] text-muted">We don't accept paid placements. Recommendations are based on specs, prices, and editorial judgment.</p>
            </div>
            <div className="py-2">
              <Shield size={24} className="text-accent mx-auto mb-2" />
              <h4 className="font-display text-lg text-ink">Real prices, real retailers</h4>
              <p className="mt-1 text-[13px] text-muted">We show current prices from multiple retailers — no fake discounts or inflated MSRPs.</p>
            </div>
            <div className="py-2">
              <Zap size={24} className="text-accent mx-auto mb-2" />
              <h4 className="font-display text-lg text-ink">Explain the trade-offs</h4>
              <p className="mt-1 text-[13px] text-muted">Every recommendation explains where a product excels and where it compromises.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}