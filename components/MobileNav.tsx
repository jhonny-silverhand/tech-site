'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const SIGNED_OUT_LINKS = [
  { href: '/write', label: 'Write' },
  { href: '/login', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/admin/login', label: 'Admin' },
];

interface MobileNavProps {
  isLoggedIn: boolean;
  bookmarkCount: number;
}

/**
 * Below md:, the desktop nav is hidden with nothing replacing it — this
 * is that replacement. Was a real bug, not a planned simplification:
 * those links were completely unreachable on an actual phone screen, not
 * just visually different.
 */
export function MobileNav({ isLoggedIn, bookmarkCount }: MobileNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

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
          <Link
            href="/write"
            onClick={() => setOpen(false)}
            className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
          >
            Write
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/library"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Library
                <span className="text-white/50">{bookmarkCount} saved</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="py-2.5 text-left font-mono text-[13px] text-red-400 hover:text-red-300 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            SIGNED_OUT_LINKS.filter((l) => l.href !== '/write').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
