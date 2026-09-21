'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from './ui/Button';
import { Textarea } from './ui/Field';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
}

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [configured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!configured) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('comments')
          .select('id, content, created_at, user_id')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
        setComments((data || []) as Comment[]);
      } catch {
        // ignore
      }
    })();
  }, [postId, configured]);

  if (!configured) {
    return (
      <section aria-label="Comments" className="rounded-folder border border-line bg-paper p-5">
        <h2 className="font-display text-xl font-semibold">Comments</h2>
        <p className="mt-2 text-sm text-muted">Comments need a Supabase connection. Sign-in and database features activate once env keys are set.</p>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
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
        .from('comments')
        .insert({ post_id: postId, user_id: auth.user.id, content: draft.trim() })
        .select('id, content, created_at, user_id')
        .single();
      if (error) throw error;
      setComments((c) => [...c, data as Comment]);
      setDraft('');
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from('comments').delete().eq('id', id);
    setComments((c) => c.filter((x) => x.id !== id));
  }

  return (
    <section aria-label="Comments" className="rounded-folder border border-line bg-paper p-5">
      <h2 className="font-display text-xl font-semibold">Comments ({comments.length})</h2>
      <ul className="mt-4 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="border-b border-line pb-3 last:border-0">
            <p className="text-sm text-ink">{c.content}</p>
            <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-muted">
              <span>{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
              <button onClick={() => remove(c.id)} className="hover:text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && <li className="text-sm text-muted">No comments yet. Start the discussion.</li>}
      </ul>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Share your thoughts…" aria-label="Write a comment" />
        <Button type="submit" disabled={busy || !draft.trim()} className="self-start">
          {busy ? 'Posting…' : 'Post comment'}
        </Button>
      </form>
    </section>
  );
}
