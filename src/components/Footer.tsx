import { getTranslations } from 'next-intl/server'

import { EMAIL, LINKEDIN_DISPLAY, LINKEDIN_URL, PHONE_DISPLAY, WHATSAPP_NUMBER } from '@/components/contactDetails'

export default async function Footer() {
  const t = await getTranslations('Footer')
  const services = t.raw('services.items') as string[]
  const approach = t.raw('approach.items') as string[]

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-10 p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-2">{t('cta.title')}</h2>
          <p className="text-gray-300 mb-4">{t('cta.subtitle')}</p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors duration-200 min-h-[44px]"
          >
            {t('cta.button')}
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href={`mailto:${EMAIL}`} dir="ltr" className="hover:text-white">{EMAIL}</a></li>
              <li>
                {t('contact.whatsapp')}:{' '}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-white">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-white">
                  {LINKEDIN_DISPLAY}
                </a>
              </li>
              <li>{t('contact.location')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t('services.title')}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {services.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t('approach.title')}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {approach.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-800">
          <p className="text-gray-300">
            © {new Date().getFullYear()} {t('copyright')}
          </p>
          <p className="text-gray-400 text-sm mt-2">{t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}
