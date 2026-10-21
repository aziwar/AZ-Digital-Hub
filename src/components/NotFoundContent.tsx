import { getTranslations } from 'next-intl/server'

const links = [
  { hash: 'services', key: 'services' },
  { hash: 'process', key: 'process' },
  { hash: 'engagements', key: 'engagements' },
  { hash: 'about', key: 'about' },
  { hash: 'faq', key: 'faq' },
  { hash: 'contact', key: 'contact' },
] as const

// Server-rendered 404 body shared by src/app/global-not-found.tsx and [locale]/not-found.tsx.
// Plain <a> links so it works without JS and without NextIntlClientProvider.
export default async function NotFoundContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'NotFound' })
  const nav = await getTranslations({ locale, namespace: 'Navigation' })
  const home = `/${locale}`

  return (
    <main
      id="content"
      className="min-h-screen bg-linear-to-br/srgb from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <p dir="ltr" className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r/srgb from-purple-400 via-pink-500 to-cyan-500">
          404
        </p>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          <p className="text-xl text-gray-300">{t('description')}</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">{t('suggestions')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {links.map((link) => (
              <a
                key={link.key}
                href={`${home}#${link.hash}`}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 border border-slate-700 hover:border-purple-500"
              >
                {nav(`menu.${link.key}`)}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <a
            href={home}
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-purple-500/30"
          >
            {t('home')}
          </a>
        </div>

        <div className="pt-8 border-t border-slate-800">
          <p className="text-gray-300 text-sm">
            {t.rich('help', {
              link: (chunks) => (
                <a href={`${home}#contact`} className="text-purple-300 hover:text-purple-200 underline">
                  {chunks}
                </a>
              )
            })}
          </p>
        </div>
      </div>
    </main>
  )
}
