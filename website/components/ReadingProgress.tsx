'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ReadingProgressContext = createContext<number>(0);

/** Single shared scroll listener for the article body. */
export function ReadingProgressProvider({
  targetId,
  children,
}: {
  targetId: string;
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef<HTMLElement | null>(null);

  const onScroll = useCallback(() => {
    if (!targetRef.current) targetRef.current = document.getElementById(targetId);
    const el = targetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight + 200;
    const read = Math.min(Math.max(-rect.top + 100, 0), Math.max(total, 1));
    setProgress(Math.round((read / Math.max(total, 1)) * 100));
  }, [targetId]);

  useEffect(() => {
    targetRef.current = document.getElementById(targetId);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll, targetId]);

  return <ReadingProgressContext.Provider value={progress}>{children}</ReadingProgressContext.Provider>;
}

export function ReadingProgressBar({ color }: { color: string }) {
  const progress = useContext(ReadingProgressContext);
  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-1 bg-transparent" aria-hidden>
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
    </div>
  );
}

export function ReadingProgressStat() {
  const progress = useContext(ReadingProgressContext);
  return <span className="font-mono text-[11px] text-muted">{progress}% read</span>;
}
