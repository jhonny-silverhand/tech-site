'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import type { Product } from '@/lib/types';

export default function CompareIndexPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    setResults([]);
    setSearchError(null);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Search failed');
      setResults(json.products || []);
      if ((json.products || []).length === 0) setSearchError('No products found — try a different search.');
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed — please try again.');
    } finally {
      setBusy(false);
    }
  }

  function toggle(p: Product) {
    setSelected((s) => (s.find((x) => x.slug === p.slug) ? s.filter((x) => x.slug !== p.slug) : [...s, p].slice(0, 3)));
  }

  function go() {
    if (selected.length < 2) return;
    router.push(`/compare/${selected.map((s) => s.slug).join('-vs-')}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="eyebrow">01 · Side by side</p>
      <h1 className="t-page mt-1 flex items-center gap-2.5 text-[32px] sm:text-4xl"><Scale size={28} aria-hidden className="flex-none text-accent" /> Compare products</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">Pick up to 3 products. We fetch fresh specs live and line up winners, pros &amp; cons, and a verdict.</p>

      <form onSubmit={search} className="mt-6 flex gap-2" role="search">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any product… e.g. iphone 17, xps 16, sony wh-1000xm6" aria-label="Search products" />
        <Button type="submit" loading={busy} disabled={!q.trim()} className="flex-none">{busy ? 'Asking Gemini…' : 'Search'}</Button>
      </form>
      {busy && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted" aria-live="polite">
          <span className="status-dot" data-state="busy" aria-hidden /> Fetching live product data — takes 10–20 seconds.
        </p>
      )}
      {searchError && !busy && (
        <p className="mt-3 rounded-md border border-danger/25 bg-dangersoft px-3 py-2 text-sm text-danger" role="alert">
          {searchError}
        </p>
      )}

      {selected.length > 0 && (
        <div className="card mt-4 flex flex-wrap items-center gap-2 p-3" aria-live="polite">
          {selected.map((s) => (
            <button key={s.slug} onClick={() => toggle(s)} aria-label={`Remove ${s.name}`} className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-void px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-void">{s.name} <span aria-hidden>✕</span></button>
          ))}
          <span className="t-numeric font-mono text-[11px] text-muted">{selected.length}/3 selected</span>
          <Button onClick={go} disabled={selected.length < 2} size="sm" className="ml-auto">Compare →</Button>
        </div>
      )}

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {results.map((p) => {
          const on = selected.some((s) => s.slug === p.slug);
          return (
            <li key={p.id}>
              <button
                onClick={() => toggle(p)}
                aria-pressed={on}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  on
                    ? 'border-accent bg-accentsoft shadow-card'
                    : 'border-line bg-paper hover:border-linestrong hover:bg-sunken/50'
                }`}
              >
                <p className="t-meta text-muted">{p.manufacturer}</p>
                <p className="mt-0.5 text-[15px] font-medium text-ink">{p.name}</p>
                {p.description && <p className="clamp-2 mt-1 text-[13px] leading-relaxed text-muted">{p.description}</p>}
                <p className="mt-1.5 flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-accentink">{on ? '✓ Selected — tap to remove' : 'Tap to select'}</span>
                  <span className="rounded border border-line px-1 text-faint">LIVE AI</span>
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="prose-tech mt-10">
        <h2>How to compare effectively</h2>
        <ol>
          <li><strong>Fix your budget first.</strong> Comparing a ₹20K phone with a ₹60K one teaches nothing.</li>
          <li><strong>Weight 3 specs that matter to you</strong> (e.g., battery, camera, updates) and ignore the rest.</li>
          <li><strong>Check lowest-price history,</strong> not MRP — street prices differ 10–20%.</li>
          <li><strong>Read the cons.</strong> Every product’s worst trait matters more than its best feature.</li>
        </ol>
        <p>Popular: <Link href="/compare/apple-iphone-15-128-vs-samsung-galaxy-s24">iPhone 15 vs Galaxy S24</Link></p>
      </div>
    </div>
  );
}
