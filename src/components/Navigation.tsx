'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { imageConfig } from '@/lib/images.config';

import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Image
              src={imageConfig.brand.logo}
              alt={t('brand')}
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-base sm:text-lg md:text-xl font-bold text-white">{t('brand')}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#hero" className="text-gray-300 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.home')}
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.about')}
            </a>
            <a href="#services" className="text-gray-300 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.services')}
            </a>
            <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.portfolio')}
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.contact')}
            </a>
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t('aria.closeMenu') : t('aria.openMenu')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#hero" className="block px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.home')}
            </a>
            <a href="#about" className="block px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.about')}
            </a>
            <a href="#services" className="block px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.services')}
            </a>
            <a href="#portfolio" className="block px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.portfolio')}
            </a>
            <a href="#contact" className="block px-4 py-3 text-base text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] flex items-center" onClick={() => setIsOpen(false)}>
              {t('menu.contact')}
            </a>
            <div className="px-4 py-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;