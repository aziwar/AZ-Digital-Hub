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
    <main className="min-h-screen bg-slate-950">
      <Navigation
        messages={messages.Navigation}
        languageLabels={{ switchToEnglish: common('switchToEnglish'), switchToArabic: common('switchToArabic') }}
      />

      <div className="pt-16">
        <EnhancedHero />
        <Services />
        <Process />
        <Portfolio />
        <About />
        <FAQ />
        <EnhancedContact
          locale={locale}
          messages={messages.Contact}
          title={contact.rich('title', {
            gradient: (chunks) => (
              <span className="bg-linear-to-r/srgb from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {chunks}
              </span>
            )
          })}
        />
      </div>

    </main>
  )
}
