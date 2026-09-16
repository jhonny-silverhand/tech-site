'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Heart, ShoppingCart, BarChart3, Star, TrendingDown,
  Sparkles, ArrowRight, SlidersHorizontal, Grid3X3, List,
  ChevronDown, X, Loader2, ExternalLink, Zap, Shield, GitCompare, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';

/* ─── types ─── */
interface ScrapedProduct {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
  product_url: string;
  price_inr: number;
  mrp_inr: number | null;
  rating: number | null;
  review_count: number | null;
  category: string;
  discount_percent: number | null;
  slug?: string;
  specifications?: Record<string, unknown> | null;
}

interface EnrichedProduct extends ScrapedProduct {
  badge?: string;
  badgeColor?: string;
  lowestIn30?: boolean;
  priceRupees: number;
  mrpRupees: number | null;
}

/* ─── constants ─── */
const CATEGORIES = [
  { slug: 'all', label: 'All', icon: '🔥' },
  { slug: 'laptop', label: 'Laptops', icon: '💻' },
  { slug: 'smartphone', label: 'Phones', icon: '📱' },
  { slug: 'headphones', label: 'Headphones', icon: '🎧' },
  { slug: 'accessories', label: 'Accessories', icon: '🔌' },
  { slug: 'gaming', label: 'Gaming', icon: '🎮' },
  { slug: 'more', label: 'More', icon: '▸' },
];

const BRANDS = [
  { name: 'Apple', count: 42 },
  { name: 'Samsung', count: 68 },
  { name: 'Sony', count: 35 },
  { name: 'Lenovo', count: 28 },
  { name: 'ASUS', count: 24 },
  { name: 'Dell', count: 19 },
  { name: 'OnePlus', count: 15 },
  { name: 'Xiaomi', count: 31 },
];

const FEATURES = ['RAM', 'Storage', 'Display Size', 'Processor', 'Graphics', 'Color'];

const BADGE_POOL = [
  { text: 'Best Overall', color: 'bg-accent' },
  { text: 'Price Drop', color: 'bg-green-500' },
  { text: 'Top Rated', color: 'bg-amber-500' },
  { text: 'Trending', color: 'bg-purple-500' },
  { text: 'Best Value', color: 'bg-cyan-500' },
];

const TRUST_ITEMS = [
  { icon: TrendingDown, title: 'Real-time Price Tracking', desc: 'Get notified when prices drop.' },
  { icon: Shield, title: 'Verified Reviews', desc: 'Only authentic user reviews.' },
  { icon: GitCompare, title: 'Smart Comparisons', desc: 'See side-by-side differences.' },
  { icon: Award, title: 'Expert Recommendations', desc: 'Curated by tech experts.' },
];

const GUIDES = [
  { title: 'Best Laptops for Programming', category: 'Buying Guide', time: '8 min read', image: 'https://picsum.photos/seed/prog-lap/400/240' },
  { title: 'Top 10 Smartphones Under ₹30,000', category: 'Buying Guide', time: '6 min read', image: 'https://picsum.photos/seed/phone-30k/400/240' },
  { title: 'Best Headphones for Travel', category: 'Buying Guide', time: '5 min read', image: 'https://picsum.photos/seed/travel-hp/400/240' },
  { title: 'How to Choose the Right Smartwatch', category: 'Guide', time: '7 min read', image: 'https://picsum.photos/seed/watch-guide/400/240' },
];

/* ─── helpers ─── */
function fmtPrice(p: number) {
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

function normalizePrice(priceInr: number, hasSpecs: boolean): number {
  // Scraped products (have specifications) store paise: 59500 = ₹595
  // Manually inserted products store rupees: 10400 = ₹10,400
  if (hasSpecs) return priceInr / 100;
  // If price looks like paise (>10000 for most products), treat as paise
  if (priceInr > 100000) return priceInr / 100;
  return priceInr;
}

function discountPct(current: number, mrp: number | null): number | null {
  if (!mrp || mrp <= current) return null;
  return Math.round(((mrp - current) / mrp) * 100);
}

function ratingStars(r: number | null) {
  if (!r) return null;
  return r.toFixed(1);
}

/* ─── page ─── */
export default function ShoppingPage() {
  /* state */
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [compareList, setCompareList] = useState<EnrichedProduct[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* fetch products */
  useEffect(() => {
    setLoading(true);
    const cat = activeCategory === 'all' ? '' : activeCategory;
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    params.set('limit', '50');
    params.set('sortBy', 'price_asc');
    if (query.trim()) params.set('q', query.trim());

    fetch(`/api/scraped-products/search?${params}`)
      .then(r => r.json())
      .then(data => {
        const raw: ScrapedProduct[] = data.products || [];
        const enriched = raw.map((p, i) => {
          const hasSpecs = Boolean(p.specifications && Object.keys(p.specifications).length > 0);
          return {
            ...p,
            priceRupees: normalizePrice(p.price_inr, hasSpecs),
            mrpRupees: p.mrp_inr ? normalizePrice(p.mrp_inr, hasSpecs) : null,
            badge: i < 3 ? BADGE_POOL[i % BADGE_POOL.length].text : i % 7 === 0 ? 'Trending' : undefined,
            badgeColor: i < 3 ? BADGE_POOL[i % BADGE_POOL.length].color : i % 7 === 0 ? 'bg-purple-500' : undefined,
            lowestIn30: i % 3 === 0,
          };
        });
        setProducts(enriched);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, query]);

  /* derived */
  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedBrands.length > 0) {
      list = list.filter(p => selectedBrands.some(b => p.brand?.toLowerCase().includes(b.toLowerCase())));
    }
    list = list.filter(p => p.priceRupees >= priceRange[0] && p.priceRupees <= priceRange[1]);
    if (minRating > 0) list = list.filter(p => (p.rating || 0) >= minRating);

    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.priceRupees - b.priceRupees); break;
      case 'price_desc': list.sort((a, b) => b.priceRupees - a.priceRupees); break;
      case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'discount': list.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0)); break;
    }
    return list;
  }, [products, selectedBrands, priceRange, minRating, sortBy]);

  const priceDrops = useMemo(() => products.filter(p => p.discount_percent && p.discount_percent > 5).slice(0, 4), [products]);
  const trending = useMemo(() => products.filter(p => p.rating && p.rating >= 4).slice(0, 4), [products]);

  function toggleBrand(b: string) {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }

  function toggleCompare(p: EnrichedProduct) {
    setCompareList(prev => {
      const exists = prev.find(x => x.id === p.id);
      if (exists) return prev.filter(x => x.id !== p.id);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  }

  /* ─── render ─── */
  return (
    <div className="min-h-screen bg-void text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-4">Shopping Intelligence</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-bold">
                <span className="text-white">Smarter Shopping.</span><br />
                <span className="text-accent">Better Decisions.</span>
              </h1>
              <p className="mt-5 text-[16px] leading-relaxed text-white/60 max-w-lg">
                Discover the best tech products with real-time price tracking, trusted reviews, and AI-powered recommendations — all in one place.
              </p>
            </div>

            {/* Floating badges visual */}
            <div className="relative hidden lg:flex items-center justify-center h-[340px]">
              <div className="absolute w-[280px] h-[340px] rounded-3xl bg-gradient-to-br from-accent/20 to-purple-500/10 border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="text-6xl opacity-30">📱</div>
              </div>
              {/* Badge: Price drop */}
              <div className="absolute top-4 right-8 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase text-green-400 tracking-wide">Price drop alert</p>
                <p className="font-display text-lg text-white font-semibold mt-0.5">₹12,999 <span className="text-green-400 text-sm">↓ 18%</span></p>
              </div>
              {/* Badge: Best rated */}
              <div className="absolute top-16 left-4 bg-amber-500/15 border border-amber-500/30 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase text-amber-400 tracking-wide">Best rated</p>
                <p className="font-display text-lg text-white font-semibold mt-0.5 flex items-center gap-1">4.6 <Star size={14} className="text-amber-400 fill-amber-400" /></p>
              </div>
              {/* Badge: Compare */}
              <div className="absolute bottom-10 right-12 bg-accent/15 border border-accent/30 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase text-accent tracking-wide">Compare</p>
                <p className="font-display text-lg text-white font-semibold mt-0.5">3 options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH + CATEGORIES ═══ */}
      <section className="border-b border-white/5 bg-void/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, brands or categories..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="hidden md:flex items-center gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-4 py-2 rounded-lg font-mono text-[12px] transition-all ${
                    activeCategory === c.slug
                      ? 'bg-accent text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN 3-COL LAYOUT ═══ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">

          {/* ─── LEFT: Filters ─── */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[12px] uppercase tracking-wide text-white/80">Filters</h3>
              <button
                onClick={() => { setSelectedBrands([]); setPriceRange([0, 200000]); setMinRating(0); }}
                className="font-mono text-[11px] text-accent hover:text-accent/80"
              >
                Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-white/50 mb-2">Category</h4>
              <div className="space-y-1.5">
                {['Laptops', 'Smartphones', 'Headphones', 'Smartwatches', 'Accessories', 'Gaming'].map(c => (
                  <label key={c} className="flex items-center gap-2 text-[13px] text-white/70 hover:text-white cursor-pointer">
                    <input type="checkbox" className="accent-accent w-3.5 h-3.5 rounded" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-white/50 mb-2">Brand</h4>
              <div className="space-y-1.5">
                {BRANDS.map(b => (
                  <label key={b.name} className="flex items-center justify-between text-[13px] text-white/70 hover:text-white cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="accent-accent w-3.5 h-3.5 rounded"
                      />
                      {b.name}
                    </div>
                    <span className="text-white/30 text-[11px]">{b.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-white/50 mb-2">Price Range</h4>
              <div className="flex items-center gap-2 text-[12px] text-white/50">
                <span>{fmtPrice(priceRange[0])}</span>
                <span>—</span>
                <span>{fmtPrice(priceRange[1])}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full mt-2 accent-accent"
              />
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-white/50 mb-2">Rating</h4>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(minRating === r ? 0 : r)}
                    className={`flex items-center gap-1.5 text-[13px] ${minRating === r ? 'text-accent' : 'text-white/60 hover:text-white'}`}
                  >
                    {Array.from({ length: r }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                    <span>&amp; up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Features (collapsed) */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-white/50 mb-2">Features</h4>
              <div className="space-y-1.5">
                {FEATURES.map(f => (
                  <div key={f} className="flex items-center justify-between text-[13px] text-white/50 hover:text-white cursor-pointer">
                    <span>{f}</span>
                    <ChevronDown size={12} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setSelectedBrands([]); setPriceRange([0, 200000]); setMinRating(0); }}
              className="w-full py-2.5 rounded-xl border border-white/10 text-[12px] font-mono text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal size={12} /> Reset filters
            </button>
          </aside>

          {/* ─── CENTER: Product Grid ─── */}
          <section>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[12px] text-white/50">
                <span className="text-white font-semibold">{filtered.length}</span> results
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-white/70 focus:outline-none focus:border-accent/50"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}>
                    <Grid3X3 size={14} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}>
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={28} className="text-accent animate-spin mb-3" />
                <p className="font-mono text-[13px] text-white/50">Loading products…</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-3'
              }>
                {filtered.map(product => {
                  const disc = discountPct(product.priceRupees, product.mrpRupees);
                  const inCompare = compareList.some(c => c.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className={`group rounded-xl border border-white/8 bg-white/[0.03] hover:border-accent/30 hover:bg-white/[0.06] transition-all overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative bg-white/[0.02] overflow-hidden ${viewMode === 'list' ? 'w-40 flex-shrink-0' : 'aspect-[4/3]'}`}>
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl font-display">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        {/* Badge */}
                        {product.badge && (
                          <span className={`absolute top-2.5 left-2.5 ${product.badgeColor} text-white text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md`}>
                            {product.badge}
                          </span>
                        )}
                        {/* Wishlist */}
                        <button className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                          <Heart size={14} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1">
                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-[12px] text-white font-medium">{ratingStars(product.rating)}</span>
                            {product.review_count && (
                              <span className="text-[11px] text-white/40">({product.review_count.toLocaleString()})</span>
                            )}
                          </div>
                        )}

                        {/* Name */}
                        <h3 className="font-display text-[15px] text-white leading-snug line-clamp-2 mb-1">{product.name}</h3>
                        <p className="font-mono text-[11px] text-white/40 mb-3">{product.brand}</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-display text-xl text-white font-semibold">{fmtPrice(product.priceRupees)}</span>
                          {disc && (
                            <span className="font-mono text-[12px] text-green-400">↓ {disc}%</span>
                          )}
                        </div>
                        {disc && product.mrpRupees && (
                          <p className="font-mono text-[11px] text-white/30 line-through mb-1">{fmtPrice(product.mrpRupees)}</p>
                        )}
                        {product.lowestIn30 && (
                          <p className="font-mono text-[10px] text-green-400/80 flex items-center gap-1 mb-3">
                            <TrendingDown size={10} /> Lowest in 30 days
                          </p>
                        )}
                        {!product.lowestIn30 && <div className="mb-3" />}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCompare(product)}
                            className={`flex-1 py-2 rounded-lg font-mono text-[11px] uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                              inCompare
                                ? 'bg-accent text-white'
                                : 'border border-accent/40 text-accent hover:bg-accent/10'
                            }`}
                          >
                            <BarChart3 size={12} />
                            Compare
                          </button>
                          <a
                            href={product.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-accent hover:text-white hover:border-accent transition-all"
                          >
                            <ShoppingCart size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-display text-xl text-white/80 mb-2">No products found</p>
                <p className="font-mono text-[13px] text-white/40">Try adjusting your filters or search query.</p>
              </div>
            )}
          </section>

          {/* ─── RIGHT: Intelligence Sidebar ─── */}
          <aside className="hidden lg:block space-y-5">
            {/* Price Drops */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-[11px] uppercase tracking-wide text-white/80">Price Drops</h3>
                <Link href="/shopping" className="font-mono text-[10px] text-accent hover:text-accent/80">View all →</Link>
              </div>
              <div className="space-y-3">
                {priceDrops.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {p.image_url ? (
                        <Image src={p.image_url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                      ) : <span className="text-white/20 text-sm">{p.name.charAt(0)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white truncate">{p.name.substring(0, 30)}</p>
                      <p className="font-mono text-[11px] text-white/50">{fmtPrice(p.priceRupees)} <span className="text-green-400">↓{p.discount_percent}%</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Now */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-[11px] uppercase tracking-wide text-white/80">Trending Now</h3>
                <Link href="/shopping" className="font-mono text-[10px] text-accent hover:text-accent/80">View all →</Link>
              </div>
              <div className="space-y-3">
                {trending.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {p.image_url ? (
                        <Image src={p.image_url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                      ) : <span className="text-white/20 text-sm">{p.name.charAt(0)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white truncate">{p.name.substring(0, 30)}</p>
                      <p className="font-mono text-[11px] flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-white/70">{ratingStars(p.rating)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compare */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-[11px] uppercase tracking-wide text-white/80">Compare</h3>
                <Link href="/compare" className="font-mono text-[10px] text-accent hover:text-accent/80">View all →</Link>
              </div>
              {compareList.length === 0 ? (
                <p className="text-[12px] text-white/40 text-center py-4">Click Compare on any product</p>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {compareList.map((p, i) => (
                      <div key={p.id} className="text-center">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden mb-1 flex items-center justify-center mx-auto">
                          {p.image_url ? (
                            <Image src={p.image_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
                          ) : <span className="text-white/20">{p.name.charAt(0)}</span>}
                        </div>
                        <p className="text-[10px] text-white/60 truncate max-w-[60px]">{p.name.substring(0, 15)}</p>
                      </div>
                    ))}
                    {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-12 h-12 rounded-lg border border-dashed border-white/10 flex items-center justify-center">
                        <span className="text-white/20 text-lg">+</span>
                      </div>
                    ))}
                  </div>
                  {compareList.length >= 2 && (
                    <Link
                      href={`/compare?products=${compareList.map(p => p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)).join('&products=')}`}
                      className="block w-full py-2 rounded-lg bg-accent text-white text-center font-mono text-[11px] uppercase tracking-wide hover:bg-accent/90 transition-all"
                    >
                      Start Compare
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* AI Buying Guide */}
            <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/10 to-purple-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-accent" />
                <h3 className="font-mono text-[12px] uppercase tracking-wide text-accent">AI Buying Guide</h3>
              </div>
              <p className="text-[13px] text-white/60 leading-relaxed mb-4">
                Not sure what to buy? Get personalized recommendations based on your needs and budget.
              </p>
              <Link
                href="/shopping"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white font-mono text-[12px] hover:bg-accent/90 transition-all"
              >
                Try AI Assistant <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-display text-[14px] text-white font-medium">{item.title}</h4>
                  <p className="font-mono text-[11px] text-white/40 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RELATED GUIDES ═══ */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-white">Related Guides &amp; Articles</h2>
            <Link href="/guides" className="font-mono text-[11px] text-accent hover:text-accent/80">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIDES.map(g => (
              <Link key={g.title} href="/guides" className="group rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden hover:border-accent/30 transition-all">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wide text-accent mb-1">{g.category}</p>
                  <h3 className="font-display text-[14px] text-white leading-snug mb-2 group-hover:text-accent transition-colors">{g.title}</h3>
                  <p className="font-mono text-[11px] text-white/40">{g.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
