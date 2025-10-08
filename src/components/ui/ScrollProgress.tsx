'use client'

import React from 'react'

import { useScrollProgress } from '@/hooks/useScrollObserver'

export function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div className="section-progress">
      <div 
        className="section-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

export default ScrollProgress