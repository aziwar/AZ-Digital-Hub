// Builds and sends the contact-form lead email via the configured provider.
import emailjs from '@emailjs/nodejs'

import {
  getContactEmailProvider,
  getContactFromEmail,
  getContactToEmail,
  type ContactEmailProvider
} from './contactDelivery'

export interface ContactLead {
  name: string
  email: string
  company?: string
  phone?: string
  project_type?: string
  budget_range?: string
  message: string
  locale?: string
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const clean = (value: string | undefined): string => (value ?? '').replace(/[\r\n]+/g, ' ').trim()

export function buildContactEmail(lead: ContactLead): { subject: string; html: string; text: string } {
  const name = clean(lead.name)
  const company = clean(lead.company)
  const subject = `New inquiry from ${name}${company ? ` (${company})` : ''}`

  const fields: [string, string][] = [
    ['Name', name],
    ['Email', clean(lead.email)],
    ['Company', company || 'Not provided'],
    ['Phone', clean(lead.phone) || 'Not provided'],
    ['Project type', clean(lead.project_type) || 'Not specified'],
    ['Budget range', clean(lead.budget_range) || 'Not specified'],
    ['Locale', clean(lead.locale) || 'Not specified']
  ]
  const message = lead.message.trim()

  const text = [
    'New inquiry from the zewar.xyz contact form.',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    message,
    '',
    'Reply to this email to answer the visitor directly.'
  ].join('\n')

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
    )
    .join('')
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5">
<p>New inquiry from the zewar.xyz contact form.</p>
<table style="border-collapse:collapse">${rows}</table>
<p style="margin:16px 0 4px;color:#555">Message:</p>
<div style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px">${escapeHtml(message)}</div>
<p style="margin-top:16px;color:#777;font-size:12px">Reply to this email to answer the visitor directly.</p>
</body></html>`

  return { subject, html, text }
}

interface CloudflareSendResponse {
  success?: boolean
  errors?: { code?: number; message?: string }[]
  result?: { delivered?: unknown[]; permanent_bounces?: unknown[]; queued?: unknown[] }
}

async function sendViaCloudflare(lead: ContactLead): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_EMAIL_API_TOKEN
  if (!accountId || !token) throw new Error('Cloudflare Email Service not configured')

  // CLOUDFLARE_API_BASE is a test-only override for a local mock server; not public config.
  const base = (process.env.CLOUDFLARE_API_BASE || 'https://api.cloudflare.com').replace(/\/+$/, '')
  const { subject, html, text } = buildContactEmail(lead)

  const res = await fetch(
    `${base}/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: getContactToEmail(),
        from: getContactFromEmail(),
        subject,
        html,
        text,
        replyTo: { email: lead.email.trim(), name: clean(lead.name) }
      }),
      signal: AbortSignal.timeout(15_000)
    }
  )

  let data: CloudflareSendResponse | null = null
  try {
    data = (await res.json()) as CloudflareSendResponse
  } catch {
    // non-JSON body: handled below
  }
  const accepted = (data?.result?.delivered?.length ?? 0) + (data?.result?.queued?.length ?? 0)
  if (!res.ok || !data?.success || accepted === 0) {
    const detail = data?.errors?.map((e) => `${e.code ?? ''} ${e.message ?? ''}`.trim()).join('; ')
    throw new Error(`Cloudflare Email Service send failed (HTTP ${res.status})${detail ? `: ${detail}` : ''}`)
  }
}

async function sendViaEmailJs(lead: ContactLead): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY
  if (!serviceId || !templateId || !publicKey || !privateKey) throw new Error('EmailJS not configured')

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: lead.name,
      from_email: lead.email,
      company: lead.company,
      project_type: lead.project_type || 'Not specified',
      budget_range: lead.budget_range || 'Not specified',
      message: lead.message,
      phone: lead.phone,
      locale: lead.locale,
      to_name: 'Ahmed Zewar'
    },
    { publicKey, privateKey }
  )
}

/** Sends the lead with the first configured provider. Throws if none is configured or the send fails. */
export async function sendContactEmail(lead: ContactLead): Promise<ContactEmailProvider> {
  const provider = getContactEmailProvider()
  if (provider === 'cloudflare') await sendViaCloudflare(lead)
  else if (provider === 'emailjs') await sendViaEmailJs(lead)
  else throw new Error('No contact email provider configured')
  return provider
}
