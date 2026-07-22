import { notFound } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createAdminClient } from '@/lib/supabase/server';
import { PostForm } from '@/components/admin/PostForm';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditAdminPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink mb-4">Edit post</h1>
        <div className="rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Editing posts needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Edit post</h1>
      <PostForm initialPost={post as Post} />
    </div>
  );
}
