export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-3 font-mono text-[12px] text-muted">Last updated: [add date when you publish this]</p>

      <div className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
        This is a starting template, not legal advice. It covers what this codebase actually does with data as
        shipped. Before you launch — especially if you'll have visitors in the EU/UK (GDPR) or California
        (CCPA) — have it reviewed by someone qualified, and update it if you add analytics, ads, or anything
        that changes what's collected.
      </div>

      <div className="prose-tech mt-8">
        <h2>What we collect</h2>
        <p>
          If you only read articles, this site does not require an account and does not set any tracking
          cookies by default. If you create an account to publish your own posts, we store the email address
          and password you sign up with (handled by our authentication provider, Supabase — we never see or
          store your raw password) and the display name and content you choose to publish.
        </p>

        <h2>How we use it</h2>
        <p>
          Account data is used to let you sign in, attribute posts to you, and let you manage your own drafts
          and published articles. We don't sell personal data, and we don't share it with third parties except
          the infrastructure providers required to run the site (currently Supabase for the database and
          authentication, and our hosting provider).
        </p>

        <h2>Cookies</h2>
        <p>
          If you sign in, we set a session cookie so you stay signed in between visits. If this site later adds
          analytics or ad services (for example Google Analytics or AdSense), update this section to name them
          specifically, since both typically set their own cookies for measurement and ad personalization.
        </p>

        <h2>Your content</h2>
        <p>
          Posts you publish under your account remain visible publicly until you delete them or your account.
          Draft posts are visible only to you and to the site admin.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request a copy of your account data or request deletion of your account and associated posts
          at any time by contacting us on the Contact page. We'll action deletion requests within a reasonable
          timeframe.
        </p>

        <h2>Children's privacy</h2>
        <p>This site is not directed at children under 13, and we don't knowingly collect data from them.</p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, we'll update the date at the top of this page. Significant changes will be
          noted here.
        </p>
      </div>
    </div>
  );
}
