'use client';

import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { BrandMark } from './BrandMark';

/**
 * Desktop-only topic constellation — pills scattered around the wordmark,
 * each drifting gently in place. Positions are fixed percentages of the
 * container; the drift animation only moves pills ±5px vertically so the
 * layout never shifts.
 *
 * NOTE: orbit pills use SHORT labels (not the full niche label) so the
 * longer names ("Tech Buying Guides", "PC Components", …) can't overlap
 * the center wordmark or each other — same trick as the reference hero.
 */
const SHORT_LABELS: Record<string, string> = {
  'ai-tools': 'AI',
  programming: 'Programming',
  android: 'Android',
  'windows-linux': 'Windows',
  'buying-guides': 'Guides',
  gaming: 'Gaming',
  'career-jobs': 'Career',
  finance: 'Finance',
  productivity: 'Productivity',
  components: 'Hardware',
};

const POSITIONS: Record<string, { left: string; top: string; delay: string }> = {
  'career-jobs': { left: '44%', top: '3%', delay: '0s' },
  finance: { left: '72%', top: '8%', delay: '0.9s' },
  gaming: { left: '28%', top: '24%', delay: '1.7s' },
  productivity: { left: '84%', top: '33%', delay: '2.5s' },
  'buying-guides': { left: '20%', top: '48%', delay: '3.2s' },
  'ai-tools': { left: '88%', top: '58%', delay: '1.2s' },
  'windows-linux': { left: '33%', top: '74%', delay: '2.1s' },
  programming: { left: '72%', top: '80%', delay: '2.9s' },
  android: { left: '54%', top: '90%', delay: '0.5s' },
  components: { left: '12%', top: '62%', delay: '1.6s' },
};

export function KnowledgeOrbit() {
  return (
    <div className="hidden lg:block" aria-label="Pick a topic">
      <div className="relative mx-auto aspect-square w-full max-w-[560px]">
        {NICHES.map((n) => {
          const pos = POSITIONS[n.slug] || { left: '50%', top: '50%', delay: '0s' };
          return (
            <span
              key={n.slug}
              className="absolute z-10"
              style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
            >
              <Link
                href={`/niche/${n.slug}`}
                title={n.label}
                className="constellation-pill flex items-center gap-2 whitespace-nowrap rounded-full border border-zinc-700/80 bg-zinc-900/90 px-4 py-2 text-sm text-zinc-100 shadow-lg shadow-black/40 transition-colors hover:border-zinc-300 hover:text-white"
                style={{ animationDelay: pos.delay }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.color }} />
                {SHORT_LABELS[n.slug] ?? n.label}
              </Link>
            </span>
          );
        })}
        {/* Static center — never moves */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <BrandMark className="text-4xl text-white" />
            <p className="mt-1 font-tagline text-xl italic text-zinc-400">pick a topic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
