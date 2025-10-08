'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const Testimonials: React.FC = () => {
  const t = useTranslations('Testimonials');

  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 px-4 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto mb-6 sm:mb-8" />
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {(t.raw('items') as Testimonial[]).map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-5 md:p-6 text-center"
            >
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <h3 className="text-base sm:text-lg font-semibold text-white">{testimonial.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;