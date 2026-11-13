import type { SearchIndexItem } from './types';

/** Client-side helpers for the Article Roulette ("Surprise me") feature.
 *
 * Reuses the public /api/search-index payload (already fetched by the
 * command palette) and caches it per page load. */

let indexCache: SearchIndexItem[] | null = null;

export async function fetchArticleIndex(): Promise<SearchIndexItem[]> {
  if (indexCache) return indexCache;
  try {
    const res = await fetch('/api/search-index');
    if (res.ok) {
      indexCache = (await res.json()) as SearchIndexItem[];
      return indexCache;
    }
  } catch {
    // fall through — empty index
  }
  indexCache = [];
  return indexCache;
}

/** Uniform random published article (never the page you're already on). */
export async function pickRandomArticle(excludeUrl?: string): Promise<SearchIndexItem | null> {
  const items = (await fetchArticleIndex()).filter((i) => i.type === 'post' && i.url !== excludeUrl);
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}
