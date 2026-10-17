// Single source of truth for how the contact form delivers leads.
// Provider order: Cloudflare Email Service -> EmailJS -> handoff (WhatsApp/email from the
// visitor's device). Rate limiting uses Upstash when configured, else an in-memory limiter.
// Detection reads only the presence of env vars, never their values.

const has = (...names: string[]): boolean => names.every((n) => Boolean(process.env[n]))

export const isUpstashConfigured = (): boolean =>
  has('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN')

export const isCloudflareEmailConfigured = (): boolean =>
  has('CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_EMAIL_API_TOKEN')

export const isEmailJsConfigured = (): boolean =>
  has('EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY')

export const isRecaptchaConfigured = (): boolean =>
  has('RECAPTCHA_SECRET_KEY', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY')

export type ContactEmailProvider = 'cloudflare' | 'emailjs'
export type ContactDeliveryMode = 'email' | 'handoff'
export type RateLimitBackend = 'upstash' | 'memory'

export const getContactEmailProvider = (): ContactEmailProvider | null =>
  isCloudflareEmailConfigured() ? 'cloudflare' : isEmailJsConfigured() ? 'emailjs' : null

export const getContactDeliveryMode = (): ContactDeliveryMode =>
  getContactEmailProvider() ? 'email' : 'handoff'

export const getRateLimitBackend = (): RateLimitBackend =>
  isUpstashConfigured() ? 'upstash' : 'memory'

/** Owner inbox (must be a verified destination address in Cloudflare Email Service). */
export const getContactToEmail = (): string => process.env.CONTACT_TO_EMAIL || 'ahmed@zewar.xyz'

/** Sender on the onboarded sending domain. */
export const getContactFromEmail = (): string => process.env.CONTACT_FROM_EMAIL || 'website@zewar.xyz'
