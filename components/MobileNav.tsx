'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const SIGNED_OUT_LINKS = [
  { href: '/shopping', label: 'Shopping' },
  { href: '/pc-builder', label: 'PC Builder' },
  { href: '/write', label: 'Write' },
  { href: '/login', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/admin/login', label: 'Admin' },
];

interface MobileNavProps {
  isLoggedIn: boolean;
  bookmarkCount: number;
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
}

/**
 * Below md:, the desktop nav is hidden with nothing replacing it — this
 * is that replacement. Was a real bug, not a planned simplification:
 * those links were completely unreachable on an actual phone screen, not
 * just visually different.
 */
export function MobileNav({ isLoggedIn, bookmarkCount, user }: MobileNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Reader';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

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
            href="/shopping"
            onClick={() => setOpen(false)}
            className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
          >
            Shopping
          </Link>

          <Link
            href="/pc-builder"
            onClick={() => setOpen(false)}
            className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
          >
            PC Builder
          </Link>

          <Link
            href="/write"
            onClick={() => setOpen(false)}
            className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
          >
            Write
          </Link>

          {isLoggedIn ? (
            <>
              {/* User identity header in mobile menu */}
              <div className="flex items-center gap-3 px-2 py-2 border-b border-white/10 mb-2">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-display text-lg text-accent">{initial}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[15px] text-white truncate">{displayName}</p>
                  <p className="font-mono text-[11px] text-white/50">@{displayName.toLowerCase().replace(/\s+/g, '')}</p>
                </div>
              </div>

              <Link
                href="/profile/@me"
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Profile
              </Link>

              <Link
                href="/library"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Library
                <span className="text-white/50">{bookmarkCount} saved</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                My Articles
              </Link>

              <Link
                href="/library/collections"
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Collections
              </Link>

              <Link
                href="/library/settings"
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] text-white/85 hover:text-white transition-colors"
              >
                Settings
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
