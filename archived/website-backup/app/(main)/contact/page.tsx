export const metadata = { title: 'Contact' };

// Replace this with your real inbox — see Guides/03-what-to-edit.md.
const CONTACT_EMAIL = 'jhonnysilverhand.069@gmail.com';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">Contact</h1>
      <div className="prose-tech mt-8 space-y-6">
        <p>
          For corrections, takedown requests, partnership questions, or anything else, the fastest way to reach
          us is email:
        </p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>We read everything that comes in, but please allow a few days for a reply.</p>

        <hr className="border-line my-8" />

        <h2 className="font-display text-2xl text-ink mb-4">What to Email About</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Corrections:</strong> Factual errors, broken links, outdated pricing, or outdated specs in any article.
          </li>
          <li><strong>Takedown requests:</strong> Copyright, DMCA, or other legal removal requests.
          </li>
          <li><strong>Partnership inquiries:</strong> Editorial collaborations, buying guide features, product review units.
          </li>
          <li><strong>Technical issues:</strong> Site bugs, broken functionality, accessibility problems.
          </li>
          <li><strong>General feedback:</strong> Suggestions, praise, complaints — we read it all.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">Response Time</h2>
        <p>
          We read every message personally. Most inquiries receive a response within 2–3 business days.
          Complex requests (legal, partnership) may take longer.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">Other Ways to Connect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <a href="https://ko-fi.com/whysoserious_omik#setGoalModal" target="_blank" rel="noopener noreferrer" className="font-mono hover:text-accent transition-colors">
              Support us on Ko-fi
            </a>
          </li>
        </ul>

        <h2 className="font-display text-2xl text-ink mt-10 mb-4">For Creators & Writers</h2>
        <p>
          Want to write for tech//site? <a href="/signup" className="text-accent hover:underline">Sign up</a> and start publishing
          under your own name — no AI tools, just a clean editor and full ownership of your work.
        </p>
      </div>
    </div>
  );
}