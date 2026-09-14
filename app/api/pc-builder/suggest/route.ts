/**
 * API Route: Suggest compatible parts for a partial build
 * POST /api/pc-builder/suggest
 * Body: { currentBuild: PCComponent[], category?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { suggestCompatibleParts, PCComponent } from '@/lib/pc-builder/compatibility';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentBuild, category } = body as { 
      currentBuild: PCComponent[];
      category?: string;
    };

    if (!currentBuild || !Array.isArray(currentBuild)) {
      return NextResponse.json(
        { error: 'Please provide currentBuild array' },
        { status: 400 }
      );
    }

    // Get all components from database
    const { data: allComponents, error } = await supabase
      .from('pc_components')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get suggestions
    const suggestions = suggestCompatibleParts(
      currentBuild,
      allComponents as PCComponent[]
    );

    // Filter by specific category if requested
    if (category && suggestions[category]) {
      return NextResponse.json({
        suggestions: {
          [category]: suggestions[category],
        },
      });
    }

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Suggest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
