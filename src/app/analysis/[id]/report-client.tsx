"use client";

import { useState } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaceAnalysisReport } from "@/lib/gemini";

interface ReportClientProps {
  analysisId: string;
  createdAt: string;
  report: FaceAnalysisReport;
  assessmentType: string; // QUICK or COMPLETE
}

export default function ReportClient({ analysisId, createdAt, report, assessmentType }: ReportClientProps) {
  const [downloading, setDownloading] = useState(false);
  
  // Email states
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Gating plans based on report assessment type
  const isPdfLocked = assessmentType === "QUICK";
  const isEmailLocked = assessmentType === "QUICK";
  const isPlanLocked = assessmentType === "QUICK";
  const isRecsLocked = assessmentType === "QUICK";

  const handleDownloadPdf = async () => {
    if (isPdfLocked) {
      alert("PDF downloads are restricted to Complete Facial Assessment (₹99) reports. Please purchase a Complete Assessment to unlock this feature.");
      return;
    }

    setDownloading(true);
    try {
      const element = document.getElementById("report-content");
      if (!element) throw new Error("Report element not found");

      // Temporarily hide buttons for PDF print capture
      const downloadBtn = document.getElementById("pdf-download-btn");
      const emailBtn = document.getElementById("email-report-btn");
      if (downloadBtn) downloadBtn.style.display = "none";
      if (emailBtn) emailBtn.style.display = "none";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#09090b",
        logging: false,
      });

      if (downloadBtn) downloadBtn.style.display = "inline-flex";
      if (emailBtn) emailBtn.style.display = "inline-flex";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`GlowScan_AI_Analysis_${analysisId.substring(0, 8)}.pdf`);
    } catch (e) {
      console.error(e);
      alert("An error occurred compiling PDF. Please use Ctrl + P to print natively.");
    } finally {
      setDownloading(false);
    }
  };

  const handleEmailReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailLocked) {
      alert("Email reports are restricted to Complete Facial Assessment (₹99) reports.");
      return;
    }
    if (!emailInput) return;

    setEmailSending(true);
    try {
      const res = await fetch("/api/email-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          targetEmail: emailInput,
        }),
      });

      if (res.ok) {
        setEmailSentSuccess(true);
        setTimeout(() => {
          setEmailModalOpen(false);
          setEmailSentSuccess(false);
          setEmailInput("");
        }, 3000);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error sending email.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 fade-in">
      
      {/* Navigation header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold flex items-center gap-2">
          ← Back to Dashboard
        </Link>

        <div className="flex flex-wrap gap-3">
          {isEmailLocked ? (
            <Link href="/upload" className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-white/5 flex items-center gap-2">
              🔒 Complete Report to Email
            </Link>
          ) : (
            <button
              id="email-report-btn"
              onClick={() => setEmailModalOpen(true)}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg border border-white/5 flex items-center gap-2 cursor-pointer"
            >
              ✉️ Email Report
            </button>
          )}

          {isPdfLocked ? (
            <Link href="/upload" className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-white/5 flex items-center gap-2">
              🔒 Complete Report to Download PDF
            </Link>
          ) : (
            <button
              id="pdf-download-btn"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              {downloading ? "Compiling PDF..." : "📥 Download PDF"}
            </button>
          )}
        </div>
      </div>

      {/* Main Report Body Container targeted by html2canvas */}
      <div id="report-content" className="space-y-8 print-card">
        
        {/* Logo print display (Visible in PDF but hidden in UI) */}
        <div className="hidden print:block mb-8 border-b border-zinc-800 pb-4">
          <div className="text-2xl font-black text-white">GlowScan AI Diagnostics</div>
          <span className="text-xs text-zinc-400">Professional Face Structure & Skin Health Report</span>
        </div>

        {/* Report Header Card (Executive Summary) */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          
          {/* Conic score Ring */}
          <div 
            className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `conic-gradient(#6366f1 ${report.summary.overallScore}%, rgba(255,255,255,0.05) 0)`,
            }}
          >
            <div className="w-[116px] h-[116px] rounded-full bg-zinc-950 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">
                {report.summary.overallScore}
              </span>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
                HEALTH SCORE
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-[260px] text-center md:text-left">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
              Executive Summary
            </span>
            <h1 className="text-3xl font-black mt-2 mb-4 text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Face Shape: {report.summary.faceShape}
            </h1>
            
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center md:justify-start text-xs text-zinc-400">
              <div>
                Report ID: <span className="font-mono text-zinc-200">{analysisId.substring(0, 8)}</span>
              </div>
              <div>
                Date: <strong className="text-zinc-200">{new Date(createdAt).toLocaleDateString()}</strong>
              </div>
              <div>
                Format: <strong className="text-indigo-400">{assessmentType} Assessment</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths and Focus areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-emerald-500/10 shadow-xl bg-emerald-500/[0.01]">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">⭐ Primary Strengths</h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              {report.summary.topStrengths.map((str, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8 border border-indigo-500/10 shadow-xl bg-indigo-500/[0.01]">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">🎯 Key Focus Areas</h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              {report.summary.topImprovementAreas.map((area, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diagnostic overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
            <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-2">Overall Symmetry</span>
            <strong className="text-3xl font-black text-white">{report.faceScores.symmetryScore}%</strong>
          </div>
          <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
            <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-2">Skin Glow Radiance</span>
            <strong className="text-3xl font-black text-white">{report.faceScores.skinGlow}%</strong>
          </div>
          <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
            <span className="text-zinc-500 text-2xs uppercase tracking-wider font-semibold block mb-2">Hydration Value</span>
            <strong className="text-3xl font-black text-white">{report.faceScores.skinHydration}%</strong>
          </div>
        </div>

        {/* Feature Specific Observations Breakdown */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Detailed Feature Observations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Skin Analysis", rating: report.faceScores.skinDetails.rating, obs: report.faceScores.skinDetails.observation },
              { title: "Facial Symmetry", rating: report.faceScores.symmetryScore, obs: "Overall facial balance score calculated based on eye alignment, lip horizontal planes, and nose symmetry." },
              { title: "Eye Analysis", rating: report.faceScores.eyesDetails.rating, obs: report.faceScores.eyesDetails.observation },
              { title: "Eyebrows", rating: report.faceScores.eyebrowsDetails.rating, obs: report.faceScores.eyebrowsDetails.observation },
              { title: "Nose", rating: report.faceScores.noseDetails.rating, obs: report.faceScores.noseDetails.observation },
              { title: "Lips", rating: report.faceScores.lipsDetails.rating, obs: report.faceScores.lipsDetails.observation },
              { title: "Jawline", rating: report.faceScores.jawlineDetails.rating, obs: report.faceScores.jawlineDetails.observation },
              { title: "Chin", rating: report.faceScores.chinDetails.rating, obs: report.faceScores.chinDetails.observation },
              { title: "Cheekbones", rating: report.faceScores.cheekbonesDetails.rating, obs: report.faceScores.cheekbonesDetails.observation },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {feature.rating}/100
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {feature.obs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gated - Recommendations List */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6">📈 Feature Corrective Recommendations</h2>

          <div className={`space-y-6 transition-all duration-300 ${isRecsLocked ? "blur-md select-none pointer-events-none" : ""}`}>
            {report.recommendations.map((item, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-white/5 pb-2.5">
                  <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider">{item.feature}</h3>
                  <span className="text-2xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md">
                    Est. Timeline: <strong>{item.timeline}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 font-semibold block mb-1">Observation</span>
                    <p className="text-zinc-300">{item.observation}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block mb-1">Contributing Factors</span>
                    <p className="text-zinc-400">{item.contributingFactors}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block mb-1">Evidence-Based Suggestions</span>
                    <p className="text-zinc-300 leading-relaxed font-medium">{item.suggestions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isRecsLocked && (
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10 no-print">
              <span className="text-3xl block mb-3">🔒</span>
              <h4 className="text-base font-bold text-white mb-1">Unlock Recommendations</h4>
              <p className="text-zinc-400 text-2xs max-w-[240px] mb-5">
                Recommendations are restricted to the Complete Facial Assessment (₹99) report.
              </p>
              <Link href="/upload" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/10">
                Get Complete Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Unlocked Daily Routine */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6">📅 Personalized Daily Routine</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-500/[0.02] border border-indigo-500/10 rounded-xl p-6">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">☀️ Morning Routine</h3>
              <ul className="space-y-3.5 text-xs text-zinc-300">
                {report.dailyRoutine.morning.map((action, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-400 font-bold">{i + 1}.</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-500/[0.02] border border-purple-500/10 rounded-xl p-6">
              <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-4">🌙 Night Routine</h3>
              <ul className="space-y-3.5 text-xs text-zinc-300">
                {report.dailyRoutine.night.map((action, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-purple-400 font-bold">{i + 1}.</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Gated - 30-Day Plan */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6">📅 30-Day Improvement Plan</h2>

          <div className={`space-y-6 transition-all duration-300 ${isPlanLocked ? "blur-md select-none pointer-events-none" : ""}`}>
            {report.improvementPlan30Days.map((range, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{range.dayRange}</h3>
                  <span className="text-2xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    Focus: {range.focus}
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-450">
                  {range.actions.map((act, i) => (
                    <li key={i} className="flex gap-2.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {isPlanLocked && (
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10 no-print">
              <span className="text-3xl block mb-3">👑</span>
              <h4 className="text-base font-bold text-white mb-1">Unlock 30-Day Action Plan</h4>
              <p className="text-zinc-400 text-2xs max-w-[240px] mb-5">
                Detailed 30-day timelines are exclusive to the Complete Facial Assessment (₹99) report.
              </p>
              <Link href="/upload" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-lg shadow-md shadow-purple-600/10">
                Get Complete Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Disclaimer section */}
        <div className="bg-white/2 border border-white/5 rounded-2xl p-6 text-zinc-550 text-2xs leading-relaxed">
          {report.disclaimer}
        </div>

      </div>

      {/* Email Report modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex justify-center items-center z-50 p-4 no-print">
          <div className="glass-card rounded-2xl max-w-md w-full border border-indigo-500/30 p-8 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white mb-2">✉️ Send Email Report</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              We will compile your scores, feature alignment details, skin parameters, and personalized routines into a professional HTML email.
            </p>

            {emailSentSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center font-bold text-sm mb-6">
                ✓ Email dispatch successful!<br/>
                <span className="text-3xs font-medium opacity-80 block mt-1">
                  (Full HTML logs printed to server terminal console)
                </span>
              </div>
            ) : (
              <form onSubmit={handleEmailReportSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="email-input">Recipient Email</label>
                  <input
                    id="email-input"
                    type="email"
                    className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    disabled={emailSending}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="submit" disabled={emailSending || !emailInput} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
                    {emailSending ? "Sending..." : "Send Report"}
                  </button>
                  <button type="button" onClick={() => setEmailModalOpen(false)} disabled={emailSending} className="px-5 py-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl border border-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
