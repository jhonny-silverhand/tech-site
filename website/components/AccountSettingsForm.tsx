'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea, Field } from './ui/Field';
import { Button } from './ui/Button';

function sanitizeUsername(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 24);
}

export function AccountSettingsForm({
  initialUsername,
  initialDisplayName,
  initialBio,
  highlightUsername,
}: {
  initialUsername: string;
  initialDisplayName: string;
  initialBio: string;
  highlightUsername?: boolean;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  const clean = sanitizeUsername(username);
  const valid = clean.length >= 3;

  async function checkAvailability() {
    if (!valid) {
      setAvailable(null);
      return;
    }
    if (clean === initialUsername) {
      setAvailable(true);
      return;
    }
    setChecking(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.from('profiles').select('id').eq('username', clean).maybeSingle();
      setAvailable(!data);
    } finally {
      setChecking(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (!valid) throw new Error('Username needs at least 3 characters (a–z, 0–9, _).');
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Not signed in');
      if (clean !== initialUsername) {
        const { data: taken } = await supabase.from('profiles').select('id').eq('username', clean).maybeSingle();
        if (taken) throw new Error(`@${clean} is taken — try another.`);
      }
      const { error } = await supabase
        .from('profiles')
        .update({ username: clean, display_name: displayName, bio })
        .eq('id', auth.user.id);
      if (error) throw error;
      setMsg('Saved.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex max-w-md flex-col gap-4">
      <Field label="Username" hint="Shown in the header and on your profile URL.">
        <Input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setAvailable(null);
          }}
          onBlur={checkAvailability}
          placeholder="techreader"
          autoComplete="username"
          className={highlightUsername ? 'border-accent' : undefined}
        />
        <span className="mt-1 block font-mono text-[11px] text-faint" aria-live="polite">
          {checking
            ? 'Checking…'
            : available === false
              ? `@${clean} is taken.`
              : available === true && clean !== initialUsername
                ? `@${clean} is available.`
                : valid
                  ? `Your profile: @${clean}`
                  : 'Min 3 characters: a–z, 0–9, _.'}
        </span>
      </Field>
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
