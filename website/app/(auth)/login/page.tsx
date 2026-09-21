'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Field, Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const checkEmail =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('check-email') === '1';

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Users created before choosing a username still carry the auto
      // `user_xxxxxxxx` handle — send them to pick a real one.
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', auth.user.id)
            .maybeSingle();
          const uname = (profile as { username?: string } | null)?.username || '';
          if (!uname || /^user_[0-9a-f]{8}$/.test(uname)) {
            router.push('/library/settings?setup=1');
            router.refresh();
            return;
          }
        }
      } catch {
        // fall through to home
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to your library and personalized feed.</p>
      {checkEmail && (
        <p className="mt-4 rounded-md border border-accent/30 bg-accentsoft px-3 py-2 text-sm text-ink-2" role="status">
          Account created — confirm your email, then log in below.
        </p>
      )}
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="Password"><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        <Link href="/forgot-password" className="text-accentink hover:underline">Forgot password?</Link>
        {' · '}
        No account? <Link href="/signup" className="text-accentink hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
