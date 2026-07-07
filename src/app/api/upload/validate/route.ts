import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // 1. Rate Limiting Protection (Max 5 checks per minute)
  if (isRateLimited(ip, 5, 60000)) {
    logger.warn({ event: "RATE_LIMIT_EXCEEDED", message: `IP ${ip} rate limited on image validation.` });
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    // 2. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check mock validation triggers in filename
    if (file.name.toLowerCase().includes("invalid") || file.name.toLowerCase().includes("error")) {
      logger.warn({ event: "IMAGE_VALIDATION_FAILED", userId: user.id, message: "Mock invalid file selected." });
      return NextResponse.json({
        valid: false,
        reason: "Face not detected. Please upload a clear, front-facing selfie containing a single person."
      });
    }

    if (!ai) {
      // Offline/Mock Mode delay check
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ valid: true, reason: "Mock validation successful" });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    const prompt = `
      Analyze this image. You must determine if it is a clear, front-facing selfie of a single person suitable for facial health diagnostics.
      Reject immediately if the image has:
      - No face detected
      - Multiple faces detected
      - Blurry or out of focus
      - Too dark or high contrast shadows
      - Face too small or far away
      - Face turned away or side profile view only
      
      Respond STRICTLY in JSON format following this schema:
      {
        "valid": boolean,
        "reason": string (if valid is false, describe what is wrong, e.g. "Image is too dark"; if true, set as "Face validated successfully")
      }
    `;

    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });
    const latency = Date.now() - startTime;

    logger.info({ event: "LATENCY_GEMINI", userId: user.id, latencyMs: latency, message: "Image pre-check latency" });

    const text = response.text || "";
    const parsed = JSON.parse(text);

    if (parsed.valid === false) {
      logger.warn({ event: "IMAGE_VALIDATION_FAILED", userId: user.id, message: parsed.reason });
    }

    return NextResponse.json({
      valid: parsed.valid,
      reason: parsed.reason || "Validation check completed"
    });
  } catch (error: any) {
    logger.error({ event: "UPLOAD_FAILED", message: "Face pre-check pipeline failed", error: error.message });
    return NextResponse.json({ error: "Failed to validate selfie image." }, { status: 500 });
  }
}
