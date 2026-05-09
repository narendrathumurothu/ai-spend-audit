export const PRICING = {

    cursor: {
        hobby: { pricePerUser: 0, name: "Hobby (Free)" },
        pro: { pricePerUser: 20, name: "Pro ($16/m yearly)" },
        pro_plus: { pricePerUser: 60, name: "Pro+ ($48/m yearly)" },
        ultra: { pricePerUser: 200, name: "Ultra ($160/m yearly)" },
        teams: { pricePerUser: 40, name: "Teams ($32/m yearly)" },
    },

    github_copilot: {
        free: { pricePerUser: 0, name: "Free" },
        pro: { pricePerUser: 10, name: "Pro" },
        pro_plus: { pricePerUser: 39, name: "Pro+" },
        business: { pricePerUser: 19, name: "Business" },
        enterprise: { pricePerUser: 39, name: "Enterprise" },
    },

    claude: {
        free: { pricePerUser: 0, name: "Free" },
        pro: { pricePerUser: 17, name: "Pro" },
        max_5x: { pricePerUser: 100, name: "Max (5x)" },
        max_20x: { pricePerUser: 200, name: "Max (20x)" },
        team_std: { pricePerUser: 20, name: "Team Standard" },
        team_prem: { pricePerUser: 100, name: "Team Premium" },
        enterprise: { pricePerUser: 0, name: "Enterprise (Custom)" },
        api: { pricePerUser: 0, name: "API (usage-based)" },
    },

    chatgpt: {
        free: { pricePerUser: 0, name: "Free" },
        go: { pricePerUser: 5, name: "Go (₹399/m)" },
        plus: { pricePerUser: 24, name: "Plus (₹1,999/m)" },
        pro: { pricePerUser: 129, name: "Pro (₹10,699/m)" },
        business: { pricePerUser: 22, name: "Business (₹1,800/m)" },
        enterprise: { pricePerUser: 0, name: "Enterprise (Custom)" },
        api: { pricePerUser: 0, name: "API (usage-based)" },
    },

    anthropic_api: {
        api: { pricePerUser: 0, name: "API (usage-based)" },
    },

    openai_api: {
        api: { pricePerUser: 0, name: "API (usage-based)" },
    },

    gemini: {
        free: { pricePerUser: 0, name: "Free" },
        pro: { pricePerUser: 20, name: "Advanced (Pro)" },
        ultra: { pricePerUser: 30, name: "Ultra" },
        api: { pricePerUser: 0, name: "API (usage-based)" },
    },

    windsurf: {
        free: { pricePerUser: 0, name: "Free" },
        pro: { pricePerUser: 20, name: "Pro" },
        max: { pricePerUser: 200, name: "Max" },
        teams: { pricePerUser: 40, name: "Teams" },
        enterprise: { pricePerUser: 0, name: "Enterprise (Custom)" },
    },
};

export const TOOL_DISPLAY_NAMES: Record<string, string> = {
    cursor: "Cursor",
    github_copilot: "GitHub Copilot",
    claude: "Claude",
    chatgpt: "ChatGPT",
    anthropic_api: "Anthropic API",
    openai_api: "OpenAI API",
    gemini: "Gemini",
    windsurf: "Windsurf",
};

export const TOOL_PLANS: Record<string, string[]> = {
    cursor: ["hobby", "pro", "pro_plus", "ultra", "teams"],
    github_copilot: ["free", "pro", "pro_plus", "business", "enterprise"],
    claude: ["free", "pro", "max_5x", "max_20x", "team_std", "team_prem", "enterprise", "api"],
    chatgpt: ["free", "go", "plus", "pro", "business", "enterprise", "api"],
    anthropic_api: ["api"],
    openai_api: ["api"],
    gemini: ["free", "pro", "ultra", "api"],
    windsurf: ["free", "pro", "max", "teams", "enterprise"],
};