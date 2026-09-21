'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function CollectionActions({
  collectionId,
  postId,
}: {
  collectionId: string;
  postId?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function removePost() {
    if (!postId || busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from('collection_posts').delete().eq('collection_id', collectionId).eq('post_id', postId);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteCollection() {
    if (busy || !confirm('Delete this collection? Articles stay saved elsewhere.')) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from('collections').delete().eq('id', collectionId);
      router.push('/library');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {postId && (
        <button
          onClick={removePost}
          disabled={busy}
          aria-label="Remove from collection"
          className="rounded-folder border border-line p-1.5 text-muted hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      )}
      {!postId && (
        <button
          onClick={deleteCollection}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-folder border border-line px-3 py-1.5 text-sm text-muted hover:text-red-600"
        >
          <Trash2 size={14} />
          Delete collection
        </button>
      )}
    </div>
  );
}
