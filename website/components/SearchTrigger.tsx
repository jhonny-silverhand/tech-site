'use client';

import { Search } from 'lucide-react';

export function SearchTrigger() {
  function open() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  }

  return (
    <button
      onClick={open}
      aria-label="Search (Ctrl+K)"
      title="Search (Ctrl+K)"
      className="hidden items-center gap-2 rounded-full border border-line bg-paper py-1.5 pl-3 pr-2 font-mono text-[11px] text-muted hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:inline-flex"
    >
      <Search size={13} aria-hidden />
      <span className="tracking-wide">Search</span>
      <kbd className="rounded border border-line px-1 text-[10px] leading-4 text-faint">⌘K</kbd>
    </button>
  );
}
