'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeletePostButton({
  postId,
  endpoint,
  redirectTo,
  compact,
}: {
  postId: string;
  endpoint?: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onDelete() {
    if (!confirm('Delete this article permanently?')) return;
    setBusy(true);
    try {
      const res = await fetch(endpoint || `/api/user-posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push(redirectTo || '/dashboard');
      router.refresh();
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete article`}
      title="Delete article"
      className={
        compact
          ? 'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[13px] text-faint hover:bg-danger-soft hover:text-danger'
          : 'inline-flex items-center gap-1.5 rounded-folder border border-line px-3 py-1.5 text-sm text-muted hover:border-red-600 hover:text-red-600'
      }
    >
      <Trash2 size={14} aria-hidden />
      {compact ? null : busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}
