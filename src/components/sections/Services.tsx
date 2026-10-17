import { CpuChipIcon, PresentationChartLineIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Reveal, RevealWithParent } from '@/components/ui/Reveal';
import { LazyVideo } from '@/components/ui/VideoBackground';

const serviceIcons = [PresentationChartLineIcon, CpuChipIcon, UserGroupIcon];

const Services: React.FC = () => {
  const t = useTranslations('Services');
  const common = useTranslations('Common');

  const items = t.raw('items') as Array<{
    title: string;
    outcome: string;
    description: string;
    features: string[];
  }>;

  return (
    <>
      <div className="section-divider mx-auto max-w-4xl" />

      <Reveal
        as="section"
        id="services"
        threshold={0.2}
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-linear-to-b/srgb from-slate-900 to-purple-900/20 transition-all duration-1000"
        revealClass="observe-fade-in"
      >
      <div className="max-w-7xl mx-auto">

        <Reveal
          threshold={0.3}
          className="text-center mb-12 sm:mb-16 transition-all duration-800"
          revealClass="observe-slide-left"
        >
          <p className="inline-flex items-center bg-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6 text-purple-200 font-semibold text-xs sm:text-sm">
            {t('badge')}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed sm:leading-7">
            {t('subtitle')}
          </p>
        </Reveal>

        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <LazyVideo
            mp4Src="/videos/services-showcase.mp4"
            posterSrc="/videos/services-poster.webp"
            className="shadow-2xl shadow-purple-500/10"
            labels={{ playVideo: common('playVideo'), pauseVideo: common('pauseVideo'), videoPoster: common('videoPoster') }}
          />
        </div>

        <RevealWithParent
          className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 transition-all duration-1000"
          revealClass="observe-stagger-children"
        >
          {items.map((service, index) => {
            const Icon = serviceIcons[index] ?? CpuChipIcon;
            return (
              <article
                key={service.title}
                className="flex flex-col bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 sm:p-6 md:p-8 hover:border-purple-500/50 transition-colors duration-300 animate-stagger"
                style={{ "--stagger-delay": `${index * 0.1}s` } as React.CSSProperties}
              >
                <Icon className="w-10 h-10 text-purple-300 mb-4" aria-hidden="true" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-cyan-200 font-medium mb-4">
                  <span className="sr-only">{t('outcomeLabel')}: </span>
                  {service.outcome}
                </p>
                <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed sm:leading-6">
                  {service.description}
                </p>
                <ul className="mt-auto space-y-2 sm:space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start text-xs sm:text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full me-2 sm:me-3 mt-1.5 shrink-0" aria-hidden="true"></span>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </RevealWithParent>

        <p className="max-w-3xl mx-auto text-center text-sm sm:text-base text-gray-300 mb-12 sm:mb-16">
          {t('audience')}
        </p>

        <Reveal
          threshold={0.4}
          className="text-center bg-linear-to-r/srgb from-purple-900/50 to-slate-900/50 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-800"
          revealClass="observe-slide-right"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            {t('cta.title')}
          </h3>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-purple-500/50 btn-magnetic focus-enhanced min-h-[44px]"
            >
              {t('cta.buttons.primary')}
            </a>
            <a
              href="#process"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm sm:text-base rounded-lg border border-purple-400/30 focus-enhanced min-h-[44px]"
            >
              {t('cta.buttons.secondary')}
            </a>
          </div>
        </Reveal>
      </div>
      </Reveal>
    </>
  );
};

export default Services;
