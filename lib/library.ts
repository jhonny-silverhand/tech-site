import { createClient } from './supabase/server';
import { withTimeout, SUPABASE_CALL_TIMEOUT_MS } from './with-timeout';
import type { Post } from './types';

const SIGNED_OUT: LibrarySummary = { isLoggedIn: false, continueReading: null, bookmarks: [], history: [] };

export interface LibrarySummary {
  isLoggedIn: boolean;
  continueReading: Post | null;
  bookmarks: Post[];
  history: Post[];
}

/**
 * Everything the header and the /library page need, fetched together
 * since they're always needed at the same time — one auth check, not one
 * per caller. Returns isLoggedIn: false with empty lists for a signed-out
 * visitor (or if anything here fails) rather than throwing, so callers —
 * including Header, which runs this on every single page — can render
 * unconditionally without risking the whole site going down over it.
 */
export async function getLibrarySummary(): Promise<LibrarySummary> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), SUPABASE_CALL_TIMEOUT_MS, { data: { user: null } } as Awaited<
      ReturnType<typeof supabase.auth.getUser>
    >);

    if (!user) return SIGNED_OUT;

    const [bookmarksResult, historyResult] = await Promise.all([
      supabase
        .from('bookmarks')
        .select('post:posts(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('reading_history')
        .select('post:posts(*)')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20),
    ]);

    // Supabase's nested-select shape is an array even for a to-one relation
    // — flatten it, and drop any row whose post was since deleted (the
    // foreign key is ON DELETE CASCADE, so this is mostly defensive).
    const bookmarks = (bookmarksResult.data ?? [])
      .map((row) => (Array.isArray(row.post) ? row.post[0] : row.post))
      .filter((post): post is Post => Boolean(post));

    const history = (historyResult.data ?? [])
      .map((row) => (Array.isArray(row.post) ? row.post[0] : row.post))
      .filter((post): post is Post => Boolean(post));

    return {
      isLoggedIn: true,
      continueReading: history[0] ?? null,
      bookmarks,
      history,
    };
  } catch (err) {
    console.error('[library] getLibrarySummary failed, treating as signed out:', err);
    return SIGNED_OUT;
  }
}

/** For the initial state of the Save/Bookmark button on an article page. */
export async function isBookmarked(postId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), SUPABASE_CALL_TIMEOUT_MS, { data: { user: null } } as Awaited<
      ReturnType<typeof supabase.auth.getUser>
    >);
    if (!user) return false;

    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle();

    return Boolean(data);
  } catch (err) {
    // A bookmark-status check failing should never be the reason an
    // article page fails to load — worst case, the button just starts
    // in the "not saved" state.
    console.error('[library] isBookmarked failed:', err);
    return false;
  }
}

/**
 * Records (or refreshes) a view for the current signed-in user. Silently
 * does nothing for signed-out visitors — reading history is explicitly a
 * signed-in feature, not anonymous tracking. Called from the article
 * page; wrapped so a database hiccup here can never break the page.
 */
export async function recordView(postId: string): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), SUPABASE_CALL_TIMEOUT_MS, { data: { user: null } } as Awaited<
      ReturnType<typeof supabase.auth.getUser>
    >);
    if (!user) return;

    await supabase
      .from('reading_history')
      .upsert(
        { user_id: user.id, post_id: postId, viewed_at: new Date().toISOString() },
        { onConflict: 'user_id,post_id' }
      );
  } catch (err) {
    console.error('[library] recordView failed:', err);
  }
}
