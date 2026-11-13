'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X } from 'lucide-react';

/** Global keyboard shortcuts + a "?" cheat-sheet overlay.
 *
 *  - "g" then a key → go-to navigation (h home, s shopping, p pc-builder,
 *    g guides, c compare, w write, l library)
 *  - "?" (Shift+/) → this overlay
 *
 *  Never fires while typing in inputs, textareas, contenteditable, or with
 *  Ctrl/Cmd/Alt held (so browser and app shortcuts stay untouched). */

const GO_TO: Record<string, string> = {
  h: '/',
  s: '/shopping',
  p: '/pc-builder',
  g: '/guides',
  c: '/compare',
  w: '/write',
  l: '/library',
};

const PENDING_TIMEOUT_MS = 1400;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function ShortcutsHelp() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pending = useRef(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function clearPending() {
      pending.current = false;
      if (pendingTimer.current) {
        clearTimeout(pendingTimer.current);
        pendingTimer.current = null;
      }
    }

    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      if (e.key === 'Escape') {
        clearPending();
        setOpen(false);
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen((v) => !v);
        clearPending();
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        clearPending();
        return;
      }

      if (open) return; // overlay open: only Esc / "?" handled

      const key = e.key.toLowerCase();

      if (pending.current) {
        const dest = GO_TO[key];
        clearPending();
        if (dest) {
          e.preventDefault();
          router.push(dest);
        }
        return;
      }

      if (key === 'g') {
        pending.current = true;
        pendingTimer.current = setTimeout(clearPending, PENDING_TIMEOUT_MS);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearPending();
    };
  }, [open, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 dark:bg-black/60"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="w-full max-w-md animate-popover overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_64px_-16px_rgb(0_0_0/0.28),0_2px_8px_rgb(0_0_0/0.06)] dark:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Keyboard size={16} aria-hidden className="text-accent" />
            Keyboard shortcuts
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close shortcuts"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-ink"
          >
            <X size={15} aria-hidden />
          </button>
        </div>

        <div className="p-5">
          <p className="eyebrow">Go to · press g, then</p>
          <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {(
              [
                ['h', 'Home'],
                ['s', 'Shopping'],
                ['p', 'PC Builder'],
                ['g', 'Guides'],
                ['c', 'Compare'],
                ['w', 'Write'],
                ['l', 'Library'],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center gap-2.5">
                <kbd className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-sunken px-1.5 font-mono text-[11px] font-medium text-ink">
                  g
                </kbd>
                <span aria-hidden className="text-faint">then</span>
                <kbd className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-sunken px-1.5 font-mono text-[11px] font-medium text-ink">
                  {key}
                </kbd>
                <span className="text-[13px] text-ink-2">{label}</span>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6">Tools</p>
          <ul className="mt-2.5 space-y-2">
            <li className="flex items-center gap-2.5">
              <kbd className="flex h-6 items-center justify-center rounded-md border border-line bg-sunken px-1.5 font-mono text-[11px] font-medium text-ink">
                ⌘K
              </kbd>
              <span className="text-[13px] text-ink-2">Search articles, topics, products, guides</span>
            </li>
            <li className="flex items-center gap-2.5">
              <kbd className="flex h-6 items-center justify-center rounded-md border border-line bg-sunken px-1.5 font-mono text-[11px] font-medium text-ink">
                ?
              </kbd>
              <span className="text-[13px] text-ink-2">Open this cheat sheet</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-line bg-sunken/60 px-5 py-2.5 font-mono text-[11px] text-muted">
          esc to close
        </div>
      </div>
    </div>
  );
}
