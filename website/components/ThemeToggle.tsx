'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

function currentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Pixel day/night switch — the neko moves across the sky.
 *  Thumb shows the cat of the current theme (white cat at night). */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [hopping, setHopping] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('techsite-theme');
      if (saved === 'dark' || saved === 'light') {
        document.documentElement.classList.toggle('dark', saved === 'dark');
        setTheme(saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        setTheme('dark');
      } else {
        setTheme(currentTheme());
      }
    } catch {
      setTheme(currentTheme());
    }
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('techsite-theme', next);
    } catch {
      // private mode — theme just won't persist
    }
    setTheme(next);
    setHopping(true);
    setTimeout(() => setHopping(false), 450);
  }

  const dark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group relative h-9 w-[68px] flex-none overflow-hidden rounded-none border-2 border-line bg-paper transition-colors hover:border-linestrong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{
        imageRendering: 'pixelated',
        boxShadow: 'inset 0 0 0 2px rgb(0 0 0 / 0.15)',
      }}
    >
      {/* sky */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: dark ? 1 : 0,
          background: 'linear-gradient(180deg, #0B0B18 0%, #1B1B3A 60%, #2D2A55 100%)',
        }}
      />
      {/* pixel stars */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: dark ? 1 : 0,
          backgroundImage:
            'radial-gradient(2px 2px at 12px 8px, #fff 50%, transparent 51%), radial-gradient(2px 2px at 30px 20px, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 48px 10px, #FFE66D 50%, transparent 51%), radial-gradient(2px 2px at 58px 24px, #fff 50%, transparent 51%)',
        }}
      />
      {/* day sky */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: dark ? 0 : 1,
          background: 'linear-gradient(180deg, #7EC8F7 0%, #BDE6FD 60%, #FFF3D6 100%)',
        }}
      />
      {/* pixel sun */}
      <span
        aria-hidden
        className="absolute left-[7px] top-[5px] h-[10px] w-[10px] bg-[#FFD93D] transition-all duration-300 dark:left-[-14px] dark:top-[22px]"
        style={{ boxShadow: '0 0 8px #FFD93D' }}
      />
      {/* pixel clouds */}
      <span
        aria-hidden
        className="absolute right-[6px] top-[8px] h-[5px] w-[16px] bg-white/90 transition-all duration-300 dark:right-[-22px]"
        style={{ boxShadow: '4px 3px 0 -1px rgb(255 255 255 / 0.7)' }}
      />
      {/* sliding neko thumb */}
      <span
        aria-hidden
        className="absolute top-[1px] h-[28px] w-[28px] overflow-hidden border-2 border-line bg-paper transition-all duration-300 ease-out group-active:scale-90"
        style={{
          left: dark ? '36px' : '2px',
          transform: hopping ? 'translateY(-3px)' : 'translateY(0)',
          imageRendering: 'pixelated',
        }}
      >
        {mounted && (
          <Image
            src={dark ? '/theme-cat-dark-face.png' : '/theme-cat-light-face.png'}
            alt=""
            width={56}
            height={56}
            sizes="28px"
            className="h-full w-full"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        )}
      </span>
    </button>
  );
}
