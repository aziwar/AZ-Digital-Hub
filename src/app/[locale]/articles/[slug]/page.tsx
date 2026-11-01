import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ArticleCta from '@/components/articles/ArticleCta'
import { ArticleBody, asArticleLocale, BackLink, formatArticleDate, JsonLd } from '@/components/articles/shared'
import SiteHeader from '@/components/SiteHeader'
import { getArticle, getArticleModified, getArticles } from '@/content/articles'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ locale: string; slug: string }> }

// One page per post and locale, built at build time; any other slug is a 404
export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const meta = await getTranslations({ locale, namespace: 'Metadata' })
  const { title, description } = article[asArticleLocale(locale)]
  const path = `/${locale}/articles/${slug}`

  return {
    title: `${title} | ${meta('creator')}`,
    description,
    alternates: {
      canonical: path,
      languages: { en: `/en/articles/${slug}`, ar: `/ar/articles/${slug}`, 'x-default': `/en/articles/${slug}` },
      types: { 'application/rss+xml': `/${locale}/articles/rss.xml` },
    },
    // og:image comes from ./opengraph-image.tsx
    openGraph: {
      type: 'article',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      url: path,
      title,
      description,
      siteName: meta('appName'),
      publishedTime: article.datePublished,
      modifiedTime: getArticleModified(article),
      authors: [meta('creator')],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const article = getArticle(slug)
  if (!article) notFound()

  const t = await getTranslations({ locale, namespace: 'Articles' })
  const lang = asArticleLocale(locale)
  const { title, description, imageAlt, body } = article[lang]
  // Newest other posts, so a reader who finishes one has somewhere to go next
  const more = getArticles().filter((other) => other.slug !== slug).slice(0, 3)
  const modified = getArticleModified(article)
  const url = `${SITE_URL}/${locale}/articles/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    datePublished: article.datePublished,
    dateModified: modified,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    inLanguage: locale,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: article.image ? [`${SITE_URL}${article.image}`, `${url}/opengraph-image`] : `${url}/opengraph-image`,
    isPartOf: { '@id': `${SITE_URL}/${locale}/articles#blog` },
  }

  return (
    <>
      <SiteHeader
        locale={locale}
        page="articles"
        languageHrefs={{ en: `/en/articles/${slug}`, ar: `/ar/articles/${slug}` }}
      />
      <JsonLd data={jsonLd} />

      <main id="content" tabIndex={-1} className="min-h-screen bg-slate-950 pt-16 focus:outline-none">
        <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <BackLink href={`/${locale}/articles`}>{t('allArticles')}</BackLink>

          <header className="mt-6 mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">{title}</h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300">{description}</p>
            <p className="mt-4 text-sm text-gray-400">
              {t('published')} <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished, locale)}</time>
              {modified !== article.datePublished && (
                <>
                  {' · '}
                  {t('updated')} <time dateTime={modified}>{formatArticleDate(modified, locale)}</time>
                </>
              )}
            </p>
          </header>

          {article.image && (
            // Content column is max-w-3xl (768px) minus the 16px side padding
            <Image
              src={article.image}
              alt={imageAlt ?? ''}
              width={1600}
              height={900}
              preload
              fetchPriority="high"
              sizes="(min-width: 768px) 736px, calc(100vw - 32px)"
              quality={70}
              className="mb-10 w-full h-auto rounded-xl border border-slate-800"
            />
          )}

          <ArticleBody blocks={body} />

          <ArticleCta locale={locale} />

          {more.length > 0 && (
            <section aria-labelledby="more-articles" className="mt-14">
              <h2 id="more-articles" className="text-xl sm:text-2xl font-bold text-white">{t('moreArticles')}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {more.map((other) => (
                  <li key={other.slug}>
                    <a
                      href={`/${locale}/articles/${other.slug}`}
                      className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-purple-500/60"
                    >
                      <span className="font-semibold leading-snug text-white">{other[lang].title}</span>
                      <time dateTime={other.datePublished} className="mt-3 text-sm text-gray-400">
                        {formatArticleDate(other.datePublished, locale)}
                      </time>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 flex flex-wrap gap-x-8">
            <BackLink href={`/${locale}/articles`}>{t('allArticles')}</BackLink>
            <BackLink href={`/${locale}`}>{t('backToHome')}</BackLink>
          </div>
        </article>
      </main>
    </>
  )
}
