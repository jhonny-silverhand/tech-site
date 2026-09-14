import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getLibrarySummary, getCollections, getReadingQueue, getUserHighlights, getUserPrivateNotes } from '@/lib/library';
import { createClient } from '@/lib/supabase/server';
import { PostCard } from '@/components/PostCard';
import { NewCollectionForm } from '@/components/NewCollectionForm';
import { NicheTag } from '@/components/NicheTag';

export const metadata = { title: 'Your library' };
export const dynamic = 'force-dynamic';

const COMING_SOON = ['Comments', 'Newsletter preferences', 'Reading settings'];

export default async function LibraryPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Your library</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          The library needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </p>
      </div>
    );
  }

  const summary = await getLibrarySummary();
  if (!summary.isLoggedIn) redirect('/login');

  // Fetch user profile for profile link
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle() : { data: null };

  const collections = await getCollections();
  
  // Fetch new library sections
  const [readingQueue, highlights, privateNotes] = user
    ? await Promise.all([
        getReadingQueue(user.id),
        getUserHighlights(user.id),
        getUserPrivateNotes(user.id),
      ])
    : [[], [], []];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink">Your library</h1>
          <p className="mt-2 text-[15px] text-muted">
            Your personal knowledge space — saved articles, collections, and reading history.
          </p>
        </div>
        {profile?.username && (
          <Link
            href={`/profile/${profile.username}`}
            className="font-mono text-[12px] text-accent hover:underline flex items-center gap-1"
          >
            View profile →
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 flex gap-8 font-mono text-[13px]">
        <div>
          <span className="text-2xl font-display text-ink">{summary.bookmarks.length}</span>
          <p className="text-muted mt-0.5">Bookmarks</p>
        </div>
        <div>
          <span className="text-2xl font-display text-ink">{summary.history.length}</span>
          <p className="text-muted mt-0.5">Articles read</p>
        </div>
        <div>
          <span className="text-2xl font-display text-ink">{collections.length}</span>
          <p className="text-muted mt-0.5">Collections</p>
        </div>
        <div>
          <span className="text-2xl font-display text-ink">{readingQueue.length}</span>
          <p className="text-muted mt-0.5">Reading queue</p>
        </div>
      </div>

      {summary.continueReading && (
        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Continue reading</h2>
          <div className="max-w-sm">
            <PostCard post={summary.continueReading} />
          </div>
        </section>
      )}

      {/* Reading Queue */}
      {readingQueue.length > 0 && (
        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Reading queue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {readingQueue.map((item) => (
              item.posts && <PostCard key={item.id} post={item.posts} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">Collections</h2>
          <NewCollectionForm />
        </div>
        {collections.length === 0 ? (
          <p className="font-mono text-[13px] text-muted">
            No collections yet — create one above, or from the Collections button on any article.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {collections.map((collection) => (
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
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Bookmarks</h2>
        {summary.bookmarks.length === 0 ? (
          <p className="font-mono text-[13px] text-muted">
            Nothing saved yet — the Save button is on every article page.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {summary.bookmarks.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Recently read</h2>
        {summary.history.length === 0 ? (
          <p className="font-mono text-[13px] text-muted">Articles you open while signed in will show up here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {summary.history.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Highlights</h2>
          <div className="space-y-3">
            {highlights.slice(0, 10).map((highlight) => (
              <div key={highlight.id} className="rounded-folder border border-line bg-paper p-4">
                <blockquote className="text-[14px] leading-relaxed text-ink border-l-2 border-accent pl-4 italic">
                  {highlight.selected_text}
                </blockquote>
                {highlight.note && (
                  <p className="mt-2 text-[13px] text-muted">
                    <span className="font-mono text-[11px] text-accent">Note:</span>{' '}
                    {highlight.note}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted">
                  <span>{highlight.posts?.title || 'Article'}</span>
                  <span>·</span>
                  <span>{new Date(highlight.created_at).toLocaleDateString()}</span>
                  {highlight.posts?.slug && (
                    <Link
                      href={`/articles/${highlight.posts.slug}`}
                      className="text-accent hover:underline"
                    >
                      Read →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Private Notes */}
      {privateNotes.length > 0 && (
        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Private notes</h2>
          <div className="space-y-3">
            {privateNotes.slice(0, 10).map((note) => (
              <div key={note.id} className="rounded-folder border border-line bg-paper p-4">
                <div className="prose-tech max-w-none text-[14px] text-ink whitespace-pre-wrap">
                  {note.content}
                </div>
                <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted">
                  <span>{note.posts?.title || 'Article'}</span>
                  <span>·</span>
                  <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                  {note.posts?.slug && (
                    <Link
                      href={`/articles/${note.posts.slug}`}
                      className="text-accent hover:underline"
                    >
                      Read →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 pt-10 border-t border-line">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">Coming later</h2>
        <div className="flex flex-wrap gap-2">
          {COMING_SOON.map((label) => (
            <span
              key={label}
              className="font-mono text-[11px] text-muted/60 border border-line rounded-full px-3 py-1"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <p className="mt-10 font-mono text-[12px] text-muted">
        <Link href="/dashboard" className="text-accent hover:underline">
          Writing something?
        </Link>{' '}
        — your published posts live in the dashboard, not here.
      </p>
    </div>
  );
}
