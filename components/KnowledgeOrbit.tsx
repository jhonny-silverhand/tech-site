'use client';

import { useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { NICHES } from '@/lib/niches';

const SIZE = 420;
const RADIUS = 145;
const MAX_TILT = 6;

/**
 * Circular arrangement of the 9 niches around the wordmark. Desktop only —
 * rendered inside a `hidden lg:flex` wrapper by the homepage, with the
 * plain grid as the sub-lg fallback (a 9-item circle doesn't compress to a
 * phone screen legibly, so this doesn't try to).
 *
 * The ring only tilts a few degrees toward the cursor rather than spinning
 * continuously — a full auto-rotate reads as "alive" for about five
 * seconds and "distracting" after that, and constant motion is exactly
 * what prefers-reduced-motion users are opting out of.
 */
export function KnowledgeOrbit() {
  const [tilt, setTilt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relativeX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    setTilt(Math.max(-1, Math.min(1, relativeX)) * MAX_TILT);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt(0)}
      className="relative motion-reduce:!rotate-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {NICHES.map((niche, i) => {
          const angle = (i / NICHES.length) * 2 * Math.PI - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);
          return (
            <Link
              key={niche.slug}
              href={`/niche/${niche.slug}`}
              className="group absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${-tilt}deg)`,
              }}
            >
              <div className="flex flex-col items-center gap-2 transition-transform duration-200 group-hover:scale-110">
                <span
                  className="h-3 w-3 rounded-full transition-shadow"
                  style={{ backgroundColor: niche.color }}
                />
                <span className="max-w-[78px] text-center font-mono text-[9.5px] uppercase leading-tight tracking-wide text-ink/70 group-hover:text-ink">
                  {niche.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="font-display text-xl text-ink/85">
          tech<span className="text-accent">//</span>site
        </span>
      </div>
    </div>
  );
}
