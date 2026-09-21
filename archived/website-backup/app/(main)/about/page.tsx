import { getVersionInfo } from '@/lib/version';

export const metadata = { title: 'About' };

export default async function AboutPage() {
  const version = await getVersionInfo();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">About tech // site</h1>
      <div className="prose-tech mt-8 space-y-6">
        <p>tech//site runs on a deliberately split publishing model. A single admin account covers nine sections — AI Tools, Programming, Android, Windows & Linux, Buying Guides, Gaming, Career & Jobs, Finance, and Productivity — and can draft with AI to move faster across all of them. Every AI-assisted draft is read and edited by the admin before it publishes, and it's labeled as AI-assisted on the article itself so readers always know.</p>
        <p>Alongside that, anyone can sign up and publish under their own name, the way you would on Medium. No AI tools are available on that side — just a clean editor, a draft/publish flow, and full ownership of what you write.</p>
        <p>Both paths land in the same nine sections, so the fastest way to find something useful is usually to just browse the section that matches what you're trying to do.</p>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">The Model</h2>
        <p>We believe the best technology writing comes from two places: deep editorial expertise and authentic personal experience. tech//site is built around that duality.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><strong>Admin desk:</strong> One curated voice covering nine technology niches with AI-accelerated research and human editorial judgment. Every piece is fact-checked, edited, and labeled transparently.</li>
          <li><strong>Writer community:</strong> Open signup for anyone who wants to publish technology writing under their own name. No AI generation tools, no algorithmic feed manipulation — just a clean markdown editor and full ownership of your work.</li>
        </ul>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">The Niches</h2>
        <p>Each section has its own editorial identity, color, and focus:</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><strong>AI Tools:</strong> Reviews, comparisons, tutorials, and prompt libraries for the rapidly evolving AI landscape.
          </li>
          <li><strong>Programming:</strong> React, Next.js, Node.js, debugging guides, and code examples for working developers.
          </li>
          <li><strong>Android:</strong> Tips, tricks, app reviews, and customization for the world's most popular mobile OS.
          </li>
          <li><strong>Windows & Linux:</strong> Error fixes, tutorials, and optimization guides for desktop power users.
          </li>
          <li><strong>Tech Buying Guides:</strong> Phones, laptops, gadgets — comparisons and best-under-budget picks backed by specs and prices.
          </li>
          <li><strong>Gaming:</strong> Guides, builds, settings, tier lists for PC and console gamers.
          </li>
          <li><strong>Career & Jobs:</strong> Exam prep, eligibility guides, and career pathways in tech.
          </li>
          <li><strong>Finance:</strong> Banking, UPI, credit cards, investments — practical money decisions for tech professionals.
          </li>
          <li><strong>Productivity:</strong> Notion, VS Code, and AI-assisted workflows that actually save time.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">Shopping Intelligence</h2>
        <p>Our Shopping Intelligence system helps you make better technology buying decisions. Set a budget, pick priorities, describe your use case — we analyze specs, aggregate prices across retailers, and present recommendations with clear reasoning and explicit trade-offs. No AI hype, no paid placement, no fake discounts. Just editorial guidance backed by specs and live prices.</p>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">Editorial Independence</h2>
        <p>We don't accept paid placement, sponsored content, or affiliate revenue that influences recommendations. Prices come from supported retailer data. Every recommendation explains both strengths and compromises. If a product has a flaw, we say so.</p>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">The Team</h2>
        <p>tech//site is built and maintained by a small team of technology writers and engineers who believe that practical, well-researched guidance beats hype every time.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">Tech Stack</h2>
        <p className="font-mono text-[13px] text-muted">Next.js 15 (App Router) • React 19 • TypeScript • Tailwind CSS • Supabase (PostgreSQL + Auth + Storage) • Variable fonts: Fraunces, Cormorant Garamond, Inter, JetBrains Mono (self-hosted via Fontsource)</p>

        {version && (
          <>
            <h2 className="font-display text-2xl text-ink mt-10 mb-4">Version</h2>
            <p className="font-mono text-[13px] text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5 rounded bg-ink/5 px-2 py-0.5 border border-line">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                v{version.version}
              </span>
              {version.commit && (
                <a
                  href={`https://github.com/jhonny-silverhand/tech-site/commit/${version.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                  title={version.commitMessage}
                >
                  {version.commit}
                </a>
              )}
              {version.branch && <span className="text-muted/60">{version.branch}</span>}
              {version.builtAt && (
                <span className="text-muted/60">
                  built {new Date(version.builtAt).toLocaleDateString('en-IN')}
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}