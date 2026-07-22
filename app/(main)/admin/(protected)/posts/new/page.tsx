import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PostForm } from '@/components/admin/PostForm';

export default function NewAdminPostPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl text-ink mb-4">New post</h1>
        <div className="rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Creating posts needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">New post</h1>
      <PostForm />
    </div>
  );
}
