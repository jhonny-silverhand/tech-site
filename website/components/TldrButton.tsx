'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

type Tldr = { bullets: string[]; takeaway: string };

/** AI TL;DR — on-demand summary card for articles.
 *  Renders as a toolbar button; the result card expands beneath it. */
export function TldrButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Tldr | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (data || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/articles/tldr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      setData((await res.json()) as Tldr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a summary');
    } finally {
      setLoading(false);
    }
  }

  async function retry() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/articles/tldr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      setData((await res.json()) as Tldr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a summary');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        aria-expanded={open}
        title="Generate an AI summary of this article"
        className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border px-3.5 text-[13px] font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
          open
            ? 'border-accent/40 bg-accentsoft text-accentink hover:border-accent'
            : 'border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
        }`}
      >
        <Sparkles size={14} aria-hidden />
        {loading ? 'Summarizing…' : open ? 'Hide TL;DR' : 'AI TL;DR'}
      </button>

      {open && (
        <div className="card mt-3 w-full p-4 sm:p-5" role="region" aria-label="AI summary">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow">TL;DR · AI-generated</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI summary"
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-ink"
            >
              <X size={14} aria-hidden />
            </button>
          </div>

          {loading && (
            <div className="mt-3 space-y-2.5" aria-live="polite">
              <p className="text-[13px] text-muted">Reading the article and picking out what matters…</p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-3.5" style={{ width: `${92 - i * 14}%` }} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-3">
              <p className="text-[13px] text-muted">
                The summarizer is unavailable right now — {error}.
              </p>
              <button
                onClick={retry}
                className="mt-3 inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-line bg-paper px-3 text-[12px] font-medium text-muted shadow-card transition-colors hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Sparkles size={12} aria-hidden /> Try again
              </button>
            </div>
          )}

          {!loading && data && (
            <div className="mt-3">
              <ul className="space-y-2.5">
                {data.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-2">
                    <span
                      aria-hidden
                      className="mt-[9px] h-[5px] w-[5px] flex-none rounded-full bg-accent"
                    />
                    {b}
                  </li>
                ))}
              </ul>
              {data.takeaway && (
                <p className="mt-4 border-l-2 border-accent/40 pl-3 text-[13px] leading-relaxed text-muted">
                  {data.takeaway}
                </p>
              )}
              <p className="t-meta mt-4 text-faint">Generated by AI — verify specifics against the full article above.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
