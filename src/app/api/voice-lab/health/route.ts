// Spike: server-side proxy to the voice relay (behind Cloudflare Access) using an Access service token.
// Docs: https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/ (headers CF-Access-Client-Id / CF-Access-Client-Secret).
// Credentials come from server env only (injected from Infisical at runtime), never NEXT_PUBLIC_.
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (process.env.NEXT_PUBLIC_VOICE_LAB_ENABLED !== 'true') return new NextResponse(null, { status: 404 })
  const base = process.env.VOICE_RELAY_URL
  const id = process.env.VOICE_RELAY_ACCESS_CLIENT_ID
  const secret = process.env.VOICE_RELAY_ACCESS_CLIENT_SECRET
  if (!base || !id || !secret) return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 503 })
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/healthz`, {
      headers: { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret },
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000)
    })
    return NextResponse.json({ ok: res.status === 200, upstream: res.status }, { status: res.status === 200 ? 200 : 502 })
  } catch {
    return NextResponse.json({ ok: false, error: 'unreachable' }, { status: 502 })
  }
}
