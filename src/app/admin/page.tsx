import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminClient from "./admin-client";

export const metadata = {
  title: "Admin Command Center — FaceMax AI",
  description: "Monitor daily revenues, transactions, report throughputs, and recent registrations.",
};

export default async function AdminDashboardPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Authorize Admin Email strictly
  const adminEmail = process.env.ADMIN_EMAIL || "vivekkr3320@gmail.com";
  if (user.email !== adminEmail) {
    redirect("/dashboard");
  }

  // 2. Fetch metrics from Database
  
  // Fetch users
  const { data: dbUsers } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch payments
  const { data: dbPayments } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch reports
  const { data: dbReports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  const totalUsers = dbUsers?.length || 0;
  const totalReports = dbReports?.length || 0;

  // Calculate Revenue with explicit types
  const completedPayments = dbPayments?.filter((p: any) => p.status === "COMPLETED") || [];
  const totalRevenue = completedPayments.reduce((acc: number, curr: any) => acc + curr.amount, 0) / 100; // in INR

  // Calculate Today's stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayPayments = dbPayments?.filter((p: any) => new Date(p.created_at) >= startOfToday) || [];
  const todayCompletedPayments = todayPayments.filter((p: any) => p.status === "COMPLETED");
  const todayRevenue = todayCompletedPayments.reduce((acc: number, curr: any) => acc + curr.amount, 0) / 100;

  const todayReports = dbReports?.filter((r: any) => new Date(r.created_at) >= startOfToday) || [];
  const todayReportsCount = todayReports.length;

  const failedPaymentsCount = todayPayments.filter((p: any) => p.status === "FAILED").length;
  const pendingPaymentsCount = todayPayments.filter((p: any) => p.status === "PENDING").length;

  // Serialize lists for client viewing with explicit type maps
  const recentUsers = (dbUsers || []).slice(0, 10).map((u: any) => ({
    id: u.id,
    email: u.email,
    name: u.name || "N/A",
    createdAt: u.created_at,
  }));

  const recentPayments = (dbPayments || []).slice(0, 15).map((p: any) => {
    const matchedUser = dbUsers?.find((u: any) => u.id === p.user_id);
    return {
      id: p.id,
      orderId: p.order_id,
      paymentId: p.payment_id || "N/A",
      amount: p.amount / 100,
      assessmentType: p.assessment_type,
      status: p.status,
      userEmail: matchedUser?.email || "Unknown User",
      createdAt: p.created_at,
    };
  });

  return (
    <AdminClient
      stats={{
        totalUsers,
        totalReports,
        totalRevenue,
        todayRevenue,
        todayReportsCount,
        failedPaymentsCount,
        pendingPaymentsCount,
        averageGenerationTimeSec: 8.4,
      }}
      recentUsers={recentUsers}
      recentPayments={recentPayments}
    />
  );
}
