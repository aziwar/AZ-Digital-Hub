/**
 * Global 404 page: served for every unmatched URL (e.g. /en/nope, /ar/a/b, /api/whatever).
 *
 * The root layout lives in the dynamic [locale] segment, so a notFound() thrown inside it
 * can only be streamed as an empty error shell. Rendering the 404 here instead gives a
 * complete server-rendered page with the right lang/dir, a localized title, Next's single
 * noindex robots tag, and no canonical/hreflang inherited from the homepage metadata.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found#global-not-foundjs-experimental
 */

import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import Footer from '@/components/Footer'
import NotFoundContent from '@/components/NotFoundContent'
import { routing } from '@/i18n/routing'

import './globals.css'

// The next-intl proxy sets this request header to the locale of the URL (/en/..., /ar/...).
// Paths the proxy skips (/api/...) have none and fall back to the default locale.
async function getNotFoundLocale() {
  const requested = (await headers()).get('x-next-intl-locale')
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getNotFoundLocale()
  const t = await getTranslations({ locale, namespace: 'NotFound' })
  const meta = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: `${t('title')} | ${meta('appName')}`,
    description: t('description'),
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e293b' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default async function GlobalNotFound() {
  const locale = await getNotFoundLocale()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body className="font-sans">
        <NotFoundContent locale={locale} />
        <Footer locale={locale} />
      </body>
    </html>
  )
}
