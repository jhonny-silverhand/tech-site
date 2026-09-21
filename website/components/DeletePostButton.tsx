'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeletePostButton({ postId }: { postId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onDelete() {
    if (!confirm('Delete this article permanently?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/user-posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/dashboard');
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-folder border border-line px-3 py-1.5 text-sm text-muted hover:border-red-600 hover:text-red-600"
    >
      <Trash2 size={14} />
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}
