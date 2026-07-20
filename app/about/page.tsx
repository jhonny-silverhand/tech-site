export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">About tech // site</h1>
      <div className="prose-tech mt-8">
        <p className="font-mono text-[14px] text-muted">
          Built with Next.js + Supabase.
        </p>  
        <p>
          tech // site runs on a deliberately split publishing model. A single admin account covers nine sections —
          AI Tools, Programming, Android, Windows &amp; Linux, Buying Guides, Gaming, Career &amp; Jobs, Finance,
          and Productivity — and can draft with AI to move faster across all of them. Every AI-assisted draft is
          read and edited by the admin before it publishes, and it's labeled as AI-assisted on the article itself
          so readers always know.
        </p>
        <p>
          Alongside that, anyone can sign up and publish under their own name, the way you would on Medium. No AI
          tools are available on that side — just a clean editor, a draft/publish flow, and full ownership of
          what you write.
        </p>
        <p>
          Both paths land in the same nine sections, so the fastest way to find something useful is usually to
          just browse the section that matches what you're trying to do.
        </p>
        <p>
          
        </p>
      </div>
    </div>
  );
}
