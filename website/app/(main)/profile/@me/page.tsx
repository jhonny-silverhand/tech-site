import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AccountSettingsForm } from '@/components/AccountSettingsForm';
import { ProfileSettingsClient } from '@/components/ProfileSettingsClient';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Your Profile' };

export default async function MyProfilePage() {
  if (!isSupabaseConfigured()) redirect('/login');
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', auth.user.id).maybeSingle();
  const p = (profile || {}) as { username?: string; display_name?: string | null; bio?: string | null; favorite_niches?: string[] };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">@{p.username || 'you'}</h1>
      <p className="mt-1 text-sm text-muted">{auth.user.email}</p>
      <div className="mt-6 flex flex-col gap-10">
        <section>
          <h2 className="font-display text-xl font-semibold">Profile</h2>
          <div className="mt-3"><AccountSettingsForm initialDisplayName={p.display_name || ''} initialBio={p.bio || ''} /></div>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Interests</h2>
          <div className="mt-3"><ProfileSettingsClient initialNiches={p.favorite_niches || []} /></div>
        </section>
      </div>
    </div>
  );
}
