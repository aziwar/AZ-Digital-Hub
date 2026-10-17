import { getTranslations } from 'next-intl/server';

export default async function Process() {
  const t = await getTranslations('Process');
  const steps = t.raw('steps') as Array<{ title: string; description: string }>;

  return (
    <section id="process" className="py-12 sm:py-16 md:py-20 px-4">
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

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 sm:p-6"
            >
              <span dir="ltr" className="block text-sm font-bold text-cyan-300 mb-3" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed sm:leading-6">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
