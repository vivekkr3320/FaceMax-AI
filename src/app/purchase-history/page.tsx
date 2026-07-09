import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Invoice & Billing Logs — FaceMax AI",
  description: "Inspect historical invoices, scanner package purchases, and subscription payment receipts.",
};

export default async function PurchaseHistoryPage() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch payments list from payments table
  const { data: purchases } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Billing & Purchases</h1>
          <p className="text-zinc-400 text-sm">Track your membership transactions and receipts.</p>
        </div>
        <Link href="/pricing" className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg border border-white/5 transition-colors">
          View Pricing Plans
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-6">Payment Records</h2>

        {!purchases || purchases.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">💳</span>
            <h3 className="text-base font-bold text-white mb-2">No Transactions Yet</h3>
            <p className="text-zinc-400 text-sm">
              Your invoice details will appear here once you purchase a scanner package.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-semibold text-2xs uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase: any) => (
                  <tr key={purchase.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                    <td className="py-4 px-4 text-zinc-300">
                      {new Date(purchase.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-400 text-xs">
                      {purchase.order_id}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {purchase.plan}
                    </td>
                    <td className="py-4 px-4 text-indigo-400 font-bold">
                      ₹{purchase.amount / 100}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-3xs font-extrabold uppercase tracking-wider border ${
                        purchase.status === "COMPLETED" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : purchase.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
