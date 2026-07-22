import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { UserPostForm } from '@/components/UserPostForm';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Edit post</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Editing needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page will
          work.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).eq('author_id', user.id).single();
  if (!post) notFound();

  const authorName = (user.user_metadata?.full_name as string) || user.email || 'Anonymous';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-8">Edit post</h1>
      <UserPostForm initialPost={post as Post} userId={user.id} authorName={authorName} />
    </div>
  );
}
