import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LibraryMenu } from '@/components/LibraryMenu';
import { AccountSettingsForm } from '@/components/AccountSettingsForm';
import { ProfileSettingsClient } from '@/components/ProfileSettingsClient';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Library Settings' };

export default async function LibrarySettingsPage({ searchParams }: { searchParams?: Promise<{ setup?: string }> }) {
  if (!isSupabaseConfigured()) redirect('/login');
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('username, display_name, bio, favorite_niches').eq('id', auth.user.id).maybeSingle();
  const p = (profile || {}) as { username?: string | null; display_name?: string | null; bio?: string | null; favorite_niches?: string[] };
  const needsUsername = !p.username || /^user_[0-9a-f]{8}$/.test(p.username);
  const showSetup = (await searchParams)?.setup === '1' || needsUsername;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Settings' }]} />
      <h1 className="mt-4 font-display text-3xl font-semibold">Library settings</h1>
      {showSetup && (
        <p className="mt-3 rounded-md border border-accent/30 bg-accentsoft px-3 py-2 text-sm text-ink-2" role="status">
          Pick your username below — it&apos;s how you appear across tech//site (reviews, comments, profile URL).
        </p>
      )}
      <div className="mt-4 grid gap-6 lg:grid-cols-[220px_1fr]">
        <LibraryMenu active="Settings" />
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-xl font-semibold">Profile</h2>
            <div className="mt-3"><AccountSettingsForm initialUsername={p.username || ''} initialDisplayName={p.display_name || ''} initialBio={p.bio || ''} highlightUsername={needsUsername} /></div>
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
