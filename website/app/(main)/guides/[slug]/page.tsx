import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getBuyingGuideBySlug, getGuideRecommendations } from '@/lib/data';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { MarkdownContent } from '@/components/MarkdownContent';
import { formatINR } from '@/lib/utils';
import { lowestPrice } from '@/lib/products-client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = await getBuyingGuideBySlug(slug);
  if (!g) return { title: 'Guide not found' };
  return { title: g.seo_title || g.title, description: g.seo_description || g.excerpt || undefined };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getBuyingGuideBySlug(slug);
  if (!guide) notFound();
  const recs = await getGuideRecommendations(guide.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Guides', href: '/guides' }, { label: guide.title }]} />
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">{guide.category_slug}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{guide.title}</h1>
      {guide.excerpt && <p className="mt-3 font-tagline text-xl italic text-muted">{guide.excerpt}</p>}
      <p className="mt-3 font-mono text-xs text-muted">By {guide.author_name || 'tech//site'} {guide.is_ai_assisted ? '· AI-assisted' : ''}</p>

      {recs.length > 0 && (
        <section aria-label="Top picks" className="mt-8">
          <h2 className="font-display text-2xl font-semibold">Our top picks</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {recs.map((r) => {
              const price = r.product ? lowestPrice(r.product) : null;
              return (
                <div key={r.id} className="rounded-folder border border-line bg-paper p-5">
                  <span className="w-fit rounded-full bg-ink px-2.5 py-0.5 font-mono text-[11px] uppercase text-bg">{r.label}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">
                    {r.product ? <Link href={`/products/${r.product.slug}`} className="hover:text-accentink">{r.product.name}</Link> : r.label}
                  </h3>
                  {price?.price_cents != null && <p className="text-sm font-semibold">from {formatINR(price.price_cents, price.currency)}</p>}
                  {r.reason && <p className="mt-1 text-sm text-muted">{r.reason}</p>}
                  {r.pros.length > 0 && <ul className="mt-2 text-sm">{r.pros.map((p, i) => <li key={i}>✓ {p}</li>)}</ul>}
                  {r.cons.length > 0 && <ul className="mt-1 text-sm text-muted">{r.cons.map((c, i) => <li key={i}>✕ {c}</li>)}</ul>}
                  {r.product?.retailers?.[0] && (
                    <a href={r.product.retailers[0].url} target="_blank" rel="nofollow sponsored noopener" className="mt-3 inline-flex items-center gap-1 text-sm text-accentink hover:underline">
                      Check price <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8">
        <MarkdownContent source={guide.content} />
      </div>
    </div>
  );
}
