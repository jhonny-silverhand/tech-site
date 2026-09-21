'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Field, Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg('Password updated. Redirecting…');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Reset password</h1>
      <p className="mt-1 text-sm text-muted">Choose a new password.</p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <Field label="New password"><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Button type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
        {msg && <p className="text-sm text-muted">{msg}</p>}
      </form>
    </div>
  );
}
