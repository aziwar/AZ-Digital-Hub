'use client'

import { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="loading-container fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="loading-logo-container mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-bold text-white">AZ</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text-container mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Ahmed Zewar
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Digital Marketing Manager & IT Consultant
          </p>
        </div>

        {/* Progress Bar */}
        <div className="loading-progress-container w-64 mx-auto">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="loading-progress-bar h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Loading... {Math.round(progress)}%
          </p>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots-container flex justify-center gap-2 mt-8">
          <div className="loading-dot-1 w-3 h-3 bg-primary rounded-full" />
          <div className="loading-dot-2 w-3 h-3 bg-primary rounded-full" />
          <div className="loading-dot-3 w-3 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
