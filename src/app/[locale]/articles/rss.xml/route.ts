import { getTranslations } from 'next-intl/server'

import { asArticleLocale } from '@/components/articles/shared'
import { getArticleModified, getArticles } from '@/content/articles'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'

// RSS 2.0 feed of the posts in one language, built at build time like the pages
export const dynamic = 'force-static'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString()

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = asArticleLocale(locale)
  const t = await getTranslations({ locale: lang, namespace: 'Articles' })
  const articles = getArticles()
  const listUrl = `${SITE_URL}/${lang}/articles`

  const items = articles
    .map((article) => {
      const url = `${listUrl}/${article.slug}`
      return [
        '    <item>',
        `      <title>${escapeXml(article[lang].title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(article[lang].description)}</description>`,
        `      <pubDate>${rfc822(article.datePublished)}</pubDate>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const lastBuild = articles.length ? rfc822(articles.map(getArticleModified).sort().at(-1) as string) : rfc822('2026-01-01')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t('metaTitle'))}</title>
    <link>${listUrl}</link>
    <description>${escapeXml(t('description'))}</description>
    <language>${lang}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${listUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
