import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  standardRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders
} from '@/lib'
import {
  getContactDeliveryMode,
  getContactEmailProvider,
  getRateLimitBackend,
  isCloudflareEmailConfigured,
  isEmailJsConfigured,
  isRecaptchaConfigured,
  isUpstashConfigured
} from '@/lib/contactDelivery'

export const dynamic = 'force-dynamic'

/**
 * Liveness/config endpoint used by the GitHub site monitor.
 * Never fails because optional config is missing: reports booleans only
 * (never values) and rate-limits only when Upstash is configured.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const checks = {
    upstash: isUpstashConfigured(),
    cloudflareEmail: isCloudflareEmailConfigured(),
    emailjs: isEmailJsConfigured(),
    recaptcha: isRecaptchaConfigured()
  }
  // Config-based, matching /api/contact/status: "handoff" = form sends leads via WhatsApp/email
  const contact = getContactDeliveryMode()
  const provider = getContactEmailProvider()
  const rateLimit = getRateLimitBackend()

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

  // "ok" = server email ready with reCAPTCHA; "degraded" = optional config missing
  const status = contact === 'email' && checks.recaptcha ? 'ok' : 'degraded'

  return NextResponse.json(
    { status, contact, provider, rateLimit, checks, timestamp: new Date().toISOString() },
    { status: 200, headers }
  )
}
