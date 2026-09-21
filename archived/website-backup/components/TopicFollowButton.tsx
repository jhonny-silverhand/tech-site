'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TopicFollowButtonProps {
  nicheSlug: string;
  initialFollowing?: boolean;
}

export function TopicFollowButton({ nicheSlug, initialFollowing = false }: TopicFollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const checkFollow = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('topic_follows')
        .select('id')
        .eq('user_id', user.id)
        .eq('niche_slug', nicheSlug)
        .maybeSingle();

      setFollowing(!!data);
    };
    checkFollow();
  }, [nicheSlug]);

  const toggleFollow = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    try {
      if (following) {
        await supabase
          .from('topic_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('niche_slug', nicheSlug);
        setFollowing(false);
      } else {
        await supabase
          .from('topic_follows')
          .insert({ user_id: user.id, niche_slug: nicheSlug });
        setFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-folder px-4 py-2 text-sm font-medium transition-all ${
        following
          ? 'bg-paper text-ink border border-line hover:border-ink'
          : 'bg-void text-white hover:opacity-90'
      } disabled:opacity-50`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
