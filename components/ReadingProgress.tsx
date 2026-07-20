'use client';

import { useEffect, useState } from 'react';

function useReadingProgress(targetId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = document.getElementById(targetId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetId]);

  return progress;
}

/** Fixed, glowing top bar tracking scroll position through #article-body. */
export function ReadingProgressBar({ color }: { color: string }) {
  const progress = useReadingProgress('article-body');
  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  );
}

/** Small inline "N% read" stat, meant to sit next to the reading-time text. */
export function ReadingProgressStat() {
  const progress = useReadingProgress('article-body');
  return <span className="tabular-nums">{Math.round(progress)}% read</span>;
}
