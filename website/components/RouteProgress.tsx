'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/** YouTube-style top loading bar for route transitions.
 *  Starts on in-app link clicks, trickles to 85%, completes on pathname
 *  change. Matches ReadingProgressBar's slot (fixed top + glow). */
export function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<{ active: boolean; width: number; done: boolean }>({
    active: false,
    width: 0,
    done: false,
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Complete + fade whenever the route actually changes.
  useEffect(() => {
    setState((s) => (s.active ? { active: true, width: 100, done: true } : s));
    const t = setTimeout(() => setState({ active: false, width: 0, done: false }), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function start() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      // Trickle toward 85% while the next page compiles/streams.
      setState({ active: true, width: 8, done: false });
      [30, 55, 75, 85].forEach((w, i) => {
        timers.current.push(setTimeout(() => setState((s) => (s.active && !s.done ? { ...s, width: w } : s)), 350 * (i + 1)));
      });
      // Safety: never trap the bar on a stalled navigation.
      timers.current.push(setTimeout(() => setState({ active: false, width: 0, done: false }), 12000));
    }
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('//') || href === pathname) return;
      if (a.getAttribute('target') === '_blank') return;
      start();
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      timers.current.forEach(clearTimeout);
    };
  }, [pathname]);

  if (!state.active) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[95] h-[3px] bg-transparent" aria-hidden>
      <div
        className="h-full bg-accent"
        style={{
          width: `${state.width}%`,
          boxShadow: '0 0 12px var(--accent)',
          transition: state.done ? 'width 0.3s ease, opacity 0.35s ease' : 'width 0.4s ease',
          opacity: state.done ? 0 : 1,
        }}
      />
    </div>
  );
}
