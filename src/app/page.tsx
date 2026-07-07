import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function LandingPage() {
  // Check user auth
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[50px] -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-xs font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase mb-8 animate-pulse">
            Gemini 2.5 Flash Powered
          </span>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 bg-gradient-to-r from-white via-zinc-200 to-indigo-500 bg-clip-text text-transparent">
            Discover Your Unique Style Blueprint
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Upload a single selfie. Receive a comprehensive face golden-ratio report, physical parameter analysis, and personalized evidence-based recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <Link href={user ? "/upload" : "/register"} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 text-center cursor-pointer">
              Get Started
            </Link>
            <Link href="#features" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl border border-white/5 transition-all text-center">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-3 text-white">
          Aesthetic Diagnostics Engine
        </h2>
        <p className="text-center text-zinc-400 max-w-lg mx-auto mb-12">
          Facial structure mapping, skin profiles, and physical parameter analysis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-2xl border border-indigo-500/20 mb-6">
              📐
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Facial Symmetry</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Measures lateral eye alignment, horizontal thirds ratio, nose and lip symmetry to compute structural geometry.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center text-2xl border border-purple-500/20 mb-6">
              ✨
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Skin Profile</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Identifies skin texture properties, tone values, hydration levels, congestion, and glow outputs.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-2xl border border-emerald-500/20 mb-6">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Feature Analysis</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Deep assessment of eyebrows shape, eye puffiness, nasal proportion, jaw contours, and cheekbone definition.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 border-t border-white/5 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-3 text-white">
          Scan Membership Packages
        </h2>
        <p className="text-center text-zinc-400 mb-12">
          Select the perfect access level. Upgrade anytime with a single tap.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          
          {/* Basic Tier */}
          <div className="glass-card rounded-2xl p-8 border border-indigo-500/20 shadow-md shadow-indigo-500/5 flex flex-col justify-between relative">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-4">
                Basic Plan
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2">Plus Scanner</h3>
              <div className="text-4xl font-black text-white mb-6">
                ₹49<span className="text-xs text-zinc-400 font-medium">/ package</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                <li>✓ 5 Full Face Scans</li>
                <li>✓ Golden-Ratio Symmetry report</li>
                <li>✓ Actionable corrective suggestions</li>
                <li>✓ Morning & Night daily care routine</li>
                <li>✓ Privacy-first temporary processing</li>
                <li className="line-through opacity-45">✗ 30-Day step plan timeline</li>
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center transition-all shadow-md shadow-indigo-600/10 cursor-pointer">
              Upgrade Now
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="glass-card rounded-2xl p-8 border border-purple-500/20 shadow-md shadow-purple-500/5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-4">
                Premium Plan
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2">Ultimate Pro</h3>
              <div className="text-4xl font-black text-white mb-6">
                ₹99<span className="text-xs text-zinc-400 font-medium">/ package</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                <li>✓ Unlimited AI Face Scans</li>
                <li>✓ Golden-Ratio Symmetry report</li>
                <li>✓ Actionable corrective suggestions</li>
                <li>✓ Morning & Night daily care routine</li>
                <li>✓ 30-Day step plan timeline</li>
                <li>✓ PDF report downloads</li>
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl text-center transition-all shadow-md shadow-purple-600/10 cursor-pointer">
              Upgrade Now
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
