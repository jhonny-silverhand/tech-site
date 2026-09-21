import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCollectionWithPosts } from '@/lib/library';
import { createClient } from '@/lib/supabase/server';
import { CollectionActions } from '@/components/CollectionActions';
import { PostCard } from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    redirect('/library');
  }

  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const collection = await getCollectionWithPosts(id);
  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
        <Link href="/library" className="hover:text-ink transition-colors">
          Your library
        </Link>
      </p>
      <CollectionActions collectionId={collection.id} initialName={collection.name} />

      {collection.posts.length === 0 ? (
        <p className="mt-10 font-mono text-[13px] text-muted">
          Nothing in here yet — use the Collections button on any article to add it.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {collection.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
