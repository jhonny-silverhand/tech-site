import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllBuyingGuides } from '@/lib/data';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Buying Guides' };

export default async function GuidesIndexPage() {
  const guides = await getAllBuyingGuides();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Guides' }]} />
      <p className="eyebrow mt-4">01 · Curated</p>
      <h1 className="t-page mt-1 text-[32px] sm:text-4xl">Buying guides</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
        Honest, price-aware recommendations for Indian buyers — updated for 2026.
        <span className="t-numeric font-mono text-[12px]"> {guides.length} guides</span>
      </p>
      {guides.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-lg border border-dashed border-linestrong bg-paper px-6 py-12 text-center">
          <p className="t-section text-[17px]">No guides yet</p>
          <p className="max-w-sm text-sm text-muted">Our editors are working on the first batch. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.id}
              href={`/guides/${g.slug}`}
              className="card card-interactive group flex flex-col p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <p className="t-meta text-muted">{g.category_slug}</p>
              <h2 className="t-section mt-2 text-[19px] leading-snug group-hover:text-accentink">
                <span className="clamp-2">{g.title}</span>
              </h2>
              {g.excerpt && <p className="clamp-3 mt-2 text-sm leading-relaxed text-muted">{g.excerpt}</p>}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-medium text-accentink">
                Read guide <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
