// Shape of one article. Each post is a module in this folder (see README.md).

/** A block of article body text. Plain strings only: no HTML, no Markdown. */
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }

export interface ArticleTranslation {
  /** Headline: the page <h1>, the <title> and the JSON-LD headline */
  title: string
  /** One or two sentences: meta description, index teaser, OG/JSON-LD description */
  description: string
  body: ArticleBlock[]
}

export interface Article {
  /** URL segment shared by both locales: lowercase ASCII words joined by hyphens */
  slug: string
  /** ISO date, YYYY-MM-DD */
  datePublished: string
  /** ISO date, YYYY-MM-DD; defaults to datePublished */
  dateModified?: string
  en: ArticleTranslation
  ar: ArticleTranslation
}
