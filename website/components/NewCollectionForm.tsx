'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection } from '@/lib/library';
import { Input } from './ui/Field';
import { Button } from './ui/Button';

export function NewCollectionForm() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createCollection(name.trim());
      setName('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create collection');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New collection name…"
        aria-label="New collection name"
        className="max-w-xs"
      />
      <Button type="submit" disabled={busy || !name.trim()}>
        {busy ? 'Creating…' : 'Create'}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
