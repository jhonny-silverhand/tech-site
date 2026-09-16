import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { MobileNav } from '@/components/MobileNav';
import { AccountMenu } from '@/components/AccountMenu';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getLibrarySummary, type LibrarySummary } from '@/lib/library';
import { createClient } from '@/lib/supabase/server';

const SIGNED_OUT_SUMMARY: LibrarySummary = { isLoggedIn: false, continueReading: null, bookmarks: [], history: [] };

export async function Header() {
  const summary = isSupabaseConfigured() ? await getLibrarySummary() : SIGNED_OUT_SUMMARY;
  const bookmarkCount = summary.bookmarks.length;

  let user = null;
  if (summary.isLoggedIn && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  }

  return (
    <header className="relative bg-paper text-ink border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center font-display text-[26px] tracking-tight">
            <span>tech</span>
            <span className="flex gap-[3px] mx-[3px] -skew-x-12 animate-slash-blink motion-reduce:animate-none">
              <span className="inline-block w-[4px] h-[0.85em] bg-accent" />
              <span className="inline-block w-[4px] h-[0.85em] bg-accent" />
            </span>
            <span>site</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden md:flex items-center gap-2 font-mono text-[12px]">
              <Link href="/shopping" className="px-3 py-1.5 rounded-folder hover:bg-line/50 transition-colors">
                Shopping
              </Link>
              <Link href="/pc-builder" className="px-3 py-1.5 rounded-folder hover:bg-line/50 transition-colors">
                PC Builder
              </Link>
              <Link href="/write" className="px-3 py-1.5 rounded-folder hover:bg-line/50 transition-colors">
                Write
              </Link>
              {summary.isLoggedIn ? (
                <AccountMenu user={user} bookmarkCount={bookmarkCount} />
              ) : (
                <>
                  <Link href="/login" className="px-3 py-1.5 rounded-folder hover:bg-line/50 transition-colors">
                    Sign in
                  </Link>
                  <Link href="/signup" className="px-3 py-1.5 rounded-folder hover:bg-line/50 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-folder border border-line hover:bg-line/50 transition-colors"
              >
                Admin
              </Link>
            </nav>
            <MobileNav isLoggedIn={summary.isLoggedIn} bookmarkCount={bookmarkCount} user={user} />
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-3 -mt-1 scrollbar-none">
          {NICHES.map((niche) => (
            <Link
              key={niche.slug}
              href={`/niche/${niche.slug}`}
              className="shrink-0 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-line text-muted hover:text-ink hover:border-accent/50 transition-colors"
            >
              /{niche.slug}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
