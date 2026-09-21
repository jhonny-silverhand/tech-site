'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function NewCollectionForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    await supabase.from('collections').insert({ user_id: user.id, name: trimmed });
    setName('');
    setCreating(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New collection name…"
        className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-[12.5px] placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
      />
      <button
        type="submit"
        disabled={creating || !name.trim()}
        className="font-mono text-[11px] uppercase tracking-wide text-accent disabled:opacity-40"
      >
        {creating ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}
