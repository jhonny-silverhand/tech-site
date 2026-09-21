export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <div className="prose-tech mt-6">
        <p>Last updated: January 2026.</p>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account data:</strong> email and profile details you provide at signup (stored in Supabase Auth).</li>
          <li><strong>Library data:</strong> bookmarks, history, collections, highlights, and notes — visible only to you.</li>
          <li><strong>Usage:</strong> anonymous page views via Vercel Speed Insights.</li>
        </ul>
        <h2>What we never do</h2>
        <ul>
          <li>Sell your data. Ever.</li>
          <li>Share private notes or highlights with anyone, including authors.</li>
          <li>Track you across other websites.</li>
        </ul>
        <h2>Your rights</h2>
        <p>Delete your account anytime from settings — library data is cascade-deleted. Contact us for data export requests.</p>
        <h2>Cookies</h2>
        <p>We use essential cookies for auth sessions (Supabase + admin JWT) and a localStorage flag for feature tips. No advertising cookies.</p>
        <h2>AI product data</h2>
        <ul>
          <li><strong>Live estimates:</strong> product specs and prices on shopping, compare, and product pages are fetched live from AI at request time. Prices are estimates and can be wrong or outdated — always verify on the retailer&apos;s site before buying.</li>
          <li><strong>No endorsement:</strong> listings do not constitute endorsement. Comparisons pick winners by spec value, not by commercial relationship.</li>
          <li><strong>External research links:</strong> price-history (PriceBefore, PriceHistory.in) and spec-comparison (GSMArena, Versus) links go to third-party sites with their own privacy policies. We share no personal data with them.</li>
        </ul>
        <h2>Affiliate disclosure</h2>
        <p>Some retailer links are affiliate links — if you buy through them we may earn a commission at no extra cost to you. This never influences rankings, verdicts, or recommendations. Clicking a retailer link shares only the product identifier via the URL; never your account or browsing data.</p>
        <h2>Shopping data</h2>
        <ul>
          <li><strong>What we process:</strong> your search queries, budgets, comparisons, wishlists, and retailer click-throughs to run Shopping Intelligence.</li>
          <li><strong>What we never do:</strong> sell shopping preferences, use wishlists for targeted ads, or share budgets with third parties.</li>
          <li><strong>Retention:</strong> session preferences clear when you close the browser; wishlists persist until you remove items or delete your account (cascade-deleted within 30 days).</li>
        </ul>
        <h2>Contact</h2>
        <p>Privacy questions or data requests: contact us via the contact page. We respond within 30 days.</p>
      </div>
    </div>
  );
}
