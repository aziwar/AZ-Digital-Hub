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
  
  // Performance optimizations (webpackMemoryOptimizations dropped: Next 16 builds with Turbopack)
  experimental: {
    optimizePackageImports: [
      '@heroicons/react'
    ],
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
    // Next 16 defaults: qualities [75] only and no 16px size; keep the v15 behaviour
    qualities: [70, 75],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
        // Self-hosted fonts never change in place; cache them for a year
        source: '/fonts/:file*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
              "script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://avatars.githubusercontent.com https://media.licdn.com",
              "font-src 'self' data:",
              "connect-src 'self' https://vercel.live",
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
