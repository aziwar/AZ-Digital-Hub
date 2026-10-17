# AZ Digital Hub

Website of **Ahmed Ziwar**, AI consultant in Kuwait. AI strategy, AI solution delivery and adoption support for mid-sized companies in Kuwait and the GCC, built on more than 15 years across IT, digital marketing and AI delivery.

Live site: [https://www.zewar.xyz](https://www.zewar.xyz) (English at `/en`, Arabic at `/ar`).

## Tech stack

- Next.js 15 (App Router) with React 19 and TypeScript
- Tailwind CSS (with RTL support)
- next-intl for English/Arabic content (`messages/en.json`, `messages/ar.json`)
- Contact form via EmailJS (server-side), with optional reCAPTCHA v3 and Upstash rate limiting
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

Requires Node.js >= 20.11.

```bash
git clone https://github.com/aziwar/AZ-Digital-Hub.git
cd AZ-Digital-Hub
npm install
cp .env.example .env.local
npm run dev
```

Useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run type-check`, `npm run quality-gates`.

## Environment variables

See `.env.example`. The code reads:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BASE_URL` | Canonical site URL (defaults to `https://www.zewar.xyz`) |
| `EMAILJS_SERVICE_ID` | EmailJS service for the contact form |
| `EMAILJS_TEMPLATE_ID` | EmailJS template |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `EMAILJS_PRIVATE_KEY` | EmailJS private key (server-side) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis for contact rate limiting (required in production) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token (required in production) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional: reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Optional: reCAPTCHA v3 secret (server-side) |

In production the contact API returns 503 unless Upstash is configured (rate limiting fails closed); in development it runs without it. reCAPTCHA is optional.

## Contact

- Email: [ahmed@zewar.xyz](mailto:ahmed@zewar.xyz)
- WhatsApp: [+965 6067 2773](https://wa.me/96560672773)
- LinkedIn: [linkedin.com/in/ahmedziwar](https://www.linkedin.com/in/ahmedziwar/)

## License

© Ahmed Ziwar. All rights reserved.
