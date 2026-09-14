/**
 * API Route: Search products from scraped data (Amazon + Flipkart)
 * GET /api/scraped-products/search?q=smartphone&category=smartphone&source=amazon
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const source = searchParams.get('source'); // 'amazon' or 'flipkart'
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const brand = searchParams.get('brand');
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let dbQuery = supabase
      .from('scraped_products')
      .select('*', { count: 'exact' });

    // Text search
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%`);
    }

    // Category filter
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    // Source filter (amazon or flipkart)
    if (source) {
      dbQuery = dbQuery.eq('specifications->>source', source);
    }

    // Price range (price_inr is in paise)
    if (minPrice) {
      dbQuery = dbQuery.gte('price_inr', parseInt(minPrice) * 100);
    }
    if (maxPrice) {
      dbQuery = dbQuery.lte('price_inr', parseInt(maxPrice) * 100);
    }

    // Brand filter
    if (brand) {
      dbQuery = dbQuery.ilike('brand', `%${brand}%`);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        dbQuery = dbQuery.order('price_inr', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('price_inr', { ascending: false });
        break;
      case 'rating':
        dbQuery = dbQuery.order('rating', { ascending: false });
        break;
      case 'popularity':
        dbQuery = dbQuery.order('review_count', { ascending: false });
        break;
      default:
        dbQuery = dbQuery.order('last_scraped_at', { ascending: false });
    }

    // Pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      limit,
      offset,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
