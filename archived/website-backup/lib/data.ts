import { cache } from 'react';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { getSeedPosts } from '@/content/seed-posts';
import { withTimeout, SUPABASE_CALL_TIMEOUT_MS } from './with-timeout';
import type { Post } from './types';

// Re-exported so existing server-side imports of isSupabaseConfigured from
// '@/lib/data' keep working. Client components should import it directly
// from '@/lib/supabase/config' instead, since this file also pulls in
// server-only code (fs, via content/seed-posts.ts).
export { isSupabaseConfigured };

interface PostsQueryResult {
  data: Post[] | null;
  error: { message: string } | null;
}

// Columns needed for article cards (NO full content body — saves memory + transfer).
// Must match the real Supabase posts schema exactly: a single unknown column
// fails the whole query (PostgREST), silently falling back to seed data.
const CARD_COLUMNS = 'id, slug, title, excerpt, niche, author_id, author_name, cover_image_url, published_at, is_ai_assisted, seo_title, seo_description, status, created_at, updated_at';

async function fetchPublishedFromSupabase(): Promise<Post[]> {
  const supabase = await createClient();
  const queryPromise = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false }) as unknown as Promise<PostsQueryResult>;

  const { data, error } = await withTimeout(queryPromise, SUPABASE_CALL_TIMEOUT_MS, {
    data: null,
    error: { message: `Supabase call did not respond within ${SUPABASE_CALL_TIMEOUT_MS}ms` },
  });

  if (error) {
    console.error('[data] Supabase fetch failed, serving local seed content instead:', error.message);
    return getLocalPosts();
  }
  return data ?? [];
}

// Lightweight fetch — only card-relevant columns, NO content body
async function fetchCardsFromSupabase(): Promise<Post[]> {
  const supabase = await createClient();
  const queryPromise = supabase
    .from('posts')
    .select(CARD_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false }) as unknown as Promise<PostsQueryResult>;

  const { data, error } = await withTimeout(queryPromise, SUPABASE_CALL_TIMEOUT_MS, {
    data: null,
    error: { message: `Supabase call did not respond within ${SUPABASE_CALL_TIMEOUT_MS}ms` },
  });

  if (error) {
    console.error('[data] Supabase cards fetch failed, falling back to seed:', error.message);
    return getLocalPosts();
  }
  // Cast through unknown — cards intentionally omit the heavy `content` body
  return (data as unknown as Post[]) ?? [];
}

let localCache: Post[] | null = null;
function getLocalPosts(): Post[] {
  if (!localCache) localCache = getSeedPosts();
  return [...localCache]
    .filter((p) => p.status === 'published')
    .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''));
}

/** All published posts (with content), newest first. Use for article pages that need full body. */
export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  if (isSupabaseConfigured()) return fetchPublishedFromSupabase();
  return getLocalPosts();
});

/** Lightweight published posts (NO content body) for cards/lists. Saves memory + bandwidth. */
export const getPublishedPostsCards = cache(async (): Promise<Post[]> => {
  if (isSupabaseConfigured()) return fetchCardsFromSupabase();
  return getLocalPosts();
});

export async function getPostsByNiche(niche: string): Promise<Post[]> {
  const posts = await getPublishedPostsCards();
  return posts.filter((p) => p.niche === niche);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Try lightweight first for metadata; fall back to full if needed
  const cards = await getPublishedPostsCards();
  const card = cards.find((p) => p.slug === slug);
  if (!card) return null;
  // If we need content (article page), fetch full version
  const full = await getPublishedPosts();
  return full.find((p) => p.slug === slug) ?? card;
}

/** Get a single post by slug without loading all posts — direct DB query */
export async function getPostBySlugDirect(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    const posts = getLocalPosts();
    return posts.find((p) => p.slug === slug) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return (data as Post) ?? null;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPublishedPostsCards();
  return posts.filter((p) => p.niche === post.niche && p.id !== post.id).slice(0, limit);
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  const posts = await getPublishedPostsCards();
  return posts.slice(0, limit);
}

export async function getPostsByAuthor(authorId: string, limit = 20): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select(CARD_COLUMNS)
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data as unknown as Post[]) ?? [];
}

export async function getNicheCounts(): Promise<Record<string, number>> {
  const posts = await getPublishedPostsCards();
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
  const posts = await getPublishedPostsCards();
  const lastPublishedAt = posts.reduce<string | null>((latest, post) => {
    if (!post.published_at) return latest;
    if (!latest || post.published_at > latest) return post.published_at;
    return latest;
  }, null);
  return { articleCount: posts.length, lastPublishedAt };
}
