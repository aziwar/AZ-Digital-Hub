import { notFound } from 'next/navigation'

// Route unknown paths under a locale to the localized [locale]/not-found.tsx
export default function CatchAllPage() {
  notFound()
}
