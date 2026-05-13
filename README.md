# Credex AI Spend Audit

A free, launch-ready tool for startup founders and engineering leaders to audit AI tool spend, identify plan mismatches, and surface measurable savings from plan changes or discounted credits.

![Landing screen](public/screenshot-1.png)
![Audit report](public/screenshot-2.png)
![Shareable result](public/screenshot-3.png)

## Live demo
- https://YOUR_DEPLOYED_URL_HERE

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
npm run build
```

## Decisions

- **Next.js + TypeScript**: Provides fast page rendering, built-in routing, and strong type safety for the audit engine and backend API routes.
- **Tailwind CSS**: Keeps the design polished and responsive without a heavy UI framework.
- **Supabase**: Enables persistent audit storage and a shareable public URL without custom database setup.
- **Google Gemini**: Powers the personalized summary while the audit logic remains rule-based and defensible.
- **SendGrid**: Enables transactional email confirmation for lead capture.

## Notes

This repository includes the full Round 1 deliverables in markdown as required by the assignment: `README.md`, `ARCHITECTURE.md`, `DEVLOG.md`, `REFLECTION.md`, `TESTS.md`, `PRICING_DATA.md`, `PROMPTS.md`, `GTM.md`, `ECONOMICS.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`, and `METRICS.md`.
