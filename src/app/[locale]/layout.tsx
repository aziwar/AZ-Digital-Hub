import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import '../globals.css'

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://az-digital-hub.vercel.app'),
    
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: t('creator'), url: 'https://az-digital-hub.vercel.app' }],
    creator: t('creator'),
    publisher: t('publisher'),
    
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ar': '/ar',
        'x-default': '/en'
      }
    },
    
    openGraph: {
      type: 'website',
      locale: locale,
      url: `/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: t('appName'),
      images: [{
        url: `/og-image-${locale}.jpg`,
        width: 1200,
        height: 630,
        alt: t('title')
      }]
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/og-image-${locale}.jpg`]
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('appName'),
    },
    applicationName: t('appName'),
    manifest: '/manifest.json',
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}))
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  setRequestLocale(locale)
  
  // Providing all messages to client-side is the simplest configuration
  // Reference: https://next-intl.dev/docs/usage/configuration#messages
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
