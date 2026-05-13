import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const { data } = await supabase.from("audits").select("audit_result").eq("id", id).single();
    
    const savings = data?.audit_result?.totalMonthlySavings || 0;
    
    return {
        title: `AI Spend Audit | Saved $${savings}/mo`,
        description: `This startup found $${savings}/month in AI tool overspend using the Credex AI Spend Audit. Check your own stack now.`,
        openGraph: {
            title: `AI Spend Audit | Saved $${savings}/mo`,
            description: `We found $${savings}/month in AI tool overspend using the Credex AI Spend Audit.`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `AI Spend Audit | Saved $${savings}/mo`,
            description: `We found $${savings}/month in AI tool overspend using the Credex AI Spend Audit.`,
        }
    };
}

export default async function AuditSharePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const { data, error } = await supabase.from("audits").select("audit_result, form_data").eq("id", id).single();

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Audit Not Found</h1>
                    <p className="text-gray-500 mt-2">This audit report doesn&apos;t exist or has been removed.</p>
                    <Link href="/" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium">Run Your Own Audit</Link>
                </div>
            </div>
        );
    }

    const auditResult = data.audit_result;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    AI Spend Audit Results
                </h1>
                <p className="text-gray-500 mt-2">
                    Anonymous audit report generated via Credex
                </p>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
                {/* Hero */}
                <div className={`rounded-2xl p-8 text-center text-white shadow-lg ${auditResult.totalMonthlySavings > 0
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}>
                    {auditResult.totalMonthlySavings > 0 ? (
                        <>
                            <p className="text-lg font-medium opacity-90">
                                Identified Savings
                            </p>
                            <p className="text-6xl font-bold my-2">
                                ${auditResult.totalMonthlySavings}/mo
                            </p>
                            <p className="text-xl opacity-90">
                                That&apos;s ${auditResult.totalAnnualSavings}/year!
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-bold">
                                🎉 Stack is highly optimized!
                            </p>
                        </>
                    )}
                </div>

                {/* Per Tool Breakdown */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Tool Breakdown
                    </h2>
                    {auditResult.recommendations.map((rec: { isOptimal: boolean, tool: string, recommendedAction: string, currentSpend: number, savings: number }, i: number) => (
                        <div
                            key={i}
                            className={`bg-white rounded-xl border p-5 shadow-sm ${rec.isOptimal
                                    ? "border-green-200"
                                    : "border-orange-200"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {rec.isOptimal ? "✅" : "⚠️"} {rec.tool}
                                    </h3>
                                    <p className="font-medium text-gray-800 mt-1">
                                        {rec.recommendedAction}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Current: <span className="font-medium">${rec.currentSpend}/mo</span>
                                    </p>
                                    {rec.savings > 0 && (
                                        <p className="text-green-600 font-bold mt-1">
                                            Save ${rec.savings}/mo
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-gray-900 text-white rounded-2xl p-8 text-center shadow-xl">
                    <h2 className="text-2xl font-bold">Are you overspending on AI?</h2>
                    <p className="mt-2 text-gray-300">
                        Find out in 30 seconds. Run your own free audit and see how much you could save on Cursor, Claude, ChatGPT and more.
                    </p>
                    <Link href="/" className="inline-block mt-6 bg-green-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-400 transition shadow-lg">
                        Run My Free Audit →
                    </Link>
                </div>
            </div>
        </div>
    );
}
