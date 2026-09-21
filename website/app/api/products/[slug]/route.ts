import { NextResponse } from 'next/server';
import { getProductDetailLive } from '@/lib/live-products';
import { GeminiError } from '@/lib/gemini';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await getProductDetailLive(slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    const status = err instanceof GeminiError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Lookup failed' }, { status });
  }
}
