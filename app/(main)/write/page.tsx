import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { UserPostForm } from '@/components/UserPostForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Write</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Writing needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page will
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

  const authorName = (user.user_metadata?.full_name as string) || user.email || 'Anonymous';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-8">New post</h1>
      <UserPostForm userId={user.id} authorName={authorName} />
    </div>
  );
}
