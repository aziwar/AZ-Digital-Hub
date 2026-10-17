import { NextResponse } from 'next/server'

import { getContactDeliveryMode } from '@/lib/contactDelivery'

export const dynamic = 'force-dynamic'

/**
 * Tells the contact form how to deliver a lead: "email" (POST /api/contact) when
 * EmailJS and Upstash are configured, otherwise "handoff" (WhatsApp/email from the
 * visitor's device). Config presence only; no values, no external calls.
 */
export function GET(): NextResponse {
  return NextResponse.json(
    { mode: getContactDeliveryMode() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
