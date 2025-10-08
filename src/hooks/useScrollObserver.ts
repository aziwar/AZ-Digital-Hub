'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollObserver(options: UseScrollObserverOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentElement = elementRef.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(currentElement)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(currentElement)

    return () => {
      observer.unobserve(currentElement)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { elementRef, isVisible }
}

// Enhanced scroll observer for multiple elements
export function useMultipleScrollObserver(options: UseScrollObserverOptions = {}) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())

  const registerElement = (id: string, element: HTMLElement) => {
    elementsRef.current.set(id, element)
  }

  const unregisterElement = (id: string) => {
    elementsRef.current.delete(id)
  }

  useEffect(() => {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true
    } = options

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.scrollId
          if (!id) return

          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, id]))
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            setVisibleElements(prev => {
              const newSet = new Set(prev)
              newSet.delete(id)
              return newSet
            })
          }
        })
      },
      { threshold, rootMargin }
    )

    // Observe all registered elements
    elementsRef.current.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [options])

  return {
    registerElement,
    unregisterElement,
    isVisible: (id: string) => visibleElements.has(id)
  }
}

// Scroll progress hook
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = Math.min(scrolled / totalHeight, 1)
      setProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}