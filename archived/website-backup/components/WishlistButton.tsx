'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkWishlistStatus();
  }, [productId]);

  async function checkWishlistStatus() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      setIsInWishlist(!!data);
    } catch {
      // Not in wishlist or not authenticated
    }
  }

  async function toggleWishlist() {
    setLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      setIsInWishlist(data.action === 'added');
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted opacity-50 ${className}`}
      >
        <Heart size={14} />
        Save
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
        isInWishlist
          ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-line text-muted hover:border-ink/30 hover:text-ink'
      } ${className}`}
    >
      <Heart size={14} fill={isInWishlist ? 'currentColor' : 'none'} />
      {isInWishlist ? 'Saved' : 'Save'}
    </button>
  );
}
