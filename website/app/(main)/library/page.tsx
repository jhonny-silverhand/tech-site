import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LibraryMenu } from '@/components/LibraryMenu';
import { NewCollectionForm } from '@/components/NewCollectionForm';
import { CollectionActions } from '@/components/CollectionActions';
import { PostCard } from '@/components/PostCard';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { CARD_COLUMNS, withCover } from '@/lib/data';

export const metadata = { title: 'Library' };

async function getLibraryData(tab: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');
  const uid = auth.user.id;

  const [bm, hist, queue, cols] = await Promise.all([
    supabase.from('bookmarks').select(`created_at, post:posts(${CARD_COLUMNS})`).eq('user_id', uid).order('created_at', { ascending: false }).limit(30),
    supabase.from('reading_history').select(`viewed_at, post:posts(${CARD_COLUMNS})`).eq('user_id', uid).order('viewed_at', { ascending: false }).limit(30),
    supabase.from('reading_queue').select(`added_at, post:posts(${CARD_COLUMNS})`).eq('user_id', uid).order('added_at', { ascending: false }).limit(30),
    supabase.from('collections').select('id, name, created_at').eq('user_id', uid).order('created_at', { ascending: false }),
  ]);

  async function enrichCollections() {
    const list = (cols.data || []) as { id: string; name: string }[];
    const out: { id: string; name: string; posts: { id: string; slug: string; title: string }[]; count: number }[] = [];
    for (const c of list) {
      const { data: rows } = await supabase.from('collection_posts').select('post:posts(id, slug, title)').eq('collection_id', c.id).limit(20);
      const posts = ((rows || []) as unknown as { post: { id: string; slug: string; title: string } | { id: string; slug: string; title: string }[] | null }[])
        .map((r) => r.post)
        .flat()
        .filter(Boolean) as { id: string; slug: string; title: string }[];
      out.push({ ...c, posts, count: posts.length });
    }
    return out;
  }

  void tab;
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bookmarks: (((bm.data || []) as any[]).map((r) => r.post).filter(Boolean).map(withCover)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history: (((hist.data || []) as any[]).map((r) => r.post).filter(Boolean).map(withCover)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queue: (((queue.data || []) as any[]).map((r) => r.post).filter(Boolean).map(withCover)),
    collections: await enrichCollections(),
  };
}

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const activeTab = tab || 'bookmarks';

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Library</h1>
        <p className="mt-2 text-muted">Your library (bookmarks, history, queue, collections) activates once Supabase keys are set in .env.local. Seed content still works for reading.</p>
      </div>
    );
  }

  const data = await getLibraryData(activeTab);
  const labels: Record<string, string> = { bookmarks: 'Bookmarks', history: 'History', queue: 'Reading Queue', collections: 'Collections' };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Library' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">Your library</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
        <LibraryMenu active={labels[activeTab]} />
        <div>
          {activeTab === 'collections' ? (
            <div>
              <NewCollectionForm />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {data.collections.map((c) => (
                  <div key={c.id} className="rounded-folder border border-line bg-paper p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <a href={`/library/collections/${c.id}`} className="font-display text-lg font-semibold hover:text-accentink">{c.name}</a>
                        <p className="font-mono text-xs text-muted">{c.count} articles</p>
                      </div>
                      <CollectionActions collectionId={c.id} />
                    </div>
                    <ul className="mt-2 space-y-1 text-sm">
                      {c.posts.slice(0, 5).map((p) => (
                        <li key={p.id}><a href={`/articles/${p.slug}`} className="text-accentink hover:underline">{p.title}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
                {data.collections.length === 0 && <p className="text-sm text-muted">No collections yet — create one above.</p>}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(activeTab === 'bookmarks' ? data.bookmarks : activeTab === 'history' ? data.history : data.queue).map((p: { id: string; slug: string }) => (
                <PostCard key={p.id} post={p as never} />
              ))}
              {(activeTab === 'bookmarks' ? data.bookmarks : activeTab === 'history' ? data.history : data.queue).length === 0 && (
                <p className="text-sm text-muted">Nothing here yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
