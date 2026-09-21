import { NextResponse } from 'next/server';
import { searchProductsLive } from '@/lib/live-products';
import { GeminiError } from '@/lib/gemini';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json({ products: [] });
  try {
    const products = await searchProductsLive(q, 8);
    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        manufacturer: p.manufacturer,
        model: p.model,
        category_slug: p.category_slug,
        description: p.description,
        live: true,
      })),
    });
  } catch (err) {
    const status = err instanceof GeminiError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Search failed' }, { status });
  }
}
