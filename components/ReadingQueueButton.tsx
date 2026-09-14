'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ReadingQueueButtonProps {
  postId: string;
  initialInQueue: boolean;
  enabled: boolean;
}

export function ReadingQueueButton({ postId, initialInQueue, enabled }: ReadingQueueButtonProps) {
  const router = useRouter();
  const [inQueue, setInQueue] = useState(initialInQueue);
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

    if (inQueue) {
      await supabase.from('reading_queue').delete().eq('user_id', user.id).eq('post_id', postId);
    } else {
      await supabase.from('reading_queue').insert({ user_id: user.id, post_id: postId });
    }
    setInQueue(!inQueue);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={inQueue}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors disabled:opacity-50 ${
        inQueue
          ? 'border-amber-500 bg-amber-500/10 text-amber-600'
          : 'border-line text-muted hover:border-ink/30 hover:text-ink'
      }`}
    >
      <BookOpen size={12} strokeWidth={2.5} />
      {inQueue ? 'Queued' : 'Read later'}
    </button>
  );
}