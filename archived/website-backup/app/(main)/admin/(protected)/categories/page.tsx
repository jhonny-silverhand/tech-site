import { NICHES } from '@/lib/niches';
import { getNicheCounts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const counts = await getNicheCounts();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Niches</h1>
      <p className="text-[14px] text-muted mb-8 max-w-lg">
        The taxonomy is fixed in code at lib/niches.ts rather than editable here, so it can&apos;t drift or get
        accidentally deleted. To add, rename, or remove one, edit that file — see Guides/03-what-to-edit.md.
      </p>
      <div className="divide-y divide-line border-t border-b border-line">
        {NICHES.map((niche) => (
          <div key={niche.slug} className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: niche.color }} />
              <div>
                <p className="font-display text-lg text-ink">{niche.label}</p>
                <p className="font-mono text-[11px] text-muted">/{niche.slug}</p>
              </div>
            </div>
            <span className="font-mono text-[13px] text-muted">{counts[niche.slug] ?? 0} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
