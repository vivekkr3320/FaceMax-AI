import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 fade-in">
      <div className="mb-8 border-b border-white/5 pb-4">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white mt-4 tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 text-xs mt-1">Last Updated: July 2026</p>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
        <p>
          At GlowScan AI, we take your privacy extremely seriously. Because we process facial images, we enforce stricter privacy measures than typical SaaS platforms.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">1. Image Processing & No Permanent Storage</h2>
          <p>
            When you upload an image for a facial health assessment, the image file is processed <strong>strictly in-memory</strong>. 
            We do not save your photo to any database, permanent storage buckets, or local hard drives. 
            The image is buffered in RAM, sent securely to the Gemini API via encrypted SSL, analyzed, and immediately discarded from memory once the report is generated.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">2. What Data We Store</h2>
          <p>
            We only store:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your account email address and username.</li>
            <li>The generated numerical scores (overall score, symmetry score, glow, hydration).</li>
            <li>The text-based diagnostic observations and daily routine recommendations.</li>
            <li>Billing logs and payment statuses via Razorpay.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">3. Third-Party Integrations</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>AI Analysis</strong>: We use the Google Gemini API to analyze visual feature balances. No user emails or identifiers are sent to Google.</li>
            <li><strong>Payments</strong>: Razorpay processes checkout billing safely. We do not store or see credit card credentials.</li>
            <li><strong>Emails</strong>: Resend processes receipt/report emails.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">4. Contact Us</h2>
          <p>
            For any questions or account deletion requests, please contact us at <strong>privacy@glowscan.ai</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
