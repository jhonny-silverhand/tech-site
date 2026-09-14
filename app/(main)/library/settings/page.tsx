import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { AccountSettingsForm } from '@/components/AccountSettingsForm';
import { ProfileSettingsClient } from '@/components/ProfileSettingsClient';
import { NICHES } from '@/lib/niches';

export const metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Settings needs a connected Supabase project. Follow Guides/01-database-setup.md, then this page will
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const displayName = (user.user_metadata?.full_name as string) || profile?.display_name || '';

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
        <Link href="/library" className="hover:text-ink transition-colors">
          Your library
        </Link>
      </p>
      <h1 className="font-display text-4xl text-ink mb-2">Settings</h1>
      <p className="text-[15px] text-muted mb-10">Manage your account and profile.</p>

      {/* Profile Section */}
      <section className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Profile</h2>
        <ProfileSettingsClient initialProfile={profile} user={user} />
      </section>

      {/* Account Section */}
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">Account</h2>
        <AccountSettingsForm initialName={displayName} email={user.email ?? ''} />
      </section>
    </div>
  );
}
