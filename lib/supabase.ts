import { createClient } from "@supabase/supabase-js";

function isValidHttpUrl(value: string | undefined): value is string {
    if (!value) return false;
    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseUrl = isValidHttpUrl(rawSupabaseUrl)
    ? rawSupabaseUrl
    : "https://placeholder-url.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
