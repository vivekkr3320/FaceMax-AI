import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  async function loginAction(formData: FormData) {
    "use server";
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      redirect("/login?error=Email and password are required.");
    }

    let redirectPath = "";

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        redirectPath = `/login?error=${encodeURIComponent(signInError.message)}`;
      } else {
        redirectPath = "/dashboard";
      }
    } catch (e: any) {
      console.error(e);
      redirectPath = "/login?error=An unexpected error occurred during login.";
    }

    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-140px)] px-4 py-8 fade-in">
      <div className="glass-card w-full max-w-[420px] rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black text-center tracking-tight text-white mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Sign in to access your scanner console.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form action={loginAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="email">Email Address</label>
            <input className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" type="email" id="email" name="email" placeholder="john@example.com" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="password">Password</label>
            <input className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" type="password" id="password" name="password" placeholder="••••••••" required />
          </div>

          <button className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/10 cursor-pointer" type="submit">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
