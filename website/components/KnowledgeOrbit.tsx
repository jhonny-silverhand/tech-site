'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { NICHES } from '@/lib/niches';

const RADIUS = 158;

/**
 * Desktop-only circular niche navigator with mouse-follow tilt (±5° max),
 * throttled via requestAnimationFrame. Hidden on touch / small screens
 * where a pill list is rendered instead.
 */
export function KnowledgeOrbit() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      inner!.style.transform = `rotateX(${current.current.y}deg) rotateY(${current.current.x}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      target.current.x = Math.max(-1, Math.min(1, nx)) * 5;
      target.current.y = Math.max(-1, Math.min(1, -ny)) * 5;
    }
    function onLeave() {
      target.current.x = 0;
      target.current.y = 0;
    }

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const niches = NICHES.slice(0, 9);

  return (
    <div
      ref={wrapRef}
      className="relative hidden select-none items-center justify-center lg:flex"
      style={{ perspective: 900 }}
      aria-label="Browse topics"
    >
      <div ref={innerRef} className="relative" style={{ width: 440, height: 440, transformStyle: 'preserve-3d' }}>
        <div aria-hidden className="absolute inset-[52px] rounded-full border border-line dark:border-white/10" />
        <div aria-hidden className="absolute inset-[104px] rounded-full border border-line dark:border-white/[0.07]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-line bg-paper px-6 py-4 text-center shadow-card backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <p className="font-pixel text-[22px] tracking-tight text-ink dark:text-white">
              tech<span className="text-accent">//</span>site
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted dark:text-zinc-500">
              {niches.length} topics · pick one
            </p>
          </div>
        </div>
        {niches.map((n, i) => {
          const angle = (i / niches.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          return (
            <Link
              key={n.slug}
              href={`/niche/${n.slug}`}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[13px] font-medium text-ink-2 shadow-card hover:-translate-y-px hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-white/15 dark:bg-elev dark:text-zinc-100 dark:shadow-popover dark:hover:border-white/35 dark:hover:text-white"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: n.color }} aria-hidden />
              {n.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
