import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ExternalLink, TrendingDown, BarChart3 } from 'lucide-react';
import { getProductDetailLive } from '@/lib/live-products';
import { getAllBuyingGuides } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { WishlistButton } from '@/components/WishlistButton';
import { formatINR } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductDetailLive(slug).catch(() => null);
  if (!p) return { title: 'Product not found' };
  return { title: p.name, description: p.description || undefined };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductDetailLive(slug).catch(() => null);
  if (!product) notFound();

  // Wishlist only works for products that also exist in the Supabase catalog
  // (wishlists.product_id is an FK to products.id). Live-only items skip it.
  let wished = false;
  let wishlistId: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data: row } = await supabase.from('products').select('id').eq('slug', product.slug).maybeSingle();
      if (auth.user && row) {
        wishlistId = (row as { id: string }).id;
        const { data } = await supabase.from('wishlists').select('id').eq('user_id', auth.user.id).eq('product_id', wishlistId).maybeSingle();
        wished = Boolean(data);
      }
    } catch {
      // ignore
    }
  }

  // Related buying guides: same category first, then latest.
  let relatedGuides: { slug: string; title: string }[] = [];
  try {
    const guides = await getAllBuyingGuides();
    const sameCat = guides.filter((g) => g.category_slug && g.category_slug === product.category_slug);
    const rest = guides.filter((g) => !(g.category_slug && g.category_slug === product.category_slug));
    relatedGuides = [...sameCat, ...rest].slice(0, 3).map((g) => ({ slug: g.slug, title: g.title }));
  } catch {
    // ignore
  }

  const priceUrl =
    product.category_slug === 'smartphones'
      ? `https://pricebefore.com/search/?q=${encodeURIComponent(product.name)}`
      : `https://pricehistory.in/search?q=${encodeURIComponent(product.name)}`;
  const versusUrl =
    product.category_slug === 'smartphones'
      ? `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(product.name)}`
      : `https://versus.com/en/?q=${encodeURIComponent(product.name)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Shopping', href: '/shopping' }, { label: product.name }]} />
      <div className="relative mt-4 aspect-[21/9] w-full overflow-hidden rounded-folder border border-line bg-paper-2">
        <Image
          src={product.image_url || `https://picsum.photos/seed/${product.slug}/1200/514`}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 896px) 896px, 100vw"
          priority
        />
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">{product.manufacturer} · {product.model}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
        {wishlistId && <WishlistButton productId={wishlistId} initialWished={wished} />}
      </div>
      <p className="mt-2">
        <span className="chip" data-tone="info"><Sparkles size={12} aria-hidden /> Live AI · fetched now · prices estimated</span>
      </p>
      {product.description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.description}</p>}

      <h2 className="mt-8 font-display text-xl font-semibold">Specifications</h2>
      <div className="mt-3 overflow-x-auto rounded-folder border border-line">
        <table className="w-full min-w-[420px] text-sm">
          <tbody>
            {(product.specs || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map((s, i) => (
              <tr key={i} className={i % 2 ? 'bg-paper' : 'bg-bg'}>
                <td className="w-1/3 px-4 py-2.5 font-medium text-ink">{s.spec_key}</td>
                <td className="px-4 py-2.5 text-muted">{s.spec_value}{s.unit ? ` ${s.unit}` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 font-display text-xl font-semibold">Where to buy</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {product.retailers.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="nofollow sponsored noopener" className="group rounded-folder border border-line bg-paper p-4 hover:border-ink">
            <p className="flex items-center justify-between font-medium text-ink">
              {r.retailer_name}
              <ExternalLink size={14} className="text-muted group-hover:text-accentink" />
            </p>
            <p className="mt-1 text-lg font-semibold">{r.price_cents != null ? <>{formatINR(r.price_cents, r.currency)}<span className="font-mono text-[10px] font-normal text-faint"> AI-EST</span></> : 'Check price'}</p>
            <p className="font-mono text-[11px] capitalize text-muted">{r.availability.replace(/_/g, ' ')}</p>
          </a>
        ))}
        {product.retailers.length === 0 && <p className="text-sm text-muted">No retailer links yet.</p>}
      </div>
      <p className="mt-3 text-[13px] text-muted">
        Prices are AI estimates at fetch time — <Link href="/compare" className="text-accentink hover:underline">compare live</Link> against another product or verify at the retailer before buying.
      </p>
      <div className="mt-3 flex gap-2">
        <a href={priceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-[11px] text-muted hover:border-linestrong hover:text-ink">
          <TrendingDown size={12} aria-hidden /> Price history
        </a>
        <a href={versusUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-[11px] text-muted hover:border-linestrong hover:text-ink">
          <BarChart3 size={12} aria-hidden /> Compare specs
        </a>
      </div>
      {relatedGuides.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-xl font-semibold">Related buying guides</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="card card-interactive block h-full p-4 text-[14px] font-medium leading-snug hover:text-accentink">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
