// Client components get their (plain-text) message namespace as a prop from a server
// component instead of through NextIntlClientProvider + useTranslations, so the ICU
// message runtime is not shipped to the browser. Only plain strings and arrays are
// supported here; rich text and ICU arguments must be formatted on the server.

export type MessageTree = { [key: string]: string | string[] | MessageTree }

export interface PlainTranslator {
  (key: string): string
  raw: (key: string) => unknown
}

export function createTranslator(messages: MessageTree, namespace: string): PlainTranslator {
  const raw = (key: string): unknown =>
    key.split('.').reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      messages
    )
  const t = (key: string): string => {
    const value = raw(key)
    return typeof value === 'string' ? value : `${namespace}.${key}`
  }
  return Object.assign(t, { raw })
}
