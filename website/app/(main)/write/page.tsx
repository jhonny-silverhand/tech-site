import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { UserPostForm } from '@/components/UserPostForm';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Write' };

export default async function WritePage() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) redirect('/login');
    } catch {
      // allow in unconfigured mode
    }
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Write' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">Write an article</h1>
      <p className="mt-1 text-sm text-muted">Markdown supported. Be specific, be useful, no filler.</p>
      <div className="mt-6">
        <UserPostForm />
      </div>
    </div>
  );
}
