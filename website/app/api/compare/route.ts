import { NextResponse } from 'next/server';
import { compareProductsLive, getProductDetailLive } from '@/lib/live-products';
import { lowestPrice } from '@/lib/products-client';
import { GeminiError } from '@/lib/gemini';

/** Live comparison, fetched from Gemini at request time.
 *  GET ?names=a,b  (preferred) — full detail: specs, winners, pros/cons, verdict.
 *  GET ?slugs=a,b  — resolves each slug live first, then compares. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const names = (searchParams.get('names') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const slugs = (searchParams.get('slugs') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  try {
    if (names.length >= 2) {
      const result = await compareProductsLive(names);
      return NextResponse.json({
        ...result,
        products: result.products.map((p) => ({ ...p, lowest: lowestPrice(p) })),
      });
    }
    if (slugs.length >= 2) {
      const details = await Promise.all(slugs.map((s) => getProductDetailLive(s)));
      const resolved = details.filter((p) => p !== null).map((p) => p.name);
      if (resolved.length < 2) return NextResponse.json({ error: 'Products not found' }, { status: 404 });
      const result = await compareProductsLive(resolved);
      return NextResponse.json({
        ...result,
        products: result.products.map((p) => ({ ...p, lowest: lowestPrice(p) })),
      });
    }
    return NextResponse.json({ error: 'Provide 2–3 product names (?names=a,b)' }, { status: 400 });
  } catch (err) {
    const status = err instanceof GeminiError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Compare failed' }, { status });
  }
}
