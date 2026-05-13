import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { auditId, email, company, role } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // take audit data
        const { data: auditData } = await supabase
            .from("audits")
            .select("audit_result")
            .eq("id", auditId)
            .single();

        const savings = auditData?.audit_result?.totalMonthlySavings || 0;
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/audit/${auditId}`;

        // save lead data
        try {
            await supabase
                .from("leads")
                .insert({
                    audit_id: auditId,
                    email,
                    company_name: company,
                    role,
                });
        } catch (e) {
            console.log("Lead save error:", e);
        }

        // send confirmation email
        await sendConfirmationEmail(email, savings, shareUrl);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Lead API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}