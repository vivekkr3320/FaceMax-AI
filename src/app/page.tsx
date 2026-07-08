import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function LandingPage() {
  // Check user auth
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="pb-20 space-y-20 fade-in">
      
      {/* Hero Section Grid */}
      <section className="grid grid-cols-12 gap-8 items-center pt-8 md:pt-16 px-4">
        
        {/* Left Column Copy and Actions */}
        <div className="col-span-12 lg:col-span-7 text-left space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
            <span className="animate-pulse">✨</span> AI-powered facial assessment
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white max-w-xl">
            Know Your Face.<br />
            Improve with <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Confidence.</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Get a detailed AI facial assessment with skin analysis, symmetry mapping, and personalized recommendations to help you become the best version of yourself.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 items-center pt-2">
            <Link 
              href={user ? "/upload" : "/register"} 
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 text-center flex items-center gap-2 cursor-pointer text-sm"
            >
              Start Your Assessment
              <span className="text-base">→</span>
            </Link>
            
            <a 
              href="#features" 
              className="px-6 py-3.5 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-350 hover:text-white font-semibold rounded-xl border border-white/5 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              {/* SVG Play Icon */}
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              How It Works
            </a>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 text-sm">✓</span>
              <span>100% Privacy First</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 text-sm">⚡</span>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 text-sm">🔒</span>
              <span>Secure & Encrypted</span>
            </div>
          </div>

        </div>

        {/* Right Column Portrait & Widgets */}
        <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
          
          {/* Main Portrait Frame with Face Grid Overlay */}
          <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <img 
              src="/hero-portrait.png" 
              alt="FaceMax AI Model Scan" 
              className="w-full h-full object-cover" 
            />
            {/* Holographic scanner layout overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/90 via-transparent to-[#030303]/20" />
            <div className="scan-line opacity-20" />
          </div>

          {/* Widget 1: Overall Score (Floating Left) */}
          <div className="absolute bottom-[20%] left-[-20px] md:left-[-40px] glass-card rounded-2xl p-4 border border-white/5 shadow-2xl flex flex-col items-center justify-center w-28 md:w-32 py-5 z-10">
            <span className="text-[9px] text-zinc-450 uppercase tracking-widest font-black mb-2">Overall Score</span>
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "conic-gradient(#6366f1 84%, rgba(255,255,255,0.05) 0)" }}>
              <div className="w-[52px] h-[52px] rounded-full bg-zinc-950 flex flex-col items-center justify-center">
                <strong className="text-white text-lg font-black leading-none">84</strong>
                <span className="text-[8px] text-zinc-550 mt-0.5">/100</span>
              </div>
            </div>
          </div>

          {/* Floating Right Score metrics widgets */}
          <div className="absolute right-[-20px] md:right-[-40px] top-[10%] space-y-4 w-40 md:w-44 z-10">
            
            {/* Skin Health */}
            <div className="glass-card rounded-xl p-3 border border-white/5 shadow-2xl flex flex-col gap-1.5 bg-zinc-950/75 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-xs">🛡️</span>
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider">Skin Health</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "82%" }} />
              </div>
              <div className="text-right text-[10px] text-zinc-400 font-mono"><strong>82</strong>/100</div>
            </div>

            {/* Symmetry */}
            <div className="glass-card rounded-xl p-3 border border-white/5 shadow-2xl flex flex-col gap-1.5 bg-zinc-950/75 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-xs">📐</span>
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider">Symmetry</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "78%" }} />
              </div>
              <div className="text-right text-[10px] text-zinc-400 font-mono"><strong>78</strong>/100</div>
            </div>

            {/* Jawline */}
            <div className="glass-card rounded-xl p-3 border border-white/5 shadow-2xl flex flex-col gap-1.5 bg-zinc-950/75 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-xs">😊</span>
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider">Jawline</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "85%" }} />
              </div>
              <div className="text-right text-[10px] text-zinc-400 font-mono"><strong>85</strong>/100</div>
            </div>

          </div>

        </div>

      </section>

      {/* Bottom Niche Feature Bar matching mockup exactly */}
      <section className="glass-card rounded-2xl p-6 border border-white/5 shadow-xl max-w-6xl mx-auto px-4 sm:px-8 bg-zinc-950/60 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-left">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-indigo-400">🔍</span>
              <h4 className="text-xs font-bold text-white tracking-wider">Face Shape</h4>
            </div>
            <p className="text-[10px] text-zinc-450 pl-7">7 types detected</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-indigo-400">✨</span>
              <h4 className="text-xs font-bold text-white tracking-wider">Skin Analysis</h4>
            </div>
            <p className="text-[10px] text-zinc-450 pl-7">10+ skin metrics</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-indigo-400">📐</span>
              <h4 className="text-xs font-bold text-white tracking-wider">Symmetry Mapping</h4>
            </div>
            <p className="text-[10px] text-zinc-450 pl-7">Precision analysis</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-indigo-400">🎯</span>
              <h4 className="text-xs font-bold text-white tracking-wider">11+ Parameters</h4>
            </div>
            <p className="text-[10px] text-zinc-450 pl-7">Detailed evaluation</p>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-indigo-400">📋</span>
              <h4 className="text-xs font-bold text-white tracking-wider">Personalized Plan</h4>
            </div>
            <p className="text-[10px] text-zinc-450 pl-7">Daily + 30 day plan</p>
          </div>

        </div>
      </section>

      {/* Aesthetic Diagnostics Features info block */}
      <section id="features" className="py-8 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center tracking-tight mb-3 text-white">
          Aesthetic Diagnostics Engine
        </h2>
        <p className="text-center text-zinc-400 max-w-lg mx-auto mb-12 text-sm leading-relaxed">
          Facial structure mapping, skin health parameters, and evidence-based suggestions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-2xl border border-indigo-500/20 mb-6">
              📐
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Facial Symmetry</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Measures lateral eye alignment, horizontal thirds ratio, nose alignment, and lip planes to compute structural geometry.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center text-2xl border border-purple-500/20 mb-6">
              ✨
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Skin Profile</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Identifies skin texture properties, tone values, hydration levels, congestion, spots, redness, and glow outputs.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-2xl border border-emerald-500/20 mb-6">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Feature Analysis</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Deep assessment of eyebrows shape, eye dark circles, nasal proportion, jaw contours, and cheekbone definition.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-8 border-t border-white/5 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center tracking-tight mb-3 text-white">
          Personalized Facial Assessment Reports
        </h2>
        <p className="text-center text-zinc-400 mb-12 text-sm leading-relaxed">
          Select the perfect format for your needs. Pay-per-report with 0 subscription overhead.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Quick Assessment */}
          <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-md flex flex-col justify-between relative">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-4">
                ₹49 package
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2">Quick Facial Assessment</h3>
              <div className="text-4xl font-black text-white mb-6">
                ₹49<span className="text-xs text-zinc-400 font-medium">/ report</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                <li>✓ Overall Face Health Score</li>
                <li>✓ Face Shape mapping</li>
                <li>✓ Skin parameters (Acne, red, spots)</li>
                <li>✓ Feature symmetry & balance scores</li>
                <li>✓ Morning & Night daily care routine</li>
                <li className="line-through opacity-45">✗ 30-Day step plan timeline</li>
                <li className="line-through opacity-45">✗ PDF report download option</li>
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center transition-all shadow-md shadow-indigo-600/10 cursor-pointer">
              Get Quick Plan
            </Link>
          </div>

          {/* Complete Assessment */}
          <div className="glass-card rounded-2xl p-8 border border-purple-500/20 shadow-md flex flex-col justify-between relative">
            <span className="absolute top-[-10px] right-6 px-2.5 py-0.5 bg-purple-600 text-white text-4xs font-black rounded-full uppercase tracking-widest">
              Most Popular
            </span>
            <div>
              <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-4">
                ₹99 package
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2">Complete Facial Assessment</h3>
              <div className="text-4xl font-black text-white mb-6">
                ₹99<span className="text-xs text-zinc-400 font-medium">/ report</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-450 mb-8">
                <li>✓ Overall Face Health Score</li>
                <li>✓ Face Shape mapping</li>
                <li>✓ Skin parameters (Acne, red, spots)</li>
                <li>✓ Feature symmetry & balance scores</li>
                <li>✓ Morning & Night daily care routine</li>
                <li>✓ <strong>30-Day step plan timeline</strong></li>
                <li>✓ <strong>High-quality PDF report download</strong></li>
                <li>✓ <strong>Progress baseline curve tracking</strong></li>
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl text-center transition-all shadow-md shadow-purple-600/10 cursor-pointer">
              Get Complete Plan
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
