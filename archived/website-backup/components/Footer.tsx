import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { getSiteStats } from '@/lib/data';

/**
 * Merged footer: improved-UI 3-column layout (brand + Explore + Company)
 * with live article count and Ko-fi link. Version info lives on /about.
 */
export async function Footer() {
  const stats = await getSiteStats();

  return (
    <footer className="bg-void text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandMark className="text-[28px] leading-none text-white" />
          <p className="mt-4 max-w-xs font-tagline text-xl italic leading-snug text-zinc-400">
            Practical answers, not filler — across code, devices, and money.
          </p>
          <p className="mt-4 font-mono text-[13px] tracking-wide text-zinc-500">
            {stats.articleCount} article{stats.articleCount === 1 ? '' : 's'}
          </p>
          {/* Ko-fi link (preserved from our footer) */}
          <p className="mt-4 font-mono text-[11px] tracking-wide text-zinc-500">
            <a
              href="https://ko-fi.com/whysoserious_omik#setGoalModal"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-white"
            >
              <span>Buy me a Coffee</span>
              <span className="opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                []~(✿◡‿◡)
              </span>
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </p>
        </div>
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-zinc-500">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/shopping" className="text-zinc-300 transition-colors hover:text-white">Shopping Intelligence</Link></li>
            <li><Link href="/pc-builder" className="text-zinc-300 transition-colors hover:text-white">AI PC Builder</Link></li>
            <li><Link href="/compare" className="text-zinc-300 transition-colors hover:text-white">Compare Products</Link></li>
            <li><Link href="/guides" className="text-zinc-300 transition-colors hover:text-white">Buying Guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-zinc-500">Company</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/about" className="text-zinc-300 transition-colors hover:text-white">About</Link></li>
            <li><Link href="/contact" className="text-zinc-300 transition-colors hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="text-zinc-300 transition-colors hover:text-white">Privacy</Link></li>
            <li><Link href="/onboarding" className="text-zinc-300 transition-colors hover:text-white">Get Started</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono text-xs text-zinc-600 sm:px-6">
          <span>© {new Date().getFullYear()} tech//site. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Made with care in India.</span>
            <Link href="/admin/login" className="transition-colors hover:text-zinc-300">
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
