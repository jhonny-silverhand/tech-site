'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const ReadingProgressContext = createContext(0);

function useReadingProgressProvider(targetId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    function handleScroll() {
      const rect = el!.getBoundingClientRect();
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

/** Provider that shares a single scroll listener for all reading progress consumers. */
export function ReadingProgressProvider({ targetId, children }: { targetId: string; children: ReactNode }) {
  const progress = useReadingProgressProvider(targetId);
  return (
    <ReadingProgressContext.Provider value={progress}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

/** Fixed, glowing top bar tracking scroll position through #article-body. */
export function ReadingProgressBar({ color }: { color: string }) {
  const progress = useContext(ReadingProgressContext);
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
  const progress = useContext(ReadingProgressContext);
  return <span className="tabular-nums">{Math.round(progress)}% read</span>;
}
