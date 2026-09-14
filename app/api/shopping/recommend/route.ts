import { NextResponse } from 'next/server';
import { parseShoppingQuery } from '@/lib/shopping/query-parser';
import { shoppingRegistry } from '@/lib/shopping/providers';
import { CurrencyConverter, compareRetailerPrices } from '@/lib/shopping/currency';
import { getRecommendations, RecommendationInput } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Parse the query if provided
    let parsedQuery = null;
    if (body.query) {
      const { parseShoppingQuery } = await import('@/lib/shopping/query-parser');
      parsedQuery = parseShoppingQuery(body.query);
    }

    // Determine category
    const categorySlug = body.categorySlug || parsedQuery?.category || 'laptop';

    const input: RecommendationInput = {
      categorySlug: categorySlug,
      budgetCents: body.budgetMax ? body.budgetMax * 100 : parsedQuery?.budgetMax ? parsedQuery.budgetMax * 100 : undefined,
      currency: 'INR',
      priorities: body.priorities || [],
      useCases: body.useCases || [],
      preferredBrands: body.preferredBrands || [],
      excludedBrands: body.excludedBrands || [],
      osPreferences: [],
    };

    // Override with parsed query data
    if (body.query) {
      const parsed = (await import('@/lib/shopping/query-parser')).parseShoppingQuery(body.query);
      if (parsed.budgetMax) input.budgetCents = parsed.budgetMax * 100;
      if (parsed.priorities.length > 0) input.priorities = parsed.priorities;
      if (parsed.useCases.length > 0) input.useCases = parsed.useCases;
      if (parsed.preferredBrands.length > 0) input.preferredBrands = parsed.preferredBrands;
    }

    // Get recommendations
    const recommendations = await getRecommendations(input);

    // Also get search results from providers
    const searchResults = await shoppingRegistry.searchProducts({
      query: body.query || '',
      categorySlug: categorySlug || 'laptop',
      minPrice: body.budgetMin,
      maxPrice: body.budgetMax,
      sortBy: body.sortBy,
      limit: body.limit || 20,
    });

    // Format recommendations with price formatting
    const { CurrencyConverter } = await import('@/lib/shopping/currency');
    const converter = new CurrencyConverter();

    const formattedRecommendations = await Promise.all(recommendations.map(async (rec) => {
      const product = rec.product;
      const retailers = product.retailers as Array<{ price_cents: number | null }>;
      const formattedPrice = retailers.some((r) => r.price_cents != null && r.price_cents > 0)
        ? `₹${Math.min(...retailers.filter((r) => r.price_cents != null && r.price_cents > 0).map((r) => (r.price_cents as number) / 100)).toLocaleString('en-IN')}`
        : 'Price not available';

      return {
        ...rec,
        product: {
          ...product,
          formattedPrice,
        },
      };
    }));

    // Get buying guides for context
    const { getBuyingGuides } = await import('@/lib/products');
    const buyingGuides = await getBuyingGuides(categorySlug || 'laptop');

    return NextResponse.json({
      parsedQuery: body.query ? (await import('@/lib/shopping/query-parser')).parseShoppingQuery(body.query) : null,
      recommendations: formattedRecommendations,
      searchResults: searchResults.products.map(p => ({ product: p, source: p.source })),
      buyingGuides: buyingGuides.slice(0, 3),
      metadata: {
        totalProducts: searchResults.totalCount,
        providersUsed: [], // Would be populated from registry
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[api/shopping/recommend] Error:', err);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const limit = searchParams.get('limit');

  // Use the same logic as POST but with GET params
  const body = {
    query,
    categorySlug: category,
    budgetMin: minPrice ? parseInt(minPrice) : undefined,
    budgetMax: maxPrice ? parseInt(maxPrice) : undefined,
    limit: limit ? parseInt(limit) : 20,
  };

  // Reuse POST logic by calling it
  const postRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return POST(postRequest);
}