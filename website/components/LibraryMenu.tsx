import Link from 'next/link';
import { Bookmark, History, ListVideo, FolderOpen, Settings } from 'lucide-react';

const ITEMS = [
  { href: '/library', label: 'Bookmarks', icon: Bookmark },
  { href: '/library?tab=history', label: 'History', icon: History },
  { href: '/library?tab=queue', label: 'Reading Queue', icon: ListVideo },
  { href: '/library?tab=collections', label: 'Collections', icon: FolderOpen },
  { href: '/library/settings', label: 'Settings', icon: Settings },
];

export function LibraryMenu({ active }: { active?: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Library">
      {ITEMS.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={active === i.label ? 'page' : undefined}
          className={`inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-md border px-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            active === i.label
              ? 'border-linestrong bg-sunken text-ink shadow-card'
              : 'border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
          }`}
        >
          <i.icon size={15} aria-hidden />
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
