'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, Star, Check, Zap, Target, Battery, Monitor, Headphones, Cpu, DollarSign, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/* ─── types ─── */
interface Pick {
  name: string;
  brand: string;
  category: string;
  tagline: string;
  features: string[];
  bestFor: string;
  badge?: string;
}

interface Recommendation {
  picks: Pick[];
  summary: string;
  query: string;
}

/* ─── curated data (offline, instant) ─── */
const CURATED_DB: Record<string, Recommendation> = {
  'phone-camera': {
    query: 'phone-camera',
    summary: 'Best phones for photography — ranked by camera system quality.',
    picks: [
      { name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Smartphone', tagline: 'Best overall camera system', features: ['48MP Main', '5x Telephoto', 'ProRes Video', 'Photonic Engine'], bestFor: 'Photography, ProRes video', badge: 'Best Camera' },
      { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphone', tagline: '200MP sensor, best zoom', features: ['200MP Main', '50MP 5x Telephoto', 'Nightography', 'AI Photo Editing'], bestFor: 'Zoom photography, Night shots', badge: 'Best Zoom' },
      { name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphone', tagline: 'Computational photography king', features: ['50MP Main', '48MP Ultrawide', 'Magic Eraser', 'Best Take'], bestFor: 'Point-and-shoot, Night mode', badge: 'Best AI Camera' },
      { name: 'Sony Xperia 1 VI', brand: 'Sony', category: 'Smartphone', tagline: 'Professional manual controls', features: ['48MP Exmor T', 'True optical zoom', 'Cinematography Pro', '4K 120fps'], bestFor: 'Professional photography, Manual control' },
    ],
  },
  'phone-budget': {
    query: 'phone-budget',
    summary: 'Best phones under ₹15,000 — maximum value for money.',
    picks: [
      { name: 'Poco M6 Pro', brand: 'Poco', category: 'Smartphone', tagline: 'Best display in budget', features: ['AMOLED 90Hz', '50MP Camera', '5000mAh', '67W Charging'], bestFor: 'Media consumption, Daily use', badge: 'Best Display' },
      { name: 'Realme Narzo 70x', brand: 'Realme', category: 'Smartphone', tagline: 'Fastest charging in segment', features: ['120Hz Display', '50MP AI Camera', '45W Charging', 'IP54 Rating'], bestFor: 'Fast charging, Gaming' },
      { name: 'Samsung Galaxy M15', brand: 'Samsung', category: 'Smartphone', tagline: 'Best battery life', features: ['6000mAh Battery', '50MP Triple Camera', 'AMOLED 90Hz', '25W Charging'], bestFor: 'Battery life, Brand trust' },
      { name: 'Redmi 13C', brand: 'Xiaomi', category: 'Smartphone', tagline: 'Clean software experience', features: ['MediaTek G85', '50MP Camera', '5000mAh', 'MIUI 14'], bestFor: 'Light use, Students' },
    ],
  },
  'laptop-coding': {
    query: 'laptop-coding',
    summary: 'Best laptops for programming — performance, keyboard, and display matter.',
    picks: [
      { name: 'MacBook Air M3', brand: 'Apple', category: 'Laptop', tagline: 'Best overall for developers', features: ['M3 Chip', '15.3" Liquid Retina', '18hr Battery', 'Fanless'], bestFor: 'Web dev, iOS dev, General coding', badge: 'Best Overall' },
      { name: 'ThinkPad X1 Carbon Gen 12', brand: 'Lenovo', category: 'Laptop', tagline: 'Best keyboard, enterprise grade', features: ['Intel Ultra 7', '14" 2.8K OLED', 'Best keyboard', '32GB RAM'], bestFor: 'Backend, DevOps, Enterprise' },
      { name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'Laptop', tagline: 'Portable powerhouse', features: ['Ryzen 9 8945HS', 'RTX 4070', '14" 2K 165Hz', '1.72kg'], bestFor: 'ML/AI, Game dev, Heavy workloads' },
      { name: 'Framework Laptop 16', brand: 'Framework', category: 'Laptop', tagline: 'Fully modular, repairable', features: ['Ryzen 7 8840HS', 'Modular GPU', '16" 2560x1600', 'Upgradeable'], bestFor: 'Linux, Tinkerers, Sustainability' },
    ],
  },
  'laptop-student': {
    query: 'laptop-student',
    summary: 'Best laptops for students — light, long battery, good value.',
    picks: [
      { name: 'MacBook Air M2', brand: 'Apple', category: 'Laptop', tagline: 'Best value MacBook', features: ['M2 Chip', '13.6" Retina', '18hr Battery', '0.76kg'], bestFor: 'Note-taking, Light editing', badge: 'Best Value' },
      { name: 'ASUS Zenbook 14 OLED', brand: 'ASUS', category: 'Laptop', tagline: 'Stunning OLED at mid-range', features: ['Ryzen 5 7530U', '14" OLED 2.8K', '16GB RAM', '1.39kg'], bestFor: 'Multimedia, Essays, Presentations' },
      { name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', category: 'Laptop', tagline: 'Budget king', features: ['Ryzen 5 7530U', '15.6" FHD IPS', '16GB RAM', '57Wh Battery'], bestFor: 'Budget students, Online classes' },
    ],
  },
  'headphones-travel': {
    query: 'headphones-travel',
    summary: 'Best headphones for travel — ANC, comfort, and battery life.',
    picks: [
      { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Headphones', tagline: 'Best ANC in the world', features: ['Industry-leading ANC', '30hr Battery', 'Multipoint', 'Speak-to-Chat'], bestFor: 'Flights, Commute', badge: 'Best ANC' },
      { name: 'Apple AirPods Max', brand: 'Apple', category: 'Headphones', tagline: 'Best for Apple ecosystem', features: ['Spatial Audio', 'ANC + Transparency', '20hr Battery', 'Aluminum build'], bestFor: 'Apple users, Premium sound' },
      { name: 'Sennheiser Momentum 4', brand: 'Sennheiser', category: 'Headphones', tagline: 'Best sound quality', features: ['Audiophile tuning', '60hr Battery', 'ANC', 'Customizable EQ'], bestFor: 'Music lovers, Long trips' },
    ],
  },
  'earbuds-gym': {
    query: 'earbuds-gym',
    summary: 'Best earbuds for gym — secure fit, sweatproof, bass-heavy.',
    picks: [
      { name: 'Sony WF-1000XM5', brand: 'Sony', category: 'Earbuds', tagline: 'Best overall earbuds', features: ['Best ANC', '8hr Battery', 'LDAC', 'IPX4'], bestFor: 'Gym + Daily use', badge: 'Best Overall' },
      { name: 'Jabra Elite 8 Active', brand: 'Jabra', category: 'Earbuds', tagline: 'Built for workouts', features: ['IP68', 'Military-grade', '6hr Battery', 'Jabra ShakeGrip'], bestFor: 'Intense workouts, Running' },
      { name: 'Beats Fit Pro', brand: 'Beats', category: 'Earbuds', tagline: 'Best for iPhone gym-goers', features: ['Apple H1 Chip', 'Secure wingtip', 'ANC', 'Spatial Audio'], bestFor: 'iPhone users, Cardio' },
    ],
  },
  'smartwatch-fitness': {
    query: 'smartwatch-fitness',
    summary: 'Best smartwatches for fitness tracking and health monitoring.',
    picks: [
      { name: 'Apple Watch Ultra 2', brand: 'Apple', category: 'Smartwatch', tagline: 'Ultimate adventure watch', features: ['GPS Precision', 'Depth Gauge', '86dB Siren', '36hr Battery'], bestFor: 'Outdoor sports, Diving', badge: 'Best Premium' },
      { name: 'Samsung Galaxy Watch 6 Classic', brand: 'Samsung', category: 'Smartwatch', tagline: 'Classic design + health sensors', features: ['Rotating Bezel', 'BIA Sensor', 'Sleep Tracking', 'WearOS'], bestFor: 'Android users, Health tracking' },
      { name: 'Garmin Venu 3', brand: 'Garmin', category: 'Smartwatch', tagline: 'Best battery + fitness', features: ['14hr GPS', 'Body Battery', 'Wheelchair mode', 'Sleep Coach'], bestFor: 'Marathon, Endurance sports' },
    ],
  },
  'monitor-gaming': {
    query: 'monitor-gaming',
    summary: 'Best gaming monitors — high refresh, low response time.',
    picks: [
      { name: 'LG UltraGear 27GR95QE', brand: 'LG', category: 'Monitor', tagline: 'Best OLED gaming', features: ['27" OLED', '240Hz', '0.03ms', 'G-Sync + FreeSync'], bestFor: 'Competitive gaming', badge: 'Best OLED' },
      { name: 'Samsung Odyssey G7 32"', brand: 'Samsung', category: 'Monitor', tagline: 'Best curved VA panel', features: ['32" 1440p', '240Hz', '1ms', '1000R Curve'], bestFor: 'Immersive gaming' },
      { name: 'ASUS ROG Swift PG279QM', brand: 'ASUS', category: 'Monitor', tagline: 'Best for esports', features: ['27" IPS', '240Hz', 'G-Sync', '1ms'], bestFor: 'FPS, Esports' },
    ],
  },
};

/* ─── intent detection ─── */
function detectIntent(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes('phone') && (q.includes('camera') || q.includes('photo'))) return 'phone-camera';
  if (q.includes('phone') && (q.includes('budget') || q.includes('cheap') || q.includes('under'))) return 'phone-budget';
  if (q.includes('laptop') && (q.includes('code') || q.includes('program') || q.includes('dev'))) return 'laptop-coding';
  if (q.includes('laptop') && (q.includes('student') || q.includes('college'))) return 'laptop-student';
  if ((q.includes('headphone') || q.includes('headset')) && (q.includes('travel') || q.includes('flight') || q.includes('commute'))) return 'headphones-travel';
  if (q.includes('earbud') && (q.includes('gym') || q.includes('workout') || q.includes('sport'))) return 'earbuds-gym';
  if (q.includes('smartwatch') || q.includes('watch')) return 'smartwatch-fitness';
  if (q.includes('monitor') || q.includes('display') || q.includes('screen')) return 'monitor-gaming';
  if (q.includes('phone') || q.includes('smartphone')) return 'phone-budget';
  if (q.includes('laptop')) return 'laptop-student';
  if (q.includes('headphone') || q.includes('earbud')) return 'headphones-travel';
  return null;
}

const SUGGESTIONS = [
  { label: 'Best camera phone', icon: '📸', query: 'phone camera' },
  { label: 'Phone under ₹15k', icon: '💰', query: 'phone budget' },
  { label: 'Laptop for coding', icon: '💻', query: 'laptop coding' },
  { label: 'Student laptop', icon: '🎓', query: 'laptop student' },
  { label: 'Travel headphones', icon: '✈️', query: 'headphones travel' },
  { label: 'Gym earbuds', icon: '🏋️', query: 'earbuds gym' },
  { label: 'Smartwatch for fitness', icon: '⌚', query: 'smartwatch fitness' },
  { label: 'Gaming monitor', icon: '🖥️', query: 'monitor gaming' },
];

/* ─── page ─── */
export default function ShoppingPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate brief "AI thinking" delay
    setTimeout(() => {
      const intent = detectIntent(q);
      if (intent && CURATED_DB[intent]) {
        setResult(CURATED_DB[intent]);
      } else {
        setError('Try a more specific query — like "laptop for coding" or "phone under 15k"');
      }
      setLoading(false);
    }, 800);
  }

  function handleReset() {
    setQuery('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-void text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-6">
            <Sparkles size={16} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">AI-Powered Picks</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.08] font-bold mb-5">
            <span className="text-white">Smarter Shopping.</span><br />
            <span className="text-accent">Better Decisions.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-white/50 max-w-xl mx-auto mb-10">
            Tell us what you need — we'll suggest the best products based on specs, reviews, and real-world use cases.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(query); }}
                placeholder='Try "laptop for coding under 60k" or "best camera phone"'
                className="w-full pl-5 pr-32 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 disabled:opacity-40 text-white rounded-xl px-5 py-2.5 font-mono text-[12px] uppercase tracking-wide transition-all flex items-center gap-1.5"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Find
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          {!result && !loading && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.label}
                  onClick={() => { setQuery(s.query); handleSearch(s.query); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-white/60 hover:border-accent/40 hover:text-white hover:bg-accent/5 transition-all"
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
            <p className="font-mono text-[13px] text-white/50">Analyzing options…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="font-display text-xl text-white/80 mb-3">{error}</p>
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
                <h2 className="font-display text-2xl sm:text-3xl text-white mb-2">{result.summary}</h2>
                <p className="font-mono text-[12px] text-white/40">Based on: &quot;{result.query}&quot;</p>
              </div>
              <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[12px] text-white/50 hover:text-white hover:border-white/30 transition-all">
                <RotateCcw size={12} /> New search
              </button>
            </div>

            {/* Picks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.picks.map((pick, i) => (
                <div key={pick.name} className="group rounded-xl border border-white/8 bg-white/[0.03] hover:border-accent/30 hover:bg-white/[0.06] transition-all p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {pick.badge && (
                        <span className="bg-accent text-white text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-md">
                          {pick.badge}
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-white/30">#{i + 1}</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">{pick.category}</span>
                  </div>

                  <h3 className="font-display text-xl text-white mb-1">{pick.name}</h3>
                  <p className="font-mono text-[12px] text-accent mb-3">{pick.tagline}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pick.features.map(f => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] text-white/60 bg-white/5 border border-white/8 px-2.5 py-1 rounded-md">
                        <Check size={10} className="text-green-400" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Best for */}
                  <div className="flex items-start gap-2 pt-3 border-t border-white/5">
                    <Target size={12} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="font-mono text-[11px] text-white/50">
                      <span className="text-white/70">Best for:</span> {pick.bestFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="font-mono text-[12px] text-white/30 mb-4">Want to compare these products side by side?</p>
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
            <p className="font-display text-xl text-white/80 mb-2">What are you looking for?</p>
            <p className="font-mono text-[13px] text-white/40 max-w-md mx-auto">
              Pick a suggestion above or type your own query — we'll find the best options for you.
            </p>
          </div>
        )}
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      {!result && !loading && (
        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h2 className="font-display text-xl text-white text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Tell us your needs', desc: 'Budget, use case, priorities — just type naturally.' },
                { icon: Cpu, title: 'AI analyzes options', desc: 'We compare specs, reviews, and real-world performance.' },
                { icon: Star, title: 'Get curated picks', desc: 'Top recommendations with features and best-for tags.' },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-display text-[15px] text-white mb-1">{item.title}</h3>
                  <p className="font-mono text-[12px] text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
