'use client';

import dynamic from 'next/dynamic';

const ShoppingIntelligenceHero = dynamic(() => import('@/components/ShoppingIntelligenceHero').then(m => m.ShoppingIntelligenceHero), { ssr: false });

export function ShoppingIntelligenceHeroLazy({ featuredProducts }: { featuredProducts: any[] }) {
  return <ShoppingIntelligenceHero featuredProducts={featuredProducts} />;
}
