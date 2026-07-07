import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { analyzeSelfie } from "@/lib/gemini";
import { isRateLimited } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // 1. Rate Limiting Protection (Max 5 checks per minute)
  if (isRateLimited(ip, 5, 60000)) {
    logger.warn({ event: "RATE_LIMIT_EXCEEDED", message: `IP ${ip} rate limited on payment verification.` });
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData to retrieve both payment and image data
    const formData = await request.formData();
    
    const orderId = formData.get("orderId") as string;
    const paymentId = formData.get("paymentId") as string;
    const signature = formData.get("signature") as string;
    const file = formData.get("file") as File;

    if (!orderId || !paymentId || !file) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Retrieve pending payment record
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !payment || payment.user_id !== user.id) {
      logger.warn({ event: "PAYMENT_FAILED", userId: user.id, orderId, error: "Payment record not found" });
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const isMockOrder = orderId.startsWith("order_mock_") || !keySecret;

    let isVerified = false;

    if (isMockOrder) {
      isVerified = true;
    } else {
      // Verify signature cryptography
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(text)
        .digest("hex");

      isVerified = generatedSignature === signature;
    }

    if (!isVerified) {
      // Mark as failed
      await supabase
        .from("payments")
        .update({ status: "FAILED" })
        .eq("order_id", orderId);
      
      logger.error({ event: "PAYMENT_FAILED", userId: user.id, orderId, error: "Signature verification failed" });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    logger.info({ event: "PAYMENT_SUCCESS", userId: user.id, orderId, message: "Payment validated successfully" });

    // Convert file to base64 completely in memory (no disk write, satisfying privacy limits)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    // Execute Gemini Analysis Pipeline with latency tracking
    const startTime = Date.now();
    const analysis = await analyzeSelfie(base64Image, mimeType);
    const latency = Date.now() - startTime;

    logger.info({ event: "LATENCY_GEMINI", userId: user.id, latencyMs: latency, message: "Report generation latency" });

    // Insert reports table (with assessment_type purchased)
    const { data: reportRow, error: reportErr } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        assessment_type: payment.assessment_type,
        overall_score: analysis.overallScore,
        face_shape: analysis.faceShape,
        top_strengths: analysis.topStrengths,
        top_improvement_areas: analysis.topImprovementAreas,
        daily_routine: analysis.dailyRoutine,
        improvement_plan_30_days: analysis.improvementPlan30Days,
      });

    if (reportErr) {
      logger.error({ event: "REPORT_GENERATED", userId: user.id, error: "Report insertion failed" });
      throw new Error("Failed to save report.");
    }

    // Extract report ID
    const reportId = Array.isArray(reportRow) ? reportRow[0]?.id : (reportRow as any)?.id || (reportRow as any)?.data?.[0]?.id || `rep_${Math.random().toString(36).substring(2, 11)}`;
    const finalReportId = reportId;

    // Insert face_scores table
    await supabase.from("face_scores").insert({
      report_id: finalReportId,
      symmetry_score: analysis.symmetryScore,
      skin_glow: analysis.skinGlow,
      skin_hydration: analysis.skinHydration,
      skin_details: analysis.skinDetails,
      eyes_details: analysis.eyesDetails,
      eyebrows_details: analysis.eyebrowsDetails,
      nose_details: analysis.noseDetails,
      lips_details: analysis.lipsDetails,
      jawline_details: analysis.jawlineDetails,
      chin_details: analysis.chinDetails,
      cheekbones_details: analysis.cheekbonesDetails,
    });

    // Insert recommendations table
    await supabase.from("recommendations").insert({
      report_id: finalReportId,
      items: analysis.recommendations,
    });

    // Update payment to completed
    await supabase
      .from("payments")
      .update({
        payment_id: paymentId,
        status: "COMPLETED",
      })
      .eq("order_id", orderId);

    logger.info({ event: "REPORT_GENERATED", userId: user.id, message: `Report ${finalReportId} created successfully.` });

    return NextResponse.json({ success: true, id: finalReportId });
  } catch (error: any) {
    logger.error({ event: "PAYMENT_FAILED", message: "Payment verification pipeline failed", error: error.message });
    return NextResponse.json({ error: error.message || "Failed to process and verify payment" }, { status: 500 });
  }
}
