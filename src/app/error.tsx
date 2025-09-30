'use client'

/**
 * Error Boundary for Next.js App Router
 *
 * Catches and handles runtime errors in Client and Server Components
 * Provides user-friendly error UI with recovery mechanism
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add error reporting service integration (e.g., Sentry)
      // eslint-disable-next-line no-console
      console.error('[Error Boundary]', {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString()
      })
    } else {
      // Development: detailed console logging
      // eslint-disable-next-line no-console
      console.error('[Error Boundary - Development]', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full border-2 border-red-500/30 mb-8">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Something went wrong!
          </h1>
          <p className="text-xl text-gray-300">
            We encountered an unexpected error while processing your request.
          </p>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
              <p className="text-sm text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-300 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 border border-slate-700"
          >
            Return Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-gray-400 text-sm">
            If this problem persists, please{' '}
            <a
              href="#contact"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              contact support
            </a>
            {error.digest && (
              <span className="text-gray-500">
                {' '}
                and include Error ID: {error.digest}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}