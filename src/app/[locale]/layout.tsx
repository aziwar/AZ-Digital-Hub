import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import Footer from '@/components/Footer'
import { routing } from '@/i18n/routing'
import '../globals.css'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.zewar.xyz').replace(/\/$/, '')

// Self-hosted IBM Plex Sans Arabic (OFL, public/fonts; @font-face in globals.css).
// Declared as plain CSS rather than next/font so the files are preloaded only on the ar locale:
// next/font preloads every font of a segment, which made EN pages download ~180KB of Arabic glyphs.
const ARABIC_PRELOAD_FONTS = [
  '/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2',
  '/fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2',
  '/fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2',
  '/fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2',
]

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    metadataBase: new URL(BASE_URL),

    title: t('title'),
    description: t('description'),
    authors: [{ name: t('creator'), url: BASE_URL }],
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

    // og:image / twitter image come from the opengraph-image file convention
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      url: `/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: t('appName'),
    },

    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
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
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const isArabic = locale === 'ar'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#person`,
        name: isArabic ? 'أحمد زيور' : 'Ahmed Ziwar',
        alternateName: isArabic ? 'Ahmed Ziwar' : 'أحمد زيور',
        jobTitle: t('jobTitle'),
        description: t('personDescription'),
        url: `${BASE_URL}/${locale}`,
        email: 'ahmed@zewar.xyz',
        image: `${BASE_URL}/images/ahmed-ziwar-portrait.webp`,
        sameAs: ['https://www.linkedin.com/in/ahmedziwar/'],
        knowsAbout: [
          'AI readiness and strategy',
          'Digital transformation',
          'AI assistants and AI avatar systems',
          'Document intelligence',
          'Legal-content portals',
          'AI model gateways',
          'AI governance and cost control',
          'Process automation agents',
          'Multi-model orchestration',
          'Self-hosted AI infrastructure',
          'Data science',
          'Digital media and marketing'
        ],
        knowsLanguage: ['en', 'ar'],
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          name: 'Microsoft Professional Program in Data Science',
          credentialCategory: 'Professional certificate program',
          recognizedBy: { '@type': 'Organization', name: 'Microsoft' }
        },
        address: { '@type': 'PostalAddress', addressCountry: 'KW' }
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${BASE_URL}/#service`,
        name: t('appName'),
        description: t('serviceDescription'),
        url: `${BASE_URL}/${locale}`,
        email: 'ahmed@zewar.xyz',
        telephone: '+96560672773',
        image: `${BASE_URL}/images/AMZ-logo-tr.png`,
        address: { '@type': 'PostalAddress', addressCountry: 'KW' },
        areaServed: [
          { '@type': 'Country', name: 'Kuwait' },
          { '@type': 'Place', name: 'Gulf Cooperation Council (GCC)' }
        ],
        availableLanguage: ['en', 'ar'],
        founder: { '@id': `${BASE_URL}/#person` },
        sameAs: ['https://www.linkedin.com/in/ahmedziwar/']
      }
    ]
  }

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} data-scroll-behavior="smooth">
      <head>
        {isArabic && ARABIC_PRELOAD_FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
        {/* Vercel injects these scripts only on its platform; elsewhere they 404 and log console errors */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
