'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tags, PenLine, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';

const ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/posts/new', label: 'New Post', icon: PenLine },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-line bg-paper px-4">
      <BrandMark name="admin" className="mr-3 text-[32px] leading-none" />
      {ITEMS.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm',
            pathname === i.href ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
          )}
        >
          <i.icon size={15} />
          {i.label}
        </Link>
      ))}
      <form action="/api/admin/logout" method="POST" className="ml-auto">
        <button type="submit" className="flex items-center gap-1.5 px-3 py-3 text-sm text-muted hover:text-red-600">
          <LogOut size={15} /> Logout
        </button>
      </form>
    </nav>
  );
}
