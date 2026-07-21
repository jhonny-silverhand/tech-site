'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts/new', label: 'New post' },
  { href: '/admin/categories', label: 'Niches' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-full md:w-52 shrink-0">
      <nav className="flex md:flex-col gap-1 font-mono text-[13px]">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-3 py-2 rounded-folder transition-colors',
              pathname === link.href ? 'bg-void text-white' : 'text-ink/70 hover:bg-ink/5'
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-folder text-left text-red-600 hover:bg-red-50 transition-colors mt-2"
        >
          Log out
        </button>
      </nav>
    </aside>
  );
}
