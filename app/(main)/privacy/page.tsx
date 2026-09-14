export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  const lastUpdated = 'September 14, 2026';
  const effectiveDate = 'September 14, 2026';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-2 font-mono text-[12px] text-muted">
        Last updated: {lastUpdated} • Effective: {effectiveDate}
      </p>

      <div className="prose-tech mt-8 space-y-8">
        <section>
          <h2 className="font-display text-2xl text-ink mb-4">1. Introduction</h2>
          <p>
            tech//site (&apos;we&apos;, &apos;us&apos;, &apos;our&apos;) respects your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website, create an account,
            publish articles, use our Shopping Intelligence features, or interact with our community.
          </p>
          <p>
            By using tech//site, you agree to the collection and use of information in accordance with this
            policy. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">2. Information We Collect</h2>
          <h3 className="font-display text-xl text-ink mt-6 mb-3">2.1 Information You Provide Directly</h3>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong>Account information:</strong> When you create an account, we collect your email address, display name, username, and password (securely hashed).</li>
            <li><strong>Profile information:</strong> Optional bio, avatar URL, website, social links (Twitter/X, GitHub, LinkedIn), and favorite niches.</li>
            <li><strong>Content you create:</strong> Articles, comments, highlights, private notes, and reading queue items you save.</li>
            <li><strong>Shopping preferences:</strong> Budget ranges, product priorities, use cases, preferred brands, and excluded brands you provide during guided searches.</li>
            <li><strong>Wishlist items:</strong> Products you save to your wishlist for later comparison or purchase.</li>
            <li><strong>Communications:</strong> Any messages you send us via email or contact forms.</li>
          </ul>

          <h3 className="font-display text-xl text-ink mt-6 mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong>Usage data:</strong> Pages visited, time spent, articles read, search queries, and feature interactions.</li>
            <li><strong>Device information:</strong> Browser type, operating system, device type, screen resolution, and IP address (anonymized).</li>
            <li><strong>Cookies and similar technologies:</strong> We use first-party cookies for authentication, preferences, and analytics. See our Cookie Policy below.</li>
          </ul>

          <h3 className="font-display text-xl text-ink mt-6 mb-3">2.3 Third-Party Sources</h3>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong>OAuth providers:</strong> If you sign up via OAuth (Google, GitHub, etc.), we may receive your email and basic profile from the provider with your consent.</li>
            <li><strong>Retailer data:</strong> Product information, pricing, and availability are sourced from retailer APIs (Amazon India, Flipkart, Croma, Reliance Digital) and publicly available catalog data.</li>
            <li><strong>Price tracking services:</strong> We reference third-party price history services (PriceBefore, PriceHistory.in) for historical pricing context. We do not share your personal data with these services.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-3 mt-4">
            <li><strong>Provide and improve the service:</strong> Authenticate you, deliver content, personalize your homepage, and enable features like Library, Shopping Intelligence, and following.</li>
            <li><strong>Shopping Intelligence:</strong> Use your budget, priorities, and use cases to generate personalized product recommendations. Shopping preferences are stored locally in your session and are not persisted unless you have an account.</li>
            <li><strong>Product recommendations:</strong> Match your stated preferences against our product catalog to surface relevant options. Recommendation data (queries, clicks, saves) may be used in aggregate to improve the recommendation engine.</li>
            <li><strong>Price alerts and tracking:</strong> If you opt in to price tracking features, we may store your watchlist and notify you of price changes via email or push notification.</li>
            <li><strong>Community features:</strong> Display your public profile, articles, comments, and follows to other users.</li>
            <li><strong>Security and fraud prevention:</strong> Detect and prevent abuse, spam, and unauthorized access.</li>
            <li><strong>Legal compliance:</strong> Comply with applicable laws, respond to legal requests, and enforce our Terms of Service.</li>
            <li><strong>Analytics:</strong> Understand how the site is used to improve content and features. We use privacy-respecting, self-hosted analytics where possible.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">4. Product Catalog Data</h2>
          <p className="mt-3">
            Our product catalog contains information about tech products across multiple categories. Please be aware:
          </p>
          <ul className="list-disc list-inside space-y-3 mt-4">
            <li><strong>Data accuracy:</strong> Product specifications, pricing, and availability are sourced from retailers and public catalogs. Prices may not reflect real-time values and can change without notice. Always verify pricing on the retailer&apos;s website before purchasing.</li>
            <li><strong>Synthetic development data:</strong> During development and testing, our catalog may include synthetic or seed data generated for development purposes. This data is clearly marked and will be replaced with verified product data before production use.</li>
            <li><strong>Affiliate relationships:</strong> Some product links are affiliate links. When you click through to a retailer and make a purchase, we may earn a commission at no additional cost to you. This does not influence our recommendations or editorial content.</li>
            <li><strong>Third-party comparisons:</strong> We provide links to external comparison services (GSMArena, Versus.com) for additional product research. These sites have their own privacy policies.</li>
            <li><strong>No endorsement:</strong> Product listings do not constitute endorsement. We strive to present objective information and clearly label sponsored content or paid placements.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">5. Information Sharing and Disclosure</h2>
          <p className="mt-3">
            We do not sell your personal information. We only share your data in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-3 mt-4">
            <li><strong>Public profile data:</strong> Your display name, username, bio, avatar, website, social links, and published articles are visible to other users and search engines.</li>
            <li><strong>Service providers:</strong> We use Supabase (database, auth, storage) and Vercel (hosting). These processors access data only to provide their services under strict data processing agreements.</li>
            <li><strong>Retailer referrals:</strong> When you click &quot;Buy from [Retailer]&quot; you are directed to the retailer&apos;s website. We share only the product identifier with the retailer via the referral URL. We do not share your account information, browsing history, or personal details with retailers.</li>
            <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or to protect our rights and safety.</li>
            <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred as part of the transaction.</li>
            <li><strong>Aggregated data:</strong> We may share anonymized, aggregated statistics (e.g., &apos;40% of users prefer laptops under 80k&apos;) that cannot identify you.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">6. Data Retention</h2>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion.</li>
            <li><strong>Published content:</strong> Articles, comments, and public profiles remain unless you delete them or request removal.</li>
            <li><strong>Shopping preferences:</strong> Session-based preferences (budget, priorities) are cleared when you close your browser. If you have an account, saved searches and wishlists are retained until you delete them.</li>
            <li><strong>Wishlist data:</strong> Retained while your account is active. Deleted within 30 days of account deletion.</li>
            <li><strong>Analytics data:</strong> Aggregated usage data retained for up to 24 months.</li>
            <li><strong>Logs and security data:</strong> Retained for up to 12 months for security and debugging.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">7. Your Rights</h2>
          <p className="mt-3">
            Depending on your location, you may have the following rights under applicable data protection laws (GDPR, CCPA, etc.):
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Access:</strong> Request a copy of your personal data.</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
            <li><strong>Erasure:</strong> Request deletion of your data (subject to legal obligations).</li>
            <li><strong>Restriction:</strong> Limit how we process your data.</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection:</strong> Object to processing for direct marketing or legitimate interests.</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, email us at <a href="mailto:privacy@tech-site.example" className="font-mono">privacy@tech-site.example</a>.
            We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">8. Cookies and Tracking</h2>
          <h3 className="font-display text-xl text-ink mt-6 mb-3">8.1 Types of Cookies</h3>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong>Essential:</strong> Authentication, session management, CSRF protection. Cannot be disabled.</li>
            <li><strong>Preferences:</strong> Theme, language, layout preferences.</li>
            <li><strong>Analytics:</strong> Anonymous usage statistics (self-hosted, no third-party trackers).</li>
          </ul>
          <h3 className="font-display text-xl text-ink mt-6 mb-3">8.2 Managing Cookies</h3>
          <p className="mt-3">
            You can manage or disable cookies via your browser settings. Disabling essential cookies will break
            authentication and core functionality. We do not use third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">9. Shopping Intelligence and Wishlist Data</h2>
          <p className="mt-3">
            When you use Shopping Intelligence features (guided search, recommendations, comparisons, wishlists), we process:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Your search queries, budget, priorities, and use cases to generate recommendations.</li>
            <li>Products you view, compare, save to your wishlist, or click through to retailers.</li>
            <li>Your feedback (helpful/not helpful) to improve recommendations.</li>
          </ul>
          <p className="mt-3">
            <strong>What we do NOT do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>We do not sell your shopping preferences or browsing history to retailers or advertisers.</li>
            <li>We do not use your wishlist data to send you targeted advertisements.</li>
            <li>We do not share your budget or priority information with third parties.</li>
            <li>We do not track you across retailer websites after you click &quot;Buy.&quot;</li>
          </ul>
          <p className="mt-3">
            Price tracking data (historical prices, price drop alerts) is sourced from public retailer pages and
            third-party price tracking services. We do not scrape retailer websites using your session or credentials.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">10. Children&apos;s Privacy</h2>
          <p className="mt-3">
            tech//site is not directed at children under 16. We do not knowingly collect personal information from
            children under 16. If you believe we have collected such information, contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">11. International Data Transfers</h2>
          <p className="mt-3">
            Our servers are hosted in the United States (Vercel) and the European Union (Supabase). By using the site,
            you consent to the transfer of your data to these jurisdictions. We rely on Standard Contractual Clauses
            and adequacy decisions for cross-border transfers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">12. Security</h2>
          <p className="mt-3">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
            <li>Passwords hashed with bcrypt (cost factor 12)</li>
            <li>Row-level security (RLS) policies on all database tables</li>
            <li>Regular security reviews and dependency scanning</li>
            <li>Principle of least privilege for internal access</li>
          </ul>
          <p className="mt-3">
            No system is 100% secure. In the event of a breach affecting your data, we will notify you as required by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">13. Changes to This Policy</h2>
          <p className="mt-3">
            We may update this policy occasionally. Material changes will be posted here with a revised &apos;Last updated&apos;
            date. For significant changes, we will notify you via email or a prominent site notice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">14. Contact Us</h2>
          <p className="mt-3">
            Questions or concerns about this policy? Contact our Data Protection Officer:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 font-mono text-[13px]">
            <li>Email: <a href="mailto:privacy@tech-site.example" className="text-accent hover:underline">privacy@tech-site.example</a></li>
            <li>Post: tech//site, Data Protection Officer, [Your Jurisdiction]</li>
          </ul>
        </section>

        <hr className="border-line my-12" />

        <p className="font-mono text-[11px] text-muted text-center">
          This policy was last reviewed and updated on <strong>{lastUpdated}</strong> by the tech//site team.
          <br />
          Signed: <strong>tech//site Editorial Team</strong> • <strong>{effectiveDate}</strong>
        </p>
      </div>
    </div>
  );
}
