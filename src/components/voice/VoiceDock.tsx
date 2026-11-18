'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Msgs = { [k: string]: string }
type Phase = 'idle' | 'consent' | 'connecting' | 'listening' | 'error'

const PORTRAIT = '/images/ahmed-ziwar-portrait.webp'
const BUBBLE_KEY = 'voice-lab-bubble-seen'

/**
 * Test dock (ticket 9ffa67a6). One real <button>, always in the DOM. It sits over the hero portrait while
 * that is visible and moves (transform only) to the corner dock once the hero scrolls away (hysteresis 20%/40%).
 * No microphone call and no network request happen before the consent checkbox plus Start.
 */
export default function VoiceDock({ messages: m }: { messages: Msgs }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const portraitRef = useRef<HTMLElement | null>(null)
  const [docked, setDocked] = useState(false)
  const [rect, setRect] = useState<{ x: number; y: number; s: number } | null>(null)
  const [bubble, setBubble] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [agree, setAgree] = useState(false)
  const [muted, setMuted] = useState(false)
  const dockedAt = useRef(0)
  const open = phase !== 'idle'

  // Track the hero portrait position (hero state) and dock/undock with hysteresis.
  useEffect(() => {
    const img = document.querySelector<HTMLElement>(`main img[src*="ahmed-ziwar-portrait"]`)
    portraitRef.current = img
    if (!img) return
    const measure = () => {
      const r = img.getBoundingClientRect()
      setRect({ x: r.left, y: r.top, s: r.width })
    }
    const raf = requestAnimationFrame(measure)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const io = new IntersectionObserver(
      ([e]) => {
        const now = performance.now()
        if (e.intersectionRatio < 0.2) { setDocked(true); dockedAt.current = now }
        else if (e.intersectionRatio > 0.4 && now - dockedAt.current > 300) setDocked(false)
      },
      { threshold: [0, 0.2, 0.4, 1] }
    )
    io.observe(img)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); io.disconnect() }
  }, [])

  // Invitation bubble: 600 ms after dock, hides after 8 s (paused on hover/focus), once per session.
  const paused = useRef(false)
  useEffect(() => {
    if (!docked || open || sessionStorage.getItem(BUBBLE_KEY)) return
    const show = setTimeout(() => {
      setBubble(true)
      sessionStorage.setItem(BUBBLE_KEY, '1')
    }, 1050)
    return () => clearTimeout(show)
  }, [docked, open])
  useEffect(() => {
    if (!bubble) return
    let left = 8000
    const tick = setInterval(() => { if (!paused.current) left -= 250; if (left <= 0) setBubble(false) }, 250)
    return () => clearInterval(tick)
  }, [bubble])

  const close = useCallback(() => { setPhase('idle'); setAgree(false); setMuted(false); btnRef.current?.focus() }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onHide = () => { if (document.hidden) setTimeout(() => document.hidden && close(), 30000) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', close)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onHide); window.removeEventListener('pagehide', close) }
  }, [open, close])

  // Stub session: spike calls the server-side proxy (health only). No getUserMedia in this test build.
  const start = async () => {
    setPhase('connecting')
    try {
      const res = await fetch('/api/voice-lab/health', { cache: 'no-store' })
      setPhase(res.ok ? 'listening' : 'error')
    } catch { setPhase('error') }
  }

  const size = docked ? 72 : (rect?.s ?? 72)
  const x = docked ? null : rect?.x
  const y = docked ? null : rect?.y
  const style: React.CSSProperties = {
    width: size, height: size,
    backgroundImage: `url(${PORTRAIT})`, backgroundSize: 'cover', backgroundPosition: 'center 20%',
    ...(docked || !rect
      ? { insetInlineEnd: 16, insetBlockEnd: 'max(16px, env(safe-area-inset-bottom))', transform: 'none' }
      : { left: 0, top: 0, transform: `translate(${x}px, ${y}px)` })
  }
  return (
    <div data-voice-dock="" dir="auto" className="voice-dock">
      <button
        ref={btnRef}
        type="button"
        aria-label={m.label}
        aria-describedby={bubble ? 'voice-bubble' : undefined}
        aria-expanded={open}
        onClick={() => setPhase(open ? 'idle' : 'consent')}
        className="voice-btn fixed z-40 rounded-full border-[3px] border-[#7c5cc4] shadow-[0_0_0_6px_#7c5cc433,0_8px_30px_#0008] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        style={{ ...style, transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1), width 450ms cubic-bezier(0.22,1,0.36,1), height 450ms cubic-bezier(0.22,1,0.36,1)', opacity: docked || rect ? 1 : 0 }}
      />
      {open && (
        <div role="dialog" aria-modal="false" aria-labelledby="voice-title" className="fixed z-50 w-[min(92vw,340px)] rounded-2xl bg-white p-4 text-slate-900 shadow-2xl" style={{ insetInlineEnd: 16, insetBlockEnd: 100 }}>
          <h2 id="voice-title" className="mb-2 text-base font-bold">{m.panelTitle}</h2>
          <p className="mb-2 text-sm font-semibold">{m.disclosure}</p>
          {phase === 'consent' && (
            <>
              <p className="mb-3 text-sm text-slate-700">{m.consent}</p>
              <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="size-5" />{m.agree}</label>
              <button type="button" disabled={!agree} onClick={start} className="min-h-11 w-full rounded-lg bg-purple-700 px-4 text-white disabled:opacity-40">{m.start}</button>
            </>
          )}
          {phase === 'connecting' && <p role="status" className="text-sm">{m.connecting}</p>}
          {phase === 'listening' && (
            <>
              <p role="status" className="mb-3 text-sm font-semibold text-green-700">{muted ? m.muted : m.micOn}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setMuted(!muted)} className="min-h-11 flex-1 rounded-lg border border-slate-400">{m.mute}</button>
                <button type="button" onClick={close} className="min-h-11 flex-1 rounded-lg bg-slate-900 text-white">{m.end}</button>
              </div>
            </>
          )}
          {phase === 'error' && <p role="alert" className="text-sm text-red-700">{m.errConnect}</p>}
          <a href="https://wa.me/" className="mt-3 block text-sm underline">{m.whatsapp}</a>
          <button type="button" onClick={close} className="absolute top-2 min-h-8 min-w-8" style={{ insetInlineEnd: 8 }} aria-label={m.panelClose}>×</button>
        </div>
      )}
      {bubble && !open && docked && (
        <div id="voice-bubble" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)} onFocus={() => (paused.current = true)} onBlur={() => (paused.current = false)}
          className="fixed z-40 max-w-[180px] rounded-2xl bg-white p-3 text-sm text-slate-900 shadow-xl sm:max-w-[230px]" style={{ insetInlineEnd: 100, insetBlockEnd: 28 }}>
          <b className="block">{m.bubbleTitle}</b><small className="text-slate-600">{m.bubbleSub}</small>
          <button type="button" aria-label={m.bubbleClose} onClick={() => setBubble(false)} className="absolute top-0 min-h-8 min-w-8" style={{ insetInlineEnd: 0 }}>×</button>
        </div>
      )}
      <p className="fixed start-3 top-20 z-50 rounded bg-yellow-300 px-2 py-1 text-xs font-semibold text-black">{m.labBanner}</p>
    </div>
  )
}
