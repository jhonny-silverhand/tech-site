'use client';

import { useState } from 'react';
import { NICHES } from '@/lib/niches';
import { createClient } from '@/lib/supabase/client';
import { Button } from './ui/Button';

export function ProfileSettingsClient({ initialNiches }: { initialNiches: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialNiches);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Not signed in');
      const { error } = await supabase.from('profiles').update({ favorite_niches: selected }).eq('id', auth.user.id);
      if (error) throw error;
      setMsg('Interests saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {NICHES.map((n) => {
          const on = selected.includes(n.slug);
          return (
            <button
              key={n.slug}
              onClick={() => toggle(n.slug)}
              aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                on ? 'border-transparent bg-ink text-bg' : 'border-line bg-paper text-muted hover:text-ink'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: n.color }} />
              {n.name}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save interests'}
        </Button>
        {msg && <p className="text-sm text-muted">{msg}</p>}
      </div>
    </div>
  );
}
