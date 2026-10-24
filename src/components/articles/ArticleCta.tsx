import { getTranslations } from 'next-intl/server'

import { PHONE_DISPLAY, WHATSAPP_NUMBER } from '@/components/contactDetails'

// WhatsApp call to action at the end of an article: same number and copy as the homepage Contact section.
export default async function ArticleCta({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.linkText'))}`

  return (
    <aside className="mt-12 flex flex-col bg-linear-to-r/srgb from-green-600/15 to-green-800/15 border border-green-500/30 rounded-xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-3">{t('whatsapp.title')}</h2>
      <p className="text-base sm:text-lg text-gray-300 mb-6">{t('whatsapp.description')}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg transition-colors duration-200 min-h-[44px] focus-enhanced"
      >
        {t('whatsapp.button')}
        <span dir="ltr">{PHONE_DISPLAY}</span>
      </a>
    </aside>
  )
}
