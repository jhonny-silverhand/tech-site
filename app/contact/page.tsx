export const metadata = { title: 'Contact' };

// Replace this with your real inbox — see Guides/03-what-to-edit.md.
const CONTACT_EMAIL = 'hello@tech-site.example';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">Contact</h1>
      <div className="prose-tech mt-8">
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
      </div>
    </div>
  );
}
