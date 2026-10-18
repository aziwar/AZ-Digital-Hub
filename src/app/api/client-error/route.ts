import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { standardRateLimiter, getClientIdentifier, checkRateLimit, isUpstashConfigured } from '@/lib'

export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 4096
const LIMITS = { message: 500, digest: 100, url: 500, userAgent: 300 } as const

type Field = keyof typeof LIMITS

const clip = (value: unknown, max: number): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value.slice(0, max) : undefined

/**
 * Receives client-side error reports (via navigator.sendBeacon) from the
 * error boundaries and writes one structured line to the runtime logs.
 * No PII is recorded beyond the User-Agent; the URL is stripped of query/hash.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const noContent = new NextResponse(null, { status: 204 })

  if (isUpstashConfigured()) {
    try {
      const result = await checkRateLimit(standardRateLimiter, getClientIdentifier(request))
      if (!result.success) return new NextResponse(null, { status: 429 })
    } catch {
      // Upstash unreachable: accept the report anyway
    }
  }

  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 })

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return new NextResponse(null, { status: 400 })
  }
  if (raw.length > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 })

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return new NextResponse(null, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return new NextResponse(null, { status: 400 })
  }

  const input = body as Record<string, unknown>
  const entry: Partial<Record<Field, string>> = {}
  for (const field of Object.keys(LIMITS) as Field[]) {
    const value = clip(input[field], LIMITS[field])
    if (value) entry[field] = value
  }
  if (!entry.message) return new NextResponse(null, { status: 400 })

  if (entry.url) {
    try {
      const u = new URL(entry.url)
      entry.url = `${u.origin}${u.pathname}`
    } catch {
      delete entry.url
    }
  }
  entry.userAgent = clip(request.headers.get('user-agent'), LIMITS.userAgent) ?? entry.userAgent

  // eslint-disable-next-line no-console
  console.error(`[client-error] ${JSON.stringify({ ...entry, boundary: clip(input.boundary, 20) })}`)

  return noContent
}
