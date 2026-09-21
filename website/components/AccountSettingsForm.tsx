'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea, Field } from './ui/Field';
import { Button } from './ui/Button';

export function AccountSettingsForm({ initialDisplayName, initialBio }: { initialDisplayName: string; initialBio: string }) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Not signed in');
      const { error } = await supabase.from('profiles').update({ display_name: displayName, bio }).eq('id', auth.user.id);
      if (error) throw error;
      setMsg('Saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex max-w-md flex-col gap-4">
      <Field label="Display name">
        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </Field>
      <Field label="Bio">
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
      </Field>
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? 'Saving…' : 'Save changes'}
      </Button>
      {msg && <p className="text-sm text-muted">{msg}</p>}
    </form>
  );
}
