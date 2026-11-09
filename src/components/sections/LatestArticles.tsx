import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { asArticleLocale, BackLink, formatArticleDate } from '@/components/articles/shared'
import { getArticles } from '@/content/articles'

// Homepage teaser: the three newest posts, so visitors (and crawlers) reach the articles from the main page
export default async function LatestArticles({ locale }: { locale: string }) {
  const articles = getArticles().slice(0, 3)
  if (!articles.length) return null
  const t = await getTranslations({ locale, namespace: 'Articles' })
  const lang = asArticleLocale(locale)

  return (
    <section id="articles" aria-labelledby="latest-articles" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-articles" className="text-3xl sm:text-4xl font-bold text-white">{t('latest')}</h2>
          <BackLink href={`/${locale}/articles`}>{t('allArticles')}</BackLink>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <a
                href={`/${locale}/articles/${article.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-colors hover:border-purple-500/60"
              >
                {article.image && (
                  <Image
                    src={article.image}
                    alt=""
                    width={1600}
                    height={900}
                    sizes="(min-width: 1152px) 368px, (min-width: 768px) calc(33vw - 32px), calc(100vw - 32px)"
                    quality={70}
                    className="w-full h-auto"
                  />
                )}
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-semibold leading-snug text-white">{article[lang].title}</span>
                  <time dateTime={article.datePublished} className="mt-3 text-sm text-gray-400">
                    {formatArticleDate(article.datePublished, locale)}
                  </time>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
