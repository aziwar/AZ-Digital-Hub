# CLAUDE.md

Guidance for AI agents working in this repo (zewar.xyz, Ahmed Ziwar's bilingual consulting site).

## Stack
- Next.js 16 (App Router, `src/app/[locale]`), React 19, TypeScript (strict), Tailwind CSS 4 (CSS-first config in `src/app/globals.css`), next-intl, deployed on Vercel.
- Shared server utilities live in `lib/` (import as `@/lib/...`); app code in `src/`.

## Commands
- `npm run dev` - local dev server
- `npm run lint` - `eslint . --max-warnings 0` (must pass, whole repo)
- `npm run type-check` - `tsc --noEmit`
- `npm run build` - production build; `/en` and `/ar` must stay in `.next/prerender-manifest.json` routes
Run lint, type-check and build before every PR.

## i18n rules
- Every key in `messages/en.json` must exist in `messages/ar.json` and vice versa (key parity).
- Client components do not load translations themselves; the server page passes strings to them as props.
- `/en` and `/ar` must remain statically prerendered (SSG). Do not add request-time APIs that make them dynamic.

## Content rules
- Claims only from the approved fact sheet. Do not invent numbers, metrics, testimonials or results.
- Do not name any client, employer, government body or project, with the single exception of Ooredoo Kuwait.
- Do not change site copy unless the task asks for it.

## Workflow
- Work on a branch; open a PR to `main`; comment `@codex review` on the PR.
- Never push directly to `main`. Never force-push `main`.
- OWNER'S MERGE RULE: merge the PR without waiting for the owner when all of these hold:
  1. CI is green.
  2. The Vercel preview is ready.
  3. There is no merge conflict.
  4. Codex's latest review on the current head commit has no findings.
  5. Every Codex finding is fixed or answered. Do not wait for CodeRabbit reviews and do not act on CodeRabbit findings (owner rule).
  Then continue to the next step of the plan.
- Ask the owner first before anything involving money, secrets or environment variables, DNS, naming clients, or new claims.

## Performance
- Lighthouse: a change must not lower any mobile score (performance, accessibility, best practices, SEO).
  The Lighthouse workflow in `.github/workflows/lighthouse.yml` checks thresholds.

## Monitoring
- See `docs/MONITORING.md` for the uptime/site-check and Lighthouse workflows and how to run them locally.
