import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { asArticleLocale } from '@/components/articles/shared'
import { getArticle, getArticles } from '@/content/articles'
import { routing } from '@/i18n/routing'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image'

export const alt = 'Ahmed Ziwar — Article'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Full params (the locale too): image routes do not inherit the layout's locale params
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getArticles().map((article) => ({ locale, slug: article.slug })))
}

export const dynamicParams = false

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const article = getArticle(slug)
  if (!hasLocale(routing.locales, locale) || !article) notFound()
  const t = await getTranslations({ locale, namespace: 'Articles' })
  return renderOgImage({ locale, title: article[asArticleLocale(locale)].title, sub: t('ogSubtitle') })
}
