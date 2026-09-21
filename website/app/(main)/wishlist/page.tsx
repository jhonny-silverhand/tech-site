import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getProductBySlug } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Wishlist' };

export default async function WishlistPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Wishlist</h1>
        <p className="mt-2 text-muted">Wishlist needs Supabase configured. Add your keys to .env.local to enable it.</p>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');

  const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', auth.user.id);
  const ids: string[] = (data || []).map((r: { product_id: string }) => r.product_id);

  // Resolve products via catalog (works in dual mode)
  const { getAllProducts } = await import('@/lib/products');
  const all = await getAllProducts();
  const items = all.filter((p) => ids.includes(p.id) || ids.includes(p.slug));
  void getProductBySlug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">Your wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-muted">Nothing saved yet. Browse <a href="/shopping" className="text-accentink hover:underline">shopping intelligence</a> to find products.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
