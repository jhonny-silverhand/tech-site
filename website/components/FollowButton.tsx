'use client';

import { useState } from 'react';
import { toggleFollowAuthor } from '@/lib/library';

export function FollowButton({
  authorId,
  initialFollowing,
}: {
  authorId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleFollowAuthor(authorId, following);
      setFollowing(!following);
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
      aria-pressed={following}
      className={`inline-flex min-h-[36px] items-center justify-center rounded-md px-4 text-[13px] font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
        following
          ? 'border border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
          : 'border border-transparent bg-accent text-white hover:brightness-110 active:translate-y-px'
      }`}
    >
      {busy ? 'Saving…' : following ? 'Following' : 'Follow'}
    </button>
  );
}
