import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import PricingClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Membership Plans — GlowScan AI",
  description: "Select the perfect scan package. Get access to detailed skin parameters, structural balance analysis, and daily care routines.",
};

export default async function PricingPage() {
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PricingClient 
      user={user ? { id: user.id, email: user.email || "", name: user.email?.split("@")[0] || "User" } : null} 
    />
  );
}
