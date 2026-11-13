'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dices } from 'lucide-react';
import { fetchArticleIndex, pickRandomArticle } from '@/lib/roulette';
import type { SearchIndexItem } from '@/lib/types';

/** Article Roulette — "Surprise me".
 *
 * Slot-machine rolls through a few random titles for ~1 s, then routes
 * to a uniformly random published article from the search index. */
export function ArticleRoulette({ excludeUrl }: { excludeUrl?: string }) {
  const router = useRouter();
  const [rolling, setRolling] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timers.current) clearInterval(timers.current);
    };
  }, []);

  async function roll() {
    if (rolling) return;
    setRolling(true);

    const pickPromise = pickRandomArticle(excludeUrl);
    const all = await fetchArticleIndex();
    const titles = all.filter((i) => i.type === 'post').map((i) => i.title);

    if (titles.length === 0) {
      const pick = await pickPromise;
      finish(pick);
      return;
    }

    let ticks = 0;
    const iv = setInterval(() => {
      ticks += 1;
      setFlash(titles[Math.floor(Math.random() * titles.length)]);
      if (ticks >= 10) {
        clearInterval(iv);
        timers.current = null;
        pickPromise.then(finish).catch(() => finish(null));
      }
    }, 95);
    timers.current = iv;
  }

  function finish(pick: SearchIndexItem | null) {
    setFlash(null);
    setRolling(false);
    if (pick) router.push(pick.url);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={roll}
        disabled={rolling}
        aria-label="Open a random article"
        title="Open a random article"
        className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border border-line bg-paper px-3.5 text-[13px] font-medium text-muted shadow-card transition-colors hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
      >
        <Dices size={14} aria-hidden className={rolling ? 'animate-spin' : ''} />
        {rolling ? 'Rolling…' : 'Surprise me'}
      </button>
      <span
        aria-live="polite"
        className={`min-w-0 truncate font-mono text-[11px] text-faint transition-opacity ${
          rolling && flash ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {rolling ? flash || '\u00A0' : '\u00A0'}
      </span>
    </div>
  );
}
