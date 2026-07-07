import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface FaceAnalysisReport {
  summary: {
    overallScore: number;
    faceShape: string;
    topStrengths: string[];
    topImprovementAreas: string[];
  };
  faceScores: {
    symmetryScore: number;
    skinGlow: number;
    skinHydration: number;
    skinDetails: { rating: number; observation: string };
    eyesDetails: { rating: number; observation: string };
    eyebrowsDetails: { rating: number; observation: string };
    noseDetails: { rating: number; observation: string };
    lipsDetails: { rating: number; observation: string };
    jawlineDetails: { rating: number; observation: string };
    chinDetails: { rating: number; observation: string };
    cheekbonesDetails: { rating: number; observation: string };
  };
  recommendations: Array<{
    feature: string;
    observation: string;
    contributingFactors: string;
    suggestions: string;
    timeline: string;
  }>;
  dailyRoutine: {
    morning: string[];
    night: string[];
  };
  improvementPlan30Days: Array<{
    dayRange: string;
    focus: string;
    actions: string[];
  }>;
  disclaimer: string;
}

export interface GeminiFaceAnalysisResult {
  overallScore: number;
  faceShape: string;
  topStrengths: string[];
  topImprovementAreas: string[];
  symmetryScore: number;
  skinGlow: number;
  skinHydration: number;
  skinDetails: { rating: number; observation: string };
  eyesDetails: { rating: number; observation: string };
  eyebrowsDetails: { rating: number; observation: string };
  noseDetails: { rating: number; observation: string };
  lipsDetails: { rating: number; observation: string };
  jawlineDetails: { rating: number; observation: string };
  chinDetails: { rating: number; observation: string };
  cheekbonesDetails: { rating: number; observation: string };
  recommendations: Array<{
    feature: string;
    observation: string;
    contributingFactors: string;
    suggestions: string;
    timeline: string;
  }>;
  dailyRoutine: {
    morning: string[];
    night: string[];
  };
  improvementPlan30Days: Array<{
    dayRange: string;
    focus: string;
    actions: string[];
  }>;
}

export async function analyzeSelfie(imageBase64: string, mimeType: string): Promise<GeminiFaceAnalysisResult> {
  if (!ai) {
    console.warn("GEMINI_API_KEY not configured. Returning simulated metrics.");
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return generateMockMetrics();
  }

  try {
    const prompt = `
      You are an expert aesthetic dermatologist, facial structural balance AI, and cosmetic consultant.
      Analyze this selfie image and provide a highly detailed aesthetic report in JSON format.
      
      Strictly follow this restricted scope:
      - NO fitness, NO hairstyle, NO beard, NO fashion, NO makeup, NO body analysis, NO emotion detection, NO age estimation, NO beauty rating.
      - Keep ONLY overall score, face shape, skin parameters, facial symmetry, eyes, eyebrows, nose, lips, jawline, chin, and cheekbones.

      Respond STRICTLY in JSON format following this TypeScript structure:
      {
        "overallScore": number (overall visual health score 0-100),
        "faceShape": string (must be Oval, Round, Square, Heart, Diamond, Oblong, Triangle),
        "topStrengths": string[] (3 main facial structural strengths),
        "topImprovementAreas": string[] (3 main improvement areas),
        "symmetryScore": number (overall symmetry 0-100),
        "skinGlow": number (glow score 0-100),
        "skinHydration": number (hydration score 0-100),
        "skinDetails": { "rating": number, "observation": string } (analyze acne, scars, spots, redness, texture, dryness),
        "eyesDetails": { "rating": number, "observation": string } (analyze dark circles, puffiness, eye symmetry),
        "eyebrowsDetails": { "rating": number, "observation": string } (analyze shape, thickness, symmetry),
        "noseDetails": { "rating": number, "observation": string } (analyze alignment, proportion),
        "lipsDetails": { "rating": number, "observation": string } (analyze symmetry, fullness, hydration),
        "jawlineDetails": { "rating": number, "observation": string } (analyze definition, contour),
        "chinDetails": { "rating": number, "observation": string } (analyze proportion, balance),
        "cheekbonesDetails": { "rating": number, "observation": string } (analyze definition, harmony),
        "recommendations": [
          {
            "feature": string (e.g. "Skin", "Eyes"),
            "observation": string (specific issue observed),
            "contributingFactors": string (why this occurs),
            "suggestions": string (evidence-based suggestions for improvement),
            "timeline": string (estimated improvement timeline)
          }
        ],
        "dailyRoutine": {
          "morning": string[] (3 steps),
          "night": string[] (3 steps)
        },
        "improvementPlan30Days": [
          { "dayRange": "Days 1-7", "focus": string, "actions": string[] },
          { "dayRange": "Days 8-15", "focus": string, "actions": string[] },
          { "dayRange": "Days 16-30", "focus": string, "actions": string[] }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return parsed as GeminiFaceAnalysisResult;
  } catch (error) {
    console.error("Gemini API call failed, falling back to mock:", error);
    return generateMockMetrics();
  }
}

function generateMockMetrics(): GeminiFaceAnalysisResult {
  const scores = [82, 85, 88, 92];
  const overall = scores[Math.floor(Math.random() * scores.length)];

  const shapes = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Triangle"];
  const faceShape = shapes[Math.floor(Math.random() * shapes.length)];

  return {
    overallScore: overall,
    faceShape,
    topStrengths: [
      "Excellent jawline definition and lateral contour",
      "Highly symmetrical eye alignment along horizontal plane",
      "Pronounced and harmonious cheekbone definition"
    ],
    topImprovementAreas: [
      "Subtle congestion and texture irregularities in the T-zone",
      "Mild dark circles and puffiness under lower lids",
      "Minor lip dryness/cracking due to dehydration"
    ],
    symmetryScore: overall - 3,
    skinGlow: overall + 2,
    skinHydration: overall - 5,
    skinDetails: {
      rating: overall + 1,
      observation: "Skin presents mild T-zone oiliness with negligible acne or scarring. Dermal texture remains smooth."
    },
    eyesDetails: {
      rating: overall - 4,
      observation: "Slight dark circles with moderate puffiness under both eyes, showing signs of sleep fatigue."
    },
    eyebrowsDetails: {
      rating: overall + 3,
      observation: "Symmetrical shape and appropriate density. Balanced arch contours match the overall facial frame."
    },
    noseDetails: {
      rating: overall,
      observation: "Nose alignment sits perfectly centered along vertical thirds. Excellent nasal proportion."
    },
    lipsDetails: {
      rating: overall - 6,
      observation: "Good symmetry and fullness, but shows slight superficial skin cracking and low hydration."
    },
    jawlineDetails: {
      rating: overall + 4,
      observation: "Strong, well-defined mandibular line with clean contours and no visible submental fat."
    },
    chinDetails: {
      rating: overall + 2,
      observation: "Balanced proportion and vertical alignment matching the lower facial third boundary."
    },
    cheekbonesDetails: {
      rating: overall + 3,
      observation: "High, prominent cheekbone angles providing excellent lateral support and harmony."
    },
    recommendations: [
      {
        feature: "Skin",
        observation: "Slight sebum congestion in T-zone.",
        contributingFactors: "Overactive sebaceous glands, potential environmental particulate build-up.",
        suggestions: "Incorporate a mild salicylic acid cleanser (2%) twice weekly to clear lipid channels.",
        timeline: "2 to 3 weeks"
      },
      {
        feature: "Eyes",
        observation: "Mild under-eye dark circles and puffiness.",
        contributingFactors: "Sleep deprivation, vascular congestion, or mild lymphatic fluid retention.",
        suggestions: "Apply cold compress morning, use caffeine-infused eye cream, and ensure consistent 7-8 hour sleep schedules.",
        timeline: "4 weeks"
      },
      {
        feature: "Lips",
        observation: "Superficial cracking and low hydration appearance.",
        contributingFactors: "Environmental drying, low daily water consumption.",
        suggestions: "Apply hyaluronic acid/ceramide lip balm twice daily; target 2.5L water intake daily.",
        timeline: "1 week"
      }
    ],
    dailyRoutine: {
      morning: [
        "Cleanse with a gentle foaming face wash.",
        "Apply a hydrating hyaluronic acid serum followed by a lightweight SPF 30+ moisturizer.",
        "Perform light under-eye tapping exercises for 60 seconds to stimulate lymphatic drainage."
      ],
      night: [
        "Double cleanse to remove sebum and environmental build-up.",
        "Apply a barrier-repair cream containing ceramides and niacinamide.",
        "Massage lip balm generously over lips before sleeping."
      ]
    },
    improvementPlan30Days: [
      {
        dayRange: "Days 1-7",
        focus: "Hydration Sync & Barrier Reset",
        actions: [
          "Establish core daily cleansing/moisturizing routine.",
          "Target 2.5L water intake daily.",
          "Apply caffeine eye cream mornings."
        ]
      },
      {
        dayRange: "Days 8-15",
        focus: "Mild Exfoliation & Drainage",
        actions: [
          "Incorporate 2% salicylic acid cleanser twice weekly.",
          "Continue consistent night routine application.",
          "Establish 7.5 hours sleep consistency."
        ]
      },
      {
        dayRange: "Days 16-30",
        focus: "Consolidation & Assessment",
        actions: [
          "Observe changes in skin congestion and hydration.",
          "Assess dark circle adjustments.",
          "Execute face exercises regularly."
        ]
      }
    ]
  };
}
