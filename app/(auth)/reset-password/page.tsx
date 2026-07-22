'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Status = 'checking' | 'ready' | 'expired';

// How long to wait for Supabase to process the recovery link in the URL
// before assuming it's missing/invalid rather than just slow.
const CHECK_TIMEOUT_MS = 4000;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready');
    });

    // The PASSWORD_RECOVERY event can fire before this listener attaches,
    // depending on load timing — this catches that case directly.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ready');
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === 'checking' ? 'expired' : current));
    }, CHECK_TIMEOUT_MS);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">Choose a new password.</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          User accounts need a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 1600);
  }

  if (done) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">Done.</h1>
        <p className="mt-4 text-[15px] text-muted leading-relaxed">Your password has been changed. Taking you back in.</p>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">This link has expired.</h1>
        <p className="mt-4 text-[15px] text-muted leading-relaxed">
          Reset links only last a little while. Request a fresh one and you&apos;ll be back in shortly.
        </p>
        <p className="mt-8 text-[13.5px] text-muted">
          <Link href="/forgot-password" className="text-accent hover:underline">
            Request a new link
          </Link>
        </p>
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">Choose a new password.</h1>
        <p className="mt-4 text-[15px] text-muted leading-relaxed">Confirming your reset link…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-ink leading-tight">Choose a new password.</h1>
      <p className="mt-4 text-[15px] text-muted leading-relaxed">Make it something you&apos;ll actually remember.</p>
      <form onSubmit={handleSubmit} className="mt-9">
        {error && (
          <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}
        <FieldGroup>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving…' : 'Set new password'}
        </Button>
      </form>
    </div>
  );
}
