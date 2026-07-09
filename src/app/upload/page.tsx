import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UploadClient from "./upload-client";

export const metadata: Metadata = {
  title: "Selfie Scan Center — FaceMax AI",
  description: "Capture a clear photo or select a file to execute your professional facial assessment.",
};

export default async function UploadPage() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Retrieve user details
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <UploadClient 
      user={{ id: user.id, email: user.email || "", name: dbUser?.name || "User" }} 
    />
  );
}
