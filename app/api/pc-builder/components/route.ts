/**
 * API Route: Get all PC components
 * GET /api/pc-builder/components?category=cpu&tier=mid
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tier = searchParams.get('tier');
  const vendor = searchParams.get('vendor');
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

  try {
    let dbQuery = supabase
      .from('pc_components')
      .select('*');

    // Category filter
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    // Performance tier filter
    if (tier) {
      dbQuery = dbQuery.eq('performance_tier', tier);
    }

    // Vendor filter
    if (vendor) {
      dbQuery = dbQuery.ilike('vendor', `%${vendor}%`);
    }

    // Limit
    dbQuery = dbQuery.limit(limit);

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      components: data || [],
      total: data?.length || 0,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
