import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 fade-in">
      <div className="mb-8 border-b border-white/5 pb-4">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white mt-4 tracking-tight">Refund Policy</h1>
        <p className="text-zinc-500 text-xs mt-1">Last Updated: July 2026</p>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
        <p>
          Thank you for choosing GlowScan AI. Please read this policy carefully.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">1. Assessment Processing Fees</h2>
          <p>
            Because report generation involves immediate computational costs via the Gemini API and secure serverless processing, we generally do not offer refunds once the report has been successfully generated.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">2. System Failures & Processing Issues</h2>
          <p>
            If your payment was processed successfully but a system failure occurred (e.g. Gemini returned an error, or the database transaction crashed), we will automatically refund the transaction or credit a new free scan.
            If your refund is not credited within 24 hours, contact us at <strong>billing@glowscan.ai</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">3. Chargeback Claims</h2>
          <p>
            For any dispute queries, we encourage contacting support first for swift resolutions.
          </p>
        </section>
      </div>
    </div>
  );
}
