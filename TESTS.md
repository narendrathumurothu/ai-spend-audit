# Automated Tests

I wrote automated tests using **Vitest** to ensure the core logic of the `auditEngine` is correct and robust.

## How to run the tests
1. Install dependencies: `npm install`
2. Run the tests: `npm run test`

## Test Coverage

**Filename:** `__tests__/auditEngine.test.ts`

This file covers the core business logic of evaluating a user's AI spend. Here are the 5 tests:

1. **Downgrades Cursor Ultra to Pro+ for solo users:** 
   - **What it covers:** Verifies that a single developer paying $200/mo for Cursor Ultra is correctly advised to downgrade to Pro+, calculating the exact savings ($200 - $60 = $140).
2. **Drops GitHub Copilot if Cursor is also used for coding (Duplicate):** 
   - **What it covers:** Checks the duplication logic. If a user inputs both Cursor and GitHub Copilot for coding, it recommends dropping Copilot entirely since they offer overlapping capabilities, maximizing savings.
3. **Recommends Claude Pro for writing over GitHub Copilot:** 
   - **What it covers:** Validates use-case alignment. GitHub Copilot offers no value for "writing", so the engine correctly suggests switching to Claude Pro instead.
4. **Identifies optimal spending (No change needed):** 
   - **What it covers:** Ensures the engine doesn't manufacture fake savings. If a solo dev is on Cursor Pro ($20/mo) for coding, the system recognizes this as optimal and suggests 0 savings.
5. **Drops ChatGPT if Claude is also used for writing (Duplicate):** 
   - **What it covers:** Checks duplication logic for writing tasks. Recommends dropping ChatGPT if Claude Pro is already present, as Claude is generally superior for long-form writing and paying for both is redundant.
