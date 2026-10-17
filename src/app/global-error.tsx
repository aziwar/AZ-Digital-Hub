'use client'

/**
 * Root error boundary: replaces the root layout when it fails, so it must
 * render its own <html>/<body> and must not depend on i18n providers.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
 */

import { useEffect } from 'react'

import { reportClientError } from '@/lib/report-client-error'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    reportClientError(error, 'global')
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '16px'
        }}
      >
        <main>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
            حدث خطأ غير متوقع. An unexpected error occurred.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#7c3aed',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '1rem' }}>
              Error ID: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  )
}
