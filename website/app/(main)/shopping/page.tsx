'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Loader2, Star, Check, Zap, Target, RotateCcw, ExternalLink,
  Camera, Laptop, Headphones, Monitor, Watch, Keyboard, Dumbbell, GraduationCap,
  Scale, Cpu,
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

/* Scan stages — the console narrates what the AI chain is doing */
const SCAN_STAGES = ['PARSING QUERY', 'GATHERING SPECS', 'CHECKING PRICES', 'RANKING PICKS'];

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
  const [slow, setSlow] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Deep-link support: /shopping?q=laptops (hero category quick-links)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      setQuery(q);
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Instrument readout: cycle scan stages + tick the elapsed counter while the AI works
  useEffect(() => {
    if (!loading) return;
    setStage(0);
    setElapsed(0);
    const stageTimer = setInterval(() => setStage((s) => (s + 1) % SCAN_STAGES.length), 2600);
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(stageTimer);
      clearInterval(tick);
    };
  }, [loading]);

  async function handleSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSlow(false);
    setError(null);
    setResult(null);
    const slowTimer = setTimeout(() => setSlow(true), 5000);

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
      clearTimeout(slowTimer);
      setSlow(false);
      setLoading(false);
    }
  }

  function handleReset() {
    setQuery('');
    setResult(null);
    setError(null);
    setSlow(false);
    inputRef.current?.focus();
  }

  const idle = !result && !loading && !error;

  return (
    <div className="min-h-screen bg-[#FFF8ED] text-[#23233B] dark:bg-[#16152E] dark:text-[#F4F2FF]">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-[#F0E2C4] dark:border-white/10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#FFD93D]/40 blur-3xl dark:bg-[#FFD93D]/15" />
        <div aria-hidden className="pointer-events-none absolute -top-16 right-[-6rem] h-96 w-96 rounded-full bg-[#FF6B6B]/25 blur-3xl dark:bg-[#FF6B6B]/15" />
        <div aria-hidden className="pointer-events-none absolute top-40 left-1/3 h-64 w-64 rounded-full bg-[#4ECDC4]/25 blur-3xl dark:bg-[#4ECDC4]/10" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* corner meta strip — kept from the console layout */}
          <div className="flex items-center justify-between pt-5 font-mono text-[10px] uppercase tracking-widest text-[#23233B]/50 dark:text-white/50">
            <span className="flex items-center gap-2">
              <span className="status-dot" data-state={loading ? 'busy' : 'idle'} aria-hidden />
              {loading ? 'Chain live' : 'Standby'}
            </span>
            <span className="hidden sm:inline">Gemini 3.8 → 3.7 → 3.6 · Groq fallback</span>
            <span>₹ INR · Amazon.in · Flipkart</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A13D]/50 bg-[#FFD93D]/25 px-4 py-2 mt-8 mb-6 dark:border-[#FFD93D]/30 dark:bg-[#FFD93D]/10">
            <Sparkles size={16} className="text-[#C77B1A] dark:text-[#FFD93D]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#9A6B00] dark:text-[#FFD93D]">AI-Powered Shopping</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.08] font-bold mb-5">
            <span>Smarter Shopping.</span><br />
            <span className="text-[#E85D5D] dark:text-[#FF8E8E]">Better Decisions.</span>
          </h1>

          <div className="mt-2 grid gap-8 pb-14 sm:pb-16 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[17px] leading-relaxed text-[#23233B]/60 dark:text-[#F4F2FF]/60 max-w-md">
                Tell us what you need — our AI analyzes specs, reviews, and prices across Indian e-commerce to find your best options.
              </p>
            </div>

            {/* Console input — kept structure (label + prompt + input + button) on original styling */}
            <div className="lg:pb-2">
              <label
                htmlFor="shopping-query"
                className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#23233B]/50 dark:text-white/50"
              >
                Query input
              </label>
              <div className="rounded-2xl border border-[#EBD9B4] bg-white p-1.5 shadow-[0_2px_12px_-4px_rgb(232_161_61/0.25)] transition-all focus-within:border-[#E85D5D]/60 focus-within:ring-2 focus-within:ring-[#E85D5D]/25 dark:bg-white/5 dark:border-white/15">
                <div className="flex items-stretch">
                  <span className="flex select-none items-center px-2.5 font-mono text-[12px] text-[#23233B]/40 dark:text-white/40" aria-hidden>
                    &gt;
                  </span>
                  <input
                    id="shopping-query"
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch(query);
                    }}
                    placeholder='Try "best phone under 30k for camera" or "laptop for coding"'
                    aria-label="Describe what you want to buy"
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] text-[#23233B] placeholder:text-[#23233B]/35 focus:outline-none dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    onClick={() => handleSearch(query)}
                    disabled={loading || !query.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#E85D5D] px-4 py-2.5 font-mono text-[12px] uppercase tracking-wide text-white transition-all hover:bg-[#D14E4E] disabled:opacity-40 dark:bg-[#FF8E8E] dark:hover:bg-[#E85D5D] shadow-[0_4px_14px_-4px_rgb(232_93_93/0.6)]"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Ask AI
                  </button>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] text-[#23233B]/40 dark:text-white/40">
                Press Enter · results are AI-estimated, verify at retailer
              </p>
            </div>
          </div>

          {/* Quick suggestions */}
          {(idle || loading) && (
            <div className="flex flex-wrap gap-2 pb-8">
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

      {/* ═══ RESULTS / STATES ═══ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Loading — stage readout (kept from the console layout) + original spinner */}
        {loading && (
          <div className="py-10" role="status" aria-label="Loading recommendations">
            <div className="mb-6 flex items-baseline justify-between border-b border-[#F0E2C4] pb-3 font-mono text-[11px] uppercase tracking-wide dark:border-white/10">
              <span className="text-[#E85D5D] dark:text-[#FF8E8E]">
                {SCAN_STAGES[stage]}
              </span>
              <span className="t-numeric text-[#23233B]/40 dark:text-white/40">{String(elapsed).padStart(2, '0')}s</span>
            </div>
            <Loader2 size={32} className="text-[#E85D5D] dark:text-[#FF8E8E] animate-spin mx-auto mb-3" />
            <p className="text-center font-mono text-[13px] text-[#23233B]/50 dark:text-white/50">AI is analyzing options for you…</p>
            {slow && (
              <p className="mx-auto mt-3 max-w-md rounded-lg border border-[#E8A13D]/50 bg-[#FFD93D]/20 px-4 py-2 font-mono text-[12px] leading-relaxed text-[#9A6B00] dark:border-[#FFD93D]/25 dark:bg-[#FFD93D]/10 dark:text-[#FFD93D]" aria-live="polite">
                The AI servers are experiencing heavy load — this might take 20–30 seconds more. Please wait, your picks are on the way.
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16" role="alert">
            <p className="font-display text-xl text-[#23233B]/80 dark:text-white/80 mb-3">{error}</p>
            <button onClick={handleReset} className="font-mono text-[12px] text-[#E85D5D] hover:text-[#D14E4E] dark:text-[#FF8E8E]">
              ← Try another query
            </button>
          </div>
        )}

        {/* Result — ranked ledger (kept console layout) on original card styling */}
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

            {/* Ledger rows */}
            <ol className="space-y-4">
              {result.picks.map((pick, i) => (
                <li
                  key={pick.name + i}
                  className="group relative rounded-2xl border border-[#EBD9B4] bg-white hover:border-[#E85D5D]/40 hover:shadow-[0_12px_32px_-12px_rgb(232_93_93/0.35)] transition-all dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.7)]"
                >
                  {/* top-pick marker: coral bar down the left edge (kept from the console layout) */}
                  {i === 0 && (
                    <span
                      aria-hidden
                      className="absolute bottom-4 left-0 top-4 w-[3px] rounded-full bg-[#E85D5D] dark:bg-[#FF8E8E]"
                    />
                  )}
                  <div className="grid gap-5 p-5 lg:grid-cols-[auto_1fr_auto]">
                    {/* rank */}
                    <div className="flex items-start gap-3 lg:w-[72px] lg:flex-col lg:gap-1">
                      <span className="t-numeric font-display text-[34px] leading-none text-[#23233B]/90 lg:text-[40px] dark:text-[#F4F2FF]/90">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {i === 0 && (
                        <span className="mt-1.5 bg-[#FFD93D] text-[#5C4300] text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md">
                          ★ Top Pick
                        </span>
                      )}
                    </div>

                    {/* body */}
                    <div className="min-w-0">
                      <h3 className="font-display text-xl mb-1">{pick.name}</h3>
                      <p className="font-mono text-[12px] text-[#0E9494] dark:text-[#4ECDC4] mb-1">{pick.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                        {pick.features.map(f => (
                          <span key={f} className="inline-flex items-center gap-1 text-[11px] text-[#23233B]/60 bg-[#F7FBF7] border border-[#CDE8CD] px-2.5 py-1 rounded-md dark:text-white/60 dark:bg-white/5 dark:border-white/10">
                            <Check size={10} className="text-green-600 dark:text-green-400" />
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-start gap-2 pt-3 border-t border-[#F0E2C4] dark:border-white/10">
                        <Target size={12} className="text-[#E85D5D] dark:text-[#FF8E8E] mt-0.5 flex-shrink-0" />
                        <p className="font-mono text-[11px] text-[#23233B]/50 dark:text-white/50">
                          <span className="text-[#23233B]/70 dark:text-white/70">Best for:</span> {pick.bestFor}
                        </p>
                      </div>
                    </div>

                    {/* price + buy column (kept from the console layout) */}
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <div className="lg:text-right">
                        <p className="t-numeric font-mono text-[15px] text-green-700 dark:text-green-400">{pick.priceRange}</p>
                        <p className="mt-1 font-mono text-[10px] text-[#23233B]/40 dark:text-white/40">Est. range · {pick.category}</p>
                      </div>
                      <div className="flex w-full gap-2 lg:w-auto">
                        <a
                          href={pick.links?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(pick.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#FF9900]/10 border border-[#FF9900]/40 px-3 py-2 font-mono text-[11px] text-[#B26A00] hover:bg-[#FF9900]/20 transition-all dark:text-[#FF9900] lg:flex-none"
                        >
                          Amazon.in <ExternalLink size={10} />
                        </a>
                        <a
                          href={pick.links?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(pick.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2874F0]/10 border border-[#2874F0]/40 px-3 py-2 font-mono text-[11px] text-[#1D5BBF] hover:bg-[#2874F0]/20 transition-all dark:text-[#6EA8FF] lg:flex-none"
                        >
                          Flipkart <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

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
        {idle && (
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

      {/* ═══ HOW IT WORKS — numbered strip (kept console layout) on original cards ═══ */}
      {idle && (
        <section className="border-t border-[#F0E2C4] bg-[#FFF3D6]/60 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, n: '01', tint: 'bg-[#FFD93D]/30 text-[#9A6B00] dark:bg-[#FFD93D]/10 dark:text-[#FFD93D]', title: 'Tell us your needs', desc: 'Budget, use case, priorities — just type naturally.' },
                { icon: Sparkles, n: '02', tint: 'bg-[#FF6B6B]/15 text-[#D14E4E] dark:bg-[#FF6B6B]/10 dark:text-[#FF8E8E]', title: 'AI analyzes options', desc: 'We compare specs, reviews, and prices across Amazon & Flipkart.' },
                { icon: Star, n: '03', tint: 'bg-[#4ECDC4]/20 text-[#0E7C7C] dark:bg-[#4ECDC4]/10 dark:text-[#4ECDC4]', title: 'Get curated picks', desc: 'Top picks with features, prices, and direct buying links.' },
              ].map(item => (
                <div key={item.title} className="rounded-2xl border border-[#EBD9B4] bg-white p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.tint}`}>
                      <item.icon size={18} aria-hidden />
                    </div>
                    <span className="t-numeric font-mono text-[12px] text-[#23233B]/30 dark:text-white/30">{item.n}</span>
                  </div>
                  <h3 className="font-display text-[15px] mb-1">{item.title}</h3>
                  <p className="font-mono text-[12px] text-[#23233B]/40 dark:text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GUIDE — numbered rows (kept console layout) on original cards ═══ */}
      {idle && (
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
                  <span className="t-numeric mt-0.5 font-mono text-[12px] text-[#E85D5D] dark:text-[#FF8E8E] flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
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

      {/* ═══ FOOTER STRIP — next instruments (kept console layout) on original cards ═══ */}
      {idle && (
        <section className="border-t border-[#F0E2C4] dark:border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  href: '/compare',
                  icon: Scale,
                  title: 'Compare',
                  desc: 'Spec-by-spec verdicts between products.',
                },
                {
                  href: '/pc-builder',
                  icon: Cpu,
                  title: 'PC Builder',
                  desc: 'Balance a full build against your budget.',
                },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-[#EBD9B4] bg-white p-5 transition-all hover:border-[#E85D5D]/40 hover:shadow-[0_12px_32px_-12px_rgb(232_93_93/0.35)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.7)]"
                >
                  <div className="flex items-center gap-4">
                    <c.icon size={26} className="text-[#E85D5D] dark:text-[#FF8E8E]" aria-hidden />
                    <div>
                      <p className="font-display text-[16px]">{c.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#23233B]/40 dark:text-white/40">{c.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="flex-none text-[#23233B]/30 transition-all group-hover:text-[#E85D5D] dark:text-white/30 dark:group-hover:text-[#FF8E8E]" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
