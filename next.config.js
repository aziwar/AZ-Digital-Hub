import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // opengraph-image reads these fonts at request time; ship them with the function
  outputFileTracingIncludes: {
    '/[locale]/opengraph-image': ['./assets/fonts/**'],
  },
  
  // SYSTEMATIC PATTERN ELIMINATION: Dangerous bypass flags removed
  // Previous configuration caused 58% deployment failure rate
  // Quality gate enforcement now active for all builds
  
  // Performance optimizations for Next.js 15
  experimental: {
    optimizePackageImports: [
      '@heroicons/react'
    ],
    webpackMemoryOptimizations: true,
  },
  
  // Image optimization (local assets plus a few allowed remote hosts)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/dms/image/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },

  // Environment variables
  // Keep default in sync with lib/site.ts (SITE_URL)
  env: {
    SITE_URL: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zewar.xyz').replace(/\/+$/, ''),
  },

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://avatars.githubusercontent.com https://media.licdn.com",
              "font-src 'self' data:",
              "connect-src 'self' https://vercel.live https://www.google.com/recaptcha/",
              "frame-src https://www.google.com/recaptcha/",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
