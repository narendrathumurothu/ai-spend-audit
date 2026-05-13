import { NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { supabase } from "@/lib/supabase";
import { FormData } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "empty");

export async function POST(request: Request) {
    try {
        const body: FormData = await request.json();
        
        // 1. Run audit
        const auditResult = runAudit(body);
        
        // 2. Generate AI summary using Gemini
        let aiSummary = "";
        try {
            if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "empty") {
                const prompt = `You are an AI spend optimization assistant. Write a short, personalized summary (under 100 words) for a company with team size ${body.teamSize} focusing on ${body.useCase}. They are currently using ${body.tools.map(t => t.tool).join(', ')}. They can save $${auditResult.totalMonthlySavings}/month. Tell them why they should act on these recommendations. Keep it extremely brief and professional.`;
                
                const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiSummary = response.text() || "";
            } else {
                throw new Error("No API Key");
            }
        } catch (e) {
            console.error("Gemini Error:", e);
            aiSummary = `By optimizing your AI tool stack for a team of ${body.teamSize} (${body.useCase}), you can save $${auditResult.totalMonthlySavings}/month ($${auditResult.totalAnnualSavings}/year). Review the recommendations below to see exactly where to downgrade, switch, or consolidate your tools.`;
        }
        
        auditResult.aiSummary = aiSummary;

        // 3. Save to Supabase (if connected)
        let auditId = crypto.randomUUID();
        try {
            const { data } = await supabase
                .from("audits")
                .insert({
                    id: auditId,
                    form_data: body,
                    audit_result: auditResult,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();
                
            if (data?.id) {
                auditId = data.id;
            }
        } catch (e) {
            console.log("Supabase error (expected if not set up):", e);
        }

        return NextResponse.json({ auditId, auditResult, aiSummary });

    } catch (e: unknown) {
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
