import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

// Shared renderer for the opengraph-image routes (homepage, articles index, each article).
// The fonts in assets/fonts are traced into each route by outputFileTracingIncludes in next.config.js.

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG_REGION = { en: 'Kuwait & GCC', ar: 'الكويت ودول الخليج' } as const

const font = (name: string) => readFile(join(process.cwd(), 'assets', 'fonts', name))

export async function renderOgImage({ locale, title, sub }: { locale: string; title: string; sub: string }) {
  const isAr = locale === 'ar'

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
          {isAr ? title.split(' ').map((w, i) => <span key={i}>{w}</span>) : title}
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#94a3b8', marginTop: 32, flexDirection: isAr ? 'row-reverse' : 'row', columnGap: isAr ? 10 : 0 }}>
          {isAr ? sub.split(' ').map((w, i) => <span key={i}>{w}</span>) : sub}
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 56, [isAr ? 'right' : 'left']: 80, fontSize: 28, color: '#38bdf8', fontFamily: 'Inter' }}>
          www.zewar.xyz
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Inter', data: inter, weight: 700, style: 'normal' },
        { name: 'Plex', data: plexAr, weight: 700, style: 'normal' },
      ],
    },
  )
}
