import { NextResponse } from 'next/server';
import { getPublishedPostsCards } from '@/lib/data';
import { NICHES, getNiche } from '@/lib/niches';
import { getProductsByCategory, getBuyingGuides } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

/**
 * Public, unauthenticated on purpose — it returns nothing that isn't
 * already visible by browsing the site (published post titles/slugs and
 * niche names). Powers the Cmd+K / "/" command palette.
 */
export async function GET() {
  // Use lightweight query — only needs titles/slugs, not full content bodies
  const posts = await getPublishedPostsCards();

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

  let productItems: Array<{ type: 'product'; title: string; subtitle: string; href: string }> = [];
  let guideItems: Array<{ type: 'guide'; title: string; subtitle: string; href: string }> = [];

  // Always try to get products and guides, with fallback to local data
  try {
    if (isSupabaseConfigured()) {
      const products = await getProductsByCategory('buying-guides', 50);
      productItems = products.map((p) => {
        return {
          type: 'product' as const,
          title: p.name,
          subtitle: `${p.manufacturer} ${p.model} · Product`,
          href: `/products/${p.slug}`,
        };
      });

      const guides = await getBuyingGuides();
      guideItems = guides.map((g) => {
        return {
          type: 'guide' as const,
          title: g.title,
          subtitle: g.category_slug ? getNiche(g.category_slug)?.label || 'Guide' : 'Guide',
          href: `/guides/${g.slug}`,
        };
      });
    }
  } catch (err) {
    console.error('[search-index] Failed to fetch products/guides:', err);
  }

  // Fallback to local demo data if Supabase not configured or fetch failed
  if (productItems.length === 0 || guideItems.length === 0) {
    try {
      const { getSeedProductsByCategory, getSeedBuyingGuides } = await import('@/content/seed-products');
      if (productItems.length === 0) {
        const products = getSeedProductsByCategory('buying-guides', 50);
        productItems = products.map((p) => {
          return {
            type: 'product' as const,
            title: p.name,
            subtitle: `${p.manufacturer} ${p.model} · Product`,
            href: `/products/${p.slug}`,
          };
        });
      }
      if (guideItems.length === 0) {
        const guides = getSeedBuyingGuides();
        guideItems = guides.map((g) => {
          return {
            type: 'guide' as const,
            title: g.title,
            subtitle: g.category_slug ? getNiche(g.category_slug)?.label || 'Guide' : 'Guide',
            href: `/guides/${g.slug}`,
          };
        });
      }
    } catch (e) {
      console.error('[search-index] Fallback also failed:', e);
    }
  }

  return NextResponse.json([...nicheItems, ...postItems, ...productItems, ...guideItems]);
}