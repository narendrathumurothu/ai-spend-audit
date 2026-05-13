import { expect, test, describe } from 'vitest';
import { runAudit } from '../lib/auditEngine';
import { FormData } from '../lib/types';
import { PRICING } from '../lib/pricing';

describe('Audit Engine', () => {
    
    test('1. Downgrades Cursor Ultra to Pro+ for solo users', () => {
        const data: FormData = {
            teamSize: 1,
            useCase: "coding",
            tools: [{ tool: "cursor", plan: "ultra", monthlySpend: 200, seats: 1 }]
        };
        const result = runAudit(data);
        expect(result.recommendations[0].recommendedAction).toContain("Downgrade to Pro+");
        expect(result.totalMonthlySavings).toBe(200 - PRICING.cursor.pro_plus.pricePerUser);
    });

    test('2. Drops GitHub Copilot if Cursor is also used for coding (Duplicate)', () => {
        const data: FormData = {
            teamSize: 1,
            useCase: "coding",
            tools: [
                { tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
                { tool: "github_copilot", plan: "pro", monthlySpend: 10, seats: 1 }
            ]
        };
        const result = runAudit(data);
        const duplicateRec = result.recommendations.find(r => r.tool.includes("Duplicate"));
        expect(duplicateRec).toBeDefined();
        expect(duplicateRec?.savings).toBe(10);
    });

    test('3. Recommends Claude Pro for writing over GitHub Copilot', () => {
        const data: FormData = {
            teamSize: 2,
            useCase: "writing",
            tools: [{ tool: "github_copilot", plan: "pro", monthlySpend: 20, seats: 2 }]
        };
        const result = runAudit(data);
        expect(result.recommendations[0].recommendedAction).toContain("Switch to Claude Pro");
    });

    test('4. Identifies optimal spending (No change needed)', () => {
        const data: FormData = {
            teamSize: 1,
            useCase: "coding",
            tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }]
        };
        const result = runAudit(data);
        expect(result.recommendations[0].isOptimal).toBe(true);
        expect(result.totalMonthlySavings).toBe(0);
    });

    test('5. Drops ChatGPT if Claude is also used for writing (Duplicate)', () => {
        const data: FormData = {
            teamSize: 1,
            useCase: "writing",
            tools: [
                { tool: "claude", plan: "pro", monthlySpend: 20, seats: 1 },
                { tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 }
            ]
        };
        const result = runAudit(data);
        const duplicateRec = result.recommendations.find(r => r.tool.includes("Duplicate"));
        expect(duplicateRec).toBeDefined();
        expect(duplicateRec?.savings).toBe(20);
        expect(duplicateRec?.recommendedAction).toContain("Drop ChatGPT");
    });

});
