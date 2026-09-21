import Image from 'next/image';
import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { FollowButton } from '@/components/FollowButton';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface AuthorBlockProps {
  authorId: string | null;
  authorName: string;
  currentUserId?: string | null;
}

/**
 * Medium-style "Written by" card at the end of every article.
 * Rounded card with avatar, name, bio, follow button, and profile link.
 */
export async function AuthorBlock({ authorId, authorName, currentUserId }: AuthorBlockProps) {
  const initial = authorName.charAt(0).toUpperCase();

  if (!authorId) {
    // Admin author - no profile link
    return (
      <section aria-label="About the author" className="rounded-folder border border-line bg-paper p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-void font-display text-xl font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Written by</p>
            <p className="font-display text-lg font-semibold text-ink">{authorName}</p>
            <p className="mt-1 text-sm text-muted">tech//site admin.</p>
          </div>
        </div>
      </section>
    );
  }

  // Try to fetch user profile
  let profile: {
    display_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    favorite_niches?: string[] | null;
  } | null = null;
  let isFollowing = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // Only select columns we actually display
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url, bio, favorite_niches')
        .eq('id', authorId)
        .maybeSingle();
      profile = profileData;

      // Use passed currentUserId if available, otherwise fetch
      let userId = currentUserId;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      if (userId && profile) {
        const { data: followData } = await supabase
          .from('author_follows')
          .select('id')
          .eq('user_id', userId)
          .eq('author_id', authorId)
          .maybeSingle();
        isFollowing = Boolean(followData);
      }
    } catch {
      // public fallback
    }
  }

  const displayName = profile?.display_name || authorName;
  const bio =
    profile?.bio ||
    (profile?.favorite_niches && profile.favorite_niches.length > 0
      ? profile.favorite_niches
          .map((slug: string) => NICHES.find((n) => n.slug === slug)?.label || slug)
          .join(' • ')
      : 'Contributing writer at tech//site.');

  return (
    <section aria-label="About the author" className="rounded-folder border border-line bg-paper p-5">
      <div className="flex items-start gap-4">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-void font-display text-xl font-semibold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Written by</p>
          <p className="font-display text-lg font-semibold text-ink">{displayName}</p>
          <p className="mt-1 text-sm text-muted">{bio}</p>
          <div className="mt-3 flex items-center gap-3">
            <FollowButton
              targetUserId={authorId}
              initialFollowing={isFollowing}
              isSelf={false}
            />
            {profile?.username && (
              <Link href={`/profile/${profile.username}`} className="text-sm text-accent hover:underline">
                View profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
