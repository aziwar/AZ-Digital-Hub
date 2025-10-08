import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // SYSTEMATIC PATTERN ELIMINATION: Dangerous bypass flags removed
  // Previous configuration caused 58% deployment failure rate
  // Quality gate enforcement now active for all builds
  
  // Performance optimizations for Next.js 15
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@heroicons/react',
      'lucide-react'
    ],
    webpackMemoryOptimizations: true,
  },
  
  // Image optimization for Vercel + OpenAI DALL-E 3
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vpqhbrekfovgkcwegvxn.supabase.co',
        pathname: '/storage/v1/object/public/**',
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
  env: {
    SITE_URL: process.env.SITE_URL || 'https://az-digital-hub-ahmed-zewars-projects.vercel.app',
    SITE_NAME: 'AZ Digital Hub - Ahmed Zewar',
    SITE_DESCRIPTION: 'Ahmed Zewar - Strategic Digital Marketing Commander | ROI-Driven Solutions for Kuwait & GCC',
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://cdn.emailjs.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://cdn.pixabay.com https://avatars.githubusercontent.com https://oaidalleapiprodscus.blob.core.windows.net https://vpqhbrekfovgkcwegvxn.supabase.co https://media.licdn.com",
              "font-src 'self' data:",
              "connect-src 'self' https://vercel.live https://api.emailjs.com https://oaidalleapiprodscus.blob.core.windows.net https://vpqhbrekfovgkcwegvxn.supabase.co",
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
