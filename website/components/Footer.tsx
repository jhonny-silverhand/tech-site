import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { countPublishedPosts } from '@/lib/data';

export async function Footer() {
  let count = 0;
  let version = '1.0.0';
  try {
    count = await countPublishedPosts();
  } catch {
    // ignore
  }
  try {
    const { getVersion } = await import('@/lib/version');
    version = getVersion().version;
  } catch {
    // ignore
  }

  return (
    <footer className="border-t border-line bg-paper-2 text-muted dark:bg-void dark:text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark className="text-[34px] leading-none text-ink dark:text-white" />
          <p className="mt-4 max-w-[26ch] font-tagline text-[19px] italic leading-snug text-ink-2 dark:text-zinc-400">
            Practical answers, not filler — across code, devices, and money.
          </p>
          <p className="t-numeric mt-4 font-mono text-[11px] text-faint dark:text-zinc-500">
            {count} articles · v{version}
          </p>
          {/* Ko-fi link — carried over from the previous tech-site footer */}
          <p className="mt-3 font-mono text-[11px] tracking-wide text-faint dark:text-zinc-500">
            <a
              href="https://ko-fi.com/whysoserious_omik#setGoalModal"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-1.5 rounded-sm text-ink-2 transition-colors duration-300 hover:text-ink dark:text-zinc-300 dark:hover:text-white"
            >
              <span>Buy me a Coffee</span>
              <span aria-hidden className="opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                []~(✿◡‿◡)
              </span>
              <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </p>
        </div>
        <nav aria-label="Product">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint dark:text-zinc-600">Product</p>
          <ul className="mt-4 space-y-1 text-[14px]">
            {[
              { href: '/shopping', label: 'Shopping Intelligence' },
              { href: '/pc-builder', label: 'AI PC Builder' },
              { href: '/compare', label: 'Compare Products' },
              { href: '/guides', label: 'Buying Guides' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block rounded-sm py-1 text-ink-2 hover:text-ink dark:text-zinc-300 dark:hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Explore">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint dark:text-zinc-600">Explore</p>
          <ul className="mt-4 space-y-1 text-[14px]">
            {[
              { href: '/library', label: 'Library' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/write', label: 'Write' },
              { href: '/onboarding', label: 'Get Started' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block rounded-sm py-1 text-ink-2 hover:text-ink dark:text-zinc-300 dark:hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint dark:text-zinc-600">Company</p>
          <ul className="mt-4 space-y-1 text-[14px]">
            {[
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/privacy', label: 'Privacy' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block rounded-sm py-1 text-ink-2 hover:text-ink dark:text-zinc-300 dark:hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono text-[11px] text-faint dark:text-zinc-600 sm:px-6">
          <span>© {new Date().getFullYear()} tech//site. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Made with care in India.</span>
            <Link href="/admin/login" className="rounded-sm hover:text-ink dark:hover:text-zinc-300">
              admin login
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
