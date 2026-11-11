'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/lib/library';

export function WishlistButton({
  productId,
  initialWished,
}: {
  productId: string;
  initialWished: boolean;
}) {
  const [wished, setWished] = useState(initialWished);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleWishlist(productId, wished);
      setWished(!wished);
    } catch {
      window.location.href = '/login';
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-pressed={wished}
      className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md border px-3.5 text-[13px] font-medium shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 ${
        wished
          ? 'border-amber-600/30 bg-amber-500/10 text-amber-700 hover:border-amber-600/50 dark:text-amber-400'
          : 'border-line bg-paper text-muted hover:border-linestrong hover:text-ink'
      }`}
    >
      <Heart size={14} aria-hidden fill={wished ? 'currentColor' : 'none'} />
      {busy ? 'Saving…' : wished ? 'Wishlisted' : 'Wishlist'}
    </button>
  );
}
