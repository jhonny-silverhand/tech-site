'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/** Pixel day/night celebration popup (~20% of screen).
 *  Fired by ThemeToggle via `techsite:theme-changed`: the outgoing neko
 *  wipes away with a stepped pixel-dissolve into the incoming one. */
export function ThemeCelebration() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLeaving(true);
    timers.current.push(setTimeout(() => setTheme(null), 250));
  }, []);

  useEffect(() => {
    function onChange(e: Event) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const next = (e as CustomEvent<{ theme: 'light' | 'dark' }>).detail.theme;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setLeaving(false);
      setTheme(next);
      timers.current.push(setTimeout(dismiss, 2200));
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('techsite:theme-changed', onChange);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('techsite:theme-changed', onChange);
      window.removeEventListener('keydown', onKey);
      timers.current.forEach(clearTimeout);
    };
  }, [dismiss]);

  useEffect(() => {
    setLeaving(false);
  }, [theme]);

  if (!theme) return null;
  const incoming = theme === 'dark' ? '/theme-cat-dark.png' : '/theme-cat-light.png';
  const outgoing = theme === 'dark' ? '/theme-cat-light.png' : '/theme-cat-dark.png';

  return (
    <div
      role="dialog"
      aria-label={theme === 'dark' ? 'Night mode on' : 'Day mode on'}
      onClick={dismiss}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      style={{ animation: leaving ? 'theme-pop-out 0.25s ease-in both' : 'theme-pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
    >
      <div
        className="relative w-[min(400px,82vw)] overflow-hidden border-4 bg-black"
        style={{
          borderColor: theme === 'dark' ? '#fff' : '#111',
          boxShadow: theme === 'dark' ? '0 0 0 2px #111, 0 24px 64px rgb(0 0 0 / 0.6)' : '0 0 0 2px #fff, 0 24px 64px rgb(0 0 0 / 0.5)',
          imageRendering: 'pixelated',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* outgoing poster dissolves away in chunky steps */}
        <div className="relative aspect-square w-full">
          <Image src={incoming} alt="" fill sizes="400px" className="object-cover" priority />
          <Image
            src={outgoing}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
            style={{ animation: 'theme-pixel-wipe 1.1s steps(9) 0.15s both' }}
            priority
          />
        </div>
        <p
          className="font-pixel bg-black px-3 py-2 text-center text-[15px] tracking-wider text-white"
        >
          {theme === 'dark' ? (
            <>NIGHT MODE <span className="text-accent">— IDEAS // TECH // YOU</span></>
          ) : (
            <>DAY MODE <span className="text-accent">— EXPLORE // LEARN // BUILD</span></>
          )}
        </p>
      </div>
      <style>{`
        @keyframes theme-pop-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes theme-pop-out { to { opacity: 0; transform: scale(0.95); } }
        @keyframes theme-pixel-wipe {
          0% { clip-path: inset(0 0 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 100% 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
