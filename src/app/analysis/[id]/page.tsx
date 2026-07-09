import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReportClient from "./report-client";
import { FaceAnalysisReport } from "@/lib/gemini";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Diagnostics Face Scan Analysis — FaceMax AI",
  description: "Inspect your facial balance, skin parameters, structure harmony, and personalized corrective routines.",
};

export default async function AnalysisReportPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch report details
  const { data: reportRow } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (!reportRow || reportRow.user_id !== user.id) {
    redirect("/dashboard");
  }

  // Fetch scores
  const { data: scoresRow } = await supabase
    .from("face_scores")
    .select("*")
    .eq("report_id", id)
    .single();

  // Fetch style recommendations
  const { data: recsRow } = await supabase
    .from("recommendations")
    .select("*")
    .eq("report_id", id)
    .single();

  // Compile final face analysis report object
  const report: FaceAnalysisReport = {
    summary: {
      overallScore: reportRow.overall_score,
      faceShape: reportRow.face_shape,
      topStrengths: reportRow.top_strengths || [],
      topImprovementAreas: reportRow.top_improvement_areas || [],
    },
    faceScores: {
      symmetryScore: scoresRow?.symmetry_score || 80,
      skinGlow: scoresRow?.skin_glow || 80,
      skinHydration: scoresRow?.skin_hydration || 80,
      skinDetails: scoresRow?.skin_details || { rating: 80, observation: "" },
      eyesDetails: scoresRow?.eyes_details || { rating: 80, observation: "" },
      eyebrowsDetails: scoresRow?.eyebrows_details || { rating: 80, observation: "" },
      noseDetails: scoresRow?.nose_details || { rating: 80, observation: "" },
      lipsDetails: scoresRow?.lips_details || { rating: 80, observation: "" },
      jawlineDetails: scoresRow?.jawline_details || { rating: 80, observation: "" },
      chinDetails: scoresRow?.chin_details || { rating: 80, observation: "" },
      cheekbonesDetails: scoresRow?.cheekbones_details || { rating: 80, observation: "" },
    },
    recommendations: recsRow?.items || [],
    dailyRoutine: reportRow.daily_routine || { morning: [], night: [] },
    improvementPlan30Days: reportRow.improvement_plan_30_days || [],
    disclaimer: "Disclaimer: This AI face analysis is based on visual patterns and aesthetic principles. It does not constitute medical diagnosis, professional dermatological assessment, or treatment prescriptions. Consult with a qualified dermatologist or physician for any specific skincare or clinical concerns.",
  };

  return (
    <ReportClient 
      analysisId={id}
      createdAt={reportRow.created_at}
      report={report}
      assessmentType={reportRow.assessment_type}
    />
  );
}
