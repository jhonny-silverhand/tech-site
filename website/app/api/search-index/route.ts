import { NextResponse } from 'next/server';
import { getPublishedPostsCards, getAllBuyingGuides } from '@/lib/data';
import { NICHES } from '@/lib/niches';
import type { SearchIndexItem } from '@/lib/types';

export async function GET() {
  try {
    const [posts, guides] = await Promise.all([
      getPublishedPostsCards(200).catch(() => []),
      getAllBuyingGuides().catch(() => []),
    ]);
    const items: SearchIndexItem[] = [
      ...NICHES.map((n) => ({ type: 'niche' as const, title: n.name, slug: n.slug, url: `/niche/${n.slug}`, excerpt: n.tagline })),
      ...posts.map((p) => ({ type: 'post' as const, title: p.title, slug: p.slug, url: `/articles/${p.slug}`, excerpt: p.excerpt || undefined, niche: p.niche })),
      ...guides.map((g) => ({ type: 'guide' as const, title: g.title, slug: g.slug, url: `/guides/${g.slug}`, excerpt: g.excerpt || undefined })),
    ];
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to build index' }, { status: 500 });
  }
}
