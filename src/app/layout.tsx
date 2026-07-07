import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GlowScan AI — Professional Facial Assessment",
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
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-zinc-50 font-sans">
        
        {/* Glow backgrounds */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[5%] w-[450px] height-[450px] bg-indigo-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[450px] height-[450px] bg-purple-500/5 rounded-full blur-[80px]" />
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/75 border-b border-white/5 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between py-4 md:h-18 gap-4">
              
              <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white hover:opacity-90">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">GlowScan AI</span>
              </Link>

              <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-400">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/upload" className="hover:text-white transition-colors">New Assessment</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/purchase-history" className="hover:text-white transition-colors">Billing</Link>
                    <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
                    
                    {/* Logout is handled in a simple form posting to server-action or client route */}
                    <form action="/api/auth/logout" method="POST" className="inline">
                      <button type="submit" className="px-4 py-2 text-xs font-semibold rounded-md border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/login" className="px-4 py-2 text-xs font-semibold rounded-md border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-center">
                      Sign In
                    </Link>
                    <Link href="/register" className="px-4 py-2 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 text-center">
                      Get Started
                    </Link>
                  </>
                )}
              </nav>

            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="w-full border-t border-white/5 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>© 2026 GlowScan AI. All rights reserved. Privacy-first, secure memory diagnostics.</div>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
