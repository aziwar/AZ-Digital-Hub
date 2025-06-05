import { paletteVars } from '../lib/utils/theme'

test('paletteVars maps palette to CSS variables', () => {
  const vars = paletteVars({ primary: '#000', accent: '#111', neutral: '#222' })
  expect(vars['--primary']).toBe('#000')
  expect(vars['--accent']).toBe('#111')
  expect(vars['--neutral']).toBe('#222')
})
