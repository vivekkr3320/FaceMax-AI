import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("SignOut failed:", error);
  }

  // Redirect user to landing page
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, {
    status: 303, // Forces GET redirect
  });
}
