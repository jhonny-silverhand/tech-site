import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Sparkles, IndianRupee, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { compareProductsLive } from '@/lib/live-products';
import { lowestPrice } from '@/lib/products-client';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { formatINR } from '@/lib/utils';
import { GeminiError } from '@/lib/gemini';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const names = slug.split('-vs-').map((s) => s.replace(/-/g, ' '));
  return { title: `Compare: ${names.join(' vs ')}`, description: `Live AI comparison of ${names.join(' vs ')} — specs, winners, pros & cons, verdict.` };
}

export default async function CompareResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const names = slug.split('-vs-').map((s) => s.replace(/-/g, ' ').trim()).filter(Boolean).slice(0, 3);
  if (names.length < 2) notFound();

  let result;
  try {
    result = await compareProductsLive(names);
  } catch (err) {
    const msg = err instanceof GeminiError ? err.message : 'Comparison failed';
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="eyebrow">Compare · unavailable</p>
        <h1 className="t-page mt-2 text-3xl">Live comparison failed</h1>
        <p className="mt-3 text-muted">{msg}. The AI models may be busy — please try again in a minute.</p>
        <Link href="/compare" className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-5 text-sm font-medium text-white hover:brightness-110">
          Back to compare
        </Link>
      </div>
    );
  }
  const { products, winners, verdict, price_guidance } = result;
  const winnerOf = (key: string) => winners.find((w) => w.spec_key === key);
  const allKeys = Array.from(new Set(products.flatMap((p) => p.specs.map((s) => s.spec_key))));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Compare', href: '/compare' }, { label: products.map((p) => p.name).join(' vs ') }]} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="font-display text-3xl font-semibold">Side-by-side comparison</h1>
        <span className="chip" data-tone="info"><Sparkles size={12} aria-hidden /> Live AI · fetched now</span>
      </div>

      {/* Verdict */}
      {verdict && (
        <section aria-label="Verdict" className="card mt-6 border-accent/30 p-5 sm:p-6">
          <p className="eyebrow flex items-center gap-1.5"><Trophy size={13} aria-hidden className="text-accent" /> Verdict</p>
          <p className="t-dek mt-2 text-[20px] leading-relaxed text-ink">{verdict}</p>
          {price_guidance && (
            <p className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-muted">
              <IndianRupee size={14} aria-hidden className="mt-0.5 flex-none" /> {price_guidance}
            </p>
          )}
        </section>
      )}

      {/* Spec table with winners */}
      <div className="mt-6 overflow-x-auto rounded-folder border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-ink text-bg">
              <th className="px-4 py-3 text-left font-mono text-xs uppercase">Spec</th>
              {products.map((p) => (
                <th key={p.id} className="px-4 py-3 text-left">
                  <Link href={`/products/${p.slug}`} className="hover:underline">{p.name}</Link>
                  <span className="mt-0.5 block text-[11px] font-normal opacity-70">{p.best_for}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line bg-paper">
              <td className="px-4 py-3 font-medium">Lowest price <span className="font-mono text-[10px] font-normal text-faint">AI-EST</span></td>
              {products.map((p) => {
                const { price_cents, currency } = lowestPrice(p);
                const win = winners.some((w) => /price/i.test(w.spec_key) && w.winner_index === products.indexOf(p));
                return (
                  <td key={p.id} className="px-4 py-3 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      {price_cents != null ? formatINR(price_cents, currency) : '—'}
                      {win && <Trophy size={13} aria-hidden className="text-accent" />}
                    </span>
                  </td>
                );
              })}
            </tr>
            {allKeys.map((key, i) => {
              const w = winnerOf(key);
              return (
                <tr key={key} className={`border-t border-line ${i % 2 ? 'bg-paper' : 'bg-bg'}`}>
                  <td className="px-4 py-2.5 font-medium">{key}</td>
                  {products.map((p, pi) => {
                    const isWin = w?.winner_index === pi;
                    return (
                      <td key={p.id} className={`px-4 py-2.5 ${isWin ? 'font-semibold text-ink' : 'text-muted'}`}>
                        <span className="inline-flex items-center gap-1.5">
                          {isWin && <Trophy size={13} aria-hidden className="flex-none text-accent" />}
                          {p.specs.find((s) => s.spec_key === key)?.spec_value || '—'}
                        </span>
                        {isWin && w?.reason && <span className="mt-0.5 block text-[11px] font-normal text-accentink">{w.reason}</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="border-t border-line bg-paper">
              <td className="px-4 py-3 font-medium">Retailers</td>
              {products.map((p) => (
                <td key={p.id} className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {p.retailers.map((r, j) => (
                      <a key={j} href={r.url} target="_blank" rel="nofollow sponsored noopener" className="inline-flex items-center gap-1 text-accentink hover:underline">
                        {r.retailer_name}{r.price_cents != null ? ` — ${formatINR(r.price_cents, r.currency)}*` : ''}
                        <ExternalLink size={12} aria-hidden />
                      </a>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-mono text-[11px] text-faint">* AI-estimated street prices — verify live prices at the retailer before buying.</p>

      {/* Pros / cons */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <section key={p.id} aria-label={`${p.name} pros and cons`} className="card p-5">
            <p className="t-meta text-muted">{p.manufacturer}</p>
            <h2 className="t-section mt-1 text-[18px]"><Link href={`/products/${p.slug}`} className="hover:text-accentink">{p.name}</Link></h2>
            {p.best_for && <p className="mt-1 text-[13px] italic text-muted">{p.best_for}</p>}
            {p.pros.length > 0 && (
              <div className="mt-3">
                <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-success"><ThumbsUp size={12} aria-hidden /> Pros</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-2">{p.pros.map((pro, k) => <li key={k}>· {pro}</li>)}</ul>
              </div>
            )}
            {p.cons.length > 0 && (
              <div className="mt-3">
                <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-danger"><ThumbsDown size={12} aria-hidden /> Cons</p>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-2">{p.cons.map((con, k) => <li key={k}>· {con}</li>)}</ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
