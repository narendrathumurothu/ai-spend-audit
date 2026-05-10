// lib/auditEngine.ts

import { PRICING, TOOL_DISPLAY_NAMES } from "./pricing";
import { FormData, AuditResult, ToolRecommendation, ToolInput, UsageIntensity } from "./types";

// Savings negative కాకుండా చూసుకో
function safeSavings(current: number, recommended: number): number {
    const savings = current - recommended;
    return savings > 0 ? savings : 0;
}

// Already optimal result
function optimal(tool: string, currentSpend: number): ToolRecommendation {
    return {
        tool,
        currentSpend,
        recommendedAction: "No change needed",
        recommendedSpend: currentSpend,
        savings: 0,
        reason: `You are on the right plan for your team size and use case. No cheaper alternative offers equivalent capability for your needs.`,
        isOptimal: true,
        isUpgrade: false,
    };
}

// Free plan logic — upgrade suggest చేయాలా?
function analyzeFreeplan(
    tool: string,
    displayName: string,
    seats: number,
    usageIntensity: UsageIntensity,
    upgradePlan: string,
    upgradePrice: number,
): ToolRecommendation {
    if (usageIntensity === "heavy") {
        return {
            tool: displayName,
            currentSpend: 0,
            recommendedAction: `Upgrade to ${upgradePlan}`,
            recommendedSpend: upgradePrice * seats,
            savings: 0,
            reason: `You are on ${displayName} Free but using it heavily every day. Free plan limits will interrupt your workflow regularly. ${upgradePlan} ($${upgradePrice}/month) removes those limits — treat this as a productivity investment, not a cost.`,
            isOptimal: false,
            isUpgrade: true,
        };
    }
    if (usageIntensity === "moderate") {
        return {
            tool: displayName,
            currentSpend: 0,
            recommendedAction: `Free plan is fine — watch your limits`,
            recommendedSpend: 0,
            savings: 0,
            reason: `${displayName} Free works well for moderate use. If you start hitting rate limits or need more advanced features regularly, ${upgradePlan} ($${upgradePrice}/month) is the natural next step. For now, Free is sufficient.`,
            isOptimal: true,
            isUpgrade: false,
        };
    }
    // light usage
    return {
        tool: displayName,
        currentSpend: 0,
        recommendedAction: "No change needed — Free plan is sufficient",
        recommendedSpend: 0,
        savings: 0,
        reason: `${displayName} Free is perfectly matched to your light usage pattern. You have no reason to upgrade yet. Revisit when your usage grows significantly.`,
        isOptimal: true,
        isUpgrade: false,
    };
}

function analyzeTool(
    toolInput: ToolInput,
    useCase: string,
    usageIntensity: UsageIntensity,
): ToolRecommendation {
    const { tool, plan, monthlySpend, seats } = toolInput;
    const displayName = TOOL_DISPLAY_NAMES[tool] || tool;
    const currentSpend = monthlySpend;

    // ─── CURSOR ───
    if (tool === "cursor") {

        // Free plan
        if (plan === "hobby") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Pro", PRICING.cursor.pro.pricePerUser
            );
        }

        // Ultra — solo user కి overkill
        if (plan === "ultra" && seats === 1) {
            const recommended = PRICING.cursor.pro_plus.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro+",
                recommendedSpend: recommended,
                reason: `Cursor Ultra ($${PRICING.cursor.ultra.pricePerUser}/month) gives 20x credits — only justified for developers coding 8+ hours daily with heavy agent use. Pro+ ($${PRICING.cursor.pro_plus.pricePerUser}/month) gives 3x credits and covers most professional workflows. Save $${savings}/month with no real capability loss.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Pro+ — non-coding use case కి overkill
        if (plan === "pro_plus" && useCase !== "coding") {
            const recommended = PRICING.cursor.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro",
                recommendedSpend: recommended,
                reason: `Cursor Pro+ ($${PRICING.cursor.pro_plus.pricePerUser}/month) is for developers hitting Pro credit limits daily. For ${useCase} tasks, Pro ($${PRICING.cursor.pro.pricePerUser}/month) covers standard workflows. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Teams — solo user కి overkill
        if (plan === "teams" && seats === 1) {
            const recommended = PRICING.cursor.pro.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro",
                recommendedSpend: recommended,
                reason: `Cursor Teams ($${PRICING.cursor.teams.pricePerUser}/user/month) includes shared rules and centralized billing for multiple developers. Solo use on Pro ($${PRICING.cursor.pro.pricePerUser}/month) gives identical AI coding capability. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Writing use case — wrong tool
        if (useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Switch to Claude Pro for writing",
                recommendedSpend: recommended,
                reason: `Cursor is built exclusively for coding — zero value for writing tasks. Claude Pro ($${PRICING.claude.pro.pricePerUser}/month) is purpose-built for writing and significantly more effective. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── GITHUB COPILOT ───
    if (tool === "github_copilot") {

        // Free plan
        if (plan === "free") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Pro", PRICING.github_copilot.pro.pricePerUser
            );
        }

        // Enterprise — small team కి overkill
        if (plan === "enterprise" && seats < 10) {
            const recommended = PRICING.github_copilot.business.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Business plan",
                recommendedSpend: recommended,
                reason: `GitHub Copilot Enterprise ($${PRICING.github_copilot.enterprise.pricePerUser}/user/month) is for large orgs needing 1,000 premium requests/user and SAML SSO. Business ($${PRICING.github_copilot.business.pricePerUser}/user/month) covers all core AI coding for teams under 10. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Pro+ — non-coding కి overkill
        if (plan === "pro_plus" && useCase !== "coding") {
            const recommended = PRICING.github_copilot.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                reason: `GitHub Copilot Pro+ ($${PRICING.github_copilot.pro_plus.pricePerUser}/month) gives 5x premium requests — for heavy coding use only. Pro ($${PRICING.github_copilot.pro.pricePerUser}/month) with 300 requests suffices for ${useCase} tasks. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Writing — wrong tool
        if (useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Switch to Claude Pro for writing",
                recommendedSpend: recommended,
                reason: `GitHub Copilot is a coding-only tool — it provides zero value for writing tasks. Claude Pro ($${PRICING.claude.pro.pricePerUser}/month) is purpose-built for writing and more cost-effective. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── CLAUDE ───
    if (tool === "claude") {

        // Free plan
        if (plan === "free") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Pro", PRICING.claude.pro.pricePerUser
            );
        }

        // Max 20x — most users don't need this
        if (plan === "max_20x") {
            const recommended = PRICING.claude.max_5x.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Max 5x",
                recommendedSpend: recommended,
                reason: `Claude Max 20x ($${PRICING.claude.max_20x.pricePerUser}/month) is justified only for developers running Claude Code 8+ hours daily. Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) covers most professional workflows. Save $${savings}/month unless you consistently exhaust 5x limits.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Max 5x — writing only కి Pro చాలు
        if (plan === "max_5x" && useCase === "writing") {
            const recommended = PRICING.claude.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                reason: `Claude Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) provides 5x usage over Pro — necessary only if you hit rate limits daily. For standard writing tasks, Pro ($${PRICING.claude.pro.pricePerUser}/month) is sufficient. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Team Standard — solo user కి Pro చాలు
        if (plan === "team_std" && seats === 1) {
            const recommended = PRICING.claude.pro.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                reason: `Claude Team Standard ($${PRICING.claude.team_std.pricePerUser}/user/month) is designed for 2+ user collaboration features. Pro ($${PRICING.claude.pro.pricePerUser}/month) gives identical AI access for solo use. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Team Premium — solo user కి Max 5x చాలు
        if (plan === "team_prem" && seats === 1) {
            const recommended = PRICING.claude.max_5x.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Switch to Max 5x plan",
                recommendedSpend: recommended,
                reason: `Claude Team Premium ($${PRICING.claude.team_prem.pricePerUser}/user/month) includes team collaboration features unused by a solo user. Max 5x ($${PRICING.claude.max_5x.pricePerUser}/month) provides same usage limits without the team overhead. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── CHATGPT ───
    if (tool === "chatgpt") {

        // Free plan
        if (plan === "free") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Plus", PRICING.chatgpt.plus.pricePerUser
            );
        }

        // Pro — non-coding కి Plus చాలు
        if (plan === "pro" && useCase !== "coding") {
            const recommended = PRICING.chatgpt.plus.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Plus plan",
                recommendedSpend: recommended,
                reason: `ChatGPT Pro ($${PRICING.chatgpt.pro.pricePerUser}/month) provides 5x-20x more Codex usage — justified only for heavy coding agent workflows. For ${useCase} tasks, Plus ($${PRICING.chatgpt.plus.pricePerUser}/month) provides full GPT-5.5 access. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Business — solo user కి Plus చాలు
        if (plan === "business" && seats === 1) {
            const recommended = PRICING.chatgpt.plus.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Plus plan",
                recommendedSpend: recommended,
                reason: `ChatGPT Business ($${PRICING.chatgpt.business.pricePerUser}/user/month) includes team admin and data privacy controls for multiple users. Solo use on Plus ($${PRICING.chatgpt.plus.pricePerUser}/month) gives same GPT-5.5 access. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── GEMINI ───
    if (tool === "gemini") {

        // Free plan
        if (plan === "free") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Advanced Pro", PRICING.gemini.pro.pricePerUser
            );
        }

        // Ultra — coding కి Cursor better
        if (plan === "ultra" && useCase === "coding") {
            const recommended = PRICING.cursor.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Switch to Cursor Pro for coding",
                recommendedSpend: recommended,
                reason: `Gemini Ultra ($${PRICING.gemini.ultra.pricePerUser}/month) is a general AI assistant. For coding specifically, Cursor Pro ($${PRICING.cursor.pro.pricePerUser}/month) offers IDE integration, codebase context, and agent features purpose-built for developers. Save $${savings}/month with better coding capability.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── WINDSURF ───
    if (tool === "windsurf") {

        // Free plan
        if (plan === "free") {
            return analyzeFreeplan(
                tool, displayName, seats, usageIntensity,
                "Pro", PRICING.windsurf.pro.pricePerUser
            );
        }

        // Max — non-coding కి Pro చాలు
        if (plan === "max" && useCase !== "coding") {
            const recommended = PRICING.windsurf.pro.pricePerUser * seats;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                reason: `Windsurf Max ($${PRICING.windsurf.max.pricePerUser}/month) is for heavy coding power users needing maximum quotas. Pro ($${PRICING.windsurf.pro.pricePerUser}/month) covers standard ${useCase} workflows. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }

        // Teams — solo user కి Pro చాలు
        if (plan === "teams" && seats === 1) {
            const recommended = PRICING.windsurf.pro.pricePerUser;
            const savings = safeSavings(currentSpend, recommended);
            if (savings === 0) return optimal(displayName, currentSpend);
            return {
                tool: displayName, currentSpend, savings,
                recommendedAction: "Downgrade to Pro plan",
                recommendedSpend: recommended,
                reason: `Windsurf Teams ($${PRICING.windsurf.teams.pricePerUser}/user/month) includes collaboration features for multiple developers. Solo use on Pro ($${PRICING.windsurf.pro.pricePerUser}/month) gives full AI coding capability. Save $${savings}/month.`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── ANTHROPIC API / OPENAI API ───
    if (tool === "anthropic_api" || tool === "openai_api") {
        const apiName = tool === "anthropic_api" ? "Anthropic" : "OpenAI";
        if (monthlySpend > 500) {
            return {
                tool: displayName,
                currentSpend: monthlySpend,
                recommendedAction: "Review API usage and consider Credex credits",
                recommendedSpend: monthlySpend * 0.8,
                savings: monthlySpend * 0.2,
                reason: `Your ${apiName} API spend of $${monthlySpend}/month is significant. Credex sources discounted AI credits from companies that overforecast usage — typically 15-25% below retail. At your volume, that could save $${Math.round(monthlySpend * 0.2)}/month ($${Math.round(monthlySpend * 0.2 * 12)}/year).`,
                isOptimal: false,
                isUpgrade: false,
            };
        }
    }

    // ─── Already Optimal ───
    return optimal(displayName, currentSpend);
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
            reason: `For writing tasks, Claude and ChatGPT offer near-identical capability. Claude is better optimized for long-form writing. Paying for both is redundant — drop ChatGPT and save $${chatgptSpend}/month with zero capability loss.`,
            isOptimal: false,
            isUpgrade: false,
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
            reason: `Cursor and GitHub Copilot both provide AI coding assistance. Cursor's agent mode and codebase context are significantly more advanced. Paying for both adds zero capability. Drop Copilot and save $${copilotSpend}/month.`,
            isOptimal: false,
            isUpgrade: false,
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
            reason: `You are paying for both a Claude subscription and Anthropic API direct access. If your API usage is low volume, the Claude subscription alone may be more cost-effective. Compare your monthly API invoice against the subscription cost to decide.`,
            isOptimal: false,
            isUpgrade: false,
        });
    }

    return results;
}

// ─── Main Audit Function ───
export function runAudit(formData: FormData): AuditResult {
    const recommendations: ToolRecommendation[] = [];

    for (const toolInput of formData.tools) {
        const rec = analyzeTool(
            toolInput,
            formData.useCase,
            formData.usageIntensity || "moderate",
        );
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