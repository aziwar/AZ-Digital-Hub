'use client'

import { useParams } from 'next/navigation'
import { useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const currentLocale = params.locale as string

  const switchLocale = (locale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-full p-1 border border-slate-700">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentLocale === 'en'
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-slate-700'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Switch to English"
        aria-current={currentLocale === 'en' ? 'true' : 'false'}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ar')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentLocale === 'ar'
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-slate-700'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Switch to Arabic"
        aria-current={currentLocale === 'ar' ? 'true' : 'false'}
      >
        AR
      </button>
    </div>
  )
}
