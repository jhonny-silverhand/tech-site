import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { FollowButton } from './FollowButton';

export async function AuthorBlock({
  authorId,
  authorName,
  currentUserId,
}: {
  authorId: string | null;
  authorName: string;
  currentUserId: string | null;
}) {
  let bio: string | null = null;
  let username: string | null = null;
  let following = false;

  if (isSupabaseConfigured() && authorId) {
    try {
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('bio, username')
        .eq('id', authorId)
        .maybeSingle();
      bio = (profile as { bio?: string | null } | null)?.bio || null;
      username = (profile as { username?: string } | null)?.username || null;
      if (currentUserId) {
        const { data: f } = await supabase
          .from('author_follows')
          .select('id')
          .eq('user_id', currentUserId)
          .eq('author_id', authorId)
          .maybeSingle();
        following = Boolean(f);
      }
    } catch {
      // public fallback
    }
  }

  const initial = authorName.charAt(0).toUpperCase();

  return (
    <section aria-label="About the author" className="rounded-folder border border-line bg-paper p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl font-semibold text-bg">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Written by</p>
          <p className="font-display text-lg font-semibold text-ink">{authorName}</p>
          {bio ? (
            <p className="mt-1 text-sm text-muted">{bio}</p>
          ) : (
            <p className="mt-1 text-sm text-muted">Contributing writer at tech//site.</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {authorId && <FollowButton authorId={authorId} initialFollowing={following} />}
            {username && (
              <a href={`/profile/${username}`} className="text-sm text-accentink hover:underline">
                View profile
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
