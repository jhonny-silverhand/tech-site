import Link from 'next/link';
import { getBuyingGuides } from '@/lib/products';
import { NICHES } from '@/lib/niches';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NicheTag } from '@/components/NicheTag';

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  const guides = await getBuyingGuides();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-2">Buying Guides</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight text-ink">
          Expert buying guides for technology
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          In-depth analysis, comparisons, and recommendations to help you make confident purchasing decisions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors border-accent bg-accent/10 text-accent"
        >
          All guides
        </Link>
        {NICHES.map((niche) => (
          <Link
            key={niche.slug}
            href={`/guides?category=${niche.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors hover:border-ink/30"
            style={{ borderColor: niche.color }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
            {niche.label}
          </Link>
        ))}
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-ink mb-2">No buying guides yet</p>
          <p className="text-muted">Check back soon for expert recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group rounded-folder border border-line bg-paper hover:border-ink/30 transition-colors overflow-hidden"
            >
              {guide.cover_image_url && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={guide.cover_image_url}
                    alt=""
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {guide.category_slug && (
                    <NicheTag slug={guide.category_slug} />
                  )}
                </div>
                <h3 className="font-display text-xl leading-snug text-ink group-hover:text-accent transition-colors">
                  {guide.title}
                </h3>
                {guide.excerpt && (
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted line-clamp-2">{guide.excerpt}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted">Buying Guide</span>
                  <span className="font-mono text-[11px] text-accent group-hover:underline">Read guide →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}