import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // No hreflang `Link` response header from the proxy: it was also sent on 404s
  // (/en/nope -> /ar/nope). The pages declare hreflang in their HTML metadata instead.
  alternateLinks: false
});
