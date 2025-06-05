import type { Metadata } from 'next'
import './globals.css'

/* eslint-disable @next/next/no-page-custom-font */

export const metadata: Metadata = {
  title: 'Ahmed Ziwar | Digital Marketing Manager',
  description: 'Experienced Digital Marketing Manager and IT Consultant in Kuwait. Specializing in ROI-driven campaigns, e-commerce solutions, and strategic business growth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Lato:wght@400;700&display=swap" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Lato:wght@400;700&display=swap"
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Lato:wght@400;700&display=swap" />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AZ Digital Hub',
              url: 'https://ahmedziwar.com',
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}