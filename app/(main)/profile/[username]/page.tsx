import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { formatDate } from '@/lib/utils';
import { PostCard } from '@/components/PostCard';
import { NicheTag } from '@/components/NicheTag';
import { FollowButton } from '@/components/FollowButton';
import { TopicFollowButton } from '@/components/TopicFollowButton';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  if (!isSupabaseConfigured()) return { title: 'Profile' };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio')
    .eq('username', username)
    .maybeSingle();

  return {
    title: profile?.display_name || username,
    description: profile?.bio || `tech//site profile for @${username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Profile</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Profiles need a connected Supabase project. Follow Guides/01-database-setup.md, then this page will work.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', profile.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const userPosts = (posts as import('@/lib/types').Post[]) ?? [];

  // Fetch public collections
  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, created_at, collection_posts(count)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  const publicCollections = (collections ?? []).map((row) => {
    const countRow = Array.isArray(row.collection_posts) ? row.collection_posts[0] : row.collection_posts;
    return {
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      post_count: (countRow as { count?: number } | null)?.count ?? 0,
    };
  });

  // Fetch followed authors
  const { data: followedAuthors } = await supabase
    .from('author_follows')
    .select('author:profiles!author_id(id, display_name, username, avatar_url)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch followed topics
  const { data: followedTopics } = await supabase
    .from('topic_follows')
    .select('niche_slug')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  // Check if current user is following this author
  let isFollowing = false;
  let isSelf = false;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    isSelf = user.id === profile.id;
    if (!isSelf) {
      const { data: followData } = await supabase
        .from('author_follows')
        .select('id')
        .eq('user_id', user.id)
        .eq('author_id', profile.id)
        .maybeSingle();
      isFollowing = Boolean(followData);
    }
  }

  const favoriteNiches = (profile.favorite_niches as string[]) || [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      {/* Profile Hero */}
      <section className="text-center">
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt=""
            width={96}
            height={96}
            className="mx-auto mb-4 rounded-full object-cover border-2 border-line"
            priority
          />
        )}
        {!profile.avatar_url && (
          <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-line flex items-center justify-center">
            <span className="font-display text-3xl text-muted">{profile.display_name?.charAt(0) || username.charAt(0)}</span>
          </div>
        )}

        <h1 className="font-display text-4xl sm:text-5xl leading-tight text-ink">
          {profile.display_name || username}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-muted">@{profile.username}</p>

        {profile.bio && (
          <p className="mt-4 max-w-xl mx-auto text-[16px] leading-relaxed text-muted">
            {profile.bio}
          </p>
        )}

        {/* Follow Button */}
        {!isSelf && (
          <FollowButton
            targetUserId={profile.id}
            initialFollowing={isFollowing}
            isSelf={isSelf}
          />
        )}

        {/* Interests */}
        {favoriteNiches.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {favoriteNiches.map((slug) => (
              <NicheTag key={slug} slug={slug} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 font-mono text-[13px]">
          <div className="text-center">
            <span className="block font-display text-3xl text-ink">{userPosts.length}</span>
            <span className="text-muted">Articles</span>
          </div>
          <div className="text-center">
            <span className="block font-display text-3xl text-ink">{publicCollections.length}</span>
            <span className="text-muted">Collections</span>
          </div>
          <div className="text-center">
            <span className="block font-display text-3xl text-ink">{followedAuthors?.length || 0}</span>
            <span className="text-muted">Following</span>
          </div>
        </div>

        {/* Links */}
        {(profile.website || profile.twitter || profile.github || profile.linkedin) && (
          <div className="mt-6 flex flex-wrap justify-center gap-4 font-mono text-[12px]">
            {profile.website && (
              <Link
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                Website
              </Link>
            )}
            {profile.twitter && (
              <Link
                href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                Twitter
              </Link>
            )}
            {profile.github && (
              <Link
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                GitHub
              </Link>
            )}
            {profile.linkedin && (
              <Link
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
              >
                LinkedIn
              </Link>
            )}
          </div>
        )}

        <p className="mt-8 font-mono text-[11px] text-muted/70">
          Joined {formatDate(profile.created_at)}
        </p>
      </section>

      {/* Following Topics */}
      {followedTopics && followedTopics.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Following topics</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {followedTopics.map((topic) => (
              <TopicFollowButton key={topic.niche_slug} nicheSlug={topic.niche_slug} initialFollowing={true} />
            ))}
          </div>
        </section>
      )}

      {/* Following Authors */}
      {followedAuthors && followedAuthors.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Following authors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedAuthors.map((follow) => {
              // Supabase nested select returns array even for to-one
              const author = Array.isArray(follow.author) ? follow.author[0] : follow.author;
              if (!author) return null;
              return (
                <Link
                  key={author.id}
                  href={`/profile/${author.username}`}
                  className="rounded-folder border border-line bg-paper p-4 hover:border-ink/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {author.avatar_url ? (
                      <Image src={author.avatar_url} alt="" width={40} height={40} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="font-display text-lg text-accent">{author.display_name?.charAt(0) || author.username?.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-display text-[15px] text-ink">{author.display_name || author.username}</p>
                      <p className="font-mono text-[11px] text-muted">@{author.username}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Public Collections */}
      {publicCollections.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Public collections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {publicCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/library/collections/${collection.id}`}
                className="rounded-folder border border-line bg-paper p-4 hover:border-ink/30 transition-colors"
              >
                <p className="font-display text-[17px] text-ink truncate">{collection.name}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  {collection.post_count} {collection.post_count === 1 ? 'article' : 'articles'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles Section */}
      <section className="mt-16 pt-10 border-t border-line">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">Published articles</h2>
        </div>

        {userPosts.length === 0 ? (
          <p className="font-mono text-[13px] text-muted text-center py-12">
            No published articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}