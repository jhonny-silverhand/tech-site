'use client';

import Link from 'next/link';

/**
 * Lazily-loaded Quick view trigger — keeps the product modal bundle out of
 * the page's initial JS. Renders on the client after hydration.
 *
 * NOTE: ProductDetailModal currently exposes useProductModal /
 * ProductModalProvider (no standalone QuickViewButton export), and this
 * component is unused. Keep it as a plain product link so the build stays
 * green without pulling the modal bundle into initial JS.
 */
export function QuickViewButtonLazy({ slug, className = '' }: { slug: string; className?: string }) {
  return (
    <Link href={`/products/${slug}`} className={className}>
      Quick view
    </Link>
  );
}
