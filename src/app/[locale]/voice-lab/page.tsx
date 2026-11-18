import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'

import About from '@/components/sections/About'
import EnhancedHero from '@/components/sections/EnhancedHero'
import Services from '@/components/sections/Services'
import SiteHeader from '@/components/SiteHeader'
import VoiceDock from '@/components/voice/VoiceDock'
import type { MessageTree } from '@/lib/messages'

// Test page (ticket 9ffa67a6). Own flag, never the homepage avatar flag. Not indexed, not linked.
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function VoiceLab({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NEXT_PUBLIC_VOICE_LAB_ENABLED !== 'true') notFound()
  const { locale } = await params
  setRequestLocale(locale)
  const messages = (await getMessages()) as unknown as Record<string, MessageTree>
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="content" tabIndex={-1} className="min-h-screen bg-slate-950 pt-16 focus:outline-none">
        <EnhancedHero />
        <Services />
        <About />
      </main>
      <VoiceDock messages={messages.VoiceLab as { [k: string]: string }} />
    </>
  )
}
