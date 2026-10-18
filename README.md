# AZ Digital Hub

Website of **Ahmed Ziwar**, AI consultant in Kuwait. AI strategy, AI solution delivery and adoption support for mid-sized companies in Kuwait and the GCC, built on more than 15 years across IT, digital marketing and AI delivery.

Live site: [https://www.zewar.xyz](https://www.zewar.xyz) (English at `/en`, Arabic at `/ar`).

## Tech stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4 (logical-property utilities for RTL)
- next-intl for English/Arabic content (`messages/en.json`, `messages/ar.json`)
- Contact: WhatsApp only (no contact form, no server email)
- Deployed on Vercel

## Project structure

```
messages/            # Site copy (en.json, ar.json): source of truth for content
lib/                 # Site config, rate limiting, utilities
public/              # Static assets, llms.txt, llms-full.txt, robots.txt
src/app/[locale]/    # Localised pages, layout, metadata, OG image
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
| `UPSTASH_REDIS_REST_URL` | Optional: Upstash Redis for rate limiting `/api/health` and `/api/client-error` |
| `UPSTASH_REDIS_REST_TOKEN` | Optional: Upstash Redis token |

## Contact

- Email: [ahmed@zewar.xyz](mailto:ahmed@zewar.xyz)
- WhatsApp: [+965 6067 2773](https://wa.me/96560672773)
- LinkedIn: [linkedin.com/in/ahmedziwar](https://www.linkedin.com/in/ahmedziwar/)

## License

© Ahmed Ziwar. All rights reserved.
