import React from 'react';

import { EMAIL, LINKEDIN_DISPLAY, LINKEDIN_URL, WHATSAPP_NUMBER, PHONE_DISPLAY } from '@/components/contactDetails';
import { createTranslator, type MessageTree } from '@/lib/messages';

interface EnhancedContactProps {
  /** The Contact namespace (plain strings); the rich title is formatted on the server */
  messages: MessageTree;
  title: React.ReactNode;
}

// WhatsApp is the single contact call to action; there is no contact form.
const EnhancedContact: React.FC<EnhancedContactProps> = ({ messages, title }) => {
  const t = createTranslator(messages, 'Contact');
  const nextSteps = t.raw('nextSteps.items') as string[];
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.linkText'))}`;

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 bg-linear-to-b/srgb from-slate-900 to-purple-900/30">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">

          {/* WhatsApp call to action */}
          <div className="lg:col-span-3 flex flex-col justify-center bg-linear-to-r/srgb from-green-600/15 to-green-800/15 border border-green-500/30 rounded-xl p-6 sm:p-8 md:p-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('whatsapp.title')}</h3>
            <p className="text-base sm:text-lg text-gray-300 mb-6">{t('whatsapp.description')}</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-2 px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg transition-colors duration-200 min-h-[44px] focus-enhanced"
            >
              {t('whatsapp.button')}
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* Side column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            <div className="bg-slate-800/30 backdrop-blur-xs border border-slate-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('nextSteps.title')}</h3>
              <ol className="space-y-3 text-sm sm:text-base text-gray-300">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600/30 text-purple-200 text-xs font-bold flex items-center justify-center" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white">{t('contactMethods.title')}</h3>
              <dl className="space-y-3 text-sm sm:text-base">
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.email')}</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`} dir="ltr" className="text-blue-300 hover:text-blue-200 transition-colors">{EMAIL}</a>
                  </dd>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.linkedin')}</dt>
                  <dd>
                    <a href={LINKEDIN_URL} dir="ltr" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">
                      {LINKEDIN_DISPLAY}
                    </a>
                  </dd>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.location.label')}</dt>
                  <dd className="text-white">{t('contactMethods.location.value')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContact;
