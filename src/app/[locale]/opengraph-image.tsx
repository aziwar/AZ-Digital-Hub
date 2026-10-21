import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { hasLocale } from 'next-intl'

import { routing } from '@/i18n/routing'

export const alt = 'Ahmed Ziwar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TITLES: Record<string, { title: string; sub: string }> = {
  en: {
    title: 'Ahmed Ziwar — AI & Digital Transformation Consultant',
    sub: 'Kuwait & GCC',
  },
  ar: {
    title: 'أحمد زيور — استشاري ذكاء اصطناعي وتحول رقمي',
    sub: 'الكويت ودول الخليج',
  },
}

const font = (name: string) => readFile(join(process.cwd(), 'assets', 'fonts', name))

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Unknown first segments (e.g. /api/opengraph-image) must not run the image function
  if (!hasLocale(routing.locales, locale)) notFound()
  const isAr = locale === 'ar'
  const t = TITLES[isAr ? 'ar' : 'en']

  const [inter, plexAr] = await Promise.all([
    font('inter-latin-700-normal.woff'),
    font('ibm-plex-sans-arabic-arabic-700-normal.woff'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
                    alignItems: isAr ? 'flex-end' : 'flex-start',
          background: 'linear-gradient(135deg, #0b1220 0%, #111c33 55%, #16294d 100%)',
          color: '#f8fafc',
          fontFamily: 'Plex, Inter',
        }}
      >
        <div style={{ display: 'flex', width: 96, height: 6, background: '#38bdf8', borderRadius: 3, marginBottom: 40 }} />
        <div
          style={{
            display: 'flex',
            fontSize: isAr ? 68 : 72,
            fontWeight: 700,
            lineHeight: 1.3,
            maxWidth: 1000,
            // satori mis-orders wrapped RTL text, so lay Arabic words out explicitly right-to-left
            flexDirection: isAr ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            columnGap: isAr ? 20 : 0,
          }}
        >
          {isAr ? t.title.split(' ').map((w, i) => <span key={i}>{w}</span>) : t.title}
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#94a3b8', marginTop: 32 }}>{t.sub}</div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 56, [isAr ? 'right' : 'left']: 80, fontSize: 28, color: '#38bdf8', fontFamily: 'Inter' }}>
          www.zewar.xyz
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: inter, weight: 700, style: 'normal' },
        { name: 'Plex', data: plexAr, weight: 700, style: 'normal' },
      ],
    },
  )
}
