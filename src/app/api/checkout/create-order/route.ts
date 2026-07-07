import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assessmentType } = body; // QUICK or COMPLETE

    if (!assessmentType || (assessmentType !== "QUICK" && assessmentType !== "COMPLETE")) {
      return NextResponse.json({ error: "Invalid assessment type" }, { status: 400 });
    }

    const amount = assessmentType === "QUICK" ? 4900 : 9900; // in paise
    const keyId = process.env.RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const isMock = keyId.startsWith("rzp_test_mock") || !keyId || !keySecret;

    let orderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;

    if (!isMock) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
          amount,
          currency: "INR",
          receipt: `receipt_${user.id}_${Date.now()}`,
        });
        orderId = order.id;
      } catch (err) {
        console.warn("Razorpay API error, falling back to mock checkout:", err);
      }
    }

    // Save pending payment log in database
    await supabase.from("payments").insert({
      order_id: orderId,
      amount,
      assessment_type: assessmentType,
      status: "PENDING",
      user_id: user.id,
    });

    return NextResponse.json({
      orderId,
      amount,
      currency: "INR",
      assessmentType,
      isMock,
      keyId: isMock ? "rzp_test_mockkeyid123" : keyId,
    });
  } catch (error) {
    console.error("Create order failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
