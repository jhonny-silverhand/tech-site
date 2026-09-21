import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { MobileNav } from './MobileNav';
import { AccountMenu } from './AccountMenu';
import { SearchTrigger } from './SearchTrigger';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const PRIMARY_LINKS = [
  { href: '/shopping', label: 'Shopping' },
  { href: '/pc-builder', label: 'PC Builder' },
  { href: '/guides', label: 'Guides' },
  { href: '/compare', label: 'Compare' },
  { href: '/write', label: 'Write' },
];

export async function Header() {
  let email: string | null = null;
  let username: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email || null;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .maybeSingle();
        username = (profile as { username?: string } | null)?.username || null;
      }
    } catch {
      // public header without auth
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 text-ink backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[60px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="tech//site home"
            className="font-pixel flex flex-none items-baseline gap-1 rounded-sm text-[19px]"
          >
            <span>tech</span>
            <span className="animate-slash-blink text-accent" aria-hidden>
              //
            </span>
            <span>site</span>
          </Link>

          <div className="flex flex-none items-center gap-1.5">
            <nav aria-label="Primary" className="hidden items-center gap-0.5 text-sm md:flex">
              {PRIMARY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-2.5 py-1.5 text-muted hover:bg-paper-2 hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <SearchTrigger />
            <ThemeToggle />
            <span className="hidden md:inline">
              <AccountMenu email={email} username={username} />
            </span>
            <span className="md:hidden">
              <MobileNav email={email} />
            </span>
          </div>
        </div>

        <nav aria-label="Topics" className="no-scrollbar -mt-1 flex gap-1.5 overflow-x-auto pb-3">
          {NICHES.map((n) => (
            <Link
              key={n.slug}
              href={`/niche/${n.slug}`}
              className="inline-flex flex-none items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="h-[6px] w-[6px] flex-none rounded-full" style={{ background: n.color }} aria-hidden />
              /{n.slug}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
