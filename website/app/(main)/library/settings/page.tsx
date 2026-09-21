import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LibraryMenu } from '@/components/LibraryMenu';
import { AccountSettingsForm } from '@/components/AccountSettingsForm';
import { ProfileSettingsClient } from '@/components/ProfileSettingsClient';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Library Settings' };

export default async function LibrarySettingsPage() {
  if (!isSupabaseConfigured()) redirect('/login');
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('display_name, bio, favorite_niches').eq('id', auth.user.id).maybeSingle();
  const p = (profile || {}) as { display_name?: string | null; bio?: string | null; favorite_niches?: string[] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Settings' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">Library settings</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
        <LibraryMenu active="Settings" />
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-xl font-semibold">Profile</h2>
            <div className="mt-3"><AccountSettingsForm initialDisplayName={p.display_name || ''} initialBio={p.bio || ''} /></div>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold">Interests</h2>
            <p className="mt-1 text-sm text-muted">Powers your personalized homepage sections.</p>
            <div className="mt-3"><ProfileSettingsClient initialNiches={p.favorite_niches || []} /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
