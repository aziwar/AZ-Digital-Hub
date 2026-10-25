import { isAvatarEnabled } from '@/lib/avatar'

/**
 * Mount point for the talking avatar widget. Renders nothing while the feature flag is off,
 * so visitors see no change and no extra bytes ship. When the widget is built it mounts here
 * as a click-to-start client component (nothing loads before the visitor opens it).
 */
export default function TalkingAvatarSlot() {
  if (!isAvatarEnabled()) return null
  return <div id="talking-avatar-slot" data-avatar-slot="" />
}
