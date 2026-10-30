'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { imageConfig } from '@/lib/images.config';
import { createTranslator, type MessageTree } from '@/lib/messages';

import LanguageSwitcher from './LanguageSwitcher';

// `hash` items are sections of the homepage; `articles` is its own page
const menuItems = [
  { hash: 'services', key: 'services' },
  { hash: 'process', key: 'process' },
  { hash: 'engagements', key: 'engagements' },
  { hash: 'about', key: 'about' },
  { hash: 'faq', key: 'faq' },
  { hash: null, key: 'articles' },
  { hash: 'contact', key: 'contact' },
] as const;

interface NavigationProps {
  messages: MessageTree;
  locale: string;
  languageLabels: React.ComponentProps<typeof LanguageSwitcher>['labels'];
  /** Page the bar is shown on: section links stay same-page hashes on the homepage only */
  page?: 'home' | 'articles';
  /** Language switcher targets (defaults to the locale homepages) */
  languageHrefs?: React.ComponentProps<typeof LanguageSwitcher>['hrefs'];
}

const Navigation: React.FC<NavigationProps> = ({ messages, locale, languageLabels, page = 'home', languageHrefs }) => {
  const t = createTranslator(messages, 'Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const onHome = page === 'home';
  const home = `/${locale}`;
  const links = menuItems.map((item) => ({
    key: item.key,
    href: item.hash ? `${onHome ? '' : home}#${item.hash}` : `${home}/articles`,
    current: item.key === 'articles' && page === 'articles',
  }));

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <a href={onHome ? '#hero' : home} aria-label={t(onHome ? 'aria.home' : 'aria.homePage')} className="flex items-center gap-1.5 sm:gap-2 min-h-[44px]">
            <Image
              src={imageConfig.brand.logo}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-base sm:text-lg md:text-xl font-bold text-white" dir="ltr">{t('brand')}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {links.map((item) => (
              <a
                key={item.key}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={`${item.current ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center whitespace-nowrap`}
              >
                {t(`menu.${item.key}`)}
              </a>
            ))}
            <LanguageSwitcher currentLocale={locale} labels={languageLabels} hrefs={languageHrefs} />
          </div>

          {/* Mobile: the language links stay in the bar, so they work without JS (the menu needs JS) */}
          <div className="lg:hidden flex items-center gap-1.5">
            <LanguageSwitcher currentLocale={locale} labels={languageLabels} hrefs={languageHrefs} />

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-300 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('aria.closeMenu') : t('aria.openMenu')}
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((item) => (
              <a
                key={item.key}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
              >
                {t(`menu.${item.key}`)}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
