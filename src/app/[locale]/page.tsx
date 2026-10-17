import { setRequestLocale } from 'next-intl/server'

import Navigation from '@/components/Navigation'
import About from '@/components/sections/About'
import EnhancedContact from '@/components/sections/EnhancedContact'
import EnhancedHero from '@/components/sections/EnhancedHero'
import FAQ from '@/components/sections/FAQ'
import Portfolio from '@/components/sections/Portfolio'
import Process from '@/components/sections/Process'
import Services from '@/components/sections/Services'


export default async function Home({
  params
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  setRequestLocale(locale)

  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      <div className="pt-16">
        <EnhancedHero />
        <Services />
        <Process />
        <Portfolio />
        <About />
        <FAQ />
        <EnhancedContact />
      </div>

    </main>
  )
}
