import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { asArticleLocale, BackLink, formatArticleDate, JsonLd } from '@/components/articles/shared'
import SiteHeader from '@/components/SiteHeader'
import { getArticleModified, getArticles } from '@/content/articles'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Articles' })
  const meta = await getTranslations({ locale, namespace: 'Metadata' })
  const path = `/${locale}/articles`

  return {
    title: t('metaTitle'),
    description: t('description'),
    alternates: {
      canonical: path,
      languages: { en: '/en/articles', ar: '/ar/articles', 'x-default': '/en/articles' },
    },
    // og:image comes from ./opengraph-image.tsx
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      url: path,
      title: t('metaTitle'),
      description: t('description'),
      siteName: meta('appName'),
    },
    twitter: { card: 'summary_large_image', title: t('metaTitle'), description: t('description') },
  }
}

export default async function ArticlesIndex({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Articles' })
  const lang = asArticleLocale(locale)
  const articles = getArticles()
  const url = `${SITE_URL}/${locale}/articles`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: t('metaTitle'),
        description: t('description'),
        inLanguage: locale,
        mainEntity: { '@id': `${url}#blog` },
      },
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: t('metaTitle'),
        description: t('description'),
        inLanguage: locale,
        author: { '@id': `${SITE_URL}/#person` },
        publisher: { '@id': `${SITE_URL}/#person` },
        ...(articles.length > 0 && {
          blogPost: articles.map((article) => ({
            '@type': 'Article',
            '@id': `${url}/${article.slug}#article`,
            url: `${url}/${article.slug}`,
            headline: article[lang].title,
            datePublished: article.datePublished,
            dateModified: getArticleModified(article),
          })),
        }),
      },
    ],
  }

  return (
    <>
      <SiteHeader locale={locale} page="articles" languageHrefs={{ en: '/en/articles', ar: '/ar/articles' }} />
      <JsonLd data={jsonLd} />

      <main id="content" tabIndex={-1} className="min-h-screen bg-slate-950 pt-16 focus:outline-none">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <BackLink href={`/${locale}`}>{t('backToHome')}</BackLink>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-white">{t('title')}</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300">{t('description')}</p>

          {articles.length === 0 ? (
            <p className="mt-12 p-6 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-300">{t('empty')}</p>
          ) : (
            <ul className="mt-12 space-y-6">
              {articles.map((article) => (
                <li key={article.slug}>
                  <article className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/60 transition-colors">
                    {article.image && (
                      // Decorative here: the linked title right below names the post
                      <Image
                        src={article.image}
                        alt=""
                        width={1600}
                        height={900}
                        sizes="(min-width: 768px) 686px, calc(100vw - 82px)"
                        quality={70}
                        className="mb-5 w-full h-auto rounded-lg"
                      />
                    )}
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      <a href={`/${locale}/articles/${article.slug}`} className="hover:text-purple-200">
                        {article[lang].title}
                      </a>
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                      <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished, locale)}</time>
                    </p>
                    <p className="mt-3 text-gray-300">{article[lang].description}</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
