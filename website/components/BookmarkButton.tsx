'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmark } from '@/lib/library';

export function BookmarkButton({
  postId,
  initialBookmarked,
}: {
  postId: string;
  initialBookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleBookmark(postId, bookmarked);
      setBookmarked(!bookmarked);
    } catch {
      window.location.href = '/login';
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-pressed={bookmarked}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
      className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border px-3.5 text-[13px] font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
        bookmarked
          ? 'border-accent/40 bg-accentsoft text-accentink hover:border-accent'
          : 'border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
      }`}
    >
      <Bookmark size={14} aria-hidden fill={bookmarked ? 'currentColor' : 'none'} />
      {busy ? 'Saving…' : bookmarked ? 'Saved' : 'Bookmark'}
    </button>
  );
}
