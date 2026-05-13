# Reflection

## 1. The hardest bug I hit this week, and how I debugged it
The hardest bug was a hidden audit-engine logic issue where the writing-use-case branch for GitHub Copilot and Cursor returned a no-op recommendation when the better option was actually more expensive. The engine was using `safeSavings()` to decide whether to return a recommendation, so any better-fit tool with a slightly higher monthly price got collapsed into `No change needed`.

I debugged it by adding a focused Vitest case for the exact scenario: a writing team paying for Copilot should be told to switch to Claude Pro. The test failed with `No change needed`, which exposed the incorrect early return. I then read the `analyzeTool()` branch and realized I needed to separate fit-based recommendations from pure savings-based downgrades. After updating the logic to return the recommendation regardless of savings and to label it as an upgrade when appropriate, the test passed and the rule became defensible.

## 2. A decision you reversed mid-week, and what made you reverse it
Initially I planned to use the AI model for the entire audit reasoning, but I reversed that decision once I built the rule-based engine. The audit was much stronger when the tool recommendations and savings math were explicit and deterministic, and the AI could be reserved for the personalized summary instead.

The reversal came after I reviewed the rubric: it explicitly says the audit math should be defensible and not just an LLM opinion. Keeping the core logic rule-based made the product more credible and easier to test, while still satisfying the requirement to use AI. That decision also simplified the prompt engineering and reduced the risk of hallucinated recommendations.

## 3. What you would build in week 2 if you had it
Week 2 would focus on conversion and credibility. I would add a PDF export of the audit report, a more polished public-facing landing page, and a benchmark mode showing spend per developer versus a peer group. I would also build an embed widget so founders could share a summary on Twitter or Slack with a tracked read-only audit card.

From a growth perspective, I would add a lightweight referral system that gives both the sender and recipient a small consulting credit, and I would refine the CTA flow for high-potential leads to book a Credex consultation immediately after the audit.

## 4. How you used AI tools
I used Google Gemini through the app backend to generate a short personalized summary paragraph for each audit. The prompt asks for a professional, under-100-word summary that mentions team size, use case, and estimated monthly savings. I also used GitHub Copilot in the editor for small refactor suggestions, but I did not rely on it for the core audit rules or the final deliverable copy.

I did not trust AI for the audit math, cost comparisons, or pricing data. Those are hardcoded from vendor pricing pages in `PRICING_DATA.md`. One specific time the AI was wrong was when Copilot suggested I could use an LLM to generate every recommendation. I caught that and moved the pricing and fit logic back into deterministic code.

## 5. Self-rating
- Discipline: 8/10 — I spread work across 7 days and documented each step honestly.
- Code quality: 7/10 — The code is readable and test-covered, though more abstraction would help if this scaled.
- Design sense: 7/10 — The UI is clean and mobile-friendly, but it can be polished further for a launch landing page.
- Problem-solving: 8/10 — I identified a logic bug quickly and fixed it with a targeted test.
- Entrepreneurial thinking: 8/10 — I focused on lead capture, honest savings messaging, and a clear Credex value path.
