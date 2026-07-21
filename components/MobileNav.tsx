'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/write', label: 'Write' },
  { href: '/login', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/admin/login', label: 'Admin' },
];

/**
 * Below md:, the desktop nav (Write/Sign in/Sign up/Admin) is hidden with
 * nothing replacing it — this is that replacement. Was a real bug, not a
 * planned simplification: those links were completely unreachable on an
 * actual phone screen, not just visually different.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-void px-4 py-3 flex flex-col">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
