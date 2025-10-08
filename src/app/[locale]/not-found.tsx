/**
 * 404 Not Found Page for Next.js App Router
 *
 * Handles unmatched routes and provides user-friendly 404 experience
 * Can be triggered programmatically with notFound() function
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Animation */}
        <div className="relative">
          {/* Large 404 Text */}
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 animate-pulse">
            404
          </h1>

          {/* Floating Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-32 h-32 text-purple-500/20 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <p className="text-gray-400">
            You might want to check out these pages instead:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              href="/#hero"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              About
            </Link>
            <Link
              href="/#services"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              Services
            </Link>
            <Link
              href="/#portfolio"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              Portfolio
            </Link>
            <Link
              href="/#testimonials"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              Testimonials
            </Link>
            <Link
              href="/#contact"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-purple-500"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return to Homepage
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-gray-400 text-sm">
            Looking for something specific?{' '}
            <Link
              href="/#contact"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Contact us
            </Link>{' '}
            and we&apos;ll help you find it.
          </p>
        </div>
      </div>
    </div>
  )
}
