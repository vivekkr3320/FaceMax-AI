"use client";

import { useRouter } from "next/navigation";

interface PricingClientProps {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

export default function PricingClient({ user }: PricingClientProps) {
  const router = useRouter();

  const handleSelect = () => {
    if (!user) {
      router.push("/register?error=Please create an account to start your assessment.");
    } else {
      router.push("/upload");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Personalized Facial Assessment Plans
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
          Select the perfect report format. Get access to detailed skin parameters, structural balance analysis, and daily care routines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Quick Facial Assessment (₹49) */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-white/5">
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-2xs font-bold rounded-full uppercase tracking-wider">
                ₹49 package
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Quick Facial Assessment</h3>
            <p className="text-zinc-400 text-sm mb-6">
              A swift structural health snapshot of your facial features.
            </p>
            <div className="text-4xl font-black text-white mb-6">
              ₹49<span className="text-xs text-zinc-400 font-medium">/ report</span>
            </div>

            <ul className="space-y-4 text-sm text-zinc-400 mb-8">
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Overall Face Health Score</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Face Shape mapping</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Skin parameters (Acne, red, spots)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Feature symmetry & balance observations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Morning & Night daily care routine</span>
              </li>
              <li className="flex gap-2 opacity-35 line-through">
                <span>✗</span>
                <span>30-Day step plan timeline</span>
              </li>
              <li className="flex gap-2 opacity-35 line-through">
                <span>✗</span>
                <span>PDF report download option</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleSelect}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            Select Quick Plan
          </button>
        </div>

        {/* Complete Facial Assessment (₹99) */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-purple-500/30 relative shadow-lg shadow-purple-500/5">
          <span className="absolute top-[-12px] right-6 px-3 py-1 bg-purple-650 text-white text-3xs font-black rounded-full uppercase tracking-widest">
            Most Popular
          </span>
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-2xs font-bold rounded-full uppercase tracking-wider">
                ₹99 package
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Complete Facial Assessment</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Our most comprehensive aesthetic and skin health analysis blueprint.
            </p>
            <div className="text-4xl font-black text-white mb-6">
              ₹99<span className="text-xs text-zinc-400 font-medium">/ report</span>
            </div>

            <ul className="space-y-4 text-sm text-zinc-400 mb-8">
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Overall Face Health Score</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Face Shape mapping</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Skin parameters (Acne, red, spots)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Feature symmetry & balance observations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Morning & Night daily care routine</span>
              </li>
              <li className="flex gap-2 text-white">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong>30-Day step plan timeline</strong></span>
              </li>
              <li className="flex gap-2 text-white">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong>High-quality PDF report download</strong></span>
              </li>
              <li className="flex gap-2 text-white">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong>Progress baseline curve tracking</strong></span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleSelect}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-600/15 cursor-pointer"
          >
            Select Complete Plan
          </button>
        </div>
      </div>
    </div>
  );
}
