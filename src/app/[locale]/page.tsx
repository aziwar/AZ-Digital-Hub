import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import Navigation from '@/components/Navigation'
import About from '@/components/sections/About'
import EnhancedContact from '@/components/sections/EnhancedContact'
import EnhancedHero from '@/components/sections/EnhancedHero'
import FAQ from '@/components/sections/FAQ'
import Portfolio from '@/components/sections/Portfolio'
import Process from '@/components/sections/Process'
import Services from '@/components/sections/Services'
import type { MessageTree } from '@/lib/messages'


export default async function Home({
  params
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  setRequestLocale(locale)

  // Client components receive their strings as props (see lib/messages.ts)
  const messages = (await getMessages()) as unknown as Record<string, MessageTree>
  const common = await getTranslations('Common')
  const contact = await getTranslations('Contact')

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
        languageLabels={{ switchToEnglish: common('switchToEnglish'), switchToArabic: common('switchToArabic') }}
      />

      <main id="content" tabIndex={-1} className="min-h-screen bg-slate-950 pt-16 focus:outline-none">
        <EnhancedHero />
        <Services />
        <Process />
        <Portfolio />
        <About />
        <FAQ />
        <EnhancedContact
          messages={messages.Contact}
          title={contact.rich('title', {
            gradient: (chunks) => (
              <span className="bg-linear-to-r/srgb from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {chunks}
              </span>
            )
          })}
        />
      </main>
    </>
  )
}
