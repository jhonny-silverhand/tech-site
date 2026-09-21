'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, FileText, Package, Compass, ArrowUp, ArrowDown, X } from 'lucide-react';
import type { SearchIndexItem } from '@/lib/types';

function score(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  const words = q.split(/\s+/);
  let s = 0;
  for (const w of words) {
    if (!w) continue;
    if (t.includes(w)) s += t.startsWith(w) ? 12 : 6;
    else s -= 5;
  }
  if (t.includes(q)) s += 20;
  return s;
}

/* App-icon style tile, Spotlight-style — uniform frosted tile, tinted glyph. */
function TypeIcon({ type }: { type: string }) {
  const glyph =
    type === 'product' ? (
      <Package size={15} aria-hidden className="text-muted" />
    ) : type === 'niche' || type === 'guide' ? (
      <Compass size={15} aria-hidden className="text-muted" />
    ) : (
      <FileText size={15} aria-hidden className="text-muted" />
    );
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-black/[0.06] bg-black/[0.04] dark:border-white/10 dark:bg-white/10"
    >
      {glyph}
    </span>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    if (index) return;
    try {
      const res = await fetch('/api/search-index');
      if (res.ok) setIndex((await res.json()) as SearchIndexItem[]);
    } catch {
      setIndex([]);
    }
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        load();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [load]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open ]);

  const results = useMemo(() => {
    if (!index || !query.trim()) return (index || []).slice(0, 8);
    return index
      .map((item) => ({ item, s: score(query, `${item.title} ${item.excerpt || ''}`) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((r) => r.item);
  }, [index, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[12vh] dark:bg-black/60"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl animate-popover overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_64px_-16px_rgb(0_0_0/0.28),0_2px_8px_rgb(0_0_0/0.06)] transition-[border-color,box-shadow] focus-within:border-linestrong focus-within:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.34),0_2px_8px_rgb(0_0_0/0.08)] dark:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.7)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* ── Finder-style field: big glyph, large text, soft keys ── */}
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={19} className="flex-none text-faint" aria-hidden strokeWidth={2.2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter' && results[active]) {
                go(results[active].url);
              }
            }}
            placeholder="Search articles, topics, products, guides…"
            aria-label="Search articles, topics, products, guides"
            aria-activedescendant={results[active] ? `search-${active}` : undefined}
            role="combobox"
            aria-expanded
            aria-controls="search-results"
            className="h-14 w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-faint focus-visible:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-black/10 text-muted hover:bg-black/20 hover:text-ink dark:bg-white/15 dark:hover:bg-white/25 dark:hover:text-white"
            >
              <X size={13} aria-hidden />
            </button>
          ) : (
            <kbd className="hidden flex-none items-center rounded-md border border-black/10 bg-black/[0.04] px-2 py-1 font-mono text-[11px] font-medium text-muted sm:inline-flex dark:border-white/10 dark:bg-white/10">
              ESC
            </kbd>
          )}
        </div>

        <ul ref={listRef} id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {index === null && (
            <>
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="skeleton h-8 w-8 rounded-[9px]" />
                  <div className="flex-1">
                    <div className="skeleton h-3.5 w-3/4" />
                    <div className="skeleton mt-1.5 h-3 w-1/2" />
                  </div>
                </li>
              ))}
            </>
          )}
          {index !== null && results.length === 0 && (
            <li className="flex flex-col items-center gap-1.5 px-3 py-10 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/10">
                <Search size={20} aria-hidden className="text-faint" />
              </span>
              <p className="mt-1 text-[15px] font-medium text-ink">No results for “{query}”</p>
              <p className="text-[13px] text-muted">Try different keywords, or browse topics below.</p>
            </li>
          )}
          {results.map((r, i) => (
            <li key={`${r.type}-${r.slug}`} id={`search-${i}`} role="option" aria-selected={i === active}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.url)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === active ? 'bg-sunken' : ''
                }`}
              >
                <TypeIcon type={r.type} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-ink">{r.title}</span>
                  {r.excerpt && <span className="block truncate text-[13px] text-muted">{r.excerpt}</span>}
                </span>
                <span className="hidden flex-none items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-faint sm:inline-flex">
                  <span className="rounded-md border border-black/10 px-1.5 py-0.5 dark:border-white/10">{r.type}</span>
                  {i === active && <CornerDownLeft size={13} aria-hidden />}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 border-t border-line bg-sunken/60 px-5 py-2.5 font-mono text-[11px] text-muted sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <ArrowUp size={11} aria-hidden />
            <ArrowDown size={11} aria-hidden /> to navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft size={11} aria-hidden /> to open
          </span>
          <span className="ml-auto">esc to close</span>
        </div>
      </div>
    </div>
  );
}
