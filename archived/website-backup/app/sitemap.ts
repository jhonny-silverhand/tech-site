import { MetadataRoute } from 'next';
import { getPublishedPostsCards } from '@/lib/data';
import { getBuyingGuides } from '@/lib/products';
import { NICHES } from '@/lib/niches';

const BASE_URL = 'https://tech-site.example';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, guides] = await Promise.all([
    getPublishedPostsCards(),
    getBuyingGuides().catch(() => []),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/articles/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.published_at ? new Date(guide.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const nicheEntries: MetadataRoute.Sitemap = NICHES.map((niche) => ({
    url: `${BASE_URL}/niche/${niche.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/shopping`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/pc-builder`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [...staticPages, ...postEntries, ...guideEntries, ...nicheEntries];
}
