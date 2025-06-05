export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <a href="/" className="text-blue-500 underline">Go Home</a>
    </div>
  )
}
