'use client';

import { useEffect, useRef, useState, useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchItem {
  type: 'post' | 'niche';
  title: string;
  subtitle: string;
  href: string;
}

function score(query: string, item: SearchItem): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const title = item.title.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (item.subtitle.toLowerCase().includes(q)) return 40;
  return 0;
}

/**
 * Global Cmd/Ctrl+K and "/" search overlay. Lazily fetches a lightweight
 * public search index (title/niche/href only — same data already visible
 * on the site) on first open, then does all matching client-side with a
 * small hand-rolled scorer rather than pulling in a fuzzy-search library
 * for what's realistically a few dozen to a few hundred posts.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
    setLoaded((alreadyLoaded) => {
      if (!alreadyLoaded) {
        fetch('/api/search-index')
          .then((res) => res.json())
          .then((data: SearchItem[]) => setItems(data))
          .catch(() => setItems([]))
          .finally(() => setLoaded(true));
      }
      return alreadyLoaded;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) return false;
          openPalette();
          return true;
        });
        return;
      }
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        openPalette();
        return;
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const results = items
    .map((item) => ({ item, s: score(query, item) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map((r) => r.item);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) go(target.href);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-void/60 backdrop-blur-sm px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-folder border border-line bg-paper shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="font-mono text-accent">/</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Jump to an article or section…"
            className="w-full bg-transparent font-body text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline font-mono text-[10px] text-muted border border-line rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {!loaded && <p className="px-4 py-6 text-center font-mono text-[12px] text-muted">Loading…</p>}
          {loaded && results.length === 0 && (
            <p className="px-4 py-6 text-center font-mono text-[12px] text-muted">No matches.</p>
          )}
          {results.map((item, i) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                i === activeIndex ? 'bg-accent/10' : ''
              }`}
            >
              <span className="font-display text-[15px] text-ink truncate">{item.title}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase text-muted">{item.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
