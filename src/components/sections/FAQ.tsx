import { getTranslations } from 'next-intl/server';

interface FaqItem {
  question: string;
  answer: string;
}

export default async function FAQ() {
  const t = await getTranslations('FAQ');
  const items = t.raw('items') as FaqItem[];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-base sm:text-lg text-gray-300">{t('subtitle')}</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group bg-slate-800/40 border border-slate-700/60 rounded-lg open:border-purple-500/40"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-4 sm:p-5 text-base sm:text-lg font-semibold text-white focus-enhanced rounded-lg [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <svg className="w-5 h-5 shrink-0 text-purple-300 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-gray-300 leading-relaxed sm:leading-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
