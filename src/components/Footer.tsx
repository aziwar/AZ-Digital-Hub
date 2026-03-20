import { getTranslations } from 'next-intl/server'

export default async function Footer() {
  const t = await getTranslations('Footer')

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Footer CTA */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-2">
            {t('cta.title')}
          </h3>
          <p className="text-gray-300 mb-4">
            {t('cta.subtitle')}
          </p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-200"
          >
            {t('cta.button')}
          </a>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">{t('contact.title')}</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>📧 {t('contact.email')}</p>
              <p>📱 {t('contact.phone')}</p>
              <p>📍 {t('contact.location')}</p>
              <p>💼 {t('contact.linkedin')}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('services.title')}</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>{t('services.items.0')}</p>
              <p>{t('services.items.1')}</p>
              <p>{t('services.items.2')}</p>
              <p>{t('services.items.3')}</p>
              <p>{t('services.items.4')}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('guarantees.title')}</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>✅ {t('guarantees.items.0')}</p>
              <p>✅ {t('guarantees.items.1')}</p>
              <p>✅ {t('guarantees.items.2')}</p>
              <p>✅ {t('guarantees.items.3')}</p>
              <p>✅ {t('guarantees.items.4')}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-slate-800">
          <p className="text-gray-400">
            {t('copyright')}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {t('tagline')}
          </p>
        </div>
      </div>
    </footer>
  )
}
