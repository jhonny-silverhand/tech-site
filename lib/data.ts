import { cache } from 'react';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { getSeedPosts } from '@/content/seed-posts';
import type { Post } from './types';

// Re-exported so existing server-side imports of isSupabaseConfigured from
// '@/lib/data' keep working. Client components should import it directly
// from '@/lib/supabase/config' instead, since this file also pulls in
// server-only code (fs, via content/seed-posts.ts).
export { isSupabaseConfigured };

async function fetchPublishedFromSupabase(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    // Most likely cause during setup: schema.sql hasn't been run yet.
    // Fall back rather than showing a broken page.
    console.error('[data] Supabase fetch failed, serving local seed content instead:', error.message);
    return getLocalPosts();
  }
  return (data as Post[]) ?? [];
}

let localCache: Post[] | null = null;
function getLocalPosts(): Post[] {
  if (!localCache) localCache = getSeedPosts();
  return [...localCache]
    .filter((p) => p.status === 'published')
    .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''));
}

/** All published posts, newest first. Deduped per-request via React's cache(). */
export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  if (isSupabaseConfigured()) return fetchPublishedFromSupabase();
  return getLocalPosts();
});

export async function getPostsByNiche(niche: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.niche === niche);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.niche === post.niche && p.id !== post.id).slice(0, limit);
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

export async function getNicheCounts(): Promise<Record<string, number>> {
  const posts = await getPublishedPosts();
  const counts: Record<string, number> = {};
  for (const post of posts) {
    counts[post.niche] = (counts[post.niche] ?? 0) + 1;
  }
  return counts;
}

export interface SiteStats {
  articleCount: number;
  lastPublishedAt: string | null;
}

/**
 * Real numbers for the footer's "knowledge published" counter — no faked
 * ticker. Deliberately omits a tool count: the developer-tools section
 * doesn't exist yet (see Guides/03-what-to-edit.md), so there's nothing
 * honest to report there until it's built.
 */
export async function getSiteStats(): Promise<SiteStats> {
  const posts = await getPublishedPosts();
  const lastPublishedAt = posts.reduce<string | null>((latest, post) => {
    if (!post.published_at) return latest;
    if (!latest || post.published_at > latest) return post.published_at;
    return latest;
  }, null);
  return { articleCount: posts.length, lastPublishedAt };
}
