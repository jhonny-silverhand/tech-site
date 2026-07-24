import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getLibrarySummary } from '@/lib/library';
import { PostCard } from '@/components/PostCard';

export const metadata = { title: 'Your library' };
export const dynamic = 'force-dynamic';

const COMING_SOON = ['Collections', 'Highlights', 'Comments', 'Newsletter preferences', 'Reading settings'];

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

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">Your library</h1>
      <p className="mt-2 text-[15px] text-muted">
        Not a profile — just where tech//site remembers what you&apos;re reading.
      </p>

      {/* Honest stats only — no estimated "reading time," since nothing
          actually measures time spent, only what's been opened/saved. */}
      <div className="mt-8 flex gap-8 font-mono text-[13px]">
        <div>
          <span className="text-2xl font-display text-ink">{summary.bookmarks.length}</span>
          <p className="text-muted mt-0.5">Bookmarks</p>
        </div>
        <div>
          <span className="text-2xl font-display text-ink">{summary.history.length}</span>
          <p className="text-muted mt-0.5">Articles read</p>
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
