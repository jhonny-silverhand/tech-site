'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNiche } from '@/lib/niches';
import type { Post } from '@/lib/types';

export function HorizontalRail({ posts }: { posts: Post[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth scrollbar-none"
      >
        {posts.map((post) => {
          const niche = getNiche(post.niche);
          return (
            <Link key={post.id} href={`/articles/${post.slug}`} className="group w-[190px] shrink-0 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden rounded-folder bg-line">
                <Image
                  src={post.cover_image_url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="190px"
                />
              </div>
              <p className="mt-2 font-display text-[14.5px] leading-snug text-ink line-clamp-2">{post.title}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide" style={{ color: niche?.color }}>
                {niche?.label}
              </p>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(-420)}
        aria-label="Scroll left"
        className="hidden sm:flex absolute -left-4 top-[35%] h-9 w-9 items-center justify-center rounded-full border border-line bg-paper shadow-md hover:bg-bg transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(420)}
        aria-label="Scroll right"
        className="hidden sm:flex absolute -right-4 top-[35%] h-9 w-9 items-center justify-center rounded-full border border-line bg-paper shadow-md hover:bg-bg transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
