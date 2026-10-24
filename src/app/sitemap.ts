import type { MetadataRoute } from 'next'

import { SITE_URL } from '../../lib/site'
import { getArticleModified, getArticles } from '../content/articles'

// Fixed so the sitemap does not report a new date on every build; bump when content changes
const LAST_MODIFIED = new Date('2026-10-17')

const LOCALES = ['en', 'ar'] as const

// One entry per locale for a path ('' is the homepage), each listing both language versions
function localized(path: string, extra: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>): MetadataRoute.Sitemap {
  const languages = { en: `${SITE_URL}/en${path}`, ar: `${SITE_URL}/ar${path}` }
  return LOCALES.map((locale) => ({ url: languages[locale], ...extra, alternates: { languages } }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles()
  const newest = articles.map(getArticleModified).sort().at(-1)

  return [
    ...localized('', { lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 }),
    ...localized('/articles', {
      lastModified: newest ? new Date(newest) : LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
    ...articles.flatMap((article) =>
      localized(`/articles/${article.slug}`, {
        lastModified: new Date(getArticleModified(article)),
        changeFrequency: 'yearly',
        priority: 0.6,
      })
    ),
  ]
}
