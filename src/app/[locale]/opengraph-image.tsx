import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import { routing } from '@/i18n/routing'
import { OG_CONTENT_TYPE, OG_REGION, OG_SIZE, renderOgImage } from '@/lib/og-image'

export const alt = 'Ahmed Ziwar'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const TITLES: Record<string, string> = {
  en: 'Ahmed Ziwar — AI & Digital Transformation Consultant',
  ar: 'أحمد زيور — استشاري ذكاء اصطناعي وتحول رقمي',
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Unknown first segments (e.g. /api/opengraph-image) must not run the image function
  if (!hasLocale(routing.locales, locale)) notFound()
  return renderOgImage({ locale, title: TITLES[locale], sub: OG_REGION[locale] })
}
