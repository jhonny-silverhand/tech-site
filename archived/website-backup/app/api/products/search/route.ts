import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

  if (!query.trim()) {
    return NextResponse.json({ products: [], total: 0 });
  }

  try {
    const products = await searchProducts(query, category, limit);

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image_url: p.image_url,
        category_slug: p.category_slug,
        manufacturer: p.manufacturer,
        model: p.model,
      })),
      total: products.length,
    });
  } catch (error) {
    console.error('[api/products/search] Error:', error);
    return NextResponse.json({ products: [], total: 0 });
  }
}
