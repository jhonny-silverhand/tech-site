import Link from 'next/link';
import { getSiteStats } from '@/lib/data';
import { timeAgo } from '@/lib/utils';
import { getVersionInfo } from '@/lib/version';

export async function Footer() {
  const [stats, version] = await Promise.all([getSiteStats(), getVersionInfo()]);

  return (
    <footer className="bg-paper text-white mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[12px] text-mutedOnDark">
            © {new Date().getFullYear()} tech/site. Built with Next.js + Supabase.
          </p>
          <p className="mt-1 font-mono text-[11px] text-mutedOnDark/70">
            Knowledge published: {stats.articleCount} article{stats.articleCount === 1 ? '' : 's'} · Updated{' '}
            {timeAgo(stats.lastPublishedAt)}
          </p>
          {/* Version control */}
          {version && (
            <p className="mt-2 font-mono text-[10px] text-mutedOnDark/50 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                v{version.version}
              </span>
              {version.commit && (
                <a
                  href={`https://github.com/jhonny-silverhand/tech-site/commit/${version.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink/70 transition-colors"
                  title={version.commitMessage}
                >
                  {version.commit}
                </a>
              )}
              {version.branch && <span className="text-mutedOnDark/30">{version.branch}</span>}
            </p>
          )}
          {/* Ko-fi link with Apple-inspired styling */}
          <p className="mt-4 font-mono text-[11px] tracking-wide text-mutedOnDark">
            <a
              href="https://ko-fi.com/whysoserious_omik#setGoalModal"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-ink"
            >
              <span>Buy me a Coffee</span>

              <span className="opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                []~(✿◡‿◡)
              </span>

              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </p>
        </div>
        <nav className="flex gap-5 font-mono text-[12px] text-mutedOnDark">
          <Link href="/about" className="relative group inline-flex transition-colors duration-300 hover:text-ink">
            About
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
          </Link>
          <Link href="/privacy" className="relative group inline-flex transition-colors duration-300 hover:text-ink">
            Privacy
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
          </Link>
          <Link href="/contact" className="relative group inline-flex transition-colors duration-300 hover:text-ink">
            Contact
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
