/**
 * Loading UI for Next.js App Router
 *
 * Provides instant loading state during navigation and data fetching
 * Automatically wraps page content in React Suspense boundary
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full animate-pulse" />
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Loading...
          </h2>
          <p className="text-gray-400">
            Preparing your experience
          </p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}
