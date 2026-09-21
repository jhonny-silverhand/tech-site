'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User, Bookmark, FolderOpen, History, Settings, ChevronDown } from 'lucide-react';

interface AccountMenuProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
  bookmarkCount: number;
}

const COMING_SOON = ['Highlights', 'Comments', 'Following'];

export function AccountMenu({ user, bookmarkCount }: AccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Reader';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-folder hover:bg-white/10 transition-colors"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="font-display text-[13px] text-accent">{initial}</span>
          </div>
        )}
        <span className="font-mono text-[12px] hidden sm:block">{displayName}</span>
        <ChevronDown size={12} className="text-white/60" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-folder border border-line bg-paper shadow-xl py-1.5 z-50 text-ink">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-line">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="font-display text-xl text-accent">{initial}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-[15px] text-ink truncate">{displayName}</p>
                <p className="font-mono text-[11px] text-muted">@{displayName.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-1.5">
            <Link
              href="/profile/@me"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <User size={16} className="text-muted" />
              Profile
            </Link>

            <Link
              href="/library"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Bookmark size={16} className="text-muted" />
                Library
              </span>
              <span className="text-muted">{bookmarkCount}</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <FolderOpen size={16} className="text-muted" />
              My Articles
            </Link>

            <Link
              href="/library/collections"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <FolderOpen size={16} className="text-muted" />
              Collections
            </Link>

            <Link
              href="/library"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <History size={16} className="text-muted" />
              Reading History
            </Link>

            <Link
              href="/library/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] hover:bg-ink/5 transition-colors"
            >
              <Settings size={16} className="text-muted" />
              Settings
            </Link>

            {COMING_SOON.map((label) => (
              <span
                key={label}
                className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] text-muted/50 cursor-default"
              >
                {label}
                <span className="text-[9px] uppercase tracking-wide border border-line rounded px-1 py-0.5">Soon</span>
              </span>
            ))}
          </nav>

          <div className="border-t border-line my-1.5" />
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}