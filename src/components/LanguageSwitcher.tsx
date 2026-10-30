interface LanguageSwitcherProps {
  currentLocale: string
  labels: { switchToEnglish: string; switchToArabic: string }
  /** Same page in each language (defaults to the locale homepages) */
  hrefs?: { en: string; ar: string }
}

// The other language, named in its own script so a reader of that language recognises it at a glance
const TARGET = {
  en: { locale: 'ar', text: 'العربية', labelKey: 'switchToArabic' },
  ar: { locale: 'en', text: 'English', labelKey: 'switchToEnglish' },
} as const

// One plain link to the same page in the other language, so switching works without JS and crawlers can follow it.
// The accessible name starts with the visible text (WCAG 2.5.3); the extra words are in the page language.
export default function LanguageSwitcher({ currentLocale, labels, hrefs }: LanguageSwitcherProps) {
  const { locale, text, labelKey } = TARGET[currentLocale === 'ar' ? 'ar' : 'en']
  return (
    <a
      href={hrefs?.[locale] ?? `/${locale}`}
      hrefLang={locale}
      lang={locale}
      className="group inline-flex min-h-[44px] items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
    >
      <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3.5 text-sm font-medium text-gray-200 transition-colors group-hover:border-purple-400/70 group-hover:bg-slate-800 group-hover:text-white">
        <svg className="h-4 w-4 shrink-0 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        {text}
      </span>
      <span className="sr-only" lang={currentLocale}>{` ${labels[labelKey]}`}</span>
    </a>
  )
}
