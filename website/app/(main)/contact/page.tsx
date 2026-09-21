'use client';

import { useState } from 'react';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Send failed');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed — please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-2 text-muted">Corrections, tips, partnerships — we read everything.</p>
      {sent ? (
        <div className="mt-6 rounded-folder border border-line bg-paper p-6">
          <p className="font-medium">Message sent. ✓</p>
          <p className="mt-1 text-sm text-muted">We usually reply within 2 working days.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Field label="Name"><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></Field>
          <Field label="Email"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
          <Field label="Message"><Textarea required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" /></Field>
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <Button type="submit" disabled={busy} className="self-start">{busy ? 'Sending…' : 'Send message'}</Button>
        </form>
      )}
    </div>
  );
}
