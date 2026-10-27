#!/usr/bin/env node
// Usage: node .github/scripts/lighthouse-median.mjs <prefix> <runs>
// Picks the run with the median performance score among <prefix>-1..N.report.json and copies it
// (JSON and HTML) to <prefix>.report.json / <prefix>.report.html for lighthouse-assert.mjs.
// Missing runs are skipped; if none exist, nothing is written and the assert step reports it.
import { copyFileSync, existsSync, readFileSync } from 'node:fs'

const [prefix, count = '3'] = process.argv.slice(2)
const runs = []
for (let i = 1; i <= Number(count); i++) {
  const file = `${prefix}-${i}.report.json`
  if (!existsSync(file)) continue
  const score = JSON.parse(readFileSync(file, 'utf8')).categories?.performance?.score
  if (typeof score === 'number') runs.push({ i, score })
}
if (!runs.length) process.exit(0)

runs.sort((a, b) => a.score - b.score)
const pick = runs[Math.floor((runs.length - 1) / 2)]
copyFileSync(`${prefix}-${pick.i}.report.json`, `${prefix}.report.json`)
if (existsSync(`${prefix}-${pick.i}.report.html`)) copyFileSync(`${prefix}-${pick.i}.report.html`, `${prefix}.report.html`)
process.stdout.write(`${prefix}: performance ${runs.map((r) => Math.round(r.score * 100)).join('/')} -> median run ${pick.i}\n`)
