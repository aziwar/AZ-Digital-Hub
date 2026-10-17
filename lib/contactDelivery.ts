// Whether the contact form can deliver leads by server email (EmailJS + Upstash rate limiting).
// Without both, the form hands leads off to WhatsApp/email from the visitor's device instead.
// Reads only the presence of env vars, never their values.

const has = (...names: string[]): boolean => names.every((n) => Boolean(process.env[n]))

export const isUpstashConfigured = (): boolean =>
  has('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN')

export const isEmailJsConfigured = (): boolean =>
  has('EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY')

export const isRecaptchaConfigured = (): boolean =>
  has('RECAPTCHA_SECRET_KEY', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY')

export type ContactDeliveryMode = 'email' | 'handoff'

export const getContactDeliveryMode = (): ContactDeliveryMode =>
  isEmailJsConfigured() && isUpstashConfigured() ? 'email' : 'handoff'
