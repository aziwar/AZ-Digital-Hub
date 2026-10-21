/**
 * Fallback for a notFound() thrown inside the [locale] segment. Unmatched URLs are served
 * by src/app/global-not-found.tsx; both render the same NotFoundContent.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import { getLocale } from 'next-intl/server'

import NotFoundContent from '@/components/NotFoundContent'

export default async function NotFound() {
  return <NotFoundContent locale={await getLocale()} />
}
