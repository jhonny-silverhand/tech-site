'use client';

import { useState } from 'react';
import { ListPlus, Check } from 'lucide-react';
import { toggleQueue } from '@/lib/library';

export function ReadingQueueButton({
  postId,
  initialInQueue,
}: {
  postId: string;
  initialInQueue: boolean;
}) {
  const [inQueue, setInQueue] = useState(initialInQueue);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleQueue(postId, inQueue);
      setInQueue(!inQueue);
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
      aria-pressed={inQueue}
      className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border px-3.5 text-[13px] font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
        inQueue
          ? 'border-accent/40 bg-accentsoft text-accentink hover:border-accent'
          : 'border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
      }`}
    >
      {inQueue ? <Check size={14} aria-hidden /> : <ListPlus size={14} aria-hidden />}
      {busy ? 'Saving…' : inQueue ? 'In queue' : 'Read later'}
    </button>
  );
}
