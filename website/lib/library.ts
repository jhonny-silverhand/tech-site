import { createClient } from './supabase/client';
import { isSupabaseConfigured } from './supabase/config';

function guard() {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');
}

// All functions are client-side (called from Client Components with an authed session).

export async function toggleBookmark(postId: string, bookmarked: boolean): Promise<void> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not signed in');
  if (bookmarked) {
    const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
    if (error) throw error;
  }
}

export async function toggleQueue(postId: string, inQueue: boolean): Promise<void> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not signed in');
  if (inQueue) {
    const { error } = await supabase.from('reading_queue').delete().eq('user_id', user.id).eq('post_id', postId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('reading_queue').insert({ user_id: user.id, post_id: postId });
    if (error) throw error;
  }
}

export async function recordView(postId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;
    await supabase.from('reading_history').upsert(
      { user_id: user.id, post_id: postId, viewed_at: new Date().toISOString() },
      { onConflict: 'user_id,post_id' }
    );
  } catch {
    // fire-and-forget
  }
}

export async function toggleFollowAuthor(authorId: string, following: boolean): Promise<void> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not signed in');
  if (following) {
    const { error } = await supabase.from('author_follows').delete().eq('user_id', user.id).eq('author_id', authorId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('author_follows').insert({ user_id: user.id, author_id: authorId });
    if (error) throw error;
  }
}

export async function toggleFollowTopic(nicheSlug: string, following: boolean): Promise<void> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not signed in');
  if (following) {
    const { error } = await supabase.from('topic_follows').delete().eq('user_id', user.id).eq('niche_slug', nicheSlug);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('topic_follows').insert({ user_id: user.id, niche_slug: nicheSlug });
    if (error) throw error;
  }
}

export async function toggleWishlist(productId: string, wished: boolean): Promise<void> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not signed in');
  if (wished) {
    const { error } = await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId });
    if (error) throw error;
  }
}

export async function getWishlistIds(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [];
    const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', auth.user.id);
    return (data || []).map((r: { product_id: string }) => r.product_id);
  } catch {
    return [];
  }
}

export async function createCollection(name: string): Promise<{ id: string; name: string }> {
  guard();
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('collections')
    .insert({ user_id: auth.user.id, name })
    .select('id, name')
    .single();
  if (error) throw error;
  return data;
}

export async function addToCollection(collectionId: string, postId: string): Promise<void> {
  guard();
  const supabase = createClient();
  const { error } = await supabase.from('collection_posts').insert({ collection_id: collectionId, post_id: postId });
  if (error) throw error;
}

export async function getMyCollections(): Promise<{ id: string; name: string }[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [];
    const { data } = await supabase.from('collections').select('id, name').eq('user_id', auth.user.id).order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}
