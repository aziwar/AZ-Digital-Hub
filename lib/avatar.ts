// Talking avatar (ElevenLabs agent) feature flag and config. Off unless NEXT_PUBLIC_AVATAR_ENABLED is "true".
// See docs/plans/2026-10-25-talking-avatar.md. Keys live in Infisical/Vercel env, never in the repo.

/** Build-time flag (inlined into the static pages), so turning it on needs a redeploy */
export function isAvatarEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AVATAR_ENABLED === 'true'
}

/** Server-only: true when the agent id and API key needed for a signed session URL are set */
export function isAvatarConfigured(): boolean {
  return Boolean(process.env.ELEVENLABS_AGENT_ID && process.env.ELEVENLABS_API_KEY)
}
