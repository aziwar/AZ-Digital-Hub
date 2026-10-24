import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import About from '@/components/sections/About'
import EnhancedContact from '@/components/sections/EnhancedContact'
import EnhancedHero from '@/components/sections/EnhancedHero'
import FAQ from '@/components/sections/FAQ'
import Portfolio from '@/components/sections/Portfolio'
import Process from '@/components/sections/Process'
import Services from '@/components/sections/Services'
import SiteHeader from '@/components/SiteHeader'
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
  const contact = await getTranslations('Contact')

  return (
    <>
      <SiteHeader locale={locale} />

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
