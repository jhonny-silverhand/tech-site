'use client';

import { useState } from 'react';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-2 text-muted">Corrections, tips, partnerships — we read everything.</p>
      {sent ? (
        <div className="mt-6 rounded-folder border border-line bg-paper p-6">
          <p className="font-medium">Message received. ✓</p>
          <p className="mt-1 text-sm text-muted">We usually reply within 2 working days.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Field label="Name"><Input required placeholder="Your name" /></Field>
          <Field label="Email"><Input required type="email" placeholder="you@example.com" /></Field>
          <Field label="Message"><Textarea required rows={6} placeholder="How can we help?" /></Field>
          <Button type="submit" disabled={busy} className="self-start">{busy ? 'Sending…' : 'Send message'}</Button>
        </form>
      )}
    </div>
  );
}
