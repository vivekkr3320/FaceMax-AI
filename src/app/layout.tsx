import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavbarLinks from "@/components/navbar-links";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FaceMax AI — Professional Facial Assessment",
  description: "Get structured facial symmetry, skin analysis, and personalized style recommendations using advanced AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check auth session
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#09090B] text-zinc-350 font-sans">
        
        {/* Niche Face Scanner Coordinate Background */}
        <div className="niche-grid-bg">
          {/* Drifting Glow Blobs */}
          <div className="glow-blob blob-1" />
          <div className="glow-blob blob-2" />
          <div className="glow-blob blob-3" />
          
          {/* Rotating HUD Radar Circles */}
          <div className="hud-circle hud-c1" />
          <div className="hud-circle hud-c2" />
          <div className="hud-circle hud-c3" />

          {/* Coordinate Scan Markers */}
          <div className="scan-coordinate-marker marker-tl" />
          <div className="scan-coordinate-marker marker-tr" />
          <div className="scan-coordinate-marker marker-bl" />
          <div className="scan-coordinate-marker marker-br" />
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#09090B]/60 border-b border-white/5 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:h-20 gap-4">
              
              {/* Custom FaceMax AI Logo matching Mockup */}
              <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white hover:opacity-90">
                <svg className="w-7 h-7 text-[#6D5EF8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 8V4h4" />
                  <path d="M20 8V4h-4" />
                  <path d="M4 16v4h4" />
                  <path d="M20 16v4h-4" />
                  <circle cx="12" cy="11" r="3" />
                  <path d="M9 17c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" />
                </svg>
                <span className="font-extrabold text-white">FaceMax <span className="text-[#6D5EF8]">AI</span></span>
              </Link>

              {/* Navigation links matching mockup layout */}
              <NavbarLinks />

              {/* Navigation Action CTA buttons */}
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/dashboard" className="px-4 py-2 text-xs font-bold text-[#C5CAD6] hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/upload" className="px-5 py-2.5 bg-[#6D5EF8] hover:bg-[#7B6DFF] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#6D5EF8]/10">
                      New Assessment
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-5 py-2 text-xs font-bold text-[#C5CAD6] hover:text-white transition-colors border border-white/10 hover:border-white/20 rounded-lg h-9 flex items-center justify-center">
                      Sign In
                    </Link>
                    <Link href="/register" className="px-5 py-2 text-xs font-bold bg-[#6D5EF8] hover:bg-[#7B6DFF] text-white rounded-lg h-9 flex items-center justify-center transition-all shadow-md shadow-[#6D5EF8]/10">
                      Get Started
                    </Link>
                  </>
                )}
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </main>

        <footer className="w-full border-t border-white/5 bg-[#111216]/40 py-6 text-center text-xs text-[#7C8495] no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>© 2026 FaceMax AI. All rights reserved. Privacy-first, secure memory diagnostics.</div>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-[#6D5EF8] transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#6D5EF8] transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-[#6D5EF8] transition-colors">Refund Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
