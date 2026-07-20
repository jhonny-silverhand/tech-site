import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/data';
import { NICHES, getNiche } from '@/lib/niches';

export const dynamic = 'force-dynamic';

/**
 * Public, unauthenticated on purpose — it returns nothing that isn't
 * already visible by browsing the site (published post titles/slugs and
 * niche names). Powers the Cmd+K / "/" command palette.
 */
export async function GET() {
  const posts = await getPublishedPosts();

  const postItems = posts.map((post) => ({
    type: 'post' as const,
    title: post.title,
    subtitle: getNiche(post.niche)?.label ?? post.niche,
    href: `/articles/${post.slug}`,
  }));

  const nicheItems = NICHES.map((niche) => ({
    type: 'niche' as const,
    title: niche.label,
    subtitle: 'Section',
    href: `/niche/${niche.slug}`,
  }));

  return NextResponse.json([...nicheItems, ...postItems]);
}
