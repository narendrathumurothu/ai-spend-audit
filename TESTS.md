# Automated Tests

This project uses **Vitest** to validate the audit engine and ensure the core recommendation logic behaves correctly.

## How to run

```bash
npm install
npm run test
```

If PowerShell script execution is blocked, the direct command is:

```bash
node node_modules/vitest/vitest.mjs run
```

## Test coverage

**Filename:** `__tests__/auditEngine.test.ts`

### What it covers

1. **Cursor Ultra downgrade for solo users**
   - Confirms the audit recommends downgrading from Cursor Ultra to Pro+ when a single developer is overpaying.
2. **Duplicate tool detection for Cursor + Copilot**
   - Ensures the engine flags overlapping coding tools and recommends dropping the redundant subscription.
3. **Writing use case alignment**
   - Validates that GitHub Copilot is not recommended for writing and that Claude Pro is suggested instead.
4. **Optimal spend detection**
   - Verifies the engine does not generate false savings for already optimal plans.
5. **Duplicate tool detection for Claude + ChatGPT**
   - Ensures redundant writing tools are flagged and that ChatGPT is recommended to be removed when Claude is sufficient.

These tests focus on the audit engine because it is the product's core differentiator.
