/**
 * API Route: Check compatibility of selected PC components
 * POST /api/pc-builder/compatibility
 * Body: { components: PCComponent[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateBuild, suggestCompatibleParts, PCComponent } from '@/lib/pc-builder/compatibility';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { components } = body as { components: PCComponent[] };

    if (!components || !Array.isArray(components) || components.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of components' },
        { status: 400 }
      );
    }

    // Validate the build
    const result = validateBuild(components);

    return NextResponse.json({
      compatible: result.compatible,
      issues: result.issues,
      warnings: result.warnings,
      componentCount: components.length,
      missingCategories: getMissingCategories(components),
    });

  } catch (error) {
    console.error('Compatibility check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getMissingCategories(components: PCComponent[]) {
  const required: PCComponent['category'][] = ['cpu', 'gpu', 'motherboard', 'ram', 'psu', 'case'];
  const present = components.map(c => c.category);
  return required.filter(r => !present.includes(r));
}
