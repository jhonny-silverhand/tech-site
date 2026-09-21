'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Loader2, Star, Check, Zap, Target, RotateCcw, ExternalLink,
  Camera, Laptop, Headphones, Monitor, Watch, Keyboard, Dumbbell, GraduationCap,
} from 'lucide-react';

/* ─── types ─── */
interface ProductPick {
  name: string;
  brand: string;
  category: string;
  tagline: string;
  features: string[];
  bestFor: string;
  priceRange: string;
  links: {
    amazon: string;
    flipkart: string;
  };
}

interface AIResult {
  summary: string;
  picks: ProductPick[];
  query: string;
}

const SUGGESTIONS = [
  { label: 'Best camera phone under 30k', icon: Camera },
  { label: 'Laptop for coding under 60k', icon: Laptop },
  { label: 'Noise cancelling headphones', icon: Headphones },
  { label: 'Gaming monitor under 25k', icon: Monitor },
  { label: 'Smartwatch for fitness', icon: Watch },
  { label: 'Mechanical keyboard for typing', icon: Keyboard },
  { label: 'Wireless earbuds for gym', icon: Dumbbell },
  { label: 'Student laptop under 40k', icon: GraduationCap },
];

/* ─── page ─── */
export default function ShoppingPage() {
  return (
    <Suspense>
      <ShoppingPageInner />
    </Suspense>
  );
}

function ShoppingPageInner() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Deep-link support: /shopping?q=laptops (hero category quick-links)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      setQuery(q);
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/shopping/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setQuery('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-line/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-6">
            <Sparkles size={16} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">AI-Powered Shopping</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.08] font-bold mb-5">
            <span className="text-ink">Smarter Shopping.</span><br />
            <span className="text-accent">Better Decisions.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-ink/50 max-w-xl mx-auto mb-10">
            Tell us what you need — our AI analyzes specs, reviews, and prices across Indian e-commerce to find your best options.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(query); }}
                placeholder='Try "best phone under 30k for camera" or "laptop for coding"'
                aria-label="Describe what you want to buy"
                className="w-full pl-5 pr-32 py-4 rounded-2xl bg-paper/5 border border-line/10 text-ink placeholder:text-ink/30 text-[15px] focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 disabled:opacity-40 text-ink rounded-xl px-5 py-2.5 font-mono text-[12px] uppercase tracking-wide transition-all flex items-center gap-1.5"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Ask AI
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          {!result && !loading && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.label}
                  onClick={() => { setQuery(s.label); handleSearch(s.label); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-paper/5 px-4 py-2 text-[13px] text-ink/60 hover:border-accent/40 hover:text-ink hover:bg-accent/5 transition-all"
                >
                  <s.icon size={13} className="text-accent" aria-hidden />
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Loading */}
        {loading && (
          <div className="text-center py-16" role="status" aria-label="Loading recommendations">
            <Loader2 size={32} className="text-accent animate-spin mx-auto mb-3" />
            <p className="font-mono text-[13px] text-ink/50">AI is analyzing options for you…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16" role="alert">
            <p className="font-display text-xl text-ink/80 mb-3">{error}</p>
            <button onClick={handleReset} className="font-mono text-[12px] text-accent hover:text-accent/80">
              ← Try another query
            </button>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-2">AI Recommendation</p>
                <h2 className="font-display text-2xl sm:text-3xl text-ink mb-2">{result.summary}</h2>
                <p className="font-mono text-[12px] text-ink/40">Based on: &quot;{result.query}&quot;</p>
              </div>
              <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-line/10 px-3 py-2 text-[12px] text-ink/50 hover:text-ink hover:border-line/30 transition-all flex-shrink-0">
                <RotateCcw size={12} /> New search
              </button>
            </div>

            {/* Picks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.picks.map((pick, i) => (
                <div key={pick.name + i} className="group rounded-xl border border-line/8 bg-paper/[0.03] hover:border-accent/30 hover:bg-line/[0.06] transition-all p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="bg-accent text-ink text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md">
                          Top Pick
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-ink/30">#{i + 1}</span>
                    </div>
                    <span className="font-mono text-[10px] text-ink/30 bg-paper/5 px-2 py-0.5 rounded">{pick.category}</span>
                  </div>

                  <h3 className="font-display text-xl text-ink mb-1">{pick.name}</h3>
                  <p className="font-mono text-[12px] text-accent mb-1">{pick.tagline}</p>
                  <p className="font-mono text-[13px] text-green-400 mb-3">{pick.priceRange}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pick.features.map(f => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] text-ink/60 bg-paper/5 border border-line/8 px-2.5 py-1 rounded-md">
                        <Check size={10} className="text-green-400" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Best for */}
                  <div className="flex items-start gap-2 pt-3 border-t border-line/5 mb-4">
                    <Target size={12} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="font-mono text-[11px] text-ink/50">
                      <span className="text-ink/70">Best for:</span> {pick.bestFor}
                    </p>
                  </div>

                  {/* Buy links */}
                  <div className="flex gap-2">
                    <a
                      href={pick.links?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(pick.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#FF9900]/10 border border-[#FF9900]/30 px-3 py-2 font-mono text-[11px] text-[#FF9900] hover:bg-[#FF9900]/20 transition-all"
                    >
                      Amazon.in <ExternalLink size={10} />
                    </a>
                    <a
                      href={pick.links?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(pick.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2874F0]/10 border border-[#2874F0]/30 px-3 py-2 font-mono text-[11px] text-[#2874F0] hover:bg-[#2874F0]/20 transition-all"
                    >
                      Flipkart <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="font-mono text-[12px] text-ink/30 mb-4">Want to compare these products side by side?</p>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-6 py-3 font-mono text-[12px] text-accent hover:bg-accent/20 transition-all"
              >
                Compare Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-accent" />
            </div>
            <p className="font-display text-xl text-ink/80 mb-2">What are you looking for?</p>
            <p className="font-mono text-[13px] text-ink/40 max-w-md mx-auto">
              Type your needs naturally — budget, use case, priorities — and our AI will find the best options with direct buying links.
            </p>
          </div>
        )}
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      {!result && !loading && (
        <section className="border-t border-line/5 bg-paper/[0.02]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-ink text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Tell us your needs', desc: 'Budget, use case, priorities — just type naturally.' },
                { icon: Sparkles, title: 'AI analyzes options', desc: 'We compare specs, reviews, and prices across Amazon & Flipkart.' },
                { icon: Star, title: 'Get curated picks', desc: 'Top picks with features, prices, and direct buying links.' },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-display text-[15px] text-ink mb-1">{item.title}</h3>
                  <p className="font-mono text-[12px] text-ink/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GUIDE ═══ */}
      {!result && !loading && (
        <section className="border-t border-line/5">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-ink text-center mb-6">Tips for better results</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { tip: 'Be specific about your budget', example: '"Best phone under 25k" beats "good phone"' },
                { tip: 'Mention your primary use', example: '"Laptop for video editing" gets different results than "laptop for browsing"' },
                { tip: 'Include brand preferences', example: '"Sony or Bose noise cancelling headphones" narrows the field' },
                { tip: 'Mention deal-breakers', example: '"Android phone, no Samsung, under 30k" filters out unwanted options' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-paper/5 border border-line/5">
                  <Check size={14} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-display text-[14px] text-ink mb-0.5">{item.tip}</p>
                    <p className="font-mono text-[11px] text-ink/40">Example: {item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
