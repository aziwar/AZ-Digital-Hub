# AZ Digital Hub

Website of **Ahmed Ziwar**, AI consultant in Kuwait. AI strategy, AI solution delivery and adoption support for mid-sized companies in Kuwait and the GCC, built on more than 15 years across IT, digital marketing and AI delivery.

Live site: [https://www.zewar.xyz](https://www.zewar.xyz) (English at `/en`, Arabic at `/ar`).

## Tech stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4 (logical-property utilities for RTL)
- next-intl for English/Arabic content (`messages/en.json`, `messages/ar.json`)
- Contact form: server email via Cloudflare Email Service (or EmailJS) when configured; otherwise it hands the lead to WhatsApp or email (no accounts needed)
- Deployed on Vercel

## Project structure

```
messages/            # Site copy (en.json, ar.json): source of truth for content
lib/                 # Site config, rate limiting, utilities
public/              # Static assets, llms.txt, llms-full.txt, robots.txt
src/app/[locale]/    # Localised pages, layout, metadata, OG image
src/app/api/contact/ # Contact form endpoint
src/app/api/health/  # Health check
src/app/sitemap.ts   # Sitemap
src/components/      # Sections and UI components
```

## Getting started

Requires Node.js >=20.11.0 <23.0.0 (see `engines` in `package.json`).

```bash
git clone https://github.com/aziwar/AZ-Digital-Hub.git
cd AZ-Digital-Hub
npm install
cp .env.example .env.local
npm run dev
```

Useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run type-check`.

## Environment variables

See `.env.example`. The code reads:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BASE_URL` | Canonical site URL (defaults to `https://www.zewar.xyz`) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account for Email Service (primary contact email provider) |
| `CLOUDFLARE_EMAIL_API_TOKEN` | Cloudflare API token with "Email Sending: Edit" (server-side) |
| `CONTACT_TO_EMAIL` | Optional: owner inbox for leads (default `ahmed@zewar.xyz`; must be a verified destination) |
| `CONTACT_FROM_EMAIL` | Optional: sender address (default `website@zewar.xyz`) |
| `EMAILJS_SERVICE_ID` | EmailJS service for the contact form (fallback provider) |
| `EMAILJS_TEMPLATE_ID` | EmailJS template |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `EMAILJS_PRIVATE_KEY` | EmailJS private key (server-side) |
| `UPSTASH_REDIS_REST_URL` | Optional: Upstash Redis for shared contact rate limiting (else in-memory) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional: Upstash Redis token |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional: reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Optional: reCAPTCHA v3 secret (server-side) |

Server email is an optional upgrade. Without a provider (`GET /api/contact/status` reports `handoff`) the form validates the lead and hands it off to WhatsApp or a prefilled email to the owner. Provider order: Cloudflare Email Service (`CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_EMAIL_API_TOKEN`), then EmailJS (all four variables); the form switches to server email automatically. The lead email has the visitor as reply-to. If a server send fails (5xx), the form falls back to the same handoff. Rate limiting (5 requests / 10 min per IP) uses Upstash when configured, otherwise an in-memory limiter. reCAPTCHA is optional. Cloudflare setup steps: `docs/MONITORING.md`.

## Contact

- Email: [ahmed@zewar.xyz](mailto:ahmed@zewar.xyz)
- WhatsApp: [+965 6067 2773](https://wa.me/96560672773)
- LinkedIn: [linkedin.com/in/ahmedziwar](https://www.linkedin.com/in/ahmedziwar/)

## License

© Ahmed Ziwar. All rights reserved.
