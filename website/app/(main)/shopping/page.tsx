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
  { label: 'Best camera phone under 30k', icon: Camera, pop: 'text-[#E85D5D] dark:text-[#FF8E8E]' },
  { label: 'Laptop for coding under 60k', icon: Laptop, pop: 'text-[#4D96FF] dark:text-[#8AB4FF]' },
  { label: 'Noise cancelling headphones', icon: Headphones, pop: 'text-[#0EA5A5] dark:text-[#4ECDC4]' },
  { label: 'Gaming monitor under 25k', icon: Monitor, pop: 'text-[#9B5DE5] dark:text-[#C39BFF]' },
  { label: 'Smartwatch for fitness', icon: Watch, pop: 'text-[#F15BB5] dark:text-[#FF8ED4]' },
  { label: 'Mechanical keyboard for typing', icon: Keyboard, pop: 'text-[#E85D5D] dark:text-[#FF8E8E]' },
  { label: 'Wireless earbuds for gym', icon: Dumbbell, pop: 'text-[#0EA5A5] dark:text-[#4ECDC4]' },
  { label: 'Student laptop under 40k', icon: GraduationCap, pop: 'text-[#B7791F] dark:text-[#FFD93D]' },
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
    <div className="min-h-screen bg-[#FFF8ED] text-[#23233B] dark:bg-[#16152E] dark:text-[#F4F2FF]">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-[#F0E2C4] dark:border-white/10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#FFD93D]/40 blur-3xl dark:bg-[#FFD93D]/15" />
        <div aria-hidden className="pointer-events-none absolute -top-16 right-[-6rem] h-96 w-96 rounded-full bg-[#FF6B6B]/25 blur-3xl dark:bg-[#FF6B6B]/15" />
        <div aria-hidden className="pointer-events-none absolute top-40 left-1/3 h-64 w-64 rounded-full bg-[#4ECDC4]/25 blur-3xl dark:bg-[#4ECDC4]/10" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A13D]/50 bg-[#FFD93D]/25 px-4 py-2 mb-6 dark:border-[#FFD93D]/30 dark:bg-[#FFD93D]/10">
            <Sparkles size={16} className="text-[#C77B1A] dark:text-[#FFD93D]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#9A6B00] dark:text-[#FFD93D]">AI-Powered Shopping</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.08] font-bold mb-5">
            <span>Smarter Shopping.</span><br />
            <span className="text-[#E85D5D] dark:text-[#FF8E8E]">Better Decisions.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-[#23233B]/60 dark:text-[#F4F2FF]/60 max-w-xl mx-auto mb-10">
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
                className="w-full pl-5 pr-32 py-4 rounded-2xl bg-white border border-[#EBD9B4] text-[#23233B] placeholder:text-[#23233B]/35 text-[15px] shadow-[0_2px_12px_-4px_rgb(232_161_61/0.25)] focus:outline-none focus:border-[#E85D5D]/60 focus:ring-2 focus:ring-[#E85D5D]/25 transition-all dark:bg-white/5 dark:border-white/15 dark:text-white dark:placeholder:text-white/30"
              />
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E85D5D] hover:bg-[#D14E4E] disabled:opacity-40 text-white rounded-xl px-5 py-2.5 font-mono text-[12px] uppercase tracking-wide transition-all flex items-center gap-1.5 shadow-[0_4px_14px_-4px_rgb(232_93_93/0.6)]"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EBD9B4] bg-white px-4 py-2 text-[13px] text-[#23233B]/70 hover:border-[#E85D5D]/50 hover:text-[#23233B] hover:bg-[#FFF3D6] transition-all dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-white/30 dark:hover:text-white dark:hover:bg-white/10"
                >
                  <s.icon size={13} className={s.pop} aria-hidden />
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
            <Loader2 size={32} className="text-[#E85D5D] animate-spin mx-auto mb-3" />
            <p className="font-mono text-[13px] text-[#23233B]/50 dark:text-white/50">AI is analyzing options for you…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16" role="alert">
            <p className="font-display text-xl text-[#23233B]/80 dark:text-white/80 mb-3">{error}</p>
            <button onClick={handleReset} className="font-mono text-[12px] text-[#E85D5D] hover:text-[#D14E4E]">
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
                <p className="font-mono text-[11px] uppercase tracking-wide text-[#E85D5D] dark:text-[#FF8E8E] mb-2">AI Recommendation</p>
                <h2 className="font-display text-2xl sm:text-3xl mb-2">{result.summary}</h2>
                <p className="font-mono text-[12px] text-[#23233B]/40 dark:text-white/40">Based on: &quot;{result.query}&quot;</p>
              </div>
              <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-[#EBD9B4] bg-white px-3 py-2 text-[12px] text-[#23233B]/50 hover:text-[#23233B] hover:border-[#E85D5D]/40 transition-all flex-shrink-0 dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:text-white dark:hover:border-white/30">
                <RotateCcw size={12} /> New search
              </button>
            </div>

            {/* Picks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.picks.map((pick, i) => (
                <div key={pick.name + i} className="group rounded-2xl border border-[#EBD9B4] bg-white hover:border-[#E85D5D]/40 hover:shadow-[0_12px_32px_-12px_rgb(232_93_93/0.35)] transition-all p-5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.7)]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="bg-[#FFD93D] text-[#5C4300] text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md">
                          ★ Top Pick
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-[#23233B]/30 dark:text-white/30">#{i + 1}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#23233B]/40 bg-[#FFF3D6] border border-[#EBD9B4] px-2 py-0.5 rounded dark:text-white/50 dark:bg-white/5 dark:border-white/10">{pick.category}</span>
                  </div>

                  <h3 className="font-display text-xl mb-1">{pick.name}</h3>
                  <p className="font-mono text-[12px] text-[#0E9494] dark:text-[#4ECDC4] mb-1">{pick.tagline}</p>
                  <p className="font-mono text-[13px] text-green-700 dark:text-green-400 mb-3">{pick.priceRange}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pick.features.map(f => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] text-[#23233B]/60 bg-[#F7FBF7] border border-[#CDE8CD] px-2.5 py-1 rounded-md dark:text-white/60 dark:bg-white/5 dark:border-white/10">
                        <Check size={10} className="text-green-600 dark:text-green-400" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Best for */}
                  <div className="flex items-start gap-2 pt-3 border-t border-[#F0E2C4] dark:border-white/10 mb-4">
                    <Target size={12} className="text-[#E85D5D] dark:text-[#FF8E8E] mt-0.5 flex-shrink-0" />
                    <p className="font-mono text-[11px] text-[#23233B]/50 dark:text-white/50">
                      <span className="text-[#23233B]/70 dark:text-white/70">Best for:</span> {pick.bestFor}
                    </p>
                  </div>

                  {/* Buy links */}
                  <div className="flex gap-2">
                    <a
                      href={pick.links?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(pick.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#FF9900]/10 border border-[#FF9900]/40 px-3 py-2 font-mono text-[11px] text-[#B26A00] hover:bg-[#FF9900]/20 transition-all dark:text-[#FF9900]"
                    >
                      Amazon.in <ExternalLink size={10} />
                    </a>
                    <a
                      href={pick.links?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(pick.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2874F0]/10 border border-[#2874F0]/40 px-3 py-2 font-mono text-[11px] text-[#1D5BBF] hover:bg-[#2874F0]/20 transition-all dark:text-[#6EA8FF]"
                    >
                      Flipkart <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="font-mono text-[12px] text-[#23233B]/30 dark:text-white/30 mb-4">Want to compare these products side by side?</p>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E85D5D]/40 bg-[#E85D5D]/10 px-6 py-3 font-mono text-[12px] text-[#D14E4E] hover:bg-[#E85D5D]/20 transition-all dark:text-[#FF8E8E]"
              >
                Compare Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD93D]/30 border border-[#E8A13D]/40 flex items-center justify-center mx-auto mb-4 dark:bg-[#FFD93D]/10 dark:border-[#FFD93D]/20">
              <Sparkles size={28} className="text-[#C77B1A] dark:text-[#FFD93D]" />
            </div>
            <p className="font-display text-xl text-[#23233B]/80 dark:text-white/80 mb-2">What are you looking for?</p>
            <p className="font-mono text-[13px] text-[#23233B]/40 dark:text-white/40 max-w-md mx-auto">
              Type your needs naturally — budget, use case, priorities — and our AI will find the best options with direct buying links.
            </p>
          </div>
        )}
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      {!result && !loading && (
        <section className="border-t border-[#F0E2C4] bg-[#FFF3D6]/60 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, tint: 'bg-[#FFD93D]/30 text-[#9A6B00] dark:bg-[#FFD93D]/10 dark:text-[#FFD93D]', title: 'Tell us your needs', desc: 'Budget, use case, priorities — just type naturally.' },
                { icon: Sparkles, tint: 'bg-[#FF6B6B]/15 text-[#D14E4E] dark:bg-[#FF6B6B]/10 dark:text-[#FF8E8E]', title: 'AI analyzes options', desc: 'We compare specs, reviews, and prices across Amazon & Flipkart.' },
                { icon: Star, tint: 'bg-[#4ECDC4]/20 text-[#0E7C7C] dark:bg-[#4ECDC4]/10 dark:text-[#4ECDC4]', title: 'Get curated picks', desc: 'Top picks with features, prices, and direct buying links.' },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${item.tint}`}>
                    <item.icon size={18} aria-hidden />
                  </div>
                  <h3 className="font-display text-[15px] mb-1">{item.title}</h3>
                  <p className="font-mono text-[12px] text-[#23233B]/40 dark:text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GUIDE ═══ */}
      {!result && !loading && (
        <section className="border-t border-[#F0E2C4] dark:border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-center mb-6">Tips for better results</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { tip: 'Be specific about your budget', example: '"Best phone under 25k" beats "good phone"' },
                { tip: 'Mention your primary use', example: '"Laptop for video editing" gets different results than "laptop for browsing"' },
                { tip: 'Include brand preferences', example: '"Sony or Bose noise cancelling headphones" narrows the field' },
                { tip: 'Mention deal-breakers', example: '"Android phone, no Samsung, under 30k" filters out unwanted options' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-[#EBD9B4] dark:bg-white/5 dark:border-white/10">
                  <Check size={14} className="text-[#0E9494] dark:text-[#4ECDC4] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-display text-[14px] mb-0.5">{item.tip}</p>
                    <p className="font-mono text-[11px] text-[#23233B]/40 dark:text-white/40">Example: {item.example}</p>
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
