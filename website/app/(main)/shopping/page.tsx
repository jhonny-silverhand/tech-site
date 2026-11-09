'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Loader2, Star, Check, Zap, Target, RotateCcw, ExternalLink,
  Camera, Laptop, Headphones, Monitor, Watch, Keyboard, Dumbbell, GraduationCap,
  Scale, Cpu,
} from '@/components/icons';

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
    <div className="min-h-screen bg-bg text-ink">
      {/* ═══ CONSOLE HERO ═══ */}
      <section className="relative border-b border-line">
        {/* corner meta — the four-corner frame */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <span className="flex items-center gap-2">
              <span className="status-dot" data-state={loading ? 'busy' : 'idle'} aria-hidden />
              {loading ? 'chain live' : 'standby'}
            </span>
            <span className="hidden sm:inline">gemini 3.8 → 3.7 → 3.6 · groq fallback</span>
            <span>₹ inr · amazon.in · flipkart</span>
          </div>

          {/* poster statement — full width */}
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Sparkles size={13} className="text-accent" aria-hidden />
            01 / ai shopping intelligence
          </p>
          <h1 className="font-display text-[clamp(2.6rem,1.6rem+6.5vw,5rem)] uppercase leading-[1.0] tracking-[-0.015em]">
            Describe it.
            <br />
            <span className="text-accent">We rank it.</span>
          </h1>

          <div className="mt-8 grid gap-8 pb-14 sm:pb-16 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <p className="t-dek max-w-md text-[15px] leading-relaxed">
                Budget, use case, deal-breakers — type it like you&apos;d tell a friend. The AI
                reads specs, reviews and Indian street prices, then hands you a ranked shortlist
                with live buying links.
              </p>
            </div>

            {/* Console input */}
            <div className="lg:pb-2">
              <label
                htmlFor="shopping-query"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
              >
                query input
              </label>
              <div className="border-2 border-ink/80 bg-paper shadow-lift transition-colors focus-within:border-accent dark:border-ink/60">
                <div className="flex items-stretch">
                  <span className="flex select-none items-center border-r border-line px-3 font-mono text-[12px] text-faint" aria-hidden>
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
                    placeholder="best phone under 30k"
                    aria-label="Describe what you want to buy"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[14px] text-ink placeholder:text-faint focus:outline-none"
                  />
                  <button
                    onClick={() => handleSearch(query)}
                    disabled={loading || !query.trim()}
                    className="flood flex items-center gap-2 border-l-2 border-ink/80 bg-ink px-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-bg transition-colors hover:text-white disabled:opacity-40 dark:border-ink/60"
                  >
                    {loading ? <Loader2 size={13} className="animate-spin" aria-hidden /> : <Zap size={13} aria-hidden />}
                    run
                  </button>
                </div>
                {/* scanline — the sweep while the chain works */}
                {loading && <div className="scanline" role="progressbar" aria-label="AI is working" />}
              </div>
              <p className="mt-2 font-mono text-[10px] text-muted">
                press enter · results are ai-estimates, verify at retailer
              </p>
            </div>
          </div>

          {/* Presets — sharp chips with device glyphs */}
          {(idle || loading) && (
            <div className="flex flex-wrap gap-1.5 pb-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setQuery(s.label);
                    handleSearch(s.label);
                  }}
                  className="inline-flex items-center gap-2 border border-line bg-paper px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/60 hover:bg-accentsoft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <s.icon size={14} className="text-faint" aria-hidden />
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ RESULTS / STATES ═══ */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Loading — the instrument narrates */}
        {loading && (
          <div role="status" aria-label="Loading recommendations" className="py-10">
            <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-accent">
                {SCAN_STAGES[stage]}
                <span className="blink-cursor" aria-hidden />
              </span>
              <span className="t-numeric text-faint">{String(elapsed).padStart(2, '0')}s</span>
            </div>
            <div className="mx-auto mb-6 max-w-md">
              <Loader2 size={28} className="mx-auto animate-spin text-accent" aria-hidden />
            </div>
            <p className="text-center font-mono text-[12px] text-muted">
              analyzing options for &quot;{query}&quot;…
            </p>
            {slow && (
              <p
                className="mx-auto mt-3 max-w-md border-l-2 border-warn bg-warnsoft px-4 py-2 font-mono text-[12px] leading-relaxed text-warn"
                aria-live="polite"
              >
                The AI servers are under heavy load — this can take 20–30 seconds more. Your picks
                are still on the way.
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div role="alert" className="py-10 text-center">
            <p className="t-section mb-3 text-[20px] text-ink/80">{error}</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 border border-line bg-paper px-4 py-2 font-mono text-[12px] text-muted transition-colors hover:border-accent/60 hover:text-ink"
            >
              <RotateCcw size={12} aria-hidden /> New query
            </button>
          </div>
        )}

        {/* Result — ranked ledger */}
        {result && !loading && (
          <div className="snap-in">
            {/* Ledger header */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink/80 pb-4 dark:border-ink/60">
              <div>
                <p className="eyebrow mb-2 flex items-center gap-2 text-accent">
                  <Star size={12} aria-hidden /> verdict
                </p>
                <h2 className="t-page max-w-2xl text-[24px] sm:text-[30px]">{result.summary}</h2>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  query: &quot;{result.query}&quot; · {result.picks.length} picks · ai-estimated
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 border border-line bg-paper px-3 py-2 font-mono text-[11px] text-muted transition-colors hover:border-accent/60 hover:text-ink"
              >
                <RotateCcw size={12} aria-hidden /> new search
              </button>
            </div>

            {/* Ledger rows */}
            <ol className="border-t border-line">
              {result.picks.map((pick, i) => (
                <li
                  key={pick.name + i}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="group relative snap-in border-b border-line"
                >
                  {/* top-pick marker: signal bar down the left edge */}
                  {i === 0 && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 top-0 w-[3px] bg-accent"
                    />
                  )}
                  <div className="grid gap-5 py-6 pl-4 pr-1 transition-colors sm:pl-6 lg:grid-cols-[auto_1fr_auto]">
                    {/* rank */}
                    <div className="flex items-start gap-3 lg:w-[72px] lg:flex-col lg:gap-1">
                      <span className="t-numeric font-display text-[34px] leading-none text-ink/90 lg:text-[40px]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {i === 0 && (
                        <span className="mt-1.5 inline-flex items-center gap-1 bg-accent px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-white">
                          <Star size={9} aria-hidden /> top pick
                        </span>
                      )}
                    </div>

                    {/* body */}
                    <div className="min-w-0">
                      <h3 className="t-section text-[19px] leading-tight">{pick.name}</h3>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-accent">
                        {pick.tagline}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {pick.features.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1.5 border border-line bg-paper px-2 py-0.5 font-mono text-[10.5px] text-muted"
                          >
                            <Check size={10} className="text-success" aria-hidden />
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-start gap-2">
                        <Target size={12} className="mt-0.5 flex-none text-accent" aria-hidden />
                        <p className="font-mono text-[11px] leading-relaxed text-muted">
                          <span className="text-ink/70">best for:</span> {pick.bestFor}
                        </p>
                      </div>
                    </div>

                    {/* price + buy column */}
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <div className="lg:text-right">
                        <p className="t-numeric font-display text-[20px] leading-none text-ink">
                          {pick.priceRange}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-faint">
                          est. range · {pick.category}
                        </p>
                      </div>
                      <div className="flex w-full gap-2 lg:w-auto">
                        <a
                          href={pick.links?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(pick.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flood inline-flex flex-1 items-center justify-center gap-1.5 border border-ink/70 px-3 py-2 font-mono text-[11px] text-ink transition-colors hover:text-white lg:flex-none"
                        >
                          amazon.in <ExternalLink size={10} className="icon-nudge" aria-hidden />
                        </a>
                        <a
                          href={pick.links?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(pick.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flood inline-flex flex-1 items-center justify-center gap-1.5 border border-ink/70 px-3 py-2 font-mono text-[11px] text-ink transition-colors hover:text-white lg:flex-none"
                        >
                          flipkart <ExternalLink size={10} className="icon-nudge" aria-hidden />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="mb-4 font-mono text-[12px] text-faint">
                want the full spec-by-spec breakdown?
              </p>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 border-2 border-accent bg-accentsoft px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-accent-ink transition-colors hover:bg-accent hover:text-white"
              >
                compare products <ArrowRight size={14} className="icon-nudge" aria-hidden />
              </Link>
            </div>
          </div>
        )}

        {/* Empty state — awaiting input */}
        {idle && (
          <div className="py-14 text-center">
            <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center border-2 border-line bg-paper">
              <Sparkles size={34} className="text-accent" aria-hidden />
            </div>
            <p className="font-display text-[22px] uppercase tracking-wide text-ink/85">
              awaiting input
            </p>
            <p className="mx-auto mt-2 max-w-md font-mono text-[12px] leading-relaxed text-muted">
              type your needs naturally — budget, use case, priorities — and the console returns a
              ranked shortlist with direct buying links.
            </p>
          </div>
        )}
      </section>

      {/* ═══ HOW IT WORKS — numbered strip ═══ */}
      {idle && (
        <section className="border-t border-line bg-paper-2/60">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="eyebrow mb-8 text-center">02 / pipeline</h2>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {[
                { icon: Zap, n: '01', title: 'Parse', desc: 'Budget, use case, priorities — plain language in.' },
                { icon: Sparkles, n: '02', title: 'Analyze', desc: 'Specs, reviews and prices compared across Amazon & Flipkart.' },
                { icon: Star, n: '03', title: 'Rank', desc: 'A numbered shortlist with features, prices and buy links.' },
              ].map((item) => (
                <div key={item.n} className="bg-bg p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center border border-line bg-paper">
                      <item.icon size={18} className="text-accent" aria-hidden />
                    </span>
                    <span className="t-numeric font-mono text-[12px] text-faint">{item.n}</span>
                  </div>
                  <h3 className="t-section mb-1 font-mono text-[13px] uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] leading-relaxed text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GUIDE ═══ */}
      {idle && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="eyebrow mb-6 text-center">03 / better queries</h2>
            <div className="mx-auto max-w-2xl">
              {[
                { tip: 'Be specific about your budget', example: '"best phone under 25k" beats "good phone"' },
                { tip: 'Mention your primary use', example: '"laptop for video editing" gets different results than "laptop for browsing"' },
                { tip: 'Include brand preferences', example: '"sony or bose noise cancelling headphones" narrows the field' },
                { tip: 'Mention deal-breakers', example: '"android phone, no samsung, under 30k" filters out unwanted options' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-b border-line py-3 first:border-t"
                >
                  <span className="t-numeric mt-0.5 font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-ink">{item.tip}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-faint">eg: {item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER STRIP — next instruments ═══ */}
      {idle && (
        <section className="border-t border-line bg-void text-white">
          <div className="mx-auto grid max-w-5xl gap-px px-4 py-0 sm:grid-cols-2 sm:px-6">
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
                className="group flex items-center justify-between gap-4 border-t border-white/10 py-6 first:border-t-0 sm:border-t-0 sm:py-8"
              >
                <div className="flex items-center gap-4">
                  <c.icon size={26} className="text-accent" aria-hidden />
                  <div>
                    <p className="font-display text-[16px] uppercase tracking-wide">{c.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-zinc-400">{c.desc}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="icon-nudge flex-none text-zinc-500 group-hover:text-accent" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
