import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { getPostsByNiche } from '@/lib/data';

export const metadata = { title: 'Admin Categories' };

export default async function AdminCategoriesPage() {
  const counts = await Promise.all(NICHES.map(async (n) => ({ niche: n, count: (await getPostsByNiche(n.slug, 100)).length })));
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-muted">10 fixed niches with brand colors.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {counts.map(({ niche, count }) => (
          <div key={niche.slug} className="flex items-center gap-3 rounded-folder border border-line bg-paper p-4">
            <span className="h-4 w-4 rounded-full" style={{ background: niche.color }} />
            <div className="flex-1">
              <p className="font-medium">{niche.name}</p>
              <p className="font-mono text-xs text-muted">/{niche.slug} · {count} articles</p>
            </div>
            <Link href={`/niche/${niche.slug}`} className="text-sm text-accent hover:underline">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
