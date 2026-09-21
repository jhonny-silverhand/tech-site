/** Supabase-backed product helpers for internal relations (wishlist, guides).
 *  Public search / detail / compare are 100% live Gemini — see live-products.ts.
 *  There is no offline seed catalog anymore. */

import type { Product, ProductCategory } from './types';
import { PRODUCT_CATEGORY_OPTIONS } from './products-client';
import { isSupabaseConfigured } from './supabase/config';
import { createClient, createAdminClient } from './supabase/server';

export { lowestPrice } from './products-client';

async function sb() {
  if (!isSupabaseConfigured()) return null;
  try {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : await createClient();
  } catch {
    return null;
  }
}

const PRODUCT_SELECT = '*, specs:product_specs(*), retailers:product_retailers(*, retailer:retailers(*))';

function normalizeDbProduct(row: Record<string, unknown>): Product {
  const specs = ((row.specs as Record<string, unknown>[]) || []).map((s) => ({
    spec_key: String(s.spec_key),
    spec_value: String(s.spec_value),
    unit: (s.unit as string) ?? null,
    display_order: (s.display_order as number) ?? 0,
  }));
  const retailers = ((row.retailers as Record<string, unknown>[]) || []).map((r) => {
    const ret = (r.retailer as Record<string, unknown> | null) || {};
    return {
      retailer_name: String((ret.name as string) || r.retailer_name || 'Retailer'),
      retailer_slug: String((ret.slug as string) || r.retailer_slug || 'retailer'),
      url: String(r.url),
      price_cents: (r.price_cents as number) ?? null,
      currency: String(r.currency || 'INR'),
      availability: String(r.availability || 'unknown'),
      affiliate_url: (r.affiliate_url as string) ?? null,
    };
  });
  return {
    id: String(row.id),
    category_slug: (row.category_slug as string) ?? null,
    name: String(row.name),
    slug: String(row.slug),
    description: (row.description as string) ?? null,
    image_url: (row.image_url as string) ?? null,
    manufacturer: (row.manufacturer as string) ?? null,
    model: (row.model as string) ?? null,
    release_date: (row.release_date as string) ?? null,
    status: String(row.status || 'active'),
    specs,
    retailers,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

/** Catalog rows (Supabase) — used only for wishlist resolution and guides relations. */
export async function getAllProducts(): Promise<Product[]> {
  const client = await sb();
  if (!client) return [];
  try {
    const { data, error } = await client.from('products').select(PRODUCT_SELECT).eq('status', 'active').limit(100);
    if (!error && data) return (data as Record<string, unknown>[]).map(normalizeDbProduct);
  } catch {
    // fall through
  }
  return [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await sb();
  if (!client) return null;
  try {
    const { data, error } = await client.from('products').select(PRODUCT_SELECT).eq('slug', slug).maybeSingle();
    if (!error && data) return normalizeDbProduct(data as Record<string, unknown>);
  } catch {
    // fall through
  }
  return null;
}

export function getProductCategories(): ProductCategory[] {
  return PRODUCT_CATEGORY_OPTIONS.map((c) => ({ ...c, description: null }));
}
