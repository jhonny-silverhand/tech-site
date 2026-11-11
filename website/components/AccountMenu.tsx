'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard, Library, PenLine, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function AccountMenu({ email, username }: { email: string | null; username: string | null }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-md border border-line px-3.5 py-1.5 text-[13px] font-medium text-ink-2 hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white shadow-card hover:brightness-110 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign up
        </Link>
      </div>
    );
  }

  async function signOut() {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={username || email || undefined}
        className="flex max-w-[180px] items-center gap-1.5 rounded-md border border-line bg-paper px-2.5 py-1.5 text-[13px] text-ink-2 hover:border-linestrong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <User size={14} aria-hidden className="flex-none" />
        <span className="max-w-[10ch] truncate">{username || email}</span>
        <ChevronDown size={13} aria-hidden className={`flex-none text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="elev absolute right-0 top-full z-50 mt-2 w-56 animate-popover overflow-hidden"
        >
          <p className="truncate border-b border-line px-4 py-2.5 font-mono text-[11px] text-faint">{email}</p>
          {[
            { href: `/profile/${username || 'me'}`, icon: <User size={15} aria-hidden />, label: 'Profile' },
            { href: '/dashboard', icon: <LayoutDashboard size={15} aria-hidden />, label: 'Dashboard' },
            { href: '/library', icon: <Library size={15} aria-hidden />, label: 'Library' },
            { href: '/write', icon: <PenLine size={15} aria-hidden />, label: 'Write' },
          ].map((i) => (
            <Link
              key={i.href}
              href={i.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-2 hover:bg-paper-2 hover:text-ink"
            >
              <span className="text-faint">{i.icon}</span>
              {i.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            role="menuitem"
            className="flex w-full items-center gap-2.5 border-t border-line px-4 py-2.5 text-sm text-danger hover:bg-paper-2"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
