"use client";

import { useState } from "react";
import Link from "next/link";

interface AdminClientProps {
  stats: {
    totalUsers: number;
    totalReports: number;
    totalRevenue: number;
    todayRevenue: number;
    todayReportsCount: number;
    failedPaymentsCount: number;
    pendingPaymentsCount: number;
    averageGenerationTimeSec: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }>;
  recentPayments: Array<{
    id: string;
    orderId: string;
    paymentId: string;
    amount: number;
    assessmentType: string;
    status: string;
    userEmail: string;
    createdAt: string;
  }>;
}

export default function AdminClient({ stats, recentUsers, recentPayments }: AdminClientProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredPayments = recentPayments.filter((p) => {
    if (filterType === "ALL") return true;
    return p.status === filterType;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border border-white/5";
    }
  };

  return (
    <div className="space-y-8 fade-in text-[#B6BCC8]">
      
      {/* Admin Title Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
            Admin Command Center
          </h1>
          <p className="text-zinc-550 text-sm">
            Monitor real-time revenue, completed facial reports, payment health, and users.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-white/5 transition-all">
            Dashboard View
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Today's Revenue */}
        <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#111216] relative overflow-hidden">
          <span className="text-[#7C8495] text-2xs uppercase tracking-wider font-extrabold block mb-1">Today's Revenue</span>
          <strong className="text-3xl font-black text-white">₹{stats.todayRevenue}</strong>
          <span className="text-[10px] text-zinc-550 block mt-1">Sum of completed transactions</span>
          <div className="absolute right-3 bottom-3 text-2xl opacity-10">💰</div>
        </div>

        {/* Today's Reports */}
        <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#111216] relative overflow-hidden">
          <span className="text-[#7C8495] text-2xs uppercase tracking-wider font-extrabold block mb-1">Today's Reports</span>
          <strong className="text-3xl font-black text-white">{stats.todayReportsCount}</strong>
          <span className="text-[10px] text-zinc-550 block mt-1">Facial assessments generated</span>
          <div className="absolute right-3 bottom-3 text-2xl opacity-10">📊</div>
        </div>

        {/* Total Revenue */}
        <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#111216] relative overflow-hidden">
          <span className="text-[#7C8495] text-2xs uppercase tracking-wider font-extrabold block mb-1">Total Revenue</span>
          <strong className="text-3xl font-black text-white">₹{stats.totalRevenue}</strong>
          <span className="text-[10px] text-zinc-550 block mt-1">Cumulative sales log</span>
          <div className="absolute right-3 bottom-3 text-2xl opacity-10">📈</div>
        </div>

        {/* Total Face Scans */}
        <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#111216] relative overflow-hidden">
          <span className="text-[#7C8495] text-2xs uppercase tracking-wider font-extrabold block mb-1">Total Face Scans</span>
          <strong className="text-3xl font-black text-white">{stats.totalReports}</strong>
          <span className="text-[10px] text-zinc-550 block mt-1">Registered profile counts</span>
          <div className="absolute right-3 bottom-3 text-2xl opacity-10">👥</div>
        </div>

      </div>

      {/* Latency and Payment Alert Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Gemini Avg Latency */}
        <div className="glass-card rounded-xl p-4 border border-white/5 bg-[#111216] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#7C8495] text-3xs font-extrabold uppercase tracking-widest">Gemini Avg Latency</span>
            <span className="text-zinc-300 text-xs font-semibold mt-1">Assessment pipeline execution</span>
          </div>
          <strong className="text-lg text-white font-mono">{stats.averageGenerationTimeSec}s</strong>
        </div>

        {/* Failed Checkouts Alert */}
        <div className="glass-card rounded-xl p-4 border border-white/5 bg-[#111216] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#7C8495] text-3xs font-extrabold uppercase tracking-widest">Failed Checkouts</span>
            <span className="text-zinc-300 text-xs font-semibold mt-1">Today's aborted transactions</span>
          </div>
          <strong className={`text-lg font-mono ${stats.failedPaymentsCount > 0 ? "text-red-400 font-extrabold" : "text-zinc-500"}`}>
            {stats.failedPaymentsCount}
          </strong>
        </div>

        {/* Pending Checkouts Alert */}
        <div className="glass-card rounded-xl p-4 border border-white/5 bg-[#111216] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#7C8495] text-3xs font-extrabold uppercase tracking-widest">Pending Checkouts</span>
            <span className="text-zinc-300 text-xs font-semibold mt-1">Awaiting verification return</span>
          </div>
          <strong className={`text-lg font-mono ${stats.pendingPaymentsCount > 0 ? "text-amber-400 font-extrabold" : "text-zinc-500"}`}>
            {stats.pendingPaymentsCount}
          </strong>
        </div>

      </div>

      {/* Recent History Logs Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Transactions list */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 bg-[#111216] overflow-hidden space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
              <p className="text-zinc-550 text-2xs">Review latest payments, amounts, and statuses.</p>
            </div>
            
            {/* Filter tags */}
            <div className="flex gap-1.5 text-3xs">
              {["ALL", "COMPLETED", "FAILED", "PENDING"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => setFilterType(btn)}
                  className={`px-2 py-1 rounded-md border font-extrabold transition-all cursor-pointer ${filterType === btn ? "bg-[#6D5EF8]/10 text-[#8A7CFF] border-[#6D5EF8]/30" : "bg-zinc-900/60 text-[#7C8495] border-white/5 hover:text-white"}`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 max-w-[120px] truncate" title={p.userEmail}>
                      {p.userEmail}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-450 uppercase text-[9px]">{p.assessmentType}</span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-white">
                      ₹{p.amount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No matching transaction logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Registrations list */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 bg-[#111216] space-y-4">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
            <p className="text-zinc-550 text-2xs">Latest accounts registered on the server.</p>
          </div>

          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <span className="text-white text-xs font-bold truncate max-w-[180px]">{u.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      month: "short", day: "numeric"
                    })}
                  </span>
                </div>
                <span className="text-zinc-450 text-[10px] truncate">{u.email}</span>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No user registrations found.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
