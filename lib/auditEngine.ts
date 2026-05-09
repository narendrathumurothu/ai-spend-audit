import { PRICING, TOOL_DISPLAY_NAMES } from "./pricing";
import { FormData, AuditResult, ToolRecommendation, ToolInput } from "./types";

function analyzeTool(
    toolInput: ToolInput,
    useCase: string,
    teamSize: number
): ToolRecommendation {
    const { tool, plan, monthlySpend, seats } = toolInput;
    const displayName = TOOL_DISPLAY_NAMES[tool] || tool;

    // ─── CURSOR ───
    if (tool === "cursor") {
        if (plan === "ultra" && seats === 1) {
            const recommended = PRICING.cursor.pro_plus.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro+",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Cursor Ultra ($${PRICING.cursor.ultra.pricePerUser}/month) gives 20x credits — only worth it for developers coding 8+ hours daily with heavy agent use. Pro+ ($${PRICING.cursor.pro_plus.pricePerUser}/month) gives 3x credits and covers most professional workflows. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "pro_plus" && seats === 1 && useCase !== "coding") {
            const recommended = PRICING.cursor.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Cursor Pro+ ($${PRICING.cursor.pro_plus.pricePerUser}/month) is for developers hitting Pro credit limits daily. For non-coding tasks, Pro ($${PRICING.cursor.pro.pricePerUser}/month) covers standard workflows. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "teams" && seats === 1) {
            const recommended = PRICING.cursor.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Cursor Teams ($${PRICING.cursor.teams.pricePerUser}/user/month) is designed for multiple developers needing shared rules and billing. Solo use on Pro ($${PRICING.cursor.pro.pricePerUser}/month) gives identical AI coding capability. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Claude Pro for writing",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Cursor is built exclusively for coding. For writing tasks, Claude Pro ($${PRICING.claude.pro.pricePerUser}/month) is purpose-built and significantly more effective at the same or lower price.`,
                isOptimal: false,
            };
        }
    }

    // ─── GITHUB COPILOT ───
    if (tool === "github_copilot") {
        if (plan === "enterprise" && seats < 10) {
            const recommended = PRICING.github_copilot.business.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Business plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `GitHub Copilot Enterprise ($${PRICING.github_copilot.enterprise.pricePerUser}/user/month) is built for large orgs needing SAML SSO and 1,000 premium requests/user. Business ($${PRICING.github_copilot.business.pricePerUser}/user/month) covers all core AI coding for teams under 10. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "pro_plus" && useCase !== "coding") {
            const recommended = PRICING.github_copilot.pro.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `GitHub Copilot Pro+ ($${PRICING.github_copilot.pro_plus.pricePerUser}/month) gives 5x premium requests and all models — for heavy coding use. Pro ($${PRICING.github_copilot.pro.pricePerUser}/month) with 300 requests suffices for non-coding tasks. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Claude Pro for writing",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `GitHub Copilot is a coding-only tool — it offers no value for writing tasks. Claude Pro ($${PRICING.claude.pro.pricePerUser}/month) is purpose-built for writing and costs $${PRICING.github_copilot.pro.pricePerUser - PRICING.claude.pro.pricePerUser >= 0 ? PRICING.github_copilot.pro.pricePerUser - PRICING.claude.pro.pricePerUser : 0} less per seat.`,
                isOptimal: false,
            };
        }
    }

    // ─── CLAUDE ───
    if (tool === "claude") {
        if (plan === "max_20x") {
            const recommended = PRICING.claude.max_5x.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Max 5x",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Claude Max 20x ($${PRICING.claude.max_20x.pricePerUser}/month) is for power users running Claude Code 8+ hours daily. Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) covers most professional workflows. Save $${monthlySpend - recommended}/month unless you consistently exhaust 5x limits.`,
                isOptimal: false,
            };
        }
        if (plan === "max_5x" && useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Claude Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) offers 5x usage limits over Pro. For standard writing tasks, Pro ($${PRICING.claude.pro.pricePerUser}/month) limits are sufficient. Save $${monthlySpend - recommended}/month unless you hit rate limits daily.`,
                isOptimal: false,
            };
        }
        if (plan === "team_std" && seats === 1) {
            const recommended = PRICING.claude.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Claude Team Standard ($${PRICING.claude.team_std.pricePerUser}/user/month) is designed for collaboration with 2+ users. Pro ($${PRICING.claude.pro.pricePerUser}/month) gives identical AI access for solo use. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "team_prem" && seats === 1) {
            const recommended = PRICING.claude.max_5x.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Max 5x plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Claude Team Premium ($${PRICING.claude.team_prem.pricePerUser}/user/month) includes team collaboration features unused by a solo user. Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) gives same usage limits without paying for team overhead. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
    }

    // ─── CHATGPT ───
    if (tool === "chatgpt") {
        if (plan === "pro" && useCase !== "coding") {
            const recommended = PRICING.chatgpt.plus.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Plus plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `ChatGPT Pro ($${PRICING.chatgpt.pro.pricePerUser}/month) gives 5x-20x more Codex usage — built for heavy coding agent workflows. For writing, research, or mixed use, Plus ($${PRICING.chatgpt.plus.pricePerUser}/month) provides full GPT-5.5 access. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "business" && seats === 1) {
            const recommended = PRICING.chatgpt.plus.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Plus plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `ChatGPT Business ($${PRICING.chatgpt.business.pricePerUser}/user/month) includes team admin controls and data privacy features for multiple users. Solo use on Plus ($${PRICING.chatgpt.plus.pricePerUser}/month) gives same AI model access. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
    }

    // ─── GEMINI ───
    if (tool === "gemini") {
        if (plan === "ultra" && useCase === "coding") {
            const recommended = PRICING.cursor.pro.pricePerUser * seats;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Cursor Pro for coding",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Gemini Ultra ($${PRICING.gemini.ultra.pricePerUser}/month) is a general AI assistant. For coding specifically, Cursor Pro ($${PRICING.cursor.pro.pricePerUser}/month) offers IDE integration, codebase context, and agent features purpose-built for developers. Save $${monthlySpend - recommended}/month with better coding capability.`,
                isOptimal: false,
            };
        }
    }

    // ─── WINDSURF ───
    if (tool === "windsurf") {
        if (plan === "max" && seats === 1 && useCase !== "coding") {
            const recommended = PRICING.windsurf.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Windsurf Max ($${PRICING.windsurf.max.pricePerUser}/month) is for heavy coding power users needing maximum quotas. Pro ($${PRICING.windsurf.pro.pricePerUser}/month) covers standard development workflows. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
        if (plan === "teams" && seats === 1) {
            const recommended = PRICING.windsurf.pro.pricePerUser;
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                savings: monthlySpend - recommended,
                reason: `Windsurf Teams ($${PRICING.windsurf.teams.pricePerUser}/user/month) includes collaboration features for multiple developers. Solo use on Pro ($${PRICING.windsurf.pro.pricePerUser}/month) gives full AI coding capability. Save $${monthlySpend - recommended}/month.`,
                isOptimal: false,
            };
        }
    }

    // ─── Already Optimal ───
    return {
        tool: displayName,
        currentSpend: monthlySpend,
        recommendedAction: "No change needed",
        recommendedSpend: monthlySpend,
        savings: 0,
        reason: `You're on the right plan for your team size and use case. No cheaper alternative offers equivalent capability for your needs.`,
        isOptimal: true,
    };
}

// ─── Duplicate Tools Check ───
function checkDuplicates(formData: FormData): ToolRecommendation[] {
    const results: ToolRecommendation[] = [];

    const hasChatGPT = formData.tools.find((t) => t.tool === "chatgpt");
    const hasClaude = formData.tools.find((t) => t.tool === "claude");

    if (hasChatGPT && hasClaude && formData.useCase === "writing") {
        const chatgptSpend = hasChatGPT.monthlySpend;
        results.push({
            tool: "ChatGPT (Duplicate)",
            currentSpend: chatgptSpend,
            recommendedAction: "Drop ChatGPT, keep Claude only",
            recommendedSpend: 0,
            savings: chatgptSpend,
            reason: `For writing tasks, Claude and ChatGPT offer near-identical capability. Claude is better optimized for long-form writing. Paying for both is redundant. Drop ChatGPT and save $${chatgptSpend}/month.`,
            isOptimal: false,
        });
    }

    const hasCursor = formData.tools.find((t) => t.tool === "cursor");
    const hasCopilot = formData.tools.find((t) => t.tool === "github_copilot");

    if (hasCursor && hasCopilot && formData.useCase === "coding") {
        const copilotSpend = hasCopilot.monthlySpend;
        results.push({
            tool: "GitHub Copilot (Duplicate)",
            currentSpend: copilotSpend,
            recommendedAction: "Drop GitHub Copilot, keep Cursor only",
            recommendedSpend: 0,
            savings: copilotSpend,
            reason: `Cursor and GitHub Copilot both provide AI coding assistance. Cursor's agent mode and codebase context are more advanced. Paying for both adds no capability. Drop Copilot and save $${copilotSpend}/month.`,
            isOptimal: false,
        });
    }

    const hasAnthropicApi = formData.tools.find((t) => t.tool === "anthropic_api");
    const hasClaudeSub = formData.tools.find(
        (t) => t.tool === "claude" && t.plan !== "api"
    );

    if (hasAnthropicApi && hasClaudeSub) {
        results.push({
            tool: "Anthropic API (Possible Overlap)",
            currentSpend: hasAnthropicApi.monthlySpend,
            recommendedAction: "Audit API vs subscription usage",
            recommendedSpend: 0,
            savings: 0,
            reason: `You're paying for both Claude subscription and Anthropic API direct. If API usage is low, Claude subscription alone may be more cost-effective. Review monthly API spend vs subscription cost.`,
            isOptimal: false,
        });
    }

    return results;
}

// ─── Main Audit Function ───
export function runAudit(formData: FormData): AuditResult {
    const recommendations: ToolRecommendation[] = [];

    for (const toolInput of formData.tools) {
        const rec = analyzeTool(toolInput, formData.useCase, formData.teamSize);
        recommendations.push(rec);
    }

    const duplicates = checkDuplicates(formData);
    recommendations.push(...duplicates);

    const totalMonthlySavings = recommendations.reduce(
        (sum, r) => sum + r.savings,
        0
    );

    return {
        recommendations,
        totalMonthlySavings,
        totalAnnualSavings: totalMonthlySavings * 12,
        aiSummary: "",
        showCredex: totalMonthlySavings > 500,
    };
}