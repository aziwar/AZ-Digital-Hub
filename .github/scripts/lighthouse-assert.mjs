#!/usr/bin/env node
// Usage: node .github/scripts/lighthouse-assert.mjs <report.json>...
// Fails (exit 1) if performance < 85 or accessibility / best-practices / seo < 90.
// Writes a Markdown summary to $LH_SUMMARY (default lighthouse-summary.md).
import { readFileSync, writeFileSync } from 'node:fs'

const MIN = { performance: 85, accessibility: 90, 'best-practices': 90, seo: 90 }
const files = process.argv.slice(2)
if (!files.length) {
  console.error('usage: lighthouse-assert.mjs <report.json>...')
  process.exit(2)
}

const rows = []
const failures = []
for (const file of files) {
  const lhr = JSON.parse(readFileSync(file, 'utf8'))
  const url = lhr.finalDisplayedUrl || lhr.finalUrl || lhr.requestedUrl
  const cells = Object.entries(MIN).map(([id, min]) => {
    const raw = lhr.categories?.[id]?.score
    const score = typeof raw === 'number' ? Math.round(raw * 100) : null
    const pass = score !== null && score >= min
    if (!pass) failures.push(`${new URL(url).pathname} ${id} ${score ?? 'n/a'} < ${min}`)
    return `${pass ? '' : '**'}${score ?? 'n/a'}${pass ? '' : '**'}`
  })
  rows.push(`| ${url} | ${cells.join(' | ')} |`)
}

const summary = [
  `| URL | ${Object.keys(MIN).join(' | ')} |`,
  `|---|${Object.keys(MIN).map(() => '---').join('|')}|`,
  ...rows,
  '',
  `Thresholds: ${Object.entries(MIN).map(([k, v]) => `${k} >= ${v}`).join(', ')} (mobile)`,
  ...(failures.length ? ['', 'Below threshold:', ...failures.map((f) => `- ${f}`)] : [])
].join('\n')

writeFileSync(process.env.LH_SUMMARY || 'lighthouse-summary.md', summary + '\n')
console.log(summary)
process.exit(failures.length ? 1 : 0)
