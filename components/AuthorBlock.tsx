import Image from 'next/image';
import Link from 'next/link';
import { getNiche } from '@/lib/niches';
import { NICHES } from '@/lib/niches';
import { FollowButton } from '@/components/FollowButton';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface AuthorBlockProps {
  authorId: string | null;
  authorName: string;
}

export async function AuthorBlock({ authorId, authorName }: AuthorBlockProps) {
  if (!authorId) {
    // Admin author - no profile link
    return (
      <div className="mt-16 pt-8 border-t border-line">
        <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Written by</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-line flex items-center justify-center">
            <span className="font-display text-2xl text-muted">A</span>
          </div>
          <div>
            <p className="font-display text-xl text-ink">{authorName}</p>
            <p className="font-mono text-[12px] text-muted">tech//site admin</p>
          </div>
        </div>
      </div>
    );
  }

  // Try to fetch user profile
  let profile = null;
  let isFollowing = false;
  
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ data: profileData }, { data: { user } }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', authorId)
        .maybeSingle(),
      supabase.auth.getUser(),
    ]);
    profile = profileData;
    
    if (user && profile) {
      const { data: followData } = await supabase
        .from('author_follows')
        .select('id')
        .eq('user_id', user.id)
        .eq('author_id', authorId)
        .maybeSingle();
      isFollowing = Boolean(followData);
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-line">
      <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Written by</h3>
      <Link
        href={profile?.username ? `/profile/${profile.username}` : '#'}
        className="flex items-center gap-4 group"
      >
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt=""
            width={64}
            height={64}
            className="rounded-full object-cover border-2 border-line transition-colors group-hover:border-accent/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border-2 border-line transition-colors group-hover:border-accent/50">
            <span className="font-display text-2xl text-accent">
              {(profile?.display_name || authorName).charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display text-xl text-ink group-hover:text-accent transition-colors truncate">
              {profile?.display_name || authorName}
            </p>
            {profile?.username && (
              <p className="font-mono text-[12px] text-muted">@{profile.username}</p>
            )}
          </div>
          {profile?.bio && (
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted line-clamp-2">{profile.bio}</p>
          )}
          {!profile?.bio && (
            <p className="mt-2 font-mono text-[12px] text-muted">
              {profile?.favorite_niches && profile.favorite_niches.length > 0
                ? profile.favorite_niches.map((slug: string) => {
                    const niche = NICHES.find(n => n.slug === slug);
                    return niche?.label || slug;
                  }).join(' • ')
                : 'Writer'}
            </p>
          )}
          {profile && (
            <FollowButton
              targetUserId={authorId}
              initialFollowing={isFollowing}
              isSelf={false}
            />
          )}
        </div>
      </Link>
    </div>
  );
}