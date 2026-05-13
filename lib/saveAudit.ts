import { supabase } from "./supabase";
import { FormData, AuditResult } from "./types";

export async function saveAudit(
    formData: FormData,
    auditResult: AuditResult
): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from("audits")
            .insert({
                form_data: formData,
                audit_result: auditResult,
            })
            .select("id")
            .single();

        if (error) {
            console.error("Save audit error:", error);
            return null;
        }

        return data.id;
    } catch (e) {
        console.error("Save audit exception:", e);
        return null;
    }
}