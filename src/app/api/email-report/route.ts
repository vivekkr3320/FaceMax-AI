import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // 1. Rate Limiting Protection (Max 5 checks per minute)
  if (isRateLimited(ip, 5, 60000)) {
    logger.warn({ event: "RATE_LIMIT_EXCEEDED", message: `IP ${ip} rate limited on email report dispatch.` });
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { analysisId, targetEmail } = body;

    if (!analysisId || !targetEmail) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Retrieve report details from 'reports' table
    const { data: report, error: reportErr } = await supabase
      .from("reports")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (reportErr || !report || report.user_id !== user.id) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Retrieve scores
    const { data: scores } = await supabase
      .from("face_scores")
      .select("*")
      .eq("report_id", analysisId)
      .single();

    // Retrieve recommendations
    const { data: recs } = await supabase
      .from("recommendations")
      .select("*")
      .eq("report_id", analysisId)
      .single();

    const topStrengths = report.top_strengths || [];
    const topImprovementAreas = report.top_improvement_areas || [];
    const dailyRoutine = report.daily_routine || { morning: [], night: [] };
    const recsItems = recs?.items || [];

    // Compile lists for email body
    const strengthsHtml = topStrengths.map((s: string) => `<li style="margin-bottom: 6px;">${s}</li>`).join("");
    const focusHtml = topImprovementAreas.map((s: string) => `<li style="margin-bottom: 6px;">${s}</li>`).join("");
    
    const morningRoutineHtml = dailyRoutine.morning.map((act: string) => `<li style="margin-bottom: 5px;">${act}</li>`).join("");
    const nightRoutineHtml = dailyRoutine.night.map((act: string) => `<li style="margin-bottom: 5px;">${act}</li>`).join("");

    const recsHtml = recsItems.map((item: any) => `
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 12px; font-size: 13px;">
        <strong style="color: #6366f1; text-transform: uppercase;">${item.feature}</strong> - <em>Timeline: ${item.timeline}</em>
        <p style="margin: 6px 0 3px 0;"><strong>Observation:</strong> ${item.observation}</p>
        <p style="margin: 3px 0 3px 0; color: #555;"><strong>Contributing:</strong> ${item.contributingFactors}</p>
        <p style="margin: 3px 0 0 0; color: #111;"><strong>Suggestion:</strong> ${item.suggestions}</p>
      </div>
    `).join("");

    const htmlEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>FaceMax AI face analysis report</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 40px 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e8e8e8;">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0b0b0f; padding: 40px 30px; text-align: center; border-bottom: 3px solid #6366f1;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">FaceMax AI</h1>
              <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Facial Health & Diagnostics</p>
            </td>
          </tr>
          
          <!-- Report Summary Row -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">Executive Summary</h2>
              <table width="100%">
                <tr>
                  <td width="30%" style="text-align: center; padding-right: 20px;">
                    <div style="width: 90px; height: 90px; border-radius: 50%; border: 6px solid #6366f1; display: inline-block; line-height: 90px; text-align: center;">
                      <strong style="font-size: 28px; color: #6366f1;">${report.overall_score}</strong>
                    </div>
                    <div style="font-size: 10px; color: #777777; margin-top: 5px; text-transform: uppercase;">Health Score</div>
                  </td>
                  <td width="70%" style="vertical-align: top;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #6366f1; font-weight: 700; display: block;">Identified Face Shape</span>
                    <strong style="font-size: 18px; display: block; margin: 3px 0 8px 0; color: #111827;">${report.face_shape}</strong>
                    <span style="font-size: 13px; color: #6b7280;">Symmetry Score: <strong>${scores?.symmetry_score || 80}%</strong></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Strengths & Areas -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 15px;">
                    <strong style="font-size: 13px; color: #10b981; text-transform: uppercase; display: block; margin-bottom: 8px;">⭐ Strengths</strong>
                    <ul style="font-size: 12px; color: #4b5563; margin: 0; padding-left: 15px;">
                      ${strengthsHtml}
                    </ul>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 15px;">
                    <strong style="font-size: 13px; color: #6366f1; text-transform: uppercase; display: block; margin-bottom: 8px;">🎯 Focus Areas</strong>
                    <ul style="font-size: 12px; color: #4b5563; margin: 0; padding-left: 15px;">
                      ${focusHtml}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Skin & Symmetry metrics -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="font-size: 16px; font-weight: 700; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 0;">✨ Core Health Metrics</h3>
              <table width="100%" style="font-size: 13px; color: #4b5563; line-height: 1.5;">
                <tr>
                  <td style="padding: 6px 0;"><strong>Skin Glow:</strong></td>
                  <td style="text-align: right;"><strong>${scores?.skin_glow || 80}%</strong></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><strong>Skin Hydration:</strong></td>
                  <td style="text-align: right;"><strong>${scores?.skin_hydration || 80}%</strong></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><strong>Skin Details:</strong></td>
                  <td style="text-align: right; color: #111;">${scores?.skin_details?.observation || "N/A"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corrective Recommendations -->
          ${recsItems.length > 0 ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="font-size: 16px; font-weight: 700; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 0;">📈 Corrective Recommendations</h3>
              ${recsHtml}
            </td>
          </tr>
          ` : ""}

          <!-- Daily routines -->
          ${dailyRoutine.morning.length > 0 ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="font-size: 16px; font-weight: 700; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 0;">📅 Daily Care Routines</h3>
              <table width="100%">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 10px;">
                    <strong style="font-size: 12px; color: #6366f1; display: block; margin-bottom: 5px;">☀️ MORNING</strong>
                    <ol style="font-size: 12px; color: #4b5563; margin: 0; padding-left: 15px;">
                      ${morningRoutineHtml}
                    </ol>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 10px;">
                    <strong style="font-size: 12px; color: #a855f7; display: block; margin-bottom: 5px;">🌙 NIGHT</strong>
                    <ol style="font-size: 12px; color: #4b5563; margin: 0; padding-left: 15px;">
                      ${nightRoutineHtml}
                    </ol>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Footer info -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #eeeeee; font-size: 11px; color: #777777;">
              <p style="margin: 0 0 8px 0; font-style: italic;">Disclaimer: This AI face analysis does not constitute medical diagnosis or professional dermatological assessment.</p>
              <p style="margin: 0;">© 2026 FaceMax AI. Privacy-first secure memory diagnostics.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Execute production email delivery via Resend API
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "FaceMax AI Reports <reports@growthbeamai.com>",
            to: [targetEmail],
            subject: `Your FaceMax AI Facial Assessment Report - ${analysisId.substring(0, 8)}`,
            html: htmlEmailTemplate,
          }),
        });

        if (!resendRes.ok) {
          const errData = await resendRes.json();
          throw new Error(errData.message || "Resend API error response");
        }

        logger.info({ event: "PAYMENT_SUCCESS", userId: user.id, message: `Email delivered to ${targetEmail} via Resend.` });
      } catch (err: any) {
        logger.error({ event: "UPLOAD_FAILED", userId: user.id, message: "Resend email dispatch failed", error: err.message });
      }
    } else {
      // Mock log to terminal console
      console.log("==================================================");
      console.log(`✉️ RESEND API KEY NOT CONFIGURED. MOCK EMAIL LOGGED BELOW:`);
      console.log(`TO: ${targetEmail}`);
      console.log(`SUBJECT: FaceMax AI facial health analysis report - ${analysisId.substring(0, 8)}`);
      console.log("==================================================");
      console.log(htmlEmailTemplate);
      console.log("==================================================");
    }

    return NextResponse.json({ 
      success: true, 
      message: `Email report logged/sent successfully for ${targetEmail}` 
    });
  } catch (error) {
    console.error("Email report dispatch failed:", error);
    return NextResponse.json({ error: "Failed to dispatch email report" }, { status: 500 });
  }
}
