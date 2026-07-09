import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 fade-in">
      <div className="mb-8 border-b border-white/5 pb-4">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white mt-4 tracking-tight">Terms of Service</h1>
        <p className="text-zinc-500 text-xs mt-1">Last Updated: July 2026</p>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
        <p>
          By creating an account or purchasing any facial assessment report on FaceMax AI, you agree to these Terms of Service.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">1. Description of Service</h2>
          <p>
            FaceMax AI provides professional facial feature analyses, skin condition estimates, and daily routines. The generated reports are based on computer vision patterns.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">2. Medical Disclaimer</h2>
          <p className="border-l-2 border-indigo-500 pl-4 py-1.5 italic text-zinc-300">
            Our diagnostics, health scores, and suggestions are provided for informational and aesthetic tracking purposes only. They do not constitute medical diagnosis, clinical skincare advice, or medical treatment plans. 
            Always consult a licensed dermatologist or physician for clinical issues.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">3. User Responsibility</h2>
          <p>
            You must upload clear, front-facing selfies of yourself. You may not upload photos of others without their explicit consent. We reserve the right to refuse image processing if validation checks fail.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">4. Payments & Purchases</h2>
          <p>
            Purchases of "Quick Facial Assessment" (₹49) and "Complete Facial Assessment" (₹99) are processed on a transactional per-report basis. You own the reports generated.
          </p>
        </section>
      </div>
    </div>
  );
}
