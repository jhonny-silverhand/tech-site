'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { NICHES } from '@/lib/niches';
import { AccountMenu } from './AccountMenu';

export function MobileNav({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open ]);

  function openSearch() {
    setOpen(false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  }

  return (
    <div>
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-line bg-paper p-2 text-ink-2 hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
      </button>
      {open && (
        <div className="elev absolute inset-x-0 top-full z-50 flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-b-xl md:hidden">
          <div className="border-b border-line px-4 py-3">
            <button
              onClick={openSearch}
              className="sunken flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-muted"
            >
              <Search size={15} aria-hidden />
              Search articles, products, guides…
              <kbd className="ml-auto rounded border border-line px-1.5 font-mono text-[10px] text-faint">⌘K</kbd>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
            <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Topics</p>
            {NICHES.map((n) => (
              <Link
                key={n.slug}
                href={`/niche/${n.slug}`}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center gap-2.5 rounded-md px-3 text-[15px] text-ink-2 hover:bg-paper-2 hover:text-ink active:bg-paper-2"
              >
                <span className="h-2 w-2 flex-none rounded-full" style={{ background: n.color }} aria-hidden />
                {n.name}
              </Link>
            ))}
            <p className="px-3 pb-1.5 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Product</p>
            {[
              { href: '/shopping', label: 'Shopping Intelligence' },
              { href: '/pc-builder', label: 'PC Builder' },
              { href: '/guides', label: 'Buying Guides' },
              { href: '/compare', label: 'Compare' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-[15px] text-ink-2 hover:bg-paper-2 hover:text-ink active:bg-paper-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-line px-4 py-4">
            <AccountMenu email={email} username={null} />
          </div>
        </div>
      )}
    </div>
  );
}
