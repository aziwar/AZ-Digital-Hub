# Monitoring and CI

Everything here is free and GitHub-native: no paid services, no extra secrets (only the built-in `GITHUB_TOKEN`).

## What runs

| Workflow | When | What it does |
|---|---|---|
| `ci.yml` | Every PR, push to `main` | `npm ci`, lint, `tsc --noEmit`, `next build` on Node 22 |
| `site-monitor.yml` | Every 30 min + manual | Runs `.github/scripts/site-check.sh` against https://www.zewar.xyz |
| `lighthouse.yml` | Mondays 05:17 UTC + manual | Mobile Lighthouse on `/en` and `/ar` |
| `dependabot.yml` | npm weekly, actions monthly | Minor/patch npm updates grouped into one PR; majors of next/react/tailwind ignored |

Site checks: `/en` and `/ar` return 200 with expected `<title>` and meta description, `/en/opengraph-image` is `image/png`, `/sitemap.xml` and `/robots.txt` return 200, `/api/health` returns 200 JSON with `status` `ok` or `degraded`, and the contact form can deliver leads (`contact` is `handoff` or `email`). A failing check is retried once after 30 s before it counts.

Lighthouse thresholds: performance >= 85; accessibility, best-practices, SEO >= 90. HTML/JSON reports are uploaded as the `lighthouse-reports` artifact (30 days).

## Where alerts appear

- **GitHub issues** labelled `site-monitor` or `lighthouse` (labels are created automatically). One open issue per label: new failures add a comment, recovery adds a comment and closes it. Watch the repo (Issues) to get email.
- **Real-visitor errors**: the error boundaries (`src/app/[locale]/error.tsx`, `src/app/global-error.tsx`) beacon to `POST /api/client-error`, which logs one line `[client-error] {"message","digest","url","userAgent","boundary"}` to **Vercel runtime logs** (filter on `client-error`). URLs are stripped of query/hash; no other PII.
- `/api/health` reports `checks.upstash|cloudflareEmail|emailjs|recaptcha` as booleans; `degraded` means optional config is missing, not that the site is down.
- `/api/health` also reports `contact`: `email` (Cloudflare Email Service or EmailJS configured, form posts to `/api/contact`) or `handoff` (form hands the lead to WhatsApp/email from the visitor's device), plus `provider` (`cloudflare`, `emailjs` or `null`) and `rateLimit` (`upstash`, or `memory` = per-instance in-memory limiter). `GET /api/contact/status` returns the same `{ "mode", "provider" }` for the form.

## Contact email: Cloudflare Email Service setup

1. Cloudflare dashboard: **Email Service -> Email Sending**, onboard `zewar.xyz`. It adds DNS records only on the `cf-bounce` subdomain; the Zoho MX records are untouched.
2. Add the owner inbox (`ahmed@zewar.xyz`, or `CONTACT_TO_EMAIL`) as a **verified destination address** (sending to verified addresses is free on the Workers Free plan).
3. Create an API token with the **Email Sending: Edit** permission.
4. On Vercel set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_EMAIL_API_TOKEN` (optionally `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`), redeploy, then check `/api/health` shows `"provider":"cloudflare"`.

## Run manually

- GitHub: Actions tab, pick the workflow, **Run workflow** (or `gh workflow run site-monitor.yml`).
- Locally: `bash .github/scripts/site-check.sh [base_url]` (set `RETRY_DELAY=0` to skip the wait).
- Lighthouse thresholds on saved reports: `node .github/scripts/lighthouse-assert.mjs report.json ...`.
