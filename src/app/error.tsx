'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-6xl font-bold">Something went wrong</h1>
      <p className="text-xl text-red-500">{error.message}</p>
      <button onClick={reset} className="text-blue-500 underline">Try Again</button>
    </div>
  )
}
