'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, BarChart3, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/Field';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  category_slug: string;
  manufacturer: string | null;
  model: string | null;
}

const CATEGORIES = [
  { slug: 'smartphone', label: 'Smartphones', icon: '📱' },
  { slug: 'laptop', label: 'Laptops', icon: '💻' },
  { slug: 'headphones', label: 'Headphones', icon: '🎧' },
  { slug: 'earbuds', label: 'Earbuds', icon: '🎵' },
  { slug: 'tablet', label: 'Tablets', icon: '📟' },
  { slug: 'monitor', label: 'Monitors', icon: '🖥️' },
  { slug: 'keyboard', label: 'Keyboards', icon: '⌨️' },
  { slug: 'mouse', label: 'Mice', icon: '🖱️' },
  { slug: 'smartwatch', label: 'Smartwatches', icon: '⌚' },
  { slug: 'camera', label: 'Cameras', icon: '📷' },
];

export default function CompareIndexPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SearchResult[]>([]);
  const [searchDone, setSearchDone] = useState(false);

  const maxProducts = 4;

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setSearchDone(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=8`)
        .then(r => r.json())
        .then(data => {
          setResults(data.products || []);
          setSearchDone(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function toggleProduct(product: SearchResult) {
    setSelected(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= maxProducts) return prev;
      return [...prev, product];
    });
  }

  function removeProduct(id: string) {
    setSelected(prev => prev.filter(p => p.id !== id));
  }

  function buildCompareUrl(): string {
    if (selected.length < 2) return '#';
    const slugs = selected.map(p => p.slug);
    return `/compare?products=${slugs.join('&products=')}`;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 mb-6">
          <BarChart3 size={18} className="text-accent" />
          <span className="font-mono text-[11px] uppercase tracking-wide text-accent">Product Comparison</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink mb-4">
          Compare products side by side
        </h1>
        <p className="text-[17px] leading-relaxed text-muted max-w-2xl mx-auto">
          Pick up to {maxProducts} products and see how they stack up — specs, prices, and verdicts in one view.
        </p>
      </div>

      {/* Search + Selected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Search */}
        <div className="lg:col-span-2">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Search products</h2>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search by name — e.g. "iPhone 16", "ThinkPad X1"'
              className="pl-10 pr-4 py-3 text-[14px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setSearchDone(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results */}
          {loading && (
            <div className="flex items-center gap-2 py-6 text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="font-mono text-[13px]">Searching…</span>
            </div>
          )}

          {!loading && searchDone && results.length === 0 && (
            <p className="py-6 font-mono text-[13px] text-muted">No products found. Try a different search.</p>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((product) => {
                const isSelected = selected.some(p => p.id === product.id);
                const atLimit = selected.length >= maxProducts && !isSelected;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => !atLimit && toggleProduct(product)}
                    disabled={atLimit}
                    className={`w-full flex items-center gap-3 p-3 rounded-folder border transition-all text-left ${
                      isSelected
                        ? 'border-accent bg-accent/5'
                        : atLimit
                          ? 'border-line/50 opacity-50 cursor-not-allowed'
                          : 'border-line bg-paper hover:border-ink/20'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 flex-shrink-0 rounded-md bg-line overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-lg text-muted">{product.name.charAt(0)}</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-[14px] text-ink truncate">{product.name}</h3>
                      {product.manufacturer && (
                        <span className="font-mono text-[11px] text-muted">{product.manufacturer}</span>
                      )}
                    </div>

                    {/* Toggle */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-accent text-white' : 'border border-line'
                    }`}>
                      {isSelected ? <Check size={12} /> : <Plus size={12} className="text-muted" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Browse by category */}
          {!searchDone && !loading && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-3">Or browse by category</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center gap-2 rounded-folder border border-line bg-paper p-3 hover:border-accent/50 hover:bg-accent/5 transition-all"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-mono text-[11px] text-muted">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Sidebar */}
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
            Selected ({selected.length}/{maxProducts})
          </h2>

          {selected.length === 0 && (
            <div className="rounded-folder border border-dashed border-line p-6 text-center">
              <BarChart3 size={24} className="mx-auto text-muted/40 mb-2" />
              <p className="font-mono text-[12px] text-muted">
                Pick at least 2 products to compare
              </p>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {selected.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 p-2.5 rounded-folder border border-accent/30 bg-accent/5"
              >
                <div className="w-8 h-8 flex-shrink-0 rounded bg-line overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-sm text-muted">{product.name.charAt(0)}</span>
                  )}
                </div>
                <p className="flex-1 font-display text-[13px] text-ink truncate">{product.name}</p>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="text-muted hover:text-ink"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Compare Button */}
          <Link
            href={buildCompareUrl()}
            onClick={(e) => { if (selected.length < 2) e.preventDefault(); }}
            className={`block w-full text-center rounded-folder py-3 font-mono text-[12px] uppercase tracking-wide transition-all ${
              selected.length >= 2
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-line text-muted/50 cursor-not-allowed'
            }`}
          >
            {selected.length < 2
              ? `Add ${2 - selected.length} more to compare`
              : `Compare ${selected.length} products`
            }
          </Link>

          {selected.length >= 2 && (
            <p className="mt-2 font-mono text-[11px] text-muted text-center">
              Opens side-by-side view with specs, prices, and verdict
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
