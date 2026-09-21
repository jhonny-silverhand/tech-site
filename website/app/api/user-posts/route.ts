import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createUserPost } from '@/lib/data';
import { slugify, excerptOf } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    const niche = String(body.niche || 'programming');
    const cover_image_url = String(body.cover_image_url || '').trim() || null;
    const excerpt = String(body.excerpt || '').trim() || excerptOf(content);
    if (title.length < 10) return NextResponse.json({ error: 'Title too short' }, { status: 400 });
    if (content.length < 200) return NextResponse.json({ error: 'Content too short (min 200 chars)' }, { status: 400 });

    let authorId = 'anonymous';
    let authorName = 'Guest Writer';
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
      authorId = auth.user.id;
      const { data: profile } = await supabase.from('profiles').select('username, display_name').eq('id', auth.user.id).maybeSingle();
      authorName = (profile as { display_name?: string; username?: string } | null)?.display_name || (profile as { username?: string } | null)?.username || auth.user.email || 'Writer';
    }

    const post = await createUserPost({ title, excerpt, content, niche, author_id: authorId, author_name: authorName, cover_image_url });
    void slugify;
    return NextResponse.json({ slug: post.slug, id: post.id });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Publish failed' }, { status: 500 });
  }
}
