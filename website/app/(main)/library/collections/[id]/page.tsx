import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PostCard } from '@/components/PostCard';
import { CollectionActions } from '@/components/CollectionActions';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { CARD_COLUMNS, withCover } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Collection ${id}` };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured()) redirect('/login');
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');

  const { data: col } = await supabase.from('collections').select('id, name').eq('id', id).eq('user_id', auth.user.id).maybeSingle();
  if (!col) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await supabase.from('collection_posts').select(`post:posts(${CARD_COLUMNS})`).eq('collection_id', id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = (((rows || []) as any[]).map((r) => r.post).filter(Boolean).map(withCover));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Library', href: '/library?tab=collections' }, { label: (col as { name: string }).name }]} />
      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{(col as { name: string }).name}</h1>
        <CollectionActions collectionId={id} />
      </div>
      {posts.length === 0 ? (
        <p className="mt-4 text-muted">Empty collection. Add articles via the “Collect” button on any article.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: { id: string }) => (
            <div key={p.id} className="relative">
              <PostCard post={p as never} />
              <div className="absolute right-2 top-2"><CollectionActions collectionId={id} postId={(p as { id: string }).id} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
