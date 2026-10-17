/** Single source of truth for the public site URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zewar.xyz').replace(/\/+$/, '')
