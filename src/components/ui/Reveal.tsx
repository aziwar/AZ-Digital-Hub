'use client'

import React, { createContext, useContext } from 'react'

import { useScrollObserver } from '@/hooks/useScrollObserver'

// Scroll-reveal wrappers: the only interactive part of otherwise server-rendered sections.
// Reveal adds `is-visible` next to `revealClass` once it scrolls into view; RevealWithParent
// follows the nearest enclosing Reveal instead of observing itself.

const VisibleContext = createContext(false)

interface RevealProps {
  as?: 'div' | 'section'
  id?: string
  className: string
  revealClass: string
  threshold: number
  children: React.ReactNode
}

const withReveal = (className: string, revealClass: string, visible: boolean) =>
  `${className} ${visible ? `${revealClass} is-visible` : revealClass}`

export function Reveal({ as = 'div', id, className, revealClass, threshold, children }: RevealProps) {
  const { elementRef, isVisible } = useScrollObserver({ threshold })

  return (
    <VisibleContext value={isVisible}>
      {React.createElement(
        as,
        { id, ref: elementRef, className: withReveal(className, revealClass, isVisible) },
        children
      )}
    </VisibleContext>
  )
}

export function RevealWithParent({
  className,
  revealClass,
  children,
}: Pick<RevealProps, 'className' | 'revealClass' | 'children'>) {
  const isVisible = useContext(VisibleContext)
  return <div className={withReveal(className, revealClass, isVisible)}>{children}</div>
}
