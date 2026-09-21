'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Field, Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError('Auth is not configured yet (missing Supabase keys). Add them to .env.local.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          display_name: username,
        });
      }
      router.push('/onboarding');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Free forever. Bookmarks, collections, AI picks.</p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <Field label="Username"><Input required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="techreader" /></Field>
        <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="Password"><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" /></Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Have an account? <Link href="/login" className="text-accentink hover:underline">Log in</Link>
      </p>
    </div>
  );
}
