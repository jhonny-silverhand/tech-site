import { NextResponse } from 'next/server';
import { getProductWithRetailers, getBuyingGuidesForProduct } from '@/lib/products';
import { CurrencyConverter, compareRetailerPrices } from '@/lib/shopping/currency';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await getProductWithRetailers(slug);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const buyingGuides = await getBuyingGuidesForProduct(product.id);

    // Format retailers with price conversion
    const { CurrencyConverter } = await import('@/lib/shopping/currency');
    const converter = new CurrencyConverter();

    const availableRetailers = product.retailers
      .filter(r => r.price_cents !== null && r.availability !== 'out_of_stock')
      .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity));

    const bestPrice = availableRetailers[0];
    const priceRange = availableRetailers.length > 1
      ? `₹${(availableRetailers[0].price_cents! / 100).toLocaleString()} – ₹${(availableRetailers[availableRetailers.length - 1].price_cents! / 100).toLocaleString()}`
      : bestPrice
        ? `₹${(bestPrice.price_cents! / 100).toLocaleString()}`
        : 'Price not available';

    const priceComparison = {
      cheapest: availableRetailers[0] || null,
      mostExpensive: availableRetailers[availableRetailers.length - 1] || null,
      averagePrice: availableRetailers.length > 0
        ? Math.round(availableRetailers.reduce((a, b) => a + (b.price_cents || 0), 0) / availableRetailers.length / 100)
        : 0,
      priceRange: {
        min: availableRetailers[0]?.price_cents ?? 0,
        max: availableRetailers[availableRetailers.length - 1]?.price_cents ?? 0,
      },
      savings: availableRetailers.length > 1
        ? Math.round(((availableRetailers[availableRetailers.length - 1]?.price_cents ?? 0) - (availableRetailers[0]?.price_cents ?? 0)) / 100)
        : 0,
      savingsPercent: availableRetailers.length > 1
        ? Math.round((((availableRetailers[availableRetailers.length - 1]?.price_cents ?? 0) - (availableRetailers[0]?.price_cents ?? 0)) / (availableRetailers[availableRetailers.length - 1]?.price_cents ?? 1)) * 100)
        : 0,
      allPrices: availableRetailers.map(pr => ({
        name: pr.retailer.name,
        price: pr.price_cents ? pr.price_cents / 100 : 0,
        currency: pr.currency,
        availability: pr.availability,
      })),
    };

// Format retailers with price conversion
      const retailers = product.retailers.map(r => ({
        name: r.retailer.name,
        price: r.price_cents ? r.price_cents / 100 : 0,
        currency: r.currency,
        availability: r.availability,
        url: r.url,
        affiliateUrl: r.affiliate_url,
        logoUrl: r.retailer.logo_url,
        isOfficial: r.retailer.is_official,
        lastChecked: r.last_checked || r.updated_at || new Date().toISOString(),
        priceUpdatedAt: r.last_checked,
      }));

    return NextResponse.json({
      product: {
        ...product,
        formattedPrice: priceRange,
      },
      retailers,
      specs: product.specs,
      buyingGuides,
      relatedProducts: [], // Would fetch related products
      priceComparison,
      relatedArticles: [],
    });
  } catch (err) {
    console.error('[api/products/[slug]] Error:', err);
    return NextResponse.json(
      { error: 'Failed to get product details' },
      { status: 500 }
    );
  }
}