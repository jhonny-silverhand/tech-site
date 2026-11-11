'use client';

import { useEffect, useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { getMyCollections, addToCollection } from '@/lib/library';

export function CollectionPicker({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getMyCollections().then(setCollections).catch(() => setCollections([]));
  }, [open ]);

  async function add(id: string, name: string) {
    try {
      await addToCollection(id, postId);
      setDone(name);
      setTimeout(() => {
        setOpen(false);
        setDone(null);
      }, 900);
    } catch {
      window.location.href = '/login';
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border border-line bg-paper px-3.5 text-[13px] font-medium text-muted shadow-card hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <FolderPlus size={14} aria-hidden />
        Collect
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-40 mt-2 w-56 animate-popover overflow-hidden rounded-lg border border-line bg-paper shadow-popover">
          {done ? (
            <p className="px-4 py-3 text-sm text-ink">Added to {done} ✓</p>
          ) : collections.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">
              No collections yet.{' '}
              <a href="/library" className="text-accentink hover:underline">
                Create one
              </a>
            </div>
          ) : (
            collections.map((c) => (
              <button
                key={c.id}
                onClick={() => add(c.id, c.name)}
                className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-bg"
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
