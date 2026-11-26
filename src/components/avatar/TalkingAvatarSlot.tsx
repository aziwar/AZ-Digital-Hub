import ChatLauncher from '@/components/avatar/ChatLauncher'
import { isAvatarEnabled } from '@/lib/avatar'
import { LAUNCHER_COPY } from '@/lib/chat-launcher'

/**
 * Mount point for the talking avatar widget. Renders nothing while the feature flag is off,
 * so visitors see no change and no extra bytes ship. With the flag on it shows the chat launcher
 * (photo + bubble, a link to the chat page); nothing of the chat loads before the visitor clicks.
 */
export default function TalkingAvatarSlot({ locale }: { locale: string }) {
  if (!isAvatarEnabled()) return null
  return (
    <div id="talking-avatar-slot" data-avatar-slot="">
      <ChatLauncher copy={LAUNCHER_COPY[locale === 'ar' ? 'ar' : 'en']} />
    </div>
  )
}
