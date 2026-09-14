'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NICHES } from '@/lib/niches';

interface TopicFollowButtonProps {
  nicheSlug: string;
  initialFollowing: boolean;
}

export function TopicFollowButton({ nicheSlug, initialFollowing }: TopicFollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const niche = NICHES.find(n => n.slug === nicheSlug);

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
      await supabase.from('topic_follows').delete().eq('user_id', user.id).eq('niche_slug', nicheSlug);
    } else {
      await supabase.from('topic_follows').insert({ user_id: user.id, niche_slug: nicheSlug });
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
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-line text-muted hover:border-ink/30 hover:text-ink'
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche?.color }} />
      {following ? (
        <>
          <Check size={12} strokeWidth={2.5} />
          Following
        </>
      ) : (
        <>
          <Tag size={12} strokeWidth={2.5} />
          Follow
        </>
      )}
    </button>
  );
}