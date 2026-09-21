'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';

interface AccountSettingsFormProps {
  initialName: string;
  email: string;
}

export function AccountSettingsForm({ initialName, email }: AccountSettingsFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameError(null);
    setNameSaved(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setNameSaving(false);
    if (error) {
      setNameError(error.message);
      return;
    }
    setNameSaved(true);
    router.refresh();
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Those passwords don't match.");
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSaved(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setPassword('');
    setConfirmPassword('');
    setPasswordSaved(true);
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Profile</h2>
        <form onSubmit={handleNameSubmit} className="max-w-sm">
          {nameError && (
            <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              {nameError}
            </div>
          )}
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="opacity-60" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameSaved(false);
              }}
            />
          </FieldGroup>
          <Button type="submit" variant="ghost" disabled={nameSaving || name === initialName}>
            {nameSaving ? 'Saving…' : nameSaved ? 'Saved' : 'Save name'}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Password</h2>
        <form onSubmit={handlePasswordSubmit} className="max-w-sm">
          {passwordError && (
            <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              {passwordError}
            </div>
          )}
          {passwordSaved && (
            <div className="mb-4 rounded-folder border border-line bg-paper px-4 py-3 text-[13.5px] text-muted">
              Password updated.
            </div>
          )}
          <FieldGroup>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FieldGroup>
          <Button type="submit" variant="ghost" disabled={passwordSaving || !password}>
            {passwordSaving ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      </section>
    </div>
  );
}
