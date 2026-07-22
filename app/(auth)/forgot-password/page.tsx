'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">Let&apos;s get you back in.</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          User accounts need a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    // Same reasoning as signup's emailRedirectTo (see Guides/01-database-setup.md):
    // derive it from wherever this request actually happened rather than
    // trusting Supabase's static Site URL setting, so this works correctly
    // in both local dev and production without needing separate code paths.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    // Deliberately shown regardless of whether the email exists — telling
    // an unauthenticated visitor "no account with that email" is a real,
    // if minor, way to leak which emails have accounts on the site.
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink leading-tight">Check your inbox.</h1>
        <p className="mt-4 text-[15px] text-muted leading-relaxed">
          If an account exists for <span className="text-ink">{email}</span>, a reset link is on its way. It'll
          be valid for a little while, so no rush.
        </p>
        <p className="mt-8 text-[13.5px] text-muted">
          <Link href="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-ink leading-tight">Let&apos;s get you back in.</h1>
      <p className="mt-4 text-[15px] text-muted leading-relaxed">
        Enter the email on your account and we&apos;ll send you a link to choose a new password. No trouble at
        all.
      </p>
      <form onSubmit={handleSubmit} className="mt-9">
        {error && (
          <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-8 text-[13.5px] text-muted">
        <Link href="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
