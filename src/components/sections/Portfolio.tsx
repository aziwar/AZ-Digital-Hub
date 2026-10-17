import { getTranslations } from 'next-intl/server';

interface Capability {
  title: string;
  description: string;
  points: string[];
}

interface StackItem {
  title: string;
  description: string;
}

export default async function Portfolio() {
  const t = await getTranslations('Portfolio');
  const items = t.raw('items') as Capability[];
  const stackItems = t.raw('stack.items') as StackItem[];

  return (
    <section id="engagements" className="py-12 sm:py-16 md:py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-5 sm:p-6 md:p-8 hover:border-blue-600/50 transition-colors duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-5">{item.description}</p>
              <ul className="mt-auto space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start text-xs sm:text-sm text-gray-200">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full me-2 sm:me-3 mt-1.5 flex-shrink-0" aria-hidden="true"></span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Own AI operations stack */}
        <div className="mt-10 sm:mt-12 bg-slate-800/30 border border-cyan-500/30 rounded-xl p-5 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{t('stack.title')}</h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">{t('stack.description')}</p>
          <dl className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {stackItems.map((item) => (
              <div key={item.title} className="border-s-2 border-cyan-400/60 ps-4">
                <dt className="text-sm sm:text-base font-semibold text-cyan-200">{item.title}</dt>
                <dd className="text-sm text-gray-300 mt-1 leading-relaxed">{item.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6">{t('cta.text')}</p>
          <a
            href="#contact"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px]"
          >
            {t('cta.button')}
          </a>
        </div>
      </div>
    </section>
  );
}
