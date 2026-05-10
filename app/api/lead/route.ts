import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "empty");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { auditId, email, company, role } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Update Supabase record
        try {
            await supabase
                .from("audits")
                .update({ email, company, role })
                .eq("id", auditId);
        } catch (e) {
            console.log("Supabase error (expected if not set up):", e);
        }

        // 2. Send transactional email
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: "Credex AI Audit <onboarding@resend.dev>",
                to: [email],
                subject: "Your AI Spend Audit Results",
                html: `
                    <h2>Thanks for running your AI Spend Audit!</h2>
                    <p>We've saved your results. You can view your full audit report and share it with your team using your unique link.</p>
                    <p>If you're a high-savings candidate, our team at Credex will reach out soon to discuss how we can help you capture those savings through discounted AI credits.</p>
                    <p>Best,<br>The Credex Team</p>
                `
            });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
