// app/results/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AuditResult } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
    const router = useRouter();
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [auditId, setAuditId] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("auditFormData");
        if (!saved) { router.push("/"); return; }

        const fetchAudit = async () => {
            try {
                const response = await fetch("/api/audit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: saved,
                });
                const data = await response.json();
                setAuditResult(data.auditResult);
                setAuditId(data.auditId);
            } catch (error) {
                console.error("Failed to fetch audit", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, [router]);

    const handleLeadSubmit = async () => {
        if (!email) return;
        try {
            await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auditId, email, company, role }),
            });
            setLeadSubmitted(true);
        } catch (e) { console.error(e); }
    };

    if (loading || !auditResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Analyzing your AI spend...</p>
                </div>
            </div>
        );
    }

    const shareableUrl = auditId
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/audit/${auditId}`
        : "";

    const upgradeRecs = auditResult.recommendations.filter((r) => r.isUpgrade);
    const savingsRecs = auditResult.recommendations.filter((r) => !r.isOptimal && !r.isUpgrade);
    const optimalRecs = auditResult.recommendations.filter((r) => r.isOptimal);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Your AI Spend Audit</h1>
                <p className="text-gray-500 mt-2">Here&apos;s exactly where you stand and what to do next</p>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

                {/* Hero */}
                <div className={`rounded-2xl p-8 text-center text-white shadow-lg ${auditResult.totalMonthlySavings > 0 ? "bg-green-600" : "bg-blue-600"
                    }`}>
                    {auditResult.totalMonthlySavings > 0 ? (
                        <>
                            <p className="text-lg font-medium opacity-90">You could save</p>
                            <p className="text-6xl font-bold my-2">${auditResult.totalMonthlySavings}/mo</p>
                            <p className="text-xl opacity-90">That&apos;s ${auditResult.totalAnnualSavings}/year!</p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-bold">🎉 You&apos;re spending well!</p>
                            <p className="text-lg opacity-90 mt-2">Your AI tool stack is already optimized.</p>
                        </>
                    )}
                </div>

                {/* AI Summary */}
                {auditResult.aiSummary && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">🤖 AI Summary</h2>
                        <p className="text-gray-700 leading-relaxed">{auditResult.aiSummary}</p>
                    </div>
                )}

                {/* Savings Opportunities */}
                {savingsRecs.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">⚠️ Overspend Detected</h2>
                        {savingsRecs.map((rec, i) => (
                            <div key={i} className="bg-white rounded-xl border border-orange-200 p-5 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <h3 className="font-semibold text-gray-900 text-lg">{rec.tool}</h3>
                                        <p className="font-medium text-orange-700 mt-1">{rec.recommendedAction}</p>
                                        <p className="text-sm text-gray-600 mt-2">{rec.reason}</p>
                                    </div>
                                    <div className="text-right shrink-0 bg-orange-50 p-3 rounded-lg min-w-[110px]">
                                        <p className="text-xs text-gray-500 uppercase">Current</p>
                                        <p className="font-medium text-gray-900">${rec.currentSpend}/mo</p>
                                        <p className="text-xs text-green-700 uppercase mt-2">Savings</p>
                                        <p className="text-green-600 font-bold text-lg">${rec.savings}/mo</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upgrade Opportunities */}
                {upgradeRecs.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">💡 Upgrade Opportunities</h2>
                        <p className="text-sm text-gray-500">Based on your heavy usage pattern, these upgrades would improve your productivity.</p>
                        {upgradeRecs.map((rec, i) => (
                            <div key={i} className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <h3 className="font-semibold text-blue-900 text-lg">{rec.tool}</h3>
                                        <p className="font-medium text-blue-700 mt-1">{rec.recommendedAction}</p>
                                        <p className="text-sm text-blue-800 mt-2">{rec.reason}</p>
                                    </div>
                                    <div className="text-right shrink-0 bg-blue-100 p-3 rounded-lg min-w-[110px]">
                                        <p className="text-xs text-blue-600 uppercase">Investment</p>
                                        <p className="text-blue-900 font-bold text-lg">${rec.recommendedSpend}/mo</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Optimal Tools */}
                {optimalRecs.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-gray-800">✅ Already Optimized</h2>
                        {optimalRecs.map((rec, i) => (
                            <div key={i} className="bg-green-50 rounded-xl border border-green-200 p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-green-900">{rec.tool}</h3>
                                        <p className="text-sm text-green-700 mt-1">{rec.reason}</p>
                                    </div>
                                    <p className="text-green-800 font-medium shrink-0 ml-4">${rec.currentSpend}/mo</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Credex CTA */}
                {auditResult.showCredex && (
                    <div className="bg-green-900 text-white rounded-2xl p-8 text-center shadow-xl">
                        <h2 className="text-2xl font-bold">💰 Save Even More with Credex</h2>
                        <p className="mt-2 text-green-200">
                            Get discounted AI credits — same tools, 15-25% lower price.
                            Credex sources credits from companies that overforecast usage.
                        </p>

                        <a
                            href="https://credex.rocks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 bg-white text-green-900 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition"
                        >
                            Book Free Credex Consultation →
                        </a>
                    </div>
                )}

                {/* Lead Capture */}
                <div className="bg-white border-2 border-green-500 rounded-2xl p-8 shadow-xl">
                    {leadSubmitted ? (
                        <div className="text-center py-4">
                            <h2 className="text-2xl font-bold text-green-700">✅ Report Sent!</h2>
                            <p className="text-gray-600 mt-2">Check your email for the full breakdown.</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {auditResult.showCredex ? "💰 Get Your Full Report + Consultation" : "📥 Save This Report"}
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    {auditResult.showCredex
                                        ? "Enter your details to receive your full audit and book a free Credex consultation."
                                        : "Enter your email to save these results and get notified when new optimizations apply."}
                                </p>
                            </div>
                            <div className="space-y-4 max-w-md mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Work Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                        placeholder="founder@startup.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                        <input
                                            type="text" value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            placeholder="Acme Inc"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <input
                                            type="text" value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            placeholder="CEO / CTO"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleLeadSubmit}
                                    disabled={!email}
                                    className="w-full bg-green-600 disabled:bg-green-300 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                                >
                                    {auditResult.showCredex ? "Send Report & Book Consultation" : "Send Me My Report"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Shareable URL */}
                {auditId && (
                    <div className="bg-gray-100 rounded-xl p-5 text-center border border-gray-200">
                        <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Share your results</p>
                        <div className="flex items-center justify-center space-x-2">
                            <input
                                readOnly value={shareableUrl}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 w-full max-w-sm"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(shareableUrl)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
                >
                    ← Edit My Tools
                </button>
            </div>
        </div >
    );
}