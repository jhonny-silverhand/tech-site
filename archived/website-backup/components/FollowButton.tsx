'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
  /** Whether the current user is the target (disable self-follow) */
  isSelf?: boolean;
}

export function FollowButton({ targetUserId, initialFollowing, isSelf = false }: FollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (isSelf) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted">
        You
      </span>
    );
  }

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      setLoading(false);
      return;
    }

    if (following) {
      await supabase.from('author_follows').delete().eq('user_id', user.id).eq('author_id', targetUserId);
    } else {
      await supabase.from('author_follows').insert({ user_id: user.id, author_id: targetUserId });
    }
    setFollowing(!following);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors disabled:opacity-50 ${
        following
          ? 'border-green-500 bg-green-500/10 text-green-600'
          : 'border-line text-muted hover:border-ink/30 hover:text-ink'
      }`}
    >
      {following ? (
        <>
          <UserCheck size={12} strokeWidth={2.5} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={12} strokeWidth={2.5} />
          Follow
        </>
      )}
    </button>
  );
}