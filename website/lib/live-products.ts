/** 100% live product data, fetched from Gemini at request time.
 *  No offline catalog: every search / detail / compare call hits the model.
 *  Prices are AI estimates — always labelled as such in the UI. */

import type { LiveCompareResult, Product } from './types';
import { GeminiError, geminiJson } from './gemini';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const AMZ = (q: string) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`;
const FLP = (q: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`;

interface LiveProductJson {
  name?: string;
  manufacturer?: string;
  model?: string;
  category_slug?: string;
  description?: string;
  specs?: { spec_key?: string; spec_value?: string; unit?: string }[];
  price_inr?: number;
}

function toProduct(j: LiveProductJson, i: number): Product {
  const name = String(j.name || 'Unknown product').slice(0, 120);
  const slug = slugify(name) || `live-product-${i}`;
  const price = typeof j.price_inr === 'number' && j.price_inr > 0 ? Math.round(j.price_inr * 100) : null;
  const now = new Date().toISOString();
  return {
    id: `live-${slug}`,
    category_slug: j.category_slug || null,
    name,
    slug,
    description: j.description || null,
    image_url: null,
    manufacturer: j.manufacturer || null,
    model: j.model || null,
    release_date: null,
    status: 'active',
    specs: Array.isArray(j.specs)
      ? j.specs.slice(0, 24).map((s, k) => ({
          spec_key: String(s.spec_key || `Spec ${k + 1}`),
          spec_value: String(s.spec_value ?? '—'),
          unit: s.unit || null,
          display_order: k,
        }))
      : [],
    retailers: [
      { retailer_name: 'Amazon', retailer_slug: 'amazon', url: AMZ(name), price_cents: price, currency: 'INR', availability: 'unknown', affiliate_url: null },
      { retailer_name: 'Flipkart', retailer_slug: 'flipkart', url: FLP(name), price_cents: price, currency: 'INR', availability: 'unknown', affiliate_url: null },
    ],
    created_at: now,
    updated_at: now,
    live: true,
  };
}

const SEARCH_SHAPE = `{
  "products": [
    {
      "name": "Exact full product name",
      "manufacturer": "Brand",
      "model": "Model identifier",
      "category_slug": "one of: laptops, smartphones, headphones, pc-components",
      "description": "One-line summary",
      "specs": [{"spec_key": "Display", "spec_value": "6.7-inch AMOLED 120Hz", "unit": null}],
      "price_inr": 45999
    }
  ]
}`;

export async function searchProductsLive(query: string, limit = 8): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const prompt = `You are a product database for an Indian tech shopping site. The user searched for: "${q}".

Return the ${limit} most relevant REAL products matching this search (current models available in India in 2026).
Include 8-14 key specs per product (display, chip/CPU, RAM, storage, battery, camera, weight, ports, etc. as applicable to the category).
price_inr: typical Indian street price (number only).

RESPOND WITH ONLY a JSON object, exactly this shape: ${SEARCH_SHAPE}`;
  const data = (await geminiJson(prompt)) as { products?: LiveProductJson[] };
  if (!data || !Array.isArray(data.products)) throw new GeminiError('AI returned no products', 502);
  return data.products.slice(0, limit).map(toProduct);
}

/** Slugs carry storage/color variants ("...-256gb-black-titanium") that break
 *  exact-match lookup — reduce to the base model name for the query. */
function baseModelName(slug: string): string {
  let name = slug.replace(/-/g, ' ').trim();
  name = name.replace(/\([^)]*\)/g, ' ');
  name = name.replace(/\b\d+\s?(gb|tb|mb)\b/gi, ' ');
  name = name.replace(/\b(black|white|blue|green|red|titanium|silver|gold|grey|gray|purple|pink|orange|natural|midnight|starlight)\b/gi, ' ');
  return name.replace(/\s+/g, ' ').trim();
}

export async function getProductDetailLive(slug: string): Promise<Product | null> {
  const raw = slug.replace(/-/g, ' ').trim();
  if (!raw) return null;
  const promptFor = (name: string) =>
    `You are a product database for an Indian tech shopping site. Give full details for this product: "${name}".
Ignore any storage capacity, color, or carrier variant mentioned — return the base model.
If the exact model is newer than your knowledge, return the closest real model from the same brand and lineup (e.g. the newest iPhone Pro Max you know).
Only if the query is clearly not a tech product at all, respond with {"products": []}.
Otherwise respond with ONE real product, 10-18 specs, typical Indian street price.

RESPOND WITH ONLY a JSON object, exactly this shape: ${SEARCH_SHAPE}`;
  const data = (await geminiJson(promptFor(raw))) as { products?: LiveProductJson[] };
  let first = data?.products?.[0];
  if (!first) {
    const simplified = baseModelName(slug);
    if (simplified && simplified.toLowerCase() !== raw.toLowerCase()) {
      const retry = (await geminiJson(promptFor(simplified))) as { products?: LiveProductJson[] };
      first = retry?.products?.[0];
    }
  }
  if (!first) return null;
  return toProduct(first, 0);
}

export async function compareProductsLive(names: string[]): Promise<LiveCompareResult> {
  const list = names.map((n) => n.trim()).filter(Boolean).slice(0, 3);
  if (list.length < 2) throw new GeminiError('Provide 2–3 product names', 400);
  const prompt = `You are a senior tech product reviewer for an Indian audience. Compare these products head-to-head: ${list.map((n) => `"${n}"`).join(', ')}.

Use your knowledge of real specs and typical Indian street prices (2026). Be decisive — pick a winner per row.

RESPOND WITH ONLY a JSON object in exactly this shape:
{
  "products": [
    {
      "name": "Exact product name",
      "manufacturer": "Brand",
      "model": "Model",
      "category_slug": "laptops | smartphones | headphones | pc-components",
      "description": "One-line summary",
      "specs": [{"spec_key": "Display", "spec_value": "..."}],
      "price_inr": 45999,
      "pros": ["pro 1", "pro 2", "pro 3", "pro 4"],
      "cons": ["con 1", "con 2", "con 3"],
      "best_for": "Who should buy this in one line"
    }
  ],
  "winners": [{"spec_key": "Display", "winner_index": 0, "reason": "Brighter 2600-nit panel"}],
  "verdict": "2-4 sentence overall verdict naming the best pick for most buyers and who should pick the runner-up",
  "price_guidance": "1-2 sentences on current Indian street prices and when to buy"
}

Rules: 10-16 aligned specs per product (same spec_key set across products where possible), one winners entry per major spec row, winner_index matches the products array order.`;
  const data = (await geminiJson(prompt)) as {
    products?: (LiveProductJson & { pros?: string[]; cons?: string[]; best_for?: string })[];
    winners?: { spec_key?: string; winner_index?: number; reason?: string }[];
    verdict?: string;
    price_guidance?: string;
  };
  if (!data || !Array.isArray(data.products) || data.products.length < 2) {
    throw new GeminiError('AI could not compare these products', 502);
  }
  const products = data.products.slice(0, 3).map((p, i) => ({
    ...toProduct(p, i),
    pros: Array.isArray(p.pros) ? p.pros.slice(0, 6).map(String) : [],
    cons: Array.isArray(p.cons) ? p.cons.slice(0, 6).map(String) : [],
    best_for: String(p.best_for || ''),
  }));
  return {
    products,
    winners: Array.isArray(data.winners)
      ? data.winners
          .filter((w) => w && typeof w.winner_index === 'number' && w.winner_index >= 0 && w.winner_index < products.length)
          .map((w) => ({ spec_key: String(w.spec_key), winner_index: w.winner_index as number, reason: String(w.reason || '') }))
      : [],
    verdict: String(data.verdict || ''),
    price_guidance: String(data.price_guidance || ''),
  };
}

/** Short-lived in-memory cache so the homepage hero doesn't spend an AI
 *  call on every single visit. Search / detail / compare stay always-live. */
const heroCache = new Map<string, { at: number; products: Product[] }>();
const HERO_TTL_MS = 30 * 60 * 1000;

export async function getTrendingProductsLive(): Promise<Product[]> {
  const hit = heroCache.get('trending');
  if (hit && Date.now() - hit.at < HERO_TTL_MS) return hit.products;
  const prompt = `You are a product database for an Indian tech shopping site. List 4 trending, popular products Indian buyers are searching for right now (mix of smartphones and laptops, current 2026 models).

RESPOND WITH ONLY a JSON object, exactly this shape: ${SEARCH_SHAPE}`;
  const data = (await geminiJson(prompt)) as { products?: LiveProductJson[] };
  const products = Array.isArray(data?.products) ? data.products.slice(0, 4).map(toProduct) : [];
  if (products.length > 0) heroCache.set('trending', { at: Date.now(), products });
  return products;
}
