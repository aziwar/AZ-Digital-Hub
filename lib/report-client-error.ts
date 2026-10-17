const reported = new Set<string>()

/**
 * Send one beacon per distinct error to /api/client-error (same origin,
 * allowed by CSP connect-src 'self'). Safe to call from any client component.
 */
export function reportClientError(
  error: Error & { digest?: string },
  boundary: 'route' | 'global'
): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return

  const key = `${boundary}|${error.digest ?? ''}|${error.message}`
  if (reported.has(key)) return
  reported.add(key)

  const payload = JSON.stringify({
    message: String(error.message || error.name || 'Unknown error').slice(0, 500),
    digest: error.digest,
    url: window.location.href,
    userAgent: navigator.userAgent,
    boundary
  })

  try {
    const blob = new Blob([payload], { type: 'application/json' })
    if (navigator.sendBeacon?.('/api/client-error', blob)) return
    void fetch('/api/client-error', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(() => undefined)
  } catch {
    // Reporting must never throw from an error boundary
  }
}
