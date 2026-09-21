import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { MobileNav } from '@/components/MobileNav';
import { AccountMenu } from '@/components/AccountMenu';
import { SearchTrigger } from '@/components/SearchTrigger';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandMark } from '@/components/BrandMark';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getLibrarySummary, type LibrarySummary } from '@/lib/library';
import { createClient } from '@/lib/supabase/server';

const SIGNED_OUT_SUMMARY: LibrarySummary = { isLoggedIn: false, continueReading: null, bookmarks: [], history: [] };

export async function Header() {
  const configured = isSupabaseConfigured();

  // Run library summary and user auth in parallel — both hit Supabase
  const [summary, authUser] = await Promise.all([
    configured ? getLibrarySummary() : Promise.resolve(SIGNED_OUT_SUMMARY),
    configured
      ? createClient().then(s => s.auth.getUser()).then(r => r.data.user)
      : Promise.resolve(null),
  ]);

  const bookmarkCount = summary.bookmarks.length;

  return (
    <header className="relative bg-void text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="tech//site home">
            <BrandMark className="text-xl text-white" />
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden md:flex items-center gap-2 font-mono text-[12px]">
              <Link href="/shopping" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                Shopping
              </Link>
              <Link href="/pc-builder" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                PC Builder
              </Link>
              <Link href="/write" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                Write
              </Link>
              <SearchTrigger />
              <ThemeToggle />
              {summary.isLoggedIn ? (
                <AccountMenu user={authUser} bookmarkCount={bookmarkCount} />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-lg border border-zinc-600 px-3.5 py-1.5 text-[13px] font-medium text-zinc-100 transition-colors hover:border-zinc-300 hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#3d68e0]"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-folder border border-white/20 hover:bg-white/10 transition-colors"
              >
                Admin
              </Link>
            </nav>
            <MobileNav isLoggedIn={summary.isLoggedIn} bookmarkCount={bookmarkCount} user={authUser} />
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-3 -mt-1 scrollbar-none">
          {NICHES.map((niche) => (
            <Link
              key={niche.slug}
              href={`/niche/${niche.slug}`}
              className="shrink-0 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              /{niche.slug}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
