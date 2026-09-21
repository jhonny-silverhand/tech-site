'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@/lib/types';

const ShoppingIntelligenceHero = dynamic(
  () => import('./ShoppingIntelligenceHero').then((m) => m.ShoppingIntelligenceHero),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-folder bg-paper" /> }
);

export function ShoppingIntelligenceHeroLazy({ products }: { products: Product[] }) {
  return <ShoppingIntelligenceHero products={products} />;
}
