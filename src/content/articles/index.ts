import monitoringThatChecksTheWork from './monitoring-that-checks-the-work'
import oneCoordinatorManyAiWorkers from './one-coordinator-many-ai-workers'
import rightAiModelForEachRequest from './right-ai-model-for-each-request'
import type { Article } from './types'

export type { Article, ArticleBlock, ArticleTranslation } from './types'

// Register every post here (import its module and add it to the list); see README.md.
const ARTICLES: readonly Article[] = [oneCoordinatorManyAiWorkers, rightAiModelForEachRequest, monitoringThatChecksTheWork]

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
// YYYY-MM-DD and a real calendar day (rejects e.g. 2026-02-30, which Date would roll into March)
const isDate = (value: string) => {
  if (!DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
}

// Fail the build on a malformed entry instead of publishing a broken page
for (const article of ARTICLES) {
  if (!SLUG.test(article.slug)) throw new Error(`Article slug "${article.slug}" must be lowercase ASCII words joined by hyphens`)
  if (!isDate(article.datePublished) || (article.dateModified && !isDate(article.dateModified))) {
    throw new Error(`Article "${article.slug}": dates must be real calendar days as YYYY-MM-DD`)
  }
  if (article.image && !(article.image.startsWith('/') && article.en.imageAlt && article.ar.imageAlt)) {
    throw new Error(`Article "${article.slug}": image must be a /public path with imageAlt in both locales`)
  }
  if (ARTICLES.filter((a) => a.slug === article.slug).length > 1) throw new Error(`Duplicate article slug "${article.slug}"`)
}

/** All posts, newest first */
export function getArticles(): readonly Article[] {
  return [...ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished))
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug)
}

export function getArticleModified(article: Article): string {
  return article.dateModified ?? article.datePublished
}
