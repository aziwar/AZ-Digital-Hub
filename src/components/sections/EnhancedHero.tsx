import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import { WHATSAPP_NUMBER } from '@/components/contactDetails';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { imageConfig } from '@/lib/images.config';

const EnhancedHero: React.FC = () => {
  const t = useTranslations('Hero');
  const highlights = t.raw('highlights') as string[];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">

      {/* Video Background - desktop only, poster on mobile */}
      <VideoBackground
        mp4Src="/videos/hero-background.mp4"
        webmSrc="/videos/hero-background.webm"
        posterSrc="/videos/hero-background-poster.webp"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">

          {/* Main Content */}
          <div className="lg:col-span-7 text-center lg:text-start">

            <p className="mb-6 sm:mb-8 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 sm:px-5 py-2 text-purple-200 font-medium text-xs sm:text-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" aria-hidden="true"></span>
              {t('eyebrow')}
            </p>

            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight sm:leading-none mb-4 sm:mb-6">
              <span className="block animate-fade-from-bottom motion-safe:delay-200">{t('headline.name')}</span>
              <span className="block bg-linear-to-r/srgb from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-fade-from-bottom motion-safe:delay-500">
                {t('headline.tagline')}
              </span>
            </h1>

            <div className="mb-8 animate-fade-from-bottom motion-safe:delay-700">
              <p className="hero-subtitle text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 mb-4">
                {t('subtitle')}
              </p>
              <p className="hero-description text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed sm:leading-7 mb-4">
                {t.rich('description', {
                  strong: (chunks) => <strong className="font-semibold text-purple-300">{chunks}</strong>
                })}
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed sm:leading-6">
                {t('whyMe')}
              </p>
            </div>

            {/* CTAs */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-from-bottom motion-safe:delay-1000">
              <a
                href="#contact"
                className="group btn-primary btn-magnetic text-base sm:text-lg min-h-[44px] focus-enhanced"
              >
                <span className="flex items-center justify-center">
                  {t('cta.primary')}
                  <span className="ms-2 rtl:rotate-180 group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" aria-hidden="true">→</span>
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('cta.whatsapp.linkText'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 min-h-[44px] flex items-center justify-center rounded-xl border border-green-400/40 bg-white/5 hover:bg-green-600/20 text-green-200 font-semibold text-base sm:text-lg transition-colors focus-enhanced"
              >
                {t('cta.whatsapp.text')}
              </a>
            </div>

            {/* Highlights */}
            <ul className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 bg-white/5 border border-slate-600/50 rounded-full px-4 py-2 text-gray-200">
                  <span className="text-cyan-400" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Image */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-linear-to-br/srgb from-purple-500/25 to-cyan-500/25 rounded-full blur-2xl" aria-hidden="true" />
              <div className="relative w-full h-full bg-linear-to-br/srgb from-slate-700 to-slate-800 rounded-full border-4 border-purple-400/40 overflow-hidden">
                <Image
                  src={imageConfig.profile.profileImage}
                  alt={t('profile.imageAlt')}
                  width={400}
                  height={400}
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, (min-width: 640px) 288px, 256px"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#services" className="hidden sm:flex absolute bottom-2 inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex-col items-center gap-2 text-purple-300 hover:text-purple-200 text-sm font-medium">
          <span>{t('scroll.text')}</span>
          <svg className="w-5 h-5 motion-safe:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default EnhancedHero;
