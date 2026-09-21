import type { MetadataRoute } from 'next';
import { getAllPostsForSitemap, getBuyingGuidesForSitemap } from '@/lib/data';
import { NICHES } from '@/lib/niches';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-site.example';
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shopping`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/pc-builder`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
  for (const n of NICHES) {
    entries.push({
      url: `${base}/niche/${n.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }
  try {
    const [posts, guides] = await Promise.all([
      getAllPostsForSitemap(),
      getBuyingGuidesForSitemap(),
    ]);
    for (const p of posts) {
      entries.push({
        url: `${base}/articles/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
    for (const g of guides) {
      entries.push({
        url: `${base}/guides/${g.slug}`,
        lastModified: g.updated_at ? new Date(g.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch {
    // seed fallback still yields static entries
  }
  return entries;
}
