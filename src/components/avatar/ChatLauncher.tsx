'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { BUBBLE_MS, CHAT_URL, type LauncherCopy } from '@/lib/chat-launcher'
import { imageConfig } from '@/lib/images.config'

// Primary actions the launcher must never cover: the "request a call" jump link and every WhatsApp button.
const ACTIONS = 'a[href="#contact"], a[href^="https://wa.me"]'
const GAP = 12 // px kept between the launcher (photo + bubble) and an action
const TOP_LIMIT = 72 // px: never lift the launcher into the fixed header

/**
 * At the top of the page the hero button sits near the bottom of tall phones, right where the
 * launcher floats. Returns how many px to lift the launcher (from its CSS position) so that the
 * photo and the visible bubble sit above every action they would otherwise cover; 0 = no overlap.
 */
function liftAboveActions(boxes: DOMRect[]): number {
  const vh = window.innerHeight
  const actions = Array.from(document.querySelectorAll(ACTIONS))
    .map((a) => a.getBoundingClientRect())
    .filter((a) => a.width > 0 && a.bottom > 0 && a.top < vh)
    .sort((a, b) => b.top - a.top) // lowest first
  let top = Math.min(...boxes.map((b) => b.top))
  let bottom = Math.max(...boxes.map((b) => b.bottom))
  const left = Math.min(...boxes.map((b) => b.left))
  const right = Math.max(...boxes.map((b) => b.right))
  let lift = 0
  for (const a of actions) {
    const sideBySide = a.right <= left || a.left >= right
    if (sideBySide || a.bottom <= top - GAP || a.top >= bottom + GAP) continue
    const up = bottom - (a.top - GAP)
    lift += up
    top -= up
    bottom -= up
  }
  return top < TOP_LIMIT ? 0 : lift
}

/**
 * Floating chat launcher: Ahmed's round photo with a two-line bubble. The bubble shows for
 * BUBBLE_MS after load, then collapses to the photo; it also collapses on the first scroll.
 * One link to the chat (new tab). The photo keeps a bottom offset (more on phones) to stay clear
 * of the contact buttons, and at the top of the page it lifts above the hero button when needed.
 * Strings come from the server as props (client components load no translations).
 */
export default function ChatLauncher({ copy }: { copy: LauncherCopy }) {
  const [bubble, setBubble] = useState(true)
  const [lift, setLift] = useState(0)
  const [ready, setReady] = useState(false)
  const pos = useRef<HTMLDivElement>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const bubbleEl = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const collapse = () => setBubble(false)
    const timer = window.setTimeout(collapse, BUBBLE_MS)
    window.addEventListener('scroll', collapse, { passive: true, once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', collapse)
    }
  }, [])

  useEffect(() => {
    const place = () => {
      if (pos.current && link.current) {
        // The positioner never moves, so its box is the CSS (unlifted) place of the photo. The bubble sits at a
        // fixed offset inside the link, so it is shifted by the same amount the link is currently lifted.
        const home = pos.current.getBoundingClientRect()
        const boxes = [home]
        if (bubble && bubbleEl.current) {
          const b = bubbleEl.current.getBoundingClientRect()
          const now = link.current.getBoundingClientRect()
          boxes.push(new DOMRect(b.x + home.x - now.x, b.y + home.y - now.y, b.width, b.height))
        }
        setLift(window.scrollY > 8 ? 0 : liftAboveActions(boxes))
      }
      setReady(true)
    }
    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [bubble])

  return (
    <div
      ref={pos}
      className="fixed right-5 bottom-6 max-sm:bottom-[calc(96px+env(safe-area-inset-bottom,0px))] z-40 h-16 w-16"
    >
      <a
        ref={link}
        href={CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.aria}
        style={lift ? { translate: `0 -${Math.ceil(lift)}px` } : undefined}
        className={`relative block h-full w-full rounded-full bg-linear-to-br/srgb from-purple-700 to-cyan-700 p-[3px] shadow-[0_10px_30px_rgba(126,34,206,0.45),0_2px_8px_rgba(0,0,0,0.5)] hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-enhanced ${
          ready ? 'opacity-100 transition-[scale,translate] duration-200' : 'opacity-0'
        }`}
      >
        <span
          ref={bubbleEl}
          aria-hidden="true"
          data-chat-bubble=""
          className={`pointer-events-none absolute right-[76px] bottom-2 w-max max-w-[min(260px,calc(100vw-124px))] rounded-[16px_16px_4px_16px] bg-white px-3.5 py-2.5 text-start text-sm leading-normal font-medium text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-[opacity,transform,visibility] duration-300 motion-reduce:transition-none ${
            bubble ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1.5 opacity-0'
          }`}
        >
          <b className="block text-[13px] font-bold text-purple-800">{copy.title}</b>
          <span className="block">{copy.hook}</span>
        </span>
        <Image
          src={imageConfig.profile.profileImage}
          alt=""
          width={64}
          height={64}
          sizes="64px"
          className="h-full w-full rounded-full border-2 border-slate-950 object-cover object-[50%_22%]"
        />
        <span aria-hidden="true" className="absolute right-0.5 bottom-[3px] h-3.5 w-3.5 rounded-full border-[2.5px] border-slate-950 bg-emerald-500" />
      </a>
    </div>
  )
}
