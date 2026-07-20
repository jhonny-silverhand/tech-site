import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NICHE_SLUGS } from '@/lib/niches';

const NOT_CONFIGURED = {
  error: 'No Supabase project is connected yet, so there is nothing to save to. See Guides/01-database-setup.md.',
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  if (body.niche && !NICHE_SLUGS.includes(body.niche)) {
    return NextResponse.json({ error: 'Unknown niche.' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    // Only set published_at the first time a post transitions to published,
    // so republishing an edit doesn't bump its original publish date.
    let publishedAtUpdate: { published_at?: string } = {};
    if (body.status === 'published') {
      const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).single();
      if (!existing?.published_at) publishedAtUpdate = { published_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: body.title,
        slug: body.slug,
        niche: body.niche,
        excerpt: body.excerpt,
        content: body.content,
        cover_image_url: body.cover_image_url,
        is_ai_assisted: Boolean(body.is_ai_assisted),
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        status: body.status === 'published' ? 'published' : 'draft',
        updated_at: new Date().toISOString(),
        ...publishedAtUpdate,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update post.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete post.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
