'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CollectionActionsProps {
  collectionId: string;
  initialName: string;
}

export function CollectionActions({ collectionId, initialName }: CollectionActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function handleRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === initialName) {
      setName(initialName);
      setEditing(false);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    await supabase.from('collections').update({ name: trimmed }).eq('id', collectionId);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${initialName}"? The articles in it stay saved as bookmarks — only the collection itself goes away.`)) {
      return;
    }
    const supabase = createClient();
    await supabase.from('collections').delete().eq('id', collectionId);
    router.push('/library');
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          autoFocus
          className="font-display text-3xl text-ink bg-transparent border-b border-line focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={handleRename}
          disabled={saving}
          className="font-mono text-[11px] text-accent uppercase tracking-wide"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <h1 className="font-display text-4xl text-ink">{initialName}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="font-mono text-[11px] text-muted hover:text-ink uppercase tracking-wide transition-colors"
      >
        Rename
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="font-mono text-[11px] text-red-600 hover:text-red-700 uppercase tracking-wide transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
