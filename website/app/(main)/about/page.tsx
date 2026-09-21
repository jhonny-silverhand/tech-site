export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">About tech//site</h1>
      <p className="mt-2 font-tagline text-xl italic text-muted">Practical answers, not filler.</p>
      <div className="prose-tech mt-6">
        <p>
          tech//site is a premium technology publication covering AI, programming, gadgets, gaming, careers,
          finance, and productivity — with a focus on India: real INR prices, local retailers, and advice that
          works on the internet and incomes we actually have.
        </p>
        <h2>What we do differently</h2>
        <ul>
          <li><strong>Dual data mode:</strong> every page works with or without a database connection.</li>
          <li><strong>AI-powered tools:</strong> shopping recommendations, PC builds, and draft assistance via Gemini.</li>
          <li><strong>Your library:</strong> bookmarks, history, queues, collections, highlights, and private notes.</li>
          <li><strong>Product intelligence:</strong> specs, retailers, and price comparison — not sponsored rankings.</li>
        </ul>
        <h2>Contact</h2>
        <p>Questions, corrections, or partnership ideas? Head to the <a href="/contact">contact page</a>.</p>
      </div>
    </div>
  );
}
