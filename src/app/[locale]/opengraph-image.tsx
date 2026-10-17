import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

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
  const isAr = locale === 'ar'
  const t = TITLES[isAr ? 'ar' : 'en']

  const [inter, kufiAr, kufiLatin] = await Promise.all([
    font('inter-latin-700-normal.woff'),
    font('noto-kufi-arabic-arabic-700-normal.woff'),
    font('noto-kufi-arabic-latin-700-normal.woff'),
  ])
  const family = isAr ? 'Kufi' : 'Inter'

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
          direction: isAr ? 'rtl' : 'ltr',
          alignItems: isAr ? 'flex-end' : 'flex-start',
          background: 'linear-gradient(135deg, #0b1220 0%, #111c33 55%, #16294d 100%)',
          color: '#f8fafc',
          fontFamily: family,
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
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          {t.title}
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
        { name: 'Kufi', data: kufiAr, weight: 700, style: 'normal' },
        { name: 'Kufi', data: kufiLatin, weight: 700, style: 'normal' },
      ],
    },
  )
}
