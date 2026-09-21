'use client';

import { useState } from 'react';
import { toggleFollowTopic } from '@/lib/library';

export function TopicFollowButton({
  nicheSlug,
  nicheName,
  initialFollowing,
}: {
  nicheSlug: string;
  nicheName: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleFollowTopic(nicheSlug, following);
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
      aria-label={`Follow topic ${nicheName}`}
      aria-pressed={following}
      className={`inline-flex min-h-[40px] items-center justify-center rounded-md px-5 text-sm font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
        following
          ? 'border border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
          : 'border border-transparent bg-void text-white hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-void dark:hover:bg-zinc-200'
      }`}
    >
      {busy ? 'Saving…' : following ? `Following ${nicheName}` : `Follow ${nicheName}`}
    </button>
  );
}
