import type { ReactNode } from 'react'

import type { ArticleBlock } from '@/content/articles'

export type ArticleLocale = 'en' | 'ar'

export const asArticleLocale = (locale: string): ArticleLocale => (locale === 'ar' ? 'ar' : 'en')

/** "23 October 2026" / "23 أكتوبر 2026" (Latin digits, as in the rest of the Arabic copy) */
export function formatArticleDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
    numberingSystem: 'latn',
  }).format(new Date(`${date}T00:00:00Z`))
}

/** JSON-LD script; `<` is escaped so content can never close the tag */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Text link with a start-pointing arrow that flips in RTL */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
    >
      <svg className="w-4 h-4 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </a>
  )
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-300">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i} className="pt-4 text-2xl sm:text-3xl font-bold text-white">{block.text}</h2>
          case 'h3':
            return <h3 key={i} className="pt-2 text-xl sm:text-2xl font-semibold text-white">{block.text}</h3>
          case 'ul':
            return (
              <ul key={i} className="list-disc ps-6 space-y-2">
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="list-decimal ps-6 space-y-2">
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ol>
            )
          case 'quote':
            return <blockquote key={i} className="border-s-4 border-purple-500/60 ps-4 italic text-gray-200">{block.text}</blockquote>
          default:
            return <p key={i}>{block.text}</p>
        }
      })}
    </div>
  )
}
