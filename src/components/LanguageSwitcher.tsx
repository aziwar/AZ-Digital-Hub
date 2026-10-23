interface LanguageSwitcherProps {
  currentLocale: string
  labels: { switchToEnglish: string; switchToArabic: string }
  /** Same page in each language (defaults to the locale homepages) */
  hrefs?: { en: string; ar: string }
}

const LANGUAGES = [
  { locale: 'en', text: 'EN', labelKey: 'switchToEnglish' },
  { locale: 'ar', text: 'AR', labelKey: 'switchToArabic' },
] as const

// Plain links between the two locale versions of the page (homepages by default), so switching works without JS and crawlers can follow it.
// The accessible name starts with the visible text ("AR Switch to Arabic", WCAG 2.5.3); the extra words are
// in the page language, the visible code in the target language.
export default function LanguageSwitcher({ currentLocale, labels, hrefs }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-full p-1 border border-slate-700">
      {LANGUAGES.map(({ locale, text, labelKey }) => {
        const isCurrent = locale === currentLocale
        return (
          <a
            key={locale}
            href={hrefs?.[locale] ?? `/${locale}`}
            hrefLang={locale}
            lang={locale}
            aria-current={isCurrent ? 'page' : undefined}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isCurrent
                ? 'bg-linear-to-r/srgb from-purple-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {text}
            <span className="sr-only" lang={currentLocale}>{` ${labels[labelKey]}`}</span>
          </a>
        )
      })}
    </div>
  )
}
