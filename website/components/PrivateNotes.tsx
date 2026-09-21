'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from './ui/Button';
import { Textarea } from './ui/Field';

export function PrivateNotes({ postId }: { postId: string }) {
  const [notes, setNotes] = useState<{ id: string; content: string; created_at: string }[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [configured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!configured) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) return;
        const { data: rows } = await supabase
          .from('private_notes')
          .select('id, content, created_at')
          .eq('post_id', postId)
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false });
        setNotes(rows || []);
      } catch {
        // ignore
      }
    })();
  }, [postId, configured]);

  if (!configured) {
    return (
      <section aria-label="Private notes" className="rounded-folder border border-line bg-paper p-5">
        <h2 className="font-display text-xl font-semibold">Private notes</h2>
        <p className="mt-2 text-sm text-muted">Private notes need a Supabase connection. They activate once env keys are set — only you can ever see them.</p>
      </section>
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.href = '/login';
        return;
      }
      const { data, error } = await supabase
        .from('private_notes')
        .insert({ user_id: auth.user.id, post_id: postId, content: draft.trim() })
        .select('id, content, created_at')
        .single();
      if (error) throw error;
      setNotes((n) => [data, ...n]);
      setDraft('');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from('private_notes').delete().eq('id', id);
    setNotes((n) => n.filter((x) => x.id !== id));
  }

  return (
    <section aria-label="Private notes" className="rounded-folder border border-line bg-paper p-5">
      <h2 className="font-display text-xl font-semibold">Private notes ({notes.length})</h2>
      <p className="mt-1 text-sm text-muted">Only you can see these.</p>
      <form onSubmit={save} className="mt-3 flex flex-col gap-2">
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Write a private note…" aria-label="Write a private note" />
        <Button type="submit" disabled={busy || !draft.trim()} className="self-start">
          {busy ? 'Saving…' : 'Save note'}
        </Button>
      </form>
      <ul className="mt-3 space-y-3">
        {notes.map((n) => (
          <li key={n.id} className="rounded-folder bg-bg px-3 py-2 text-sm">
            <p className="whitespace-pre-wrap text-ink">{n.content}</p>
            <button onClick={() => remove(n.id)} className="mt-1 font-mono text-[11px] text-muted hover:text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
