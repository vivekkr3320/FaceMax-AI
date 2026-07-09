import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Account Profile Settings — FaceMax AI",
  description: "Manage your personal profile, email settings, and active scan memberships.",
};

export default async function ProfilePage() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Retrieve user plan details
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Retrieve count of user reports
  const { data: reports } = await supabase
    .from("reports")
    .select("id")
    .eq("user_id", user.id);

  const scanCount = reports?.length || 0;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Settings</h1>
        <p className="text-zinc-400 text-sm">Manage your personal profile and diagnostic reports history.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-xl mb-6">
        <h2 className="text-lg font-bold text-white mb-6">Personal Details</h2>
        
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-zinc-400">Full Name</span>
            <strong className="text-white">{dbUser?.name || "N/A"}</strong>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-zinc-400">Email Address</span>
            <strong className="text-white">{user.email}</strong>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-zinc-400">Total Assessments Purchased</span>
            <strong className="text-white">{scanCount}</strong>
          </div>

          <div className="flex justify-between pt-1">
            <span className="text-zinc-400">Joined On</span>
            <strong className="text-white">
              {dbUser?.created_at ? new Date(dbUser.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : "N/A"}
            </strong>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-xl text-center">
        <h3 className="text-base font-bold text-white mb-2">Request New Face Assessment</h3>
        <p className="text-zinc-400 text-xs leading-relaxed mb-6">
          Get a professional analysis of your facial parameters, skin health, symmetry vectors, and evidence-based routines.
        </p>
        <Link href="/upload" className="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl text-center transition-all cursor-pointer">
          Order New Assessment
        </Link>
      </div>
    </div>
  );
}
