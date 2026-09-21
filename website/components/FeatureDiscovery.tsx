'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';

const TIPS = [
  { id: 'cmdk', text: 'Press Ctrl/⌘ + K to search every article, product and guide instantly.', href: null as string | null },
  { id: 'pcbuilder', text: 'New: AI PC Builder generates complete builds for your exact budget.', href: '/pc-builder' },
  { id: 'library', text: 'Bookmark articles and build collections in your free library.', href: '/library' },
];

export function FeatureDiscovery() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('techsite-dismissed-tips');
      if (raw) setDismissed(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  const visible = TIPS.filter((t) => !dismissed.includes(t.id));
  if (visible.length === 0) return null;
  const tip = visible[0];

  function dismiss() {
    const next = [...dismissed, tip.id];
    setDismissed(next);
    try {
      localStorage.setItem('techsite-dismissed-tips', JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  return (
    <div className="border-b border-line bg-accent-soft text-ink-2">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-[13px] sm:px-6">
        <Sparkles size={15} className="shrink-0 text-accent" />
        <p className="min-w-0 flex-1 truncate">
          {tip.text}{' '}
          {tip.href && (
            <Link href={tip.href} className="text-accentink underline underline-offset-2 hover:text-accent">
              Try it
            </Link>
          )}
        </p>
        <button onClick={dismiss} aria-label="Dismiss tip" className="text-muted hover:text-ink">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
