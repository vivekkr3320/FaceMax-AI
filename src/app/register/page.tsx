import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function RegisterPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  async function registerAction(formData: FormData) {
    "use server";
    
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      redirect("/register?error=Email and password are required.");
    }

    let redirectPath = "";

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (signUpError) {
        redirectPath = `/register?error=${encodeURIComponent(signUpError.message)}`;
      } else if (data?.user) {
        // Guarantee user profile row exists in the postgres 'users' table
        await supabase.from("users").insert({
          id: data.user.id,
          email,
          name,
          plan: "FREE",
        });
        redirectPath = "/dashboard";
      }
    } catch (e: any) {
      console.error(e);
      redirectPath = "/register?error=An unexpected error occurred during signup.";
    }

    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-140px)] px-4 py-8 fade-in">
      <div className="glass-card w-full max-w-[420px] rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black text-center tracking-tight text-white mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Analyze symmetry, glow, and find your aesthetic.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form action={registerAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="name">Full Name</label>
            <input className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" type="text" id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="email">Email Address</label>
            <input className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" type="email" id="email" name="email" placeholder="john@example.com" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="password">Password</label>
            <input className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" type="password" id="password" name="password" placeholder="••••••••" required />
          </div>

          <button className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/10 cursor-pointer" type="submit">
            Get Started
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
