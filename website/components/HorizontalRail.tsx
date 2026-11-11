'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PostCard as PostCardType } from '@/lib/types';
import { PostCard } from './PostCard';

export function HorizontalRail({ posts }: { posts: PostCardType[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateArrows() {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, []);

  function scrollBy(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * 344, behavior: 'smooth' });
  }

  if (posts.length === 0) return null;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <p className="t-numeric font-mono text-[11px] text-faint">
          {posts.length} article{posts.length === 1 ? '' : 's'}
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canLeft}
            aria-label="Scroll left"
            className="rounded-md border border-line bg-paper p-2 text-ink shadow-card hover:border-linestrong hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-paper"
          >
            <ChevronLeft size={15} aria-hidden />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canRight}
            aria-label="Scroll right"
            className="rounded-md border border-line bg-paper p-2 text-ink shadow-card hover:border-linestrong hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-paper"
          >
            <ChevronRight size={15} aria-hidden />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        onScroll={updateArrows}
        className="rail-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {posts.map((p) => (
          <div key={p.id} className="w-[272px] shrink-0 snap-start sm:w-[320px]">
            <PostCard post={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
