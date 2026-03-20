import { setRequestLocale } from 'next-intl/server'

import Navigation from '@/components/Navigation'
import About from '@/components/sections/About'
import EnhancedContact from '@/components/sections/EnhancedContact'
import EnhancedHero from '@/components/sections/EnhancedHero'
import Portfolio from '@/components/sections/Portfolio'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'


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

      {/* Main Content */}
      <div className="pt-16">
        <EnhancedHero />
        <About />
        <Services />
        <Testimonials />
        <Portfolio />
        <EnhancedContact />
      </div>

    </main>
  )
}
