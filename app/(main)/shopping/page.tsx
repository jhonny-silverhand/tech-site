'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Sparkles, Search, ArrowRight, X, Loader2, ExternalLink } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

const CATEGORY_MAP: Record<string, { label: string; icon: string; categories: string[] }> = {
  smartphone: { label: 'Smartphone', icon: '📱', categories: ['smartphone'] },
  laptop: { label: 'Laptop', icon: '💻', categories: ['laptop'] },
  headphones: { label: 'Headphones', icon: '🎧', categories: ['headphones'] },
  earbuds: { label: 'Earbuds', icon: '🎵', categories: ['earbuds'] },
  tablet: { label: 'Tablet', icon: '📟', categories: ['tablet'] },
  monitor: { label: 'Monitor', icon: '🖥️', categories: ['monitor'] },
  keyboard: { label: 'Keyboard', icon: '⌨️', categories: ['keyboard'] },
  mouse: { label: 'Mouse', icon: '🖱️', categories: ['mouse'] },
  smartwatch: { label: 'Smartwatch', icon: '⌚', categories: ['smartwatch'] },
  camera: { label: 'Camera', icon: '📷', categories: ['camera'] },
  tv: { label: 'TV', icon: '📺', categories: ['tv'] },
  gaming: { label: 'Gaming', icon: '🎮', categories: ['gaming'] },
  components: { label: 'PC Parts', icon: '🔧', categories: ['components'] },
  accessories: { label: 'Accessories', icon: '🔌', categories: ['accessories'] },
};

const BUDGET_OPTIONS: Record<string, { value: number | null; label: string; sublabel: string }[]> = {
  smartphone: [
    { value: 5000, label: 'Under ₹5,000', sublabel: 'Entry' },
    { value: 8000, label: 'Under ₹8,000', sublabel: 'Budget' },
    { value: 10000, label: 'Under ₹10,000', sublabel: 'Value' },
    { value: 15000, label: 'Under ₹15,000', sublabel: 'Mid-range' },
    { value: 20000, label: 'Under ₹20,000', sublabel: 'Upper mid' },
    { value: 25000, label: 'Under ₹25,000', sublabel: 'Premium mid' },
    { value: 30000, label: 'Under ₹30,000', sublabel: 'Flagship killer' },
    { value: 40000, label: 'Under ₹40,000', sublabel: 'Premium' },
    { value: 50000, label: 'Under ₹50,000', sublabel: 'Flagship' },
    { value: 100000, label: 'Under ₹1,00,000', sublabel: 'Ultra' },
    { value: null, label: 'No limit', sublabel: 'All' },
  ],
  laptop: [
    { value: 25000, label: 'Under ₹25,000', sublabel: 'Basic' },
    { value: 40000, label: 'Under ₹40,000', sublabel: 'Student' },
    { value: 50000, label: 'Under ₹50,000', sublabel: 'Productivity' },
    { value: 60000, label: 'Under ₹60,000', sublabel: 'Performance' },
    { value: 80000, label: 'Under ₹80,000', sublabel: 'Premium' },
    { value: 100000, label: 'Under ₹1,00,000', sublabel: 'Ultra' },
    { value: 150000, label: 'Under ₹1,50,000', sublabel: 'Pro' },
    { value: null, label: 'No limit', sublabel: 'All' },
  ],
  headphones: [
    { value: 1000, label: 'Under ₹1,000', sublabel: 'Entry' },
    { value: 2000, label: 'Under ₹2,000', sublabel: 'Budget' },
    { value: 3000, label: 'Under ₹3,000', sublabel: 'Mid' },
    { value: 5000, label: 'Under ₹5,000', sublabel: 'Upper mid' },
    { value: 10000, label: 'Under ₹10,000', sublabel: 'Premium' },
    { value: 20000, label: 'Under ₹20,000', sublabel: 'Ultra' },
    { value: null, label: 'No limit', sublabel: 'All' },
  ],
  earbuds: [
    { value: 500, label: 'Under ₹500', sublabel: 'Entry' },
    { value: 1000, label: 'Under ₹1,000', sublabel: 'Budget' },
    { value: 2000, label: 'Under ₹2,000', sublabel: 'Mid' },
    { value: 5000, label: 'Under ₹5,000', sublabel: 'Premium' },
    { value: 10000, label: 'Under ₹10,000', sublabel: 'Ultra' },
    { value: null, label: 'No limit', sublabel: 'All' },
  ],
  default: [
    { value: 10000, label: 'Under ₹10,000', sublabel: 'Budget' },
    { value: 25000, label: 'Under ₹25,000', sublabel: 'Mid' },
    { value: 50000, label: 'Under ₹50,000', sublabel: 'Premium' },
    { value: 100000, label: 'Under ₹1,00,000', sublabel: 'Ultra' },
    { value: null, label: 'No limit', sublabel: 'All' },
  ],
};

const PRIORITY_OPTIONS: Record<string, { label: string; description: string; categories: string[] }> = {
  performance: { label: 'Performance', description: 'Raw speed, multitasking', categories: ['laptop', 'smartphone', 'tablet', 'gaming', 'components'] },
  battery: { label: 'Battery Life', description: 'All-day endurance', categories: ['laptop', 'smartphone', 'tablet', 'earbuds', 'smartwatch'] },
  display: { label: 'Display', description: 'Color, brightness, refresh rate', categories: ['laptop', 'smartphone', 'tablet', 'monitor', 'tv'] },
  camera: { label: 'Camera', description: 'Photo/video quality', categories: ['smartphone', 'tablet'] },
  gaming: { label: 'Gaming', description: 'FPS, graphics, cooling', categories: ['laptop', 'smartphone', 'gaming', 'components'] },
  portability: { label: 'Portability', description: 'Lightweight, thin', categories: ['laptop', 'tablet', 'earbuds', 'smartwatch'] },
  sound: { label: 'Sound', description: 'Audio fidelity, drivers', categories: ['headphones', 'earbuds'] },
  anc: { label: 'ANC', description: 'Noise cancellation', categories: ['headphones', 'earbuds'] },
  comfort: { label: 'Comfort', description: 'Long-session wearability', categories: ['headphones', 'earbuds', 'smartwatch'] },
  build: { label: 'Build', description: 'Materials, durability', categories: ['laptop', 'smartphone', 'headphones', 'smartwatch'] },
  value: { label: 'Value', description: 'Best specs per rupee', categories: ['laptop', 'smartphone', 'headphones', 'earbuds', 'tv'] },
};

const USE_CASE_OPTIONS: Record<string, { label: string; description: string }> = {
  programming: { label: 'Programming', description: 'IDE, compilation, containers' },
  gaming: { label: 'Gaming', description: 'AAA titles, competitive' },
  college: { label: 'College', description: 'Lectures, assignments' },
  travel: { label: 'Travel', description: 'Portable, long battery' },
  photography: { label: 'Photography', description: 'Photo editing, RAW' },
  content_creation: { label: 'Content Creation', description: 'Video editing, 3D' },
  office: { label: 'Office', description: 'Documents, meetings' },
  study: { label: 'Study', description: 'Reading, notes' },
  entertainment: { label: 'Entertainment', description: 'Movies, shows' },
};

interface RetailerLink {
  name: string;
  url: string;
  price: number;
}

interface ScrapedProduct {
  name: string;
  brand: string;
  image_url: string | null;
  product_url: string;
  price_inr: number;
  mrp_inr: number | null;
  rating: number | null;
  review_count: number | null;
  category: string;
}

interface PhoneSegment {
  name: string;
  slug: string;
  brand: string;
  image: string;
  specs: string[];
  price: number;
  retailers: RetailerLink[];
}

const PHONE_SEGMENTS: Record<string, PhoneSegment[]> = {};

function getBudgetOptions(category: string) {
  return BUDGET_OPTIONS[category] || BUDGET_OPTIONS.default;
}

function scrapedToSegment(products: ScrapedProduct[]): Record<string, PhoneSegment[]> {
  const segments: Record<string, PhoneSegment[]> = {
    'Under ₹5,000': [],
    'Under ₹10,000': [],
    'Under ₹15,000': [],
    'Under ₹20,000': [],
    'Under ₹30,000': [],
    'Under ₹50,000': [],
  };

  const getSegment = (price: number) => {
    if (price < 5000) return 'Under ₹5,000';
    if (price < 10000) return 'Under ₹10,000';
    if (price < 15000) return 'Under ₹15,000';
    if (price < 20000) return 'Under ₹20,000';
    if (price < 30000) return 'Under ₹30,000';
    if (price < 50000) return 'Under ₹50,000';
    return null;
  };

  const seen = new Set<string>();
  for (const p of products) {
    const price = Math.round(p.price_inr / 100);
    const seg = getSegment(price);
    if (!seg || seen.has(p.name)) continue;
    seen.add(p.name);

    const cleanUrl = p.product_url.split('&amp;')[0].replace(/&amp;/g, '&');
    const brand = p.brand || p.name.split(' ')[0];
    segments[seg].push({
      name: p.name.substring(0, 60),
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40),
      brand,
      image: p.image_url || '',
      specs: [],
      price,
      retailers: [{ name: 'Buy', url: cleanUrl, price }],
    });
  }

  // Trim each segment to top 3
  for (const seg of Object.keys(segments)) {
    segments[seg] = segments[seg].slice(0, 3);
  }

  return segments;
}

export default function ShoppingPage() {
  const [step, setStep] = useState<'browse' | 'configure' | 'results'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budget, setBudget] = useState<number | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phoneSegments, setPhoneSegments] = useState<Record<string, PhoneSegment[]>>({});
  const [segmentsLoading, setSegmentsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scraped-products/search?category=smartphone&limit=50&sortBy=price_asc')
      .then(r => r.json())
      .then(data => {
        if (data.products) {
          setPhoneSegments(scrapedToSegment(data.products));
        }
      })
      .catch(() => {})
      .finally(() => setSegmentsLoading(false));
  }, []);

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    setBudget(null);
    setStep('configure');
  }

  function handleQuickSearch(query: string) {
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    setStep('results');

    fetch('/api/shopping/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setResults(data.recommendations || []);
        if (data.parsedQuery?.category) setSelectedCategory(data.parsedQuery.category);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }

  function handleFindMatches() {
    if (!selectedCategory) return;
    setLoading(true);
    setError(null);
    setStep('results');

    const query = searchQuery || `best ${selectedCategory} under ${budget ? `₹${budget.toLocaleString('en-IN')}` : 'any budget'}`;

    fetch('/api/shopping/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        categorySlug: CATEGORY_MAP[selectedCategory]?.categories[0] || selectedCategory,
        budgetMax: budget || undefined,
        priorities,
        useCases,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setResults(data.recommendations || []);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }

  function handleRestart() {
    setStep('browse');
    setSelectedCategory('');
    setBudget(null);
    setPriorities([]);
    setUseCases([]);
    setSearchQuery('');
    setResults([]);
    setError(null);
  }

  function togglePriority(priority: string) {
    setPriorities(prev => prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]);
  }

  function toggleUseCase(useCase: string) {
    setUseCases(prev => prev.includes(useCase) ? prev.filter(u => u !== useCase) : [...prev, useCase]);
  }

  // ====== STEP: BROWSE (Category + Budget + Search) ======
  if (step === 'browse') {
    const phoneSegmentNames = Object.keys(phoneSegments);

    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        {/* Hero */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 mb-6">
            <Sparkles size={18} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-wide text-accent">Shopping Intelligence</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink mb-4">
            Tell us what you're looking for.
          </h1>
          <p className="text-[17px] leading-relaxed text-muted max-w-2xl mx-auto mb-8">
            We'll analyze the options and help you decide — no AI hype, just editorial guidance backed by specs and prices.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) handleQuickSearch(searchQuery); }}
                placeholder='Try "best phone under 15k for camera" or "laptop for coding under 60k"'
                className="pl-11 pr-24 py-3.5 text-[15px] rounded-full border-line"
              />
              <Button
                onClick={() => searchQuery.trim() && handleQuickSearch(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-5"
              >
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content: Categories + Budget side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Categories (Left 2/3) */}
          <div className="lg:col-span-2">
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Pick a category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key)}
                  className="group relative rounded-folder border border-line bg-paper p-4 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 text-left"
                >
                  <div className="text-2xl mb-1.5">{cat.icon}</div>
                  <h3 className="font-display text-[15px] text-ink group-hover:text-accent transition-colors">{cat.label}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Quick Select (Right 1/3) */}
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Quick budget filter</h2>
            <div className="rounded-folder border border-line bg-paper p-4 space-y-2">
              <p className="font-mono text-[11px] text-muted mb-3">Select a category first, then pick your budget range</p>
              {BUDGET_OPTIONS.default.map((opt) => (
                <button
                  key={opt.value ?? 'none'}
                  type="button"
                  disabled={!selectedCategory}
                  className={`w-full rounded-lg border p-3 text-left transition-all text-[13px] ${
                    selectedCategory
                      ? 'border-line hover:border-accent/50 hover:bg-accent/5 cursor-pointer'
                      : 'border-line/50 text-muted/50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (selectedCategory) {
                      setBudget(opt.value);
                      handleFindMatches();
                    }
                  }}
                >
                  <span className="font-display text-ink">{opt.label}</span>
                  <span className="ml-2 font-mono text-[10px] text-muted">({opt.sublabel})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Best Phones by Segment */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl text-ink">Best Phones by Budget</h2>
              <p className="text-[14px] text-muted mt-1">Real prices from Flipkart — tap to buy</p>
            </div>
          </div>

          {segmentsLoading ? (
            <div className="flex items-center justify-center py-12 text-muted">
              <Loader2 size={20} className="animate-spin mr-2" />
              Loading real prices...
            </div>
          ) : (
            <div className="space-y-10">
              {phoneSegmentNames.map((segment) => (
                <div key={segment}>
                  <h3 className="font-mono text-[12px] uppercase tracking-wide text-accent mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {segment}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phoneSegments[segment].map((phone) => (
                      <div
                        key={phone.slug}
                        className="group relative rounded-folder border border-line bg-paper overflow-hidden hover:border-accent/30 transition-all"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-line overflow-hidden">
                          {phone.image ? (
                            <Image
                              src={phone.image}
                              alt={phone.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-3xl font-display">
                              {phone.name.charAt(0)}
                            </div>
                          )}
                          {/* Price badge */}
                          <div className="absolute top-3 right-3 bg-ink/90 text-white px-3 py-1.5 rounded-full font-display text-[14px]">
                            ₹{phone.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] uppercase tracking-wide text-muted bg-line px-1.5 py-0.5 rounded">{phone.brand}</span>
                          </div>
                          <h4 className="font-display text-[16px] text-ink mb-2 line-clamp-2">{phone.name}</h4>

                          {/* Retailer Link - Direct product page */}
                          <div className="flex gap-2">
                            {phone.retailers.map((r) => (
                              <a
                                key={r.name}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-line bg-background px-3 py-2 font-mono text-[11px] text-ink hover:border-accent/50 hover:bg-accent/5 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {r.name}
                                <ExternalLink size={10} className="text-muted" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="pt-10 border-t border-line">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/guides" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-muted hover:border-ink/30 hover:text-ink transition-colors">
              <ArrowRight size={14} />
              Buying Guides
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ====== STEP: CONFIGURE (Priorities + Use Cases) ======
  if (step === 'configure') {
    const cat = CATEGORY_MAP[selectedCategory];
    const availablePriorities = Object.entries(PRIORITY_OPTIONS).filter(([_, v]) => v.categories.includes(selectedCategory));

    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <div className="mb-8 text-center">
          <button type="button" onClick={() => setStep('browse')} className="absolute left-4 top-4 text-muted hover:text-ink transition-colors">
            <X size={20} />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 mb-4">
            <span className="text-2xl">{cat?.icon}</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-accent">{cat?.label}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">What matters most?</h1>
          <p className="mt-3 text-[15px] text-muted">Pick up to 3 priorities — or skip for general recommendations.</p>
        </div>

        {/* Budget */}
        <section className="mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-3">Budget</h2>
          <div className="flex flex-wrap gap-2">
            {getBudgetOptions(selectedCategory).map((opt) => (
              <button
                key={opt.value ?? 'none'}
                type="button"
                onClick={() => setBudget(opt.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] transition-colors ${
                  budget === opt.value ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-ink/30'
                }`}
              >
                {budget === opt.value && <span className="text-accent">✓</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Priorities */}
        {availablePriorities.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-3">Priorities (pick up to 3)</h2>
            <div className="flex flex-wrap gap-2">
              {availablePriorities.map(([key, opt]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => togglePriority(key)}
                  disabled={!priorities.includes(key) && priorities.length >= 3}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[11px] transition-colors ${
                    priorities.includes(key) ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-ink/30'
                  } ${!priorities.includes(key) && priorities.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {priorities.includes(key) && <span className="text-accent">✓</span>}
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Use Cases */}
        <section className="mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-3">Use Cases (pick up to 2)</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(USE_CASE_OPTIONS).map(([key, opt]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleUseCase(key)}
                disabled={!useCases.includes(key) && useCases.length >= 2}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[11px] transition-colors ${
                  useCases.includes(key) ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-ink/30'
                } ${!useCases.includes(key) && useCases.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {useCases.includes(key) && <span className="text-accent">✓</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep('browse')} className="flex-1">
            Back
          </Button>
          <Button type="button" onClick={handleFindMatches} disabled={loading} className="flex-1">
            {loading ? 'Finding…' : 'Find my matches'}
          </Button>
        </div>
      </div>
    );
  }

  // ====== STEP: RESULTS ======
  if (step === 'results') {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <div className="mb-8 text-center">
          {loading ? (
            <>
              <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">Finding your best matches…</h1>
              <p className="mt-3 text-[15px] text-muted">Analyzing specs, prices, and reviews across retailers.</p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
                {results.length > 0 ? `Found ${results.length} matches` : 'No matches found'}
              </h1>
              <p className="mt-3 text-[15px] text-muted">
                {selectedCategory && `Category: ${CATEGORY_MAP[selectedCategory]?.label || selectedCategory}`}
                {budget && ` · Budget: ₹${budget.toLocaleString('en-IN')}`}
              </p>
            </>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader2 size={32} className="text-accent animate-spin" />
            <p className="font-mono text-[13px] text-muted">This usually takes a few seconds…</p>
          </div>
        )}

        {error && (
          <div className="rounded-folder border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 mb-6">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((rec: any) => (
                <ProductCard
                  key={rec.product.id}
                  product={{
                    ...rec.product,
                    label: rec.label,
                    reasoning: rec.reasoning,
                    pros: rec.pros,
                    cons: rec.cons,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="font-display text-xl text-ink mb-2">No strong matches found</p>
            <p className="text-muted mb-6">Try adjusting your budget or priorities.</p>
            <Button variant="ghost" onClick={() => setStep('configure')}>Adjust filters</Button>
          </div>
        )}

        <div className="mt-10 flex gap-3 justify-center">
          <Button variant="ghost" onClick={handleRestart}>
            Start over
          </Button>
          <Button onClick={handleRestart}>
            New search
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
