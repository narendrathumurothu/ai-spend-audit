// lib/saveLead.ts
import { supabase } from "./supabase";

export async function saveLead({
    auditId,
    email,
    companyName,
    role,
    teamSize,
}: {
    auditId: string;
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: number;
}): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("leads")
            .insert({
                audit_id: auditId,
                email,
                company_name: companyName,
                role,
                team_size: teamSize,
            });

        if (error) {
            console.error("Save lead error:", error);
            return false;
        }

        return true;
    } catch (e) {
        console.error("Save lead exception:", e);
        return false;
    }
}