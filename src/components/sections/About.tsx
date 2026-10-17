import { useTranslations } from 'next-intl';
import React from 'react';

const About: React.FC = () => {
  const t = useTranslations('About');
  const skills = t.raw('competencies.skills') as string[];
  const highlights = t.raw('highlights') as Array<{ value: string; label: string }>;
  const roles = t.raw('experience.roles') as Array<{ title: string; description: string }>;

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6 text-center">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{t('intro')}</p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{t('approach')}</p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{t('experienceLine')}</p>

            <div className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{t('competencies.title')}</h3>
              <ul className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/10 border border-blue-600/30 rounded-full text-blue-300 text-xs sm:text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Highlights */}
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-5 md:p-6 text-center flex flex-col-reverse"
              >
                <dt className="text-xs sm:text-sm text-gray-300">{item.label}</dt>
                <dd dir="auto" className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Career path */}
        <div className="mt-12 sm:mt-14 md:mt-16 max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">{t('experience.title')}</h3>
          <ol className="space-y-4 sm:space-y-5">
            {roles.map((role) => (
              <li key={role.title} className="flex items-start gap-3 sm:gap-4">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-semibold text-white">{role.title}</h4>
                  <p className="text-sm sm:text-base text-gray-300 mt-1">{role.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default About;
