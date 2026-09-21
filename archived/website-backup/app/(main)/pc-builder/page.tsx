'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, Star, Zap, RotateCcw, ExternalLink, Cpu, ShoppingCart, Check } from 'lucide-react';

/* ─── types ─── */
interface PCComponent {
  category: string;
  name: string;
  brand: string;
  specs: string;
  priceRange: string;
  reason: string;
  links: {
    amazon: string;
    flipkart: string;
  };
}

interface PCBuild {
  name: string;
  tier: string;
  useCase: string;
  totalPrice: string;
  components: PCComponent[];
  notes?: string;
}

interface AIResult {
  summary: string;
  builds: PCBuild[];
  query: string;
}

const SUGGESTIONS = [
  { label: 'Gaming PC under 80k', icon: '🎮' },
  { label: 'Budget office PC under 40k', icon: '💼' },
  { label: 'Video editing workstation under 1.5L', icon: '🎬' },
  { label: 'Coding and development PC under 60k', icon: '💻' },
  { label: 'Streaming PC build under 1L', icon: '📺' },
  { label: 'Home server under 50k', icon: '🖥️' },
  { label: 'Student PC under 35k', icon: '🎓' },
  { label: 'High-end gaming PC no budget limit', icon: '🔥' },
];

const TIER_ICONS: Record<string, string> = {
  budget: '💰',
  midrange: '⚡',
  highend: '🚀',
};

const CATEGORY_ICONS: Record<string, string> = {
  CPU: '🔲',
  'CPU Cooler': '❄️',
  Motherboard: '📋',
  RAM: '💾',
  GPU: '🎮',
  Storage: '💿',
  PSU: '⚡',
  Case: '📦',
};

/* ─── page ─── */
export default function PCBuilderPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedBuild, setExpandedBuild] = useState<number>(0);

  async function handleSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/pc-builder/ai-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate builds');
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
            <Cpu size={16} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">AI PC Builder</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.08] font-bold mb-5">
            <span className="text-ink">Build Your Dream PC.</span><br />
            <span className="text-accent">AI-Optimized.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-ink/50 max-w-xl mx-auto mb-10">
            Tell us your budget and use case — our AI recommends complete builds with compatible parts, real prices, and buying links.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(query); }}
                placeholder='Try "gaming PC under 80k" or "workstation for video editing"'
                className="w-full pl-5 pr-32 py-4 rounded-2xl bg-paper/5 border border-line/10 text-ink placeholder:text-ink/30 text-[15px] focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 disabled:opacity-40 text-ink rounded-xl px-5 py-2.5 font-mono text-[12px] uppercase tracking-wide transition-all flex items-center gap-1.5"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Build
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
                  <span>{s.icon}</span>
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
          <div className="text-center py-16">
            <Loader2 size={32} className="text-accent animate-spin mx-auto mb-3" />
            <p className="font-mono text-[13px] text-ink/50">AI is building your PC configuration…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="font-display text-xl text-ink/80 mb-3">{error}</p>
            <button onClick={handleReset} className="font-mono text-[12px] text-accent hover:text-accent/80">
              ← Try another request
            </button>
          </div>
        )}

        {/* Builds */}
        {result && !loading && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-2">AI PC Builds</p>
                <h2 className="font-display text-2xl sm:text-3xl text-ink mb-2">{result.summary}</h2>
                <p className="font-mono text-[12px] text-ink/40">Based on: &quot;{result.query}&quot;</p>
              </div>
              <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-line/10 px-3 py-2 text-[12px] text-ink/50 hover:text-ink hover:border-line/30 transition-all flex-shrink-0">
                <RotateCcw size={12} /> New build
              </button>
            </div>

            {/* Build Cards */}
            <div className="space-y-6">
              {result.builds.map((build, i) => (
                <div
                  key={build.name + i}
                  className={`rounded-xl border transition-all ${
                    expandedBuild === i
                      ? 'border-accent/40 bg-paper shadow-lg'
                      : 'border-line/8 bg-paper hover:border-line/20'
                  }`}
                >
                  {/* Build Header */}
                  <button
                    onClick={() => setExpandedBuild(expandedBuild === i ? -1 : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TIER_ICONS[build.tier] || '🔧'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl text-ink">{build.name}</h3>
                          {i === 0 && (
                            <span className="bg-accent text-ink text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[12px] text-ink/50 mt-0.5">{build.useCase}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-accent">{build.totalPrice}</p>
                      <p className="font-mono text-[10px] text-ink/30">{build.components.length} components</p>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedBuild === i && (
                    <div className="border-t border-line/8 p-5">
                      {build.notes && (
                        <p className="font-mono text-[12px] text-ink/50 mb-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
                          {build.notes}
                        </p>
                      )}

                      {/* Components Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {build.components.map((comp) => (
                          <div
                            key={comp.category + comp.name}
                            className="rounded-lg border border-line/8 bg-bg/50 p-4 hover:border-accent/20 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg mt-0.5">{CATEGORY_ICONS[comp.category] || '🔧'}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded">
                                    {comp.category}
                                  </span>
                                  <span className="font-mono text-[10px] text-ink/30">{comp.brand}</span>
                                </div>
                                <h4 className="font-display text-[15px] text-ink mb-1">{comp.name}</h4>
                                <p className="font-mono text-[11px] text-ink/40 mb-1.5">{comp.specs}</p>
                                <p className="font-mono text-[11px] text-green-600 mb-2">{comp.priceRange}</p>
                                <p className="font-mono text-[11px] text-ink/50 mb-3 italic">{comp.reason}</p>

                                {/* Buy Links */}
                                <div className="flex gap-2">
                                  <a
                                    href={comp.links?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(comp.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#FF9900]/10 border border-[#FF9900]/20 px-2.5 py-1.5 font-mono text-[10px] text-[#FF9900] hover:bg-[#FF9900]/20 transition-all"
                                  >
                                    Amazon <ExternalLink size={8} />
                                  </a>
                                  <a
                                    href={comp.links?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(comp.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#2874F0]/10 border border-[#2874F0]/20 px-2.5 py-1.5 font-mono text-[10px] text-[#2874F0] hover:bg-[#2874F0]/20 transition-all"
                                  >
                                    Flipkart <ExternalLink size={8} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Buy all CTA */}
                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-mono text-[11px] text-ink/30">
                          {build.components.length} components · {build.totalPrice} total
                        </p>
                        <Link
                          href={`/shopping?q=${encodeURIComponent(build.name + ' PC build')}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 font-mono text-[11px] text-accent hover:bg-accent/20 transition-all"
                        >
                          <ShoppingCart size={12} /> Find deals
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="font-mono text-[12px] text-ink/30 mb-4">Need specific component advice?</p>
              <Link
                href="/shopping"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-6 py-3 font-mono text-[12px] text-accent hover:bg-accent/20 transition-all"
              >
                Ask Shopping AI <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Cpu size={28} className="text-accent" />
            </div>
            <p className="font-display text-xl text-ink/80 mb-2">What kind of PC do you need?</p>
            <p className="font-mono text-[13px] text-ink/40 max-w-md mx-auto">
              Describe your budget, use case, and preferences — our AI will generate optimized builds with compatible parts and buying links.
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
                { icon: Zap, title: 'Tell us your needs', desc: 'Budget, use case, preferences — just describe naturally.' },
                { icon: Sparkles, title: 'AI builds your PC', desc: 'We generate optimized builds with compatible, real parts.' },
                { icon: Star, title: 'Get buying links', desc: 'Every component has direct Amazon & Flipkart links.' },
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
    </div>
  );
}
