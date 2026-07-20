'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Sign up</h1>
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
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // Without this, Supabase falls back entirely to the static "Site
        // URL" in the dashboard for every confirmation email, regardless
        // of where the signup actually happened — which is exactly why
        // production signups were linking back to localhost. Deriving it
        // from window.location.origin makes it correct for both local dev
        // and production, as long as both origins are also added to
        // Supabase's Redirect URLs allowlist (Guides/01-database-setup.md).
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    setCheckEmail(true);
    setLoading(false);
  }

  if (checkEmail) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Check your email</h1>
        <p className="mt-4 text-[14.5px] text-muted leading-relaxed">
          We sent a confirmation link to {email}. Click it to confirm your account and get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 sm:px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Sign up</h1>
      <p className="mt-2 text-[14.5px] text-muted">Publish under your own name, no AI tools attached.</p>
      <form onSubmit={handleSubmit} className="mt-8">
        {error && (
          <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
            {error}
          </div>
        )}
        <FieldGroup>
          <Label htmlFor="name">Display name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-[13.5px] text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
