'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'theme';

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

/**
 * The actual theme decision happens instantly, before paint, in the
 * blocking inline script in app/layout.tsx — this component just reflects
 * and toggles it afterward. isDark starts null (not "light") specifically
 * so the icon renders nothing until mount, rather than possibly rendering
 * the wrong icon for a frame and then swapping it.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    >
      {isDark === null ? null : isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
