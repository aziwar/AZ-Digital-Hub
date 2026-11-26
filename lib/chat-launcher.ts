// Chat launcher (variant A): Ahmed's round photo at the bottom right with a two-line bubble.
// The owner picks the bubble text: change LAUNCHER_COPY below (Arabic and English) to change it.
// Same wording as the chat page itself (voice-web in aziwar/zewar-brain-v2).

/** Where the launcher sends the visitor. */
export const CHAT_URL = 'https://chat.zewar.xyz'

/** Bubble milliseconds on screen before it collapses to the photo (it also collapses on the first scroll). */
export const BUBBLE_MS = 6000

export interface LauncherCopy {
  /** Bubble line 1 (bold) */
  title: string
  /** Bubble line 2: the hook */
  hook: string
  /** Accessible name of the link */
  aria: string
}

export const LAUNCHER_COPY: Record<'ar' | 'en', LauncherCopy> = {
  ar: {
    title: 'أهلاً، أنا أحمد',
    hook: 'عندك فكرة مشروع؟ خلّينا نتكلم',
    aria: 'افتح المحادثة مع أحمد زيور',
  },
  en: {
    title: "Hi, I'm Ahmed",
    hook: "Got a project idea? Let's talk",
    aria: 'Open the chat with Ahmed Ziwar',
  },
}
