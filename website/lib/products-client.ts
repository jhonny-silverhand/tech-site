import type { Product } from './types';

export const PRODUCT_CATEGORY_OPTIONS = [
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'headphones', name: 'Headphones' },
  { slug: 'pc-components', name: 'PC Components' },
];

export function getProductCategories() {
  return PRODUCT_CATEGORY_OPTIONS;
}

/** Client-safe pure helper: cheapest retailer price for a product. */
export function lowestPrice(p: Product): { price_cents: number | null; currency: string } {
  let best: number | null = null;
  for (const r of p.retailers) {
    if (r.price_cents != null && (best == null || r.price_cents < best)) best = r.price_cents;
  }
  return { price_cents: best, currency: p.retailers[0]?.currency || 'INR' };
}
