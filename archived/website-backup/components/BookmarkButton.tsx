'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked: boolean;
  /** Whether Supabase auth is even available — hides the button entirely
   * in local demo mode rather than showing something that can't work. */
  enabled: boolean;
}

export function BookmarkButton({ postId, initialBookmarked, enabled }: BookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
    }
    setBookmarked(!bookmarked);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={bookmarked}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors disabled:opacity-50 ${
        bookmarked
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-line text-muted hover:border-ink/30 hover:text-ink'
      }`}
    >
      <Bookmark size={12} strokeWidth={2.5} fill={bookmarked ? 'currentColor' : 'none'} />
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  );
}
