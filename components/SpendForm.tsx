// components/SpendForm.tsx
"use client";

import { useState, useEffect } from "react";
import { TOOL_DISPLAY_NAMES, TOOL_PLANS, PRICING } from "@/lib/pricing";
import { FormData, ToolInput, ToolName, UseCase, UsageIntensity } from "@/lib/types";
import { useRouter } from "next/navigation";

const TOOLS: ToolName[] = [
    "cursor", "github_copilot", "claude", "chatgpt",
    "anthropic_api", "openai_api", "gemini", "windsurf",
];

const USE_CASES = [
    { value: "coding", label: "💻 Coding" },
    { value: "writing", label: "✍️ Writing" },
    { value: "data", label: "📊 Data Analysis" },
    { value: "research", label: "🔍 Research" },
    { value: "mixed", label: "🔀 Mixed" },
];

const USAGE_INTENSITY = [
    { value: "light", label: "🌱 Light — few times a week" },
    { value: "moderate", label: "⚡ Moderate — daily use" },
    { value: "heavy", label: "🔥 Heavy — all day, every day" },
];

const defaultTool = (tool: ToolName): ToolInput => ({
    tool,
    plan: TOOL_PLANS[tool][0],
    monthlySpend: 0,
    seats: 1,
});

function getSavedFormData(): FormData | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("auditFormData");
    if (!saved) return null;
    try {
        return JSON.parse(saved) as FormData;
    } catch {
        return null;
    }
}

export default function SpendForm() {
    const router = useRouter();
    const savedForm = getSavedFormData();
    const [selectedTools, setSelectedTools] = useState<ToolName[]>(() =>
        savedForm?.tools.map((t) => t.tool) || []
    );
    const [toolInputs, setToolInputs] = useState<Record<string, ToolInput>>(() => {
        if (!savedForm) return {};
        const inputs: Record<string, ToolInput> = {};
        savedForm.tools.forEach((t) => {
            inputs[t.tool] = t;
        });
        return inputs;
    });
    const [teamSize, setTeamSize] = useState<number>(() => savedForm?.teamSize || 1);
    const [useCase, setUseCase] = useState<UseCase>(() => savedForm?.useCase || "mixed");
    const [usageIntensity, setUsageIntensity] = useState<UsageIntensity>(() =>
        savedForm?.usageIntensity || "moderate"
    );

    useEffect(() => {
        if (selectedTools.length === 0) return;
        const formData: FormData = {
            tools: selectedTools.map((t) => toolInputs[t] || defaultTool(t)),
            teamSize,
            useCase,
            usageIntensity,
        };
        localStorage.setItem("auditFormData", JSON.stringify(formData));
    }, [selectedTools, toolInputs, teamSize, useCase, usageIntensity]);

    function toggleTool(tool: ToolName) {
        setSelectedTools((prev) =>
            prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
        );
        if (!toolInputs[tool]) {
            setToolInputs((prev) => ({ ...prev, [tool]: defaultTool(tool) }));
        }
    }

    function updateToolInput(tool: ToolName, field: keyof ToolInput, value: string | number) {
        setToolInputs((prev) => ({
            ...prev,
            [tool]: { ...prev[tool], [field]: value },
        }));
    }

    function handleSubmit() {
        if (selectedTools.length === 0) {
            alert("Please select at least one AI tool!");
            return;
        }
        const formData: FormData = {
            tools: selectedTools.map((t) => toolInputs[t] || defaultTool(t)),
            teamSize,
            useCase,
            usageIntensity,
        };
        localStorage.setItem("auditFormData", JSON.stringify(formData));
        router.push("/results");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">🔍 AI Spend Audit</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Find out if you&apos;re overspending on AI tools — free, instant audit
                </p>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

                {/* Step 1: Team Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Step 1: Your Team
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team Size
                            </label>
                            <input
                                type="number" min={1} value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Primary Use Case
                            </label>
                            <select
                                value={useCase}
                                onChange={(e) => setUseCase(e.target.value as UseCase)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {USE_CASES.map((uc) => (
                                    <option key={uc.value} value={uc.value}>{uc.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                How heavily do you use AI tools?
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {USAGE_INTENSITY.map((u) => (
                                    <button
                                        key={u.value}
                                        onClick={() => setUsageIntensity(u.value as UsageIntensity)}
                                        className={`px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${usageIntensity === u.value
                                                ? "border-green-500 bg-green-50 text-green-800"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        {u.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Select Tools */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Step 2: Select Your AI Tools
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {TOOLS.map((tool) => (
                            <button
                                key={tool}
                                onClick={() => toggleTool(tool)}
                                className={`px-4 py-3 rounded-xl border-2 text-left font-medium transition-all ${selectedTools.includes(tool)
                                        ? "border-green-500 bg-green-50 text-green-800"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {selectedTools.includes(tool) ? "✅ " : ""}
                                {TOOL_DISPLAY_NAMES[tool]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Tool Details */}
                {selectedTools.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Step 3: Enter Your Spend
                        </h2>
                        <div className="space-y-6">
                            {selectedTools.map((tool) => {
                                const input = toolInputs[tool] || defaultTool(tool);
                                const plans = TOOL_PLANS[tool];
                                const currentPlanPrice = (PRICING as Record<string, Record<string, { pricePerUser: number }>>)[tool]?.[input.plan]?.pricePerUser || 0;
                                return (
                                    <div key={tool} className="border border-gray-200 rounded-xl p-4 space-y-3">
                                        <h3 className="font-semibold text-gray-800">
                                            {TOOL_DISPLAY_NAMES[tool]}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Plan</label>
                                                <select
                                                    value={input.plan}
                                                    onChange={(e) => {
                                                        updateToolInput(tool, "plan", e.target.value);
                                                        // Plan change అయితే auto-fill price
                                                        const price = (PRICING as Record<string, Record<string, { pricePerUser: number }>>)[tool]?.[e.target.value]?.pricePerUser || 0;
                                                        if (price > 0) {
                                                            updateToolInput(tool, "monthlySpend", price * input.seats);
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    {plans.map((plan) => (
                                                        <option key={plan} value={plan}>
                                                            {(PRICING as Record<string, Record<string, { name?: string }>>)[tool]?.[plan]?.name || plan}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Monthly Spend ($)
                                                </label>
                                                <input
                                                    type="number" min={0}
                                                    value={input.monthlySpend}
                                                    onChange={(e) => updateToolInput(tool, "monthlySpend", Number(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                                {currentPlanPrice > 0 && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        List: ${currentPlanPrice}/seat
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Seats</label>
                                                <input
                                                    type="number" min={1}
                                                    value={input.seats}
                                                    onChange={(e) => updateToolInput(tool, "seats", Number(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Honeypot — bots కోసం hidden field */}
                <input
                    type="text"
                    name="honeypot"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={selectedTools.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-md"
                >
                    {selectedTools.length === 0
                        ? "Select at least one tool to continue"
                        : "🔍 Run My Free Audit →"}
                </button>
            </div>
        </div>
    );
}