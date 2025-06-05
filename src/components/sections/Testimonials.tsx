'use client'
import React, { useEffect, useRef, useState } from 'react'
import data from '../../data/testimonials.json'

interface Testimonial {
  name: string
  role: string
  quote: string
}

const Testimonials: React.FC = () => {
  const testimonials = data as Testimonial[]
  const [index, setIndex] = useState(0)
  const [pause, setPause] = useState(false)
  const startX = useRef(0)

  useEffect(() => {
    if (pause) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    )
    return () => clearInterval(id)
  }, [pause, testimonials.length])

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const point = 'touches' in e ? e.touches[0]?.clientX : (e as React.MouseEvent).clientX
    startX.current = point || 0
  }

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const point =
      'changedTouches' in e ? e.changedTouches[0]?.clientX : (e as React.MouseEvent).clientX
    const diff = startX.current - (point || 0)
    if (diff > 50) setIndex((i) => (i + 1) % testimonials.length)
    if (diff < -50) setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-6xl mx-auto @container">
        <div className="text-center mb-12">
          <h2 className="text-4xl @md:text-5xl font-bold text-white mb-4">Testimonials</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from clients who have partnered with Ahmed Ziwar to elevate their digital presence.
          </p>
        </div>
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`transition-opacity duration-700 absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg ${
                i === index ? 'opacity-100 relative' : 'opacity-0'
              }`}
            >
              <p className="text-gray-300 mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <h3 className="text-lg font-semibold text-white">{t.name}</h3>
              <p className="text-sm text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
