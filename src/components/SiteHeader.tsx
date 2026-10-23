import { getMessages, getTranslations } from 'next-intl/server'
import type React from 'react'

import Navigation from '@/components/Navigation'
import type { MessageTree } from '@/lib/messages'

type NavigationProps = React.ComponentProps<typeof Navigation>

// Skip link + fixed navigation bar. Server component: the client Navigation gets its strings as props.
export default async function SiteHeader({
  locale,
  page = 'home',
  languageHrefs,
}: {
  locale: string
  page?: NavigationProps['page']
  languageHrefs?: NavigationProps['languageHrefs']
}) {
  const messages = (await getMessages({ locale })) as unknown as Record<string, MessageTree>
  const common = await getTranslations({ locale, namespace: 'Common' })

  return (
    <>
      {/* First focusable element: lets keyboard users jump past the navigation */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-100 focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-3 focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        {common('skipToContent')}
      </a>

      <Navigation
        messages={messages.Navigation}
        locale={locale}
        page={page}
        languageHrefs={languageHrefs}
        languageLabels={{ switchToEnglish: common('switchToEnglish'), switchToArabic: common('switchToArabic') }}
      />
    </>
  )
}
