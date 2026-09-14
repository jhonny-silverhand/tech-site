'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/ProductCard';

interface WishlistItem {
  product_id: string;
  created_at: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Get wishlist items
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('product_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (wishlistError) throw wishlistError;
      setItems(wishlistData || []);

      // Fetch product details for each wishlist item
      if (wishlistData && wishlistData.length > 0) {
        const productPromises = wishlistData.map(async (item) => {
          const response = await fetch(`/api/products/${item.product_id}`);
          if (response.ok) {
            const data = await response.json();
            return data.product;
          }
          return null;
        });

        const productResults = await Promise.all(productPromises);
        setProducts(productResults.filter(Boolean));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.product_id !== productId));
        setProducts(prev => prev.filter(product => product.id !== productId));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <div className="text-center">
          <Heart size={32} className="mx-auto text-muted animate-pulse" />
          <p className="mt-4 font-mono text-[13px] text-muted">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-2">Your Collection</p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">Wishlist</h1>
        <p className="mt-2 font-mono text-[13px] text-muted">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-folder border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-muted/30 mb-4" />
          <p className="font-display text-xl text-ink mb-2">No items yet</p>
          <p className="text-muted mb-6">Save products you're interested in to compare later.</p>
          <Link
            href="/shopping"
            className="inline-block rounded-folder bg-accent text-white px-6 py-3 font-mono text-[13px] hover:bg-accent/90 transition-colors"
          >
            Browse products
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-paper/80 border border-line text-muted hover:text-red-500 hover:border-red-300 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
