import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { readingTime } from '@/lib/utils';
import { nicheColor } from '@/lib/niches';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const patch: Record<string, unknown> = {};
    for (const k of ['title', 'excerpt', 'content', 'niche', 'status', 'featured', 'cover_image_url']) {
      if (body[k] !== undefined) patch[k] = body[k];
    }
    if (typeof patch.content === 'string') patch.reading_time = readingTime(patch.content);
    if (typeof patch.niche === 'string') patch.niche_color = nicheColor(patch.niche);
    patch.updated_at = new Date().toISOString();
    if (patch.status === 'published') patch.published_at = new Date().toISOString();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('posts').update(patch).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ post: data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
