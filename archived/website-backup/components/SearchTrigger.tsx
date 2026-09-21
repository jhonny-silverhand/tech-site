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
      className="hidden items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:border-zinc-400 hover:text-white lg:inline-flex"
    >
      <Search size={12} />
      <span className="tracking-wide">⌘K search</span>
    </button>
  );
}
