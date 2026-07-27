'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FolderPlus, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CollectionPickerProps {
  postId: string;
  enabled: boolean;
}

interface CollectionOption {
  id: string;
  name: string;
  checked: boolean;
}

export function CollectionPicker({ postId, enabled }: CollectionPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [options, setOptions] = useState<CollectionOption[]>([]);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!enabled) return null;

  async function loadOptions() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const [{ data: collections }, { data: memberships }] = await Promise.all([
      supabase.from('collections').select('id, name').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('collection_posts').select('collection_id').eq('post_id', postId),
    ]);

    const memberSet = new Set((memberships ?? []).map((m) => m.collection_id));
    setOptions((collections ?? []).map((c) => ({ id: c.id, name: c.name, checked: memberSet.has(c.id) })));
    setLoaded(true);
  }

  async function handleOpen() {
    setOpen((v) => !v);
    if (!loaded) await loadOptions();
  }

  async function toggle(collectionId: string, checked: boolean) {
    setOptions((prev) => prev.map((o) => (o.id === collectionId ? { ...o, checked } : o)));
    const supabase = createClient();
    if (checked) {
      await supabase.from('collection_posts').insert({ collection_id: collectionId, post_id: postId });
    } else {
      await supabase.from('collection_posts').delete().eq('collection_id', collectionId).eq('post_id', postId);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: collection } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name })
      .select('id, name')
      .single();

    if (collection) {
      await supabase.from('collection_posts').insert({ collection_id: collection.id, post_id: postId });
      setOptions((prev) => [{ id: collection.id, name: collection.name, checked: true }, ...prev]);
      setNewName('');
    }
    setCreating(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted hover:border-ink/30 hover:text-ink transition-colors"
      >
        <FolderPlus size={12} strokeWidth={2.5} />
        Collections
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-folder border border-line bg-paper shadow-xl py-2 z-50 text-ink">
          {!loaded && <p className="px-4 py-3 font-mono text-[12px] text-muted">Loading…</p>}
          {loaded && options.length === 0 && (
            <p className="px-4 py-2 font-mono text-[12px] text-muted">No collections yet.</p>
          )}
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id, !option.checked)}
              className="flex w-full items-center justify-between px-4 py-2 font-mono text-[12.5px] hover:bg-ink/5 transition-colors text-left"
            >
              <span className="truncate">{option.name}</span>
              {option.checked && <Check size={13} className="text-accent shrink-0" />}
            </button>
          ))}
          <form onSubmit={handleCreate} className="flex items-center gap-2 px-4 pt-2 mt-1 border-t border-line">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New collection…"
              className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-[12.5px] placeholder:text-muted/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="font-mono text-[11px] text-accent disabled:opacity-40 shrink-0"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
