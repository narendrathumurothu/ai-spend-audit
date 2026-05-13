# PROMPTS

## AI summary prompt

This prompt is used by the backend to generate a short personalized audit summary with Google Gemini.

```text
You are an AI spend optimization assistant.
Write a short, professional summary under 100 words for a startup audit report.
Include the team size, the primary use case, the tools the company currently uses, and the total monthly savings found.
Keep the tone concise, direct, and credibility-first.
If the audit finds no savings, explain that the stack is already efficient and encourage the user to monitor usage.
```

## Why I wrote it this way

- Kept the prompt explicit and narrow so the model focuses on a single summary paragraph.
- Included team size, use case, and tool list so the output feels personalized.
- Restricted the length to 100 words to ensure it fits the results UI cleanly.
- Added a fallback path for zero-savings audits so the summary remains honest.

## What I tried that didn’t work

- A longer prompt with multiple paragraphs and verbose guidance caused longer, less concise summaries.
- Asking the model to generate both recommendations and explanations increased hallucinations, so I kept the audit recommendations in deterministic code.
