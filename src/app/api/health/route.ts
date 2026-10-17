import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  standardRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders
} from '@/lib'

export const dynamic = 'force-dynamic'

const has = (...names: string[]): boolean => names.every((n) => Boolean(process.env[n]))

/**
 * Liveness/config endpoint used by the GitHub site monitor.
 * Never fails because optional config is missing: reports booleans only
 * (never values) and rate-limits only when Upstash is configured.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const checks = {
    upstash: has('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'),
    emailjs: has(
      'EMAILJS_SERVICE_ID',
      'EMAILJS_TEMPLATE_ID',
      'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
      'EMAILJS_PRIVATE_KEY'
    ),
    recaptcha: has('RECAPTCHA_SECRET_KEY', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY')
  }

  const headers: Record<string, string> = { 'Cache-Control': 'no-store' }

  if (checks.upstash) {
    try {
      const result = await checkRateLimit(standardRateLimiter, getClientIdentifier(request))
      Object.assign(headers, getRateLimitHeaders(result))
      if (!result.success) {
        return NextResponse.json({ status: 'rate_limited' }, { status: 429, headers })
      }
    } catch {
      // Upstash unreachable: skip rate limiting rather than failing the health check
      checks.upstash = false
    }
  }

  const status = checks.upstash && checks.emailjs && checks.recaptcha ? 'ok' : 'degraded'

  return NextResponse.json(
    { status, checks, timestamp: new Date().toISOString() },
    { status: 200, headers }
  )
}
