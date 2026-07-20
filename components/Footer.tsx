import Link from 'next/link';
import { getSiteStats } from '@/lib/data';
import { timeAgo } from '@/lib/utils';

export async function Footer() {
  const stats = await getSiteStats();

  return (
    <footer className="bg-void text-white mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[12px] text-mutedOnDark">
            © {new Date().getFullYear()} tech/site. Built with Next.js + Supabase.
          </p>
          <p className="mt-1 font-mono text-[11px] text-mutedOnDark/70">
            Knowledge published: {stats.articleCount} article{stats.articleCount === 1 ? '' : 's'} · Updated{' '}
            {timeAgo(stats.lastPublishedAt)}
          </p>
        </div>
        <nav className="flex gap-5 font-mono text-[12px] text-mutedOnDark">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
