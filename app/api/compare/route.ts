import { NextResponse } from 'next/server';
import { getProductWithRetailers } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { CurrencyConverter, compareRetailerPrices } from '@/lib/shopping/currency';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productSlugs: string[] = Array.isArray(body.products) ? body.products : body.products ? [body.products] : [];

    if (productSlugs.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 products required for comparison' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Products need a connected Supabase project' },
        { status: 503 }
      );
    }

    // Fetch all products
    const products = await Promise.all(
      productSlugs.slice(0, 4).map(slug => getProductWithRetailers(slug))
    );

    const validProducts = products.filter((p): p is any => Boolean(p));

    if (validProducts.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 valid products required' },
        { status: 404 }
      );
    }

    // Get all unique spec keys
    const specKeySet = new Set<string>();
    validProducts.forEach(p => {
      p.specs.forEach((s: { spec_key: string }) => specKeySet.add(s.spec_key));
    });

    const specKeys = Array.from(specKeySet);
    const primaryCategory = validProducts[0]?.category_slug || 'laptop';
    const categoryColor = '#4F7DFF'; // Would come from niche

    // Build comparison data
    const specComparison = specKeys.map(specKey => {
      const row: Record<string, string> = { spec: specKey.replace(/_/g, ' ') };
      validProducts.forEach(product => {
        const spec = product.specs.find((s: { spec_key: string }) => s.spec_key === specKey);
        row[product.name] = spec ? `${spec.spec_value} ${spec.unit || ''}` : '—';
      });
      return row;
    });

    // Price comparison
    const priceComparison = validProducts.map(product => {
      const availableRetailers = product.retailers
        .filter((r: { price_cents: number | null }) => r.price_cents !== null)
        .sort((a: { price_cents: number | null }, b: { price_cents: number | null }) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity));

      return {
        productId: product.id,
        productName: product.name,
        bestPrice: availableRetailers[0] ? {
          price: availableRetailers[0].price_cents! / 100,
          retailer: availableRetailers[0].retailer.name,
          currency: availableRetailers[0].currency,
        } : null,
        allPrices: availableRetailers.map((pr: { retailer: { name: string }; price_cents: number | null; currency: string; availability: string }) => ({
          retailer: pr.retailer.name,
          price: pr.price_cents! / 100,
          currency: pr.currency,
          availability: pr.availability,
        })),
      };
    });

    // Quick verdict with reasoning
    const quickVerdict = validProducts.map((product, index) => ({
      productId: product.id,
      productName: product.name,
      reasoning: product.reasoning || 'Strong contender in its category with competitive specs and pricing.',
      pros: product.pros || [],
      cons: product.cons || [],
    }));

    return NextResponse.json({
      products: validProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        manufacturer: p.manufacturer,
        model: p.model,
        image_url: p.image_url,
        category_slug: p.category_slug,
      })),
      specs: specKeys.map(specKey => {
        const row: Record<string, string> = { spec: specKey.replace(/_/g, ' ') };
        validProducts.forEach(product => {
          const spec = product.specs.find((s: { spec_key: string; spec_value: string; unit?: string }) => s.spec_key === specKey);
          row[product.name] = spec ? `${spec.spec_value} ${spec.unit || ''}` : '—';
        });
        return row;
      }),
      prices: priceComparison,
      verdict: validProducts.map((product, index) => ({
        productId: product.id,
        productName: product.name,
        reasoning: product.reasoning || 'Strong contender in its category with competitive specs and pricing.',
        pros: product.pros || [],
        cons: product.cons || [],
      })),
    });
  } catch (err) {
    console.error('[api/compare] Error:', err);
    return NextResponse.json(
      { error: 'Failed to compare products' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = searchParams.get('products');
  
  if (!products) {
    return NextResponse.json(
      { error: 'products query parameter required' },
      { status: 400 }
    );
  }

  const productSlugs = products.split(',');
  
  // Reuse POST logic
  const postRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products: productSlugs }),
  });

  return POST(postRequest);
}