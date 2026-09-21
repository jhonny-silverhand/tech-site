import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { FollowButton } from '@/components/FollowButton';
import { PostCard } from '@/components/PostCard';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { CARD_COLUMNS } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle();
  if (!profile) notFound();
  const p = profile as { id: string; username: string; display_name?: string | null; bio?: string | null };

  const { data: posts } = await supabase.from('posts').select(CARD_COLUMNS).eq('author_id', p.id).eq('status', 'published').order('published_at', { ascending: false }).limit(12);
  const { data: auth } = await supabase.auth.getUser();
  let following = false;
  if (auth.user && auth.user.id !== p.id) {
    const { data: f } = await supabase.from('author_follows').select('id').eq('user_id', auth.user.id).eq('author_id', p.id).maybeSingle();
    following = Boolean(f);
  }
  const { count: followers } = await supabase.from('author_follows').select('id', { count: 'exact', head: true }).eq('author_id', p.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: `@${p.username}` }]} />
      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl font-semibold text-bg">
          {(p.display_name || p.username).charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold">{p.display_name || `@${p.username}`}</h1>
          <p className="font-mono text-sm text-muted">@{p.username} · {followers || 0} followers</p>
          {p.bio && <p className="mt-2 max-w-2xl text-[15px] text-muted">{p.bio}</p>}
          {auth.user?.id !== p.id && (
            <div className="mt-3"><FollowButton authorId={p.id} initialFollowing={following} /></div>
          )}
        </div>
      </div>
      <h2 className="mt-10 font-display text-2xl font-semibold">Articles</h2>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(posts || []).length === 0 ? (
        <p className="mt-3 text-sm text-muted">No published articles yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(posts as any[]).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
