# Articles

Posts for `/{locale}/articles` live here, one TypeScript module per post. Both locales are
required: every post has an English and an Arabic version under the same slug.

## Add a post

1. Create `src/content/articles/<slug>.ts` (slug: lowercase ASCII words joined by hyphens):

   ```ts
   import type { Article } from './types'

   const article: Article = {
     slug: 'my-post-slug',          // must match the file name; becomes /en/articles/my-post-slug
     datePublished: '2026-11-01',   // YYYY-MM-DD
     // dateModified: '2026-11-15', // optional, YYYY-MM-DD; set it when you change the post
     en: {
       title: 'Headline',
       description: 'One or two sentences for the meta description, index and social cards.',
       body: [
         { type: 'p', text: 'A paragraph.' },
         { type: 'h2', text: 'A section heading' },
         { type: 'ul', items: ['A point', 'Another point'] },
       ],
     },
     ar: {
       title: 'العنوان',
       description: 'جملة أو جملتان للوصف.',
       body: [{ type: 'p', text: 'فقرة.' }],
     },
   }

   export default article
   ```

   Body blocks (see `types.ts`): `p`, `h2`, `h3`, `ul`, `ol`, `quote`. Text is plain: no HTML or Markdown.
   The page already renders the title as the `<h1>`, so start sections at `h2`.

2. Register it in `index.ts`: import the module and add it to `ARTICLES`.

3. Run `npm run lint`, `npm run type-check` and `npm run build`. The build lists
   `/en/articles/<slug>` and `/ar/articles/<slug>`, and fails on a bad slug, a bad date or a duplicate.

The page, its metadata (canonical, hreflang, Open Graph image, `Article` JSON-LD), the index
listing and the sitemap entries are generated from the module; nothing else needs editing.
Content rules from `CLAUDE.md` apply: only approved facts, and no client names except Ooredoo Kuwait.
Optionally add the post to `public/llms.txt` under "Articles".
