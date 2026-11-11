'use client';

import { useState } from 'react';
import { Cpu, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import type { PCBuild } from '@/lib/types';
import { formatPriceINR } from '@/lib/utils';

const USE_CASES = ['Gaming 1080p', 'Gaming 1440p', 'Coding & Productivity', 'Video Editing', 'Student All-Rounder', 'AI/ML Starter'];

export default function PCBuilderPage() {
  const [budget, setBudget] = useState('80000');
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [builds, setBuilds] = useState<PCBuild[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openTier, setOpenTier] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/pc-builder/ai-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetInr: Number(budget), useCase }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Build generation failed');
      setBuilds(json.builds);
      setOpenTier(json.builds?.[1]?.tier || json.builds?.[0]?.tier || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'PC Builder' }]} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="info">
          <Cpu size={11} aria-hidden /> AI PC Builder
        </Badge>
        {busy && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted" role="status">
            <span className="status-dot" data-state="busy" aria-hidden />
            Building…
          </span>
        )}
      </div>
      <h1 className="t-page mt-3 max-w-2xl text-[32px] sm:text-4xl">A complete PC for your exact budget.</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">Three builds — Budget, Balanced, Stretch — with 8 real components, INR pricing, and buy links.</p>

      <form onSubmit={submit} aria-busy={busy} className="card mt-6 grid gap-4 p-5 sm:grid-cols-[200px_1fr_auto] sm:items-end sm:p-6">
        <Field label="Budget (₹)" required>
          <div className="relative">
            <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-faint">₹</span>
            <Input value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" required placeholder="80000" aria-label="Budget in rupees" className="t-numeric pl-7" />
          </div>
        </Field>
        <Field label="Use case">
          <Select value={useCase} onChange={(e) => setUseCase(e.target.value)} aria-label="Use case">
            {USE_CASES.map((u) => <option key={u} value={u}>{u}</option>)}
          </Select>
        </Field>
        <Button type="submit" size="lg" loading={busy}>
          <Cpu size={15} aria-hidden /> {busy ? 'Building…' : 'Generate builds'}
        </Button>
      </form>

      {error && <Alert tone="error" title="Build generation failed" className="mt-4">{error}</Alert>}

      {builds && (
        <div className="mt-8 flex flex-col gap-4">
          {builds.map((b) => {
            const open = openTier === b.tier;
            return (
              <div key={b.tier} className="card overflow-hidden">
                <button onClick={() => setOpenTier(open ? null : b.tier)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-sunken/60">
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="t-section text-[17px]">{b.tier}</span>
                    <span className="t-numeric font-mono text-[13px] text-muted">{formatPriceINR(b.total_inr)}</span>
                  </span>
                  <ChevronDown size={17} aria-hidden className={`flex-none text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="border-t border-line px-5 py-4">
                    <p className="text-sm leading-relaxed text-muted">{b.use_case}</p>
                    <ul className="mt-3 divide-y divide-line">
                      {b.components.map((c, i) => (
                        <li key={i} className="flex items-start justify-between gap-4 py-3.5">
                          <div className="min-w-0">
                            <p className="t-meta text-muted">{c.category}</p>
                            <p className="mt-0.5 text-[15px] font-medium text-ink">{c.name}</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-muted">{c.reasoning}</p>
                            {c.buy_link && (
                              <a href={c.buy_link} target="_blank" rel="nofollow sponsored noopener" className="mt-1 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-accentink hover:underline hover:underline-offset-4">
                                Buy <ExternalLink size={12} aria-hidden />
                              </a>
                            )}
                          </div>
                          <p className="t-numeric flex-none whitespace-nowrap font-mono text-[13px] font-medium">{formatPriceINR(c.price_inr)}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="sunken mt-3 p-3 text-[13px] leading-relaxed text-muted">{b.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
