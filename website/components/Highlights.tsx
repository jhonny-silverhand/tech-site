'use client';

import { useEffect, useState } from 'react';
import { Highlighter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from './ui/Button';
import type { Highlight } from '@/lib/types';

export function Highlights({ postId }: { postId: string }) {
  const [items, setItems] = useState<Highlight[]>([]);
  const [configured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!configured) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) return;
        const { data: rows } = await supabase
          .from('highlights')
          .select('*')
          .eq('post_id', postId)
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false });
        setItems((rows || []) as Highlight[]);
      } catch {
        // ignore
      }
    })();
  }, [postId, configured]);

  async function saveSelection() {
    const sel = window.getSelection()?.toString().trim();
    if (!sel) return;
    if (!configured) return;
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      window.location.href = '/login';
      return;
    }
    const { data, error } = await supabase
      .from('highlights')
      .insert({ user_id: auth.user.id, post_id: postId, selected_text: sel.slice(0, 1000) })
      .select('*')
      .single();
    if (!error && data) {
      setItems((items) => [data as Highlight, ...items]);
      window.getSelection()?.removeAllRanges();
    }
  }

  async function remove(id: string) {
    if (!configured) return;
    const supabase = createClient();
    await supabase.from('highlights').delete().eq('id', id);
    setItems((items) => items.filter((h) => h.id !== id));
  }

  if (!configured) {
    return (
      <section aria-label="Your highlights" className="rounded-folder border border-line bg-paper p-5">
        <h2 className="font-display text-xl font-semibold">Highlights</h2>
        <p className="mt-2 text-sm text-muted">Highlights need a Supabase connection. They activate once env keys are set — select any text to save it here.</p>
      </section>
    );
  }

  return (
    <section aria-label="Your highlights" className="rounded-folder border border-line bg-paper p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Highlights ({items.length})</h2>
        <Button variant="secondary" onClick={saveSelection}>
          <Highlighter size={15} /> Save selection
        </Button>
      </div>
      <p className="mt-1 text-sm text-muted">Select any text in the article, then click “Save selection”.</p>
      <ul className="mt-3 space-y-3">
        {items.map((h) => (
          <li key={h.id} className="border-l-2 border-accent bg-bg px-3 py-2 text-sm">
            <p className="text-ink">“{h.selected_text}”</p>
            <button onClick={() => remove(h.id)} className="mt-1 font-mono text-[11px] text-muted hover:text-red-600">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
