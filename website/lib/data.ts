import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { BuyingGuide, GuideRecommendation, Post, PostCard, Product } from './types';
import { SEED_POSTS } from '@/content/seed-posts';
import { SEED_GUIDES } from '@/content/seed-guides';
import { isSupabaseConfigured } from './supabase/config';
import { createClient, createAdminClient } from './supabase/server';
import { readingTime, slugify } from './utils';
import { nicheColor } from './niches';
import { COVER_POOLS, DEFAULT_COVER_POOL } from './cover-pools';

export const CARD_COLUMNS =
  'id, slug, title, excerpt, niche, author_id, author_name, author_avatar, cover_image_url, published_at, reading_time, seo_title, seo_description, status, featured, tags, niche_color, is_ai_assisted, created_at, updated_at';

/**
 * Every article ships a picture — no exceptions. Explicit covers
 * (upload or pasted URL) win; otherwise a deterministic pick from the
 * curated per-niche pool of freely licensed photos (see lib/cover-pools.ts),
 * keyed by slug, so the same article always gets the same photo.
 */
export function coverFor(slug: string, existing?: string | null, niche?: string | null): string {
  const url = (existing || '').trim();
  if (url) return url;
  const pool = (niche && COVER_POOLS[niche]) || DEFAULT_COVER_POOL;
  if (pool.length > 0) return pool[hashSlug(slug) % pool.length];
  return `https://picsum.photos/seed/${slug}/1200/675`;
}

/** djb2 — deterministic per-slug index into a cover pool. */
function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h * 33) ^ slug.charCodeAt(i)) >>> 0;
  return h;
}

/** Read-time backfill — guarantees every card/post carries a picture, even old DB rows. */
export function withCover<T extends { slug: string; niche: string; cover_image_url: string | null }>(p: T): T {
  const cover = coverFor(p.slug, p.cover_image_url, p.niche);
  return cover === p.cover_image_url ? p : { ...p, cover_image_url: cover };
}

function articlesDir(): string {
  return join(process.cwd(), 'content', 'articles');
}

function readArticleFile(file: string): string {
  const p = join(articlesDir(), file);
  if (existsSync(p)) return readFileSync(p, 'utf8');
  return '';
}

function seedPostsAll(): Post[] {
  const base = new Date('2026-01-05T10:00:00Z').getTime();
  return SEED_POSTS.map((s, i) => {
    const content = readArticleFile(s.file);
    const published = new Date(base + i * 86400000).toISOString();
    return {
      id: `seed-${s.slug}`,
      slug: s.slug,
      title: s.title,
      excerpt: s.excerpt,
      content,
      niche: s.niche,
      cover_image_url: coverFor(s.slug, null, s.niche),
      status: 'published' as const,
      author_id: null,
      author_name: s.author_name,
      author_avatar: null,
      reading_time: readingTime(content || s.excerpt),
      featured: Boolean(s.featured),
      tags: s.tags,
      niche_color: s.niche_color,
      is_ai_assisted: Boolean(s.is_ai_assisted),
      seo_title: s.title,
      seo_description: s.excerpt,
      created_at: published,
      updated_at: published,
      published_at: published,
    };
  }).sort((a, b) => +new Date(b.published_at!) - +new Date(a.published_at!));
}

function toCard(p: Post): PostCard {
  const { content: _content, ...rest } = p;
  return withCover(rest);
}

function useAdmin(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

async function sb() {
  if (!isSupabaseConfigured()) return null;
  try {
    return useAdmin() ? createAdminClient() : await createClient();
  } catch {
    return null;
  }
}

// ---------- Public post queries ----------

export async function getRecentPosts(limit = 12): Promise<PostCard[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data) return (data as PostCard[]).map(withCover);
    } catch {
      // fall through to seed
    }
  }
  return seedPostsAll().slice(0, limit).map(toCard);
}

export async function getPublishedPostsCards(limit = 50): Promise<PostCard[]> {
  return getRecentPosts(limit);
}

export async function getFeaturedPosts(limit = 6): Promise<PostCard[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) return (data as PostCard[]).map(withCover);
    } catch {
      // fall through
    }
  }
  const seeds = seedPostsAll().filter((p) => p.featured);
  const rest = seedPostsAll().filter((p) => !p.featured);
  return [...seeds, ...rest].slice(0, limit).map(toCard);
}

export async function getPostBySlugDirect(slug: string): Promise<Post | null> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
      if (!error && data) return withCover(data as Post);
    } catch {
      // fall through
    }
  }
  return seedPostsAll().find((p) => p.slug === slug) || null;
}

export async function getPostBySlugForEdit(idOrSlug: string): Promise<Post | null> {
  const client = await sb();
  if (client) {
    try {
      let { data } = await client.from('posts').select('*').eq('id', idOrSlug).maybeSingle();
      if (!data) {
        const res = await client.from('posts').select('*').eq('slug', idOrSlug).maybeSingle();
        data = res.data;
      }
      if (data) return withCover(data as Post);
    } catch {
      // fall through
    }
  }
  return seedPostsAll().find((p) => p.slug === idOrSlug || p.id === idOrSlug) || null;
}

export async function getPostsByNiche(niche: string, limit = 24): Promise<PostCard[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .eq('niche', niche)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data) return (data as PostCard[]).map(withCover);
    } catch {
      // fall through
    }
  }
  return seedPostsAll().filter((p) => p.niche === niche).slice(0, limit).map(toCard);
}

export async function getRelatedPosts(post: Post | PostCard, limit = 3): Promise<PostCard[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .eq('niche', post.niche)
        .neq('id', post.id)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) return (data as PostCard[]).map(withCover);
    } catch {
      // fall through
    }
  }
  return seedPostsAll().filter((p) => p.niche === post.niche && p.id !== post.id).slice(0, limit).map(toCard);
}

export async function getAllPostsForSitemap(): Promise<{ slug: string; updated_at: string }[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client.from('posts').select('slug, updated_at').eq('status', 'published');
      if (!error && data) return data;
    } catch {
      // fall through
    }
  }
  return seedPostsAll().map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
}

export async function countPublishedPosts(): Promise<number> {
  const client = await sb();
  if (client) {
    try {
      const { count } = await client.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published');
      if (typeof count === 'number') return count;
    } catch {
      // fall through
    }
  }
  return SEED_POSTS.length;
}

export async function getAllPostsAdmin(): Promise<PostCard[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client.from('posts').select(CARD_COLUMNS).order('created_at', { ascending: false }).limit(200);
      if (!error && data) return (data as PostCard[]).map(withCover);
    } catch {
      // fall through
    }
  }
  return seedPostsAll().map(toCard);
}

// ---------- User-authored posts ----------

export async function createUserPost(input: {
  title: string;
  excerpt: string;
  content: string;
  niche: string;
  author_id: string;
  author_name: string;
  cover_image_url?: string | null;
}): Promise<Post> {
  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const post: Post = {
    id: `local-${Date.now()}`,
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    niche: input.niche,
    cover_image_url: coverFor(slug, input.cover_image_url, input.niche),
    status: 'published',
    author_id: input.author_id,
    author_name: input.author_name,
    author_avatar: null,
    reading_time: readingTime(input.content),
    featured: false,
    tags: [],
    niche_color: nicheColor(input.niche),
    is_ai_assisted: false,
    seo_title: input.title,
    seo_description: input.excerpt,
    created_at: now,
    updated_at: now,
    published_at: now,
  };
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .insert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          niche: post.niche,
          cover_image_url: post.cover_image_url,
          status: 'published',
          author_id: post.author_id,
          author_name: post.author_name,
          reading_time: post.reading_time,
          tags: [],
          niche_color: post.niche_color,
          published_at: now,
        })
        .select('*')
        .single();
      if (!error && data) return data as Post;
    } catch {
      // fall through — return local post
    }
  }
  return post;
}

// ---------- Buying guides ----------

function seedGuidesAll(): BuyingGuide[] {
  const base = new Date('2026-02-01T10:00:00Z').getTime();
  return SEED_GUIDES.map((g, i) => {
    const published = new Date(base + i * 86400000).toISOString();
    return {
      id: `seed-guide-${g.slug}`,
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      content: g.content,
      category_slug: g.category_slug,
      cover_image_url: coverFor(g.slug, null),
      status: 'published',
      author_id: null,
      author_name: g.author_name,
      is_ai_assisted: false,
      seo_title: g.title,
      seo_description: g.excerpt,
      created_at: published,
      updated_at: published,
      published_at: published,
    };
  });
}

export async function getBuyingGuidesForHomepage(limit = 3): Promise<BuyingGuide[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('buying_guides')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) return data as BuyingGuide[];
    } catch {
      // fall through
    }
  }
  return seedGuidesAll().slice(0, limit);
}

export async function getAllBuyingGuides(): Promise<BuyingGuide[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('buying_guides')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) return data as BuyingGuide[];
    } catch {
      // fall through
    }
  }
  return seedGuidesAll();
}

export async function getBuyingGuideBySlug(slug: string): Promise<BuyingGuide | null> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client.from('buying_guides').select('*').eq('slug', slug).maybeSingle();
      if (!error && data) return data as BuyingGuide;
    } catch {
      // fall through
    }
  }
  return seedGuidesAll().find((g) => g.slug === slug) || null;
}

export async function getGuideRecommendations(guideId: string): Promise<GuideRecommendation[]> {
  const client = await sb();
  if (client) {
    try {
      const { data, error } = await client
        .from('buying_guide_recommendations')
        .select('*, product:products(*, specs:product_specs(*), retailers:product_retailers(*, retailer:retailers(*)))')
        .eq('guide_id', guideId)
        .order('display_order');
      if (!error && data) return data as unknown as GuideRecommendation[];
    } catch {
      // fall through
    }
  }
  const guide = seedGuidesAll().find((g) => g.id === guideId);
  if (!guide) return [];
  const seedGuide = SEED_GUIDES.find((g) => `seed-guide-${g.slug}` === guideId);
  if (!seedGuide) return [];
  const { getAllProducts } = await import('./products');
  const all = Object.fromEntries((await getAllProducts()).map((p) => [p.slug, p]));
  return seedGuide.picks.map((p, i) => ({
    id: `seed-rec-${guideId}-${i}`,
    label: p.label,
    reason: p.reason,
    pros: p.pros,
    cons: p.cons,
    display_order: i,
    product: all[p.product_slug] || null,
  }));
}

export async function getBuyingGuidesForSitemap(): Promise<{ slug: string; updated_at: string }[]> {
  return seedGuidesAll().map((g) => ({ slug: g.slug, updated_at: g.updated_at }));
}

// ---------- Personalized homepage ----------

export async function getPersonalizedData(): Promise<{
  continueReading: PostCard[];
  becauseYouRead: PostCard[];
  yourTopics: PostCard[];
  fromFollowedAuthors: PostCard[];
} | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return null;

    const [historyRes, topicsRes, authorsRes, profileRes] = await Promise.all([
      supabase.from('reading_history').select('post_id').eq('user_id', user.id).order('viewed_at', { ascending: false }).limit(4),
      supabase.from('topic_follows').select('niche_slug').eq('user_id', user.id).limit(5),
      supabase.from('author_follows').select('author_id').eq('user_id', user.id).limit(10),
      supabase.from('profiles').select('favorite_niches').eq('id', user.id).maybeSingle(),
    ]);

    const historyIds: string[] = (historyRes.data || []).map((r: { post_id: string }) => r.post_id);
    let continueReading: PostCard[] = [];
    let becauseYouRead: PostCard[] = [];
    if (historyIds.length > 0) {
      const { data: histPosts } = await supabase.from('posts').select(CARD_COLUMNS).in('id', historyIds).eq('status', 'published');
      continueReading = ((histPosts || []) as PostCard[]).map(withCover);
      const nicheOfFirst = (continueReading[0] as PostCard | undefined)?.niche;
      if (nicheOfFirst) {
        const { data: rel } = await supabase
          .from('posts')
          .select(CARD_COLUMNS)
          .eq('status', 'published')
          .eq('niche', nicheOfFirst)
          .not('id', 'in', `(${historyIds.join(',')})`)
          .limit(4);
        becauseYouRead = ((rel || []) as PostCard[]).map(withCover);
      }
    }

    const followedNiches: string[] = [
      ...((topicsRes.data || []).map((r: { niche_slug: string }) => r.niche_slug)),
      ...(((profileRes.data as { favorite_niches?: string[] } | null)?.favorite_niches) || []),
    ].slice(0, 5);
    let yourTopics: PostCard[] = [];
    if (followedNiches.length > 0) {
      const { data } = await supabase
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .in('niche', followedNiches)
        .order('published_at', { ascending: false })
        .limit(4);
      yourTopics = ((data || []) as PostCard[]).map(withCover);
    }

    let fromFollowedAuthors: PostCard[] = [];
    const authorIds: string[] = (authorsRes.data || []).map((r: { author_id: string }) => r.author_id);
    if (authorIds.length > 0) {
      const { data } = await supabase
        .from('posts')
        .select(CARD_COLUMNS)
        .eq('status', 'published')
        .in('author_id', authorIds)
        .order('published_at', { ascending: false })
        .limit(4);
      fromFollowedAuthors = ((data || []) as PostCard[]).map(withCover);
    }

    if (
      continueReading.length === 0 &&
      becauseYouRead.length === 0 &&
      yourTopics.length === 0 &&
      fromFollowedAuthors.length === 0
    ) {
      return null;
    }
    return { continueReading, becauseYouRead, yourTopics, fromFollowedAuthors };
  } catch {
    return null;
  }
}

export async function getShoppingIntelligenceHero(): Promise<{ products: Product[] } | null> {
  try {
    const { getTrendingProductsLive } = await import('./live-products');
    // Never let the AI hero block the homepage: 8s budget, then skip it.
    // The background call still warms the 30-min cache for the next visit.
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const products = await Promise.race([getTrendingProductsLive(), timeout]);
    if (!products || products.length === 0) return null;
    return { products };
  } catch {
    return null;
  }
}

export { seedPostsAll, seedGuidesAll };
