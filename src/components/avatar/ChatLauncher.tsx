'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { BUBBLE_MS, CHAT_URL, type LauncherCopy } from '@/lib/chat-launcher'
import { imageConfig } from '@/lib/images.config'

/**
 * Floating chat launcher: Ahmed's round photo with a two-line bubble. The bubble shows for
 * BUBBLE_MS after load, then collapses to the photo; it also collapses on the first scroll.
 * One link to the chat (new tab). Standard floating-button placement: fixed at the bottom right
 * with one bottom offset (16 px + the safe area on phones, 24 px on desktop), so it sits below the
 * contact buttons on the page and not on top of them.
 * Strings come from the server as props (client components load no translations).
 */
export default function ChatLauncher({ copy }: { copy: LauncherCopy }) {
  const [bubble, setBubble] = useState(true)

  useEffect(() => {
    const collapse = () => setBubble(false)
    const timer = window.setTimeout(collapse, BUBBLE_MS)
    window.addEventListener('scroll', collapse, { passive: true, once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', collapse)
    }
  }, [])

  return (
    <a
      href={CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.aria}
      className="fixed right-5 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] sm:bottom-6 z-40 block h-16 w-16 rounded-full bg-linear-to-br/srgb from-purple-700 to-cyan-700 p-[3px] shadow-[0_10px_30px_rgba(126,34,206,0.45),0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-enhanced"
    >
      <span
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
  )
}
