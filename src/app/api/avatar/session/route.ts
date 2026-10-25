import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { checkRateLimit, getClientIdentifier, isUpstashConfigured, standardRateLimiter } from '@/lib'
import { isAvatarConfigured, isAvatarEnabled } from '@/lib/avatar'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }

/**
 * Returns a short-lived ElevenLabs signed URL for one conversation with the site's agent,
 * so the API key never reaches the browser. 404 while the feature flag is off.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAvatarEnabled()) return NextResponse.json({ error: 'not_found' }, { status: 404, headers: NO_STORE })
  if (!isAvatarConfigured()) return NextResponse.json({ error: 'not_configured' }, { status: 503, headers: NO_STORE })

  if (isUpstashConfigured()) {
    try {
      const result = await checkRateLimit(standardRateLimiter, getClientIdentifier(request))
      if (!result.success) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: NO_STORE })
    } catch {
      // Upstash unreachable: serve the request rather than blocking the avatar
    }
  }

  const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get-signed-url')
  url.searchParams.set('agent_id', process.env.ELEVENLABS_AGENT_ID as string)
  try {
    const res = await fetch(url, { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY as string }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: 'upstream' }, { status: 502, headers: NO_STORE })
    const { signed_url: signedUrl } = (await res.json()) as { signed_url?: string }
    if (!signedUrl) return NextResponse.json({ error: 'upstream' }, { status: 502, headers: NO_STORE })
    return NextResponse.json({ signedUrl }, { headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: 'upstream' }, { status: 502, headers: NO_STORE })
  }
}
