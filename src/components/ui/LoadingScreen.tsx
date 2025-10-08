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
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from { 
            transform: scale(0);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes dotPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        .loading-container {
          animation: fadeIn 0.5s ease-out;
        }
        
        .logo-container {
          animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both;
        }
        
        .text-container {
          animation: slideUp 0.6s ease-out 0.5s both;
        }
        
        .progress-container {
          animation: slideUp 0.6s ease-out 0.7s both;
        }
        
        .dots-container {
          animation: slideUp 0.6s ease-out 1s both;
        }
        
        .progress-bar {
          transition: width 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .dot-1 {
          animation: dotPulse 1.5s infinite;
        }
        
        .dot-2 {
          animation: dotPulse 1.5s infinite 0.2s;
        }
        
        .dot-3 {
          animation: dotPulse 1.5s infinite 0.4s;
        }
      `}</style>
      
      <div className="loading-container fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="logo-container mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold text-white">AZ</span>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-container mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Ahmed Zewar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Digital Marketing Manager & IT Consultant
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-container w-64 mx-auto">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="progress-bar h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Loading... {Math.round(progress)}%
            </p>
          </div>

          {/* Animated Dots */}
          <div className="dots-container flex justify-center gap-2 mt-8">
            <div className="dot-1 w-3 h-3 bg-primary rounded-full" />
            <div className="dot-2 w-3 h-3 bg-primary rounded-full" />
            <div className="dot-3 w-3 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadingScreen
