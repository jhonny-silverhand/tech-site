'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface LibraryMenuProps {
  bookmarkCount: number;
  continueReading: { title: string; slug: string } | null;
}

const COMING_SOON = ['Highlights', 'Comments'];

/**
 * Header's logged-in state — Option B from the 3.6 brief ("Library"
 * replaces "Sign In"), the one marked as the strongest fit. Deliberately
 * a compact dropdown, not a full account menu — Continue Reading,
 * Bookmarks, Collections, History, and Settings are real and link
 * somewhere useful; Highlights and Comments are shown but disabled, so
 * the eventual full shape is visible without pretending they're built.
 */
export function LibraryMenu({ bookmarkCount, continueReading }: LibraryMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="px-3 py-1.5 rounded-folder font-mono text-[12px] hover:bg-white/10 transition-colors"
      >
        Library
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-folder border border-line bg-paper shadow-xl py-1.5 z-50 text-ink">
          {continueReading && (
            <Link
              href={`/articles/${continueReading.slug}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 hover:bg-ink/5 transition-colors border-b border-line mb-1"
            >
              <p className="font-mono text-[10px] uppercase tracking-wide text-muted">Continue reading</p>
              <p className="font-display text-[14.5px] text-ink truncate mt-0.5">{continueReading.title}</p>
            </Link>
          )}

          <Link
            href="/library"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-4 py-2 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
          >
            Bookmarks
            <span className="text-muted">{bookmarkCount}</span>
          </Link>
          <Link
            href="/library"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/library"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
          >
            History
          </Link>
          <Link
            href="/library/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
          >
            Settings
          </Link>

          {COMING_SOON.map((label) => (
            <span
              key={label}
              className="flex items-center justify-between px-4 py-2 font-mono text-[12.5px] text-muted/50 cursor-default"
            >
              {label}
              <span className="text-[9px] uppercase tracking-wide border border-line rounded px-1 py-0.5">Soon</span>
            </span>
          ))}

          <div className="border-t border-line my-1.5" />
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 font-mono text-[12.5px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
