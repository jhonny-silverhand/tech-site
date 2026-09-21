import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { getAllPostsAdmin, coverFor } from '@/lib/data';
import { slugify, readingTime, excerptOf } from '@/lib/utils';
import { nicheColor } from '@/lib/niches';

function adminDb() {
  return createAdminClient();
}

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const posts = await getAllPostsAdmin();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
    const niche = String(body.niche || 'programming');
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const row = {
      slug,
      title,
      excerpt: String(body.excerpt || excerptOf(content)),
      content,
      niche,
      cover_image_url: coverFor(slug, String(body.cover_image_url || '')),
      status: body.status === 'published' ? 'published' : 'draft',
      author_name: 'tech//site Editorial',
      reading_time: readingTime(content),
      featured: Boolean(body.featured),
      tags: [],
      niche_color: nicheColor(niche),
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };
    const supabase = adminDb();
    const { data, error } = await supabase.from('posts').insert(row).select('*').single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ post: data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Create failed' }, { status: 500 });
  }
}
