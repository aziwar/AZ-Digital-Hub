export interface Palette {
  primary: string
  accent: string
  neutral: string
}

export function paletteVars(palette: Palette): Record<string, string> {
  return {
    '--primary': palette.primary,
    '--primary-foreground': '#ffffff',
    '--accent': palette.accent,
    '--neutral': palette.neutral,
  }
}
