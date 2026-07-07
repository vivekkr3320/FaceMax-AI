"use client";

import { useState } from "react";
import Link from "next/link";

interface ReportData {
  id: string;
  createdAt: string;
  overallScore: number;
  primaryAttribute: string;
  mood: string;
  microexpressions: string;
  symmetryScore: number;
  glowScore: number;
  hydrationScore: number;
}

interface DashboardClientProps {
  user: {
    name: string;
  };
  reports: ReportData[];
}

type MetricType = "overallScore" | "symmetryScore" | "glowScore" | "hydrationScore";

export default function DashboardClient({ user, reports }: DashboardClientProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("overallScore");

  // Determine current stats based on last report
  const latestReport = reports[reports.length - 1] || null;

  // Chart configuration parameters
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  // Generate SVG chart coordinates
  const getSvgPath = () => {
    if (reports.length < 2) return "";
    
    const minVal = 50; // clamp min grid boundary
    const maxVal = 100;
    const valueRange = maxVal - minVal;

    const points = reports.map((rep, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2)) / (reports.length - 1);
      const val = rep[selectedMetric];
      const y = chartHeight - paddingY - ((val - minVal) / valueRange) * (chartHeight - paddingY * 2);
      return { x, y };
    });

    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  };

  const getSvgCircles = () => {
    if (reports.length === 0) return [];
    
    const minVal = 50;
    const maxVal = 100;
    const valueRange = maxVal - minVal;

    if (reports.length === 1) {
      const x = chartWidth / 2;
      const val = reports[0][selectedMetric];
      const y = chartHeight / 2;
      return [{ x, y, value: val, date: new Date(reports[0].createdAt).toLocaleDateString() }];
    }

    return reports.map((rep, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2)) / (reports.length - 1);
      const val = rep[selectedMetric];
      const y = chartHeight - paddingY - ((val - minVal) / valueRange) * (chartHeight - paddingY * 2);
      return { x, y, value: val, date: new Date(rep.createdAt).toLocaleDateString() };
    });
  };

  const renderTimelineDelta = (current: ReportData, prev: ReportData | null) => {
    if (!prev) {
      return (
        <span className="inline-block px-2.5 py-1 bg-zinc-800 text-zinc-400 text-3xs font-extrabold rounded-md uppercase tracking-wider">
          Baseline Scan
        </span>
      );
    }

    const delta = current.overallScore - prev.overallScore;

    if (delta > 0) {
      return (
        <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xs font-extrabold rounded-md uppercase tracking-wider">
          +{delta}% Improvement
        </span>
      );
    } else if (delta < 0) {
      return (
        <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-3xs font-extrabold rounded-md uppercase tracking-wider">
          {delta}% Decline
        </span>
      );
    } else {
      return (
        <span className="inline-block px-2.5 py-1 bg-zinc-800 text-zinc-300 text-3xs font-extrabold rounded-md uppercase tracking-wider">
          No Change
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 fade-in">
      
      {/* Console Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
            Welcome, {user.name}
          </h1>
          <p className="text-zinc-400 text-sm">
            Professional Face & Skin Assessment Dashboard
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/upload" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/15">
            📸 New Assessment
          </Link>
        </div>
      </div>

      {reports.length === 0 ? (
        /* Empty Dashboard Screen */
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
          <span className="text-6xl block mb-6">🛰️</span>
          <h2 className="text-2xl font-bold text-white mb-2">No Reports Generated</h2>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-8">
            Complete your first selfie facial assessment to activate overall symmetry, skin glow progress charts and historical trend vectors.
          </p>
          <Link href="/upload" className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer">
            Run Initial Facial Assessment
          </Link>
        </div>
      ) : (
        <>
          {/* Diagnostic overview metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="glass-card rounded-xl p-5 border border-white/5">
              <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-1">Face Health Score</span>
              <strong className="text-3xl font-black text-white">{latestReport?.overallScore || 0}</strong>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/5">
              <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-1">Face Symmetry</span>
              <strong className="text-3xl font-black text-white">{latestReport?.symmetryScore || 0}%</strong>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/5">
              <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-1">Skin Glow</span>
              <strong className="text-3xl font-black text-white">{latestReport?.glowScore || 0}%</strong>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/5">
              <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-1">Skin Hydration</span>
              <strong className="text-3xl font-black text-white">{latestReport?.hydrationScore || 0}%</strong>
            </div>

          </div>

          {/* SVG Trend line charts */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Diagnostic Trend Vector</h3>
                <p className="text-zinc-400 text-xs">Visualize historical metrics progression points over time.</p>
              </div>

              {/* Selector triggers */}
              <div className="flex flex-wrap gap-2 text-xs">
                {(
                  [
                    { id: "overallScore", label: "Health Score" },
                    { id: "symmetryScore", label: "Symmetry" },
                    { id: "glowScore", label: "Glow" },
                    { id: "hydrationScore", label: "Hydration" },
                  ] as const
                ).map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedMetric(btn.id)}
                    className={`px-3.5 py-2 font-bold rounded-lg border transition-all cursor-pointer ${selectedMetric === btn.id ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30" : "bg-zinc-900 text-zinc-400 border-white/5 hover:text-white"}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Render Container */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px] h-[160px] relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  
                  {/* Grid background reference horizontal paths */}
                  <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                  <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

                  {/* Trend Path */}
                  {reports.length >= 2 && (
                    <path
                      d={getSvgPath()}
                      fill="none"
                      stroke="url(#gradient-accent)"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Nodes circles triggers */}
                  {getSvgCircles().map((circle, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={circle.x}
                        cy={circle.y}
                        r={5}
                        className="fill-indigo-500 stroke-zinc-950 stroke-[2.5px] group-hover:r-7 transition-all"
                      />
                      <title>{`Val: ${circle.value} (${circle.date})`}</title>
                    </g>
                  ))}

                  {/* Definition for path linear gradients */}
                  <defs>
                    <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Chronological Vertical timeline and history logs logs list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Timeline element */}
            <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Improvement Timeline</h3>
              
              <div className="relative pl-6 border-l border-white/10 flex flex-col gap-8">
                {reports
                  .slice()
                  .reverse()
                  .map((rep, idx, arr) => {
                    const nextReportIdx = arr.length - 1 - idx;
                    const prevReport = nextReportIdx > 0 ? reports[nextReportIdx - 1] : null;

                    return (
                      <div key={rep.id} className="relative flex flex-col items-start">
                        {/* Dot indicator */}
                        <div className="absolute left-[-29px] top-1 w-4.5 h-4.5 rounded-full bg-zinc-950 border-2 border-indigo-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-400">
                              {new Date(rep.createdAt).toLocaleDateString(undefined, {
                                month: "short", day: "numeric", year: "2-digit"
                              })}
                            </span>
                            {renderTimelineDelta(rep, prevReport)}
                          </div>
                          
                          <Link href={`/analysis/${rep.id}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                            {rep.primaryAttribute} Shape Profile
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Historical Scan Logs table */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">Historical Records</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 font-semibold text-2xs uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Health Score</th>
                      <th className="py-3 px-4">Face Shape</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports
                      .slice()
                      .reverse()
                      .map((rep) => (
                        <tr key={rep.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                          <td className="py-4 px-4 text-zinc-300">
                            {new Date(rep.createdAt).toLocaleDateString(undefined, {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-white bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20 text-xs">
                              {rep.overallScore}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-zinc-400 font-medium truncate max-w-[200px]">
                            {rep.primaryAttribute}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/analysis/${rep.id}`} className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline">
                              View Report →
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
