import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/MobileNav';

export function Header() {
  return (
    <header className="relative bg-void text-white">
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
              <Link href="/write" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                Write
              </Link>
              <Link href="/login" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors">
                Sign up
              </Link>
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-folder border border-white/20 hover:bg-white/10 transition-colors"
              >
                Admin
              </Link>
            </nav>
            <ThemeToggle />
            <MobileNav />
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
