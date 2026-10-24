import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { OG_CONTENT_TYPE, OG_REGION, OG_SIZE, renderOgImage } from '@/lib/og-image'

export const alt = 'Ahmed Ziwar — Articles'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const t = await getTranslations({ locale, namespace: 'Articles' })
  return renderOgImage({ locale, title: t('ogSubtitle'), sub: OG_REGION[locale] })
}
