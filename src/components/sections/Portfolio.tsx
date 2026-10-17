import { getTranslations } from 'next-intl/server';
import React from 'react';

interface Engagement {
  title: string;
  context: string;
  challenge: string;
  approach: string;
  outcome: string;
}

export default async function Portfolio() {
  const t = await getTranslations('Portfolio');
  const items = t.raw('items') as Engagement[];
  const rows = ['challenge', 'approach', 'outcome'] as const;

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

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item) => (
            <article
              key={item.title}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-5 sm:p-6 md:p-8 hover:border-blue-600/50 transition-colors duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-blue-300 mb-5">{item.context}</p>
              <dl className="space-y-4">
                {rows.map((row) => (
                  <div key={row}>
                    <dt className={`text-xs font-semibold mb-1 ${row === 'outcome' ? 'text-green-300' : 'text-gray-400'}`}>
                      {t(`labels.${row}`)}
                    </dt>
                    <dd className="text-sm sm:text-base text-gray-200 leading-relaxed">{item[row]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
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
