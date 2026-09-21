import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Fire-and-forget reading-history insert for the current user. Never throws. */
export async function recordViewIfAuthed(postId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;
    // Fire and forget — don't block rendering.
    Promise.resolve(
      supabase
        .from('reading_history')
        .upsert({ user_id: user.id, post_id: postId, viewed_at: new Date().toISOString() }, { onConflict: 'user_id,post_id' })
    ).catch(() => {});
  } catch {
    // never block rendering
  }
}
