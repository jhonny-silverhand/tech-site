import { createClient } from './supabase/server';
import { withTimeout, SUPABASE_CALL_TIMEOUT_MS } from './with-timeout';
import type { Post, Comment, Highlight, PrivateNote, ReadingQueueItem, AuthorFollow, TopicFollow } from './types';

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

export interface Collection {
  id: string;
  name: string;
  created_at: string;
  post_count: number;
}

export interface CollectionWithPosts {
  id: string;
  name: string;
  created_at: string;
  posts: Post[];
}

/** For the /library page's Collections section. */
export async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), SUPABASE_CALL_TIMEOUT_MS, { data: { user: null } } as Awaited<
      ReturnType<typeof supabase.auth.getUser>
    >);
    if (!user) return [];

    const { data } = await supabase
      .from('collections')
      .select('id, name, created_at, collection_posts(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return (data ?? []).map((row) => {
      const countRow = Array.isArray(row.collection_posts) ? row.collection_posts[0] : row.collection_posts;
      return {
        id: row.id,
        name: row.name,
        created_at: row.created_at,
        post_count: (countRow as { count?: number } | null)?.count ?? 0,
      };
    });
  } catch (err) {
    console.error('[library] getCollections failed:', err);
    return [];
  }
}

/** A single collection and its posts, for /library/collections/[id]. Returns
 * null both when the collection doesn't exist and when it belongs to someone
 * else — RLS already prevents the latter, this just makes the not-found
 * case explicit for the page to redirect on. */
export async function getCollectionWithPosts(collectionId: string): Promise<CollectionWithPosts | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), SUPABASE_CALL_TIMEOUT_MS, { data: { user: null } } as Awaited<
      ReturnType<typeof supabase.auth.getUser>
    >);
    if (!user) return null;

    const { data: collection } = await supabase
      .from('collections')
      .select('id, name, created_at')
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!collection) return null;

    const { data: postsData } = await supabase
      .from('collection_posts')
      .select('post:posts(*)')
      .eq('collection_id', collectionId)
      .order('added_at', { ascending: false });

    const posts = (postsData ?? [])
      .map((row) => (Array.isArray(row.post) ? row.post[0] : row.post))
      .filter((post): post is Post => Boolean(post));

    return { ...collection, posts };
  } catch (err) {
    console.error('[library] getCollectionWithPosts failed:', err);
    return null;
  }
}

// ============ Comments ============

export interface CommentWithProfile extends Comment {
  profiles: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export async function getCommentsForPost(postId: string): Promise<CommentWithProfile[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('comments')
      .select('*, profiles!user_id(display_name, username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return (data as CommentWithProfile[]) ?? [];
  } catch (err) {
    console.error('[library] getCommentsForPost failed:', err);
    return [];
  }
}

export async function addComment(postId: string, content: string): Promise<CommentWithProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content })
      .select('*, profiles!user_id(display_name, username, avatar_url)')
      .single();

    if (error) throw error;
    return data as CommentWithProfile;
  } catch (err) {
    console.error('[library] addComment failed:', err);
    return null;
  }
}

export async function updateComment(commentId: string, content: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId);
    return !error;
  } catch (err) {
    console.error('[library] updateComment failed:', err);
    return false;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    return !error;
  } catch (err) {
    console.error('[library] deleteComment failed:', err);
    return false;
  }
}

// ============ Highlights ============

export async function getUserHighlights(userId: string): Promise<Highlight[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('highlights')
      .select('*, posts!post_id(title, slug)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data as (Highlight & { posts: { title: string; slug: string } | null })[]) ?? [];
  } catch (err) {
    console.error('[library] getUserHighlights failed:', err);
    return [];
  }
}

export async function getPostHighlights(postId: string, userId: string): Promise<Highlight[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('highlights')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data as Highlight[]) ?? [];
  } catch (err) {
    console.error('[library] getPostHighlights failed:', err);
    return [];
  }
}

export async function addHighlight(
  postId: string,
  selectedText: string,
  note: string | null,
  locationJson: Record<string, unknown> | null
): Promise<Highlight | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('highlights')
      .insert({
        post_id: postId,
        user_id: user.id,
        selected_text: selectedText,
        note,
        location_json: locationJson,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Highlight;
  } catch (err) {
    console.error('[library] addHighlight failed:', err);
    return null;
  }
}

export async function updateHighlight(highlightId: string, note: string | null): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('highlights')
      .update({ note, updated_at: new Date().toISOString() })
      .eq('id', highlightId);
    return !error;
  } catch (err) {
    console.error('[library] updateHighlight failed:', err);
    return false;
  }
}

export async function deleteHighlight(highlightId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId);
    return !error;
  } catch (err) {
    console.error('[library] deleteHighlight failed:', err);
    return false;
  }
}

// ============ Private Notes ============

export async function getUserPrivateNotes(userId: string): Promise<PrivateNote[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('private_notes')
      .select('*, posts!post_id(title, slug)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data as (PrivateNote & { posts: { title: string; slug: string } | null })[]) ?? [];
  } catch (err) {
    console.error('[library] getUserPrivateNotes failed:', err);
    return [];
  }
}

export async function getPostPrivateNote(postId: string, userId: string): Promise<PrivateNote | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('private_notes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    return data as PrivateNote | null;
  } catch (err) {
    console.error('[library] getPostPrivateNote failed:', err);
    return null;
  }
}

export async function upsertPrivateNote(postId: string, content: string): Promise<PrivateNote | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('private_notes')
      .upsert({
        post_id: postId,
        user_id: user.id,
        content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as PrivateNote;
  } catch (err) {
    console.error('[library] upsertPrivateNote failed:', err);
    return null;
  }
}

export async function deletePrivateNote(postId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('private_notes')
      .delete()
      .eq('post_id', postId);
    return !error;
  } catch (err) {
    console.error('[library] deletePrivateNote failed:', err);
    return false;
  }
}

// ============ Reading Queue ============

export async function getReadingQueue(userId: string): Promise<ReadingQueueItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('reading_queue')
      .select('*, posts!post_id(*)')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    return (data as (ReadingQueueItem & { posts: Post | null })[]) ?? [];
  } catch (err) {
    console.error('[library] getReadingQueue failed:', err);
    return [];
  }
}

export async function addToQueue(postId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('reading_queue')
      .upsert({ user_id: user.id, post_id: postId, added_at: new Date().toISOString() }, { onConflict: 'user_id,post_id' });
    return !error;
  } catch (err) {
    console.error('[library] addToQueue failed:', err);
    return false;
  }
}

export async function removeFromQueue(postId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('reading_queue')
      .delete()
      .eq('post_id', postId);
    return !error;
  } catch (err) {
    console.error('[library] removeFromQueue failed:', err);
    return false;
  }
}

export async function isInQueue(postId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('reading_queue')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle();
    return Boolean(data);
  } catch (err) {
    console.error('[library] isInQueue failed:', err);
    return false;
  }
}

// ============ Author Follows ============

export async function getUserFollowedAuthors(userId: string): Promise<AuthorFollow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('author_follows')
      .select('*, profiles!author_id(display_name, username, avatar_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data as (AuthorFollow & { profiles: { display_name: string | null; username: string | null; avatar_url: string | null } | null })[]) ?? [];
  } catch (err) {
    console.error('[library] getUserFollowedAuthors failed:', err);
    return [];
  }
}

export async function followAuthor(authorId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === authorId) return false;

    const { error } = await supabase
      .from('author_follows')
      .insert({ user_id: user.id, author_id: authorId });
    return !error;
  } catch (err) {
    console.error('[library] followAuthor failed:', err);
    return false;
  }
}

export async function unfollowAuthor(authorId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('author_follows')
      .delete()
      .eq('author_id', authorId);
    return !error;
  } catch (err) {
    console.error('[library] unfollowAuthor failed:', err);
    return false;
  }
}

export async function isFollowingAuthor(authorId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('author_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('author_id', authorId)
      .maybeSingle();
    return Boolean(data);
  } catch (err) {
    console.error('[library] isFollowingAuthor failed:', err);
    return false;
  }
}

// ============ Topic Follows ============

export async function getUserFollowedTopics(userId: string): Promise<TopicFollow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('topic_follows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data as TopicFollow[]) ?? [];
  } catch (err) {
    console.error('[library] getUserFollowedTopics failed:', err);
    return [];
  }
}

export async function followTopic(nicheSlug: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('topic_follows')
      .insert({ user_id: user.id, niche_slug: nicheSlug });
    return !error;
  } catch (err) {
    console.error('[library] followTopic failed:', err);
    return false;
  }
}

export async function unfollowTopic(nicheSlug: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('topic_follows')
      .delete()
      .eq('niche_slug', nicheSlug);
    return !error;
  } catch (err) {
    console.error('[library] unfollowTopic failed:', err);
    return false;
  }
}

export async function isFollowingTopic(nicheSlug: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('topic_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('niche_slug', nicheSlug)
      .maybeSingle();
    return Boolean(data);
  } catch (err) {
    console.error('[library] isFollowingTopic failed:', err);
    return false;
  }
}
