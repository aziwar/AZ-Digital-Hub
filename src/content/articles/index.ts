import oneCoordinatorManyAiWorkers from './one-coordinator-many-ai-workers'
import type { Article } from './types'

export type { Article, ArticleBlock, ArticleTranslation } from './types'

// Register every post here (import its module and add it to the list); see README.md.
const ARTICLES: readonly Article[] = [oneCoordinatorManyAiWorkers]

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

// Fail the build on a malformed entry instead of publishing a broken page
for (const article of ARTICLES) {
  if (!SLUG.test(article.slug)) throw new Error(`Article slug "${article.slug}" must be lowercase ASCII words joined by hyphens`)
  if (!DATE.test(article.datePublished) || (article.dateModified && !DATE.test(article.dateModified))) {
    throw new Error(`Article "${article.slug}": dates must be YYYY-MM-DD`)
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
