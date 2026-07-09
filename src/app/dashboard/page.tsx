import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Console Dashboard — FaceMax AI",
  description: "Track your aesthetic scores, skin metrics, and chronological style improvement timeline.",
};

export default async function DashboardPage() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user profile details
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch historical reports chronologically (oldest first for trend lines)
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const serializedReports = [];
  if (reports && reports.length > 0) {
    for (const rep of reports) {
      const { data: score } = await supabase
        .from("face_scores")
        .select("*")
        .eq("report_id", rep.id)
        .single();
      
      serializedReports.push({
        id: rep.id,
        createdAt: rep.created_at,
        overallScore: rep.overall_score,
        primaryAttribute: rep.face_shape, // use face_shape as primary attribute
        mood: "N/A",
        microexpressions: "N/A",
        symmetryScore: score?.symmetry_score || 80,
        glowScore: score?.skin_glow || 80,
        hydrationScore: score?.skin_hydration || 80,
      });
    }
  }

  return (
    <DashboardClient 
      user={{ name: dbUser?.name || "User" }}
      reports={serializedReports}
    />
  );
}
