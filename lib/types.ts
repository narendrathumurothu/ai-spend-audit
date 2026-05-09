export type ToolName =
    | "cursor"
    | "github_copilot"
    | "claude"
    | "chatgpt"
    | "anthropic_api"
    | "openai_api"
    | "gemini"
    | "windsurf";

export type CursorPlan =
    | "hobby"
    | "pro"
    | "pro_plus"
    | "ultra"
    | "teams";

export type CopilotPlan =
    | "free"
    | "pro"
    | "pro_plus"
    | "business"
    | "enterprise";

export type ClaudePlan =
    | "free"
    | "pro"
    | "max_5x"
    | "max_20x"
    | "team_std"
    | "team_prem"
    | "enterprise"
    | "api";

export type ChatGPTPlan =
    | "free"
    | "go"
    | "plus"
    | "pro"
    | "business"
    | "enterprise"
    | "api";

export type GeminiPlan =
    | "free"
    | "pro"
    | "ultra"
    | "api";

export type WindsurfPlan =
    | "free"
    | "pro"
    | "max"
    | "teams"
    | "enterprise";

export type UseCase =
    | "coding"
    | "writing"
    | "data"
    | "research"
    | "mixed";

export interface ToolInput {
    tool: ToolName;
    plan: string;
    monthlySpend: number;
    seats: number;
}

export interface FormData {
    tools: ToolInput[];
    teamSize: number;
    useCase: UseCase;
}

export interface ToolRecommendation {
    tool: string;
    currentSpend: number;
    recommendedAction: string;
    recommendedSpend: number;
    savings: number;
    reason: string;
    isOptimal: boolean;
}

export interface AuditResult {
    recommendations: ToolRecommendation[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    aiSummary: string;
    showCredex: boolean;
}

export interface SavedAudit {
    id: string;
    shareId: string;
    formData: FormData;
    results: AuditResult;
    createdAt: string;
}

export interface LeadData {
    auditId: string;
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: number;
}