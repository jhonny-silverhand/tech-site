import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NICHE_SLUGS } from '@/lib/niches';

const NOT_CONFIGURED = {
  error: 'No Supabase project is connected yet, so there is nothing to save to. See Guides/01-database-setup.md.',
};

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== 'string' || typeof body.slug !== 'string' || typeof body.content !== 'string') {
    return NextResponse.json({ error: 'title, slug, and content are required.' }, { status: 400 });
  }
  if (!NICHE_SLUGS.includes(body.niche)) {
    return NextResponse.json({ error: 'Unknown niche.' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: body.title,
        slug: body.slug,
        niche: body.niche,
        excerpt: body.excerpt ?? '',
        content: body.content,
        cover_image_url: body.cover_image_url ?? '',
        author_id: null,
        author_name: 'Admin',
        is_ai_assisted: Boolean(body.is_ai_assisted),
        seo_title: body.seo_title ?? body.title,
        seo_description: body.seo_description ?? body.excerpt ?? '',
        status: body.status === 'published' ? 'published' : 'draft',
        published_at: body.status === 'published' ? now : null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save post.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
