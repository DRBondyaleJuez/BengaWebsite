/**
 * npm run i18n:report            → how much of the site is translated into English and French
 * npm run i18n:report -- --all   → also list every missing text (normally the first 5 per file)
 * npm run i18n:report -- --strict → exit with an error if anything is missing (for CI)
 *
 * Reads:
 *   src/locales/es.json, en.json, fr.json      interface and page texts (same keys in each)
 *   src/data/**\/*.json (not schemas)          content texts { "es": …, "en": …, "fr": … }
 * Checks are in scripts/lib/i18n-report.mjs. Guide: docs/TRANSLATIONS.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/collect-words.mjs'
import { compareLocale, dataCoverage, percent } from './lib/i18n-report.mjs'

const SHOW_ALL = process.argv.includes('--all')
const STRICT = process.argv.includes('--strict')
const LIMIT = SHOW_ALL ? Infinity : 5
const LANGUAGES = { en: 'English', fr: 'Français' }

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const relative = (file) => path.relative(ROOT, file).replace(/\\/g, '/')
const list = (items, indent = '      ') => {
  for (const item of items.slice(0, LIMIT)) console.log(`${indent}${item}`)
  if (items.length > LIMIT) console.log(`${indent}… and ${items.length - LIMIT} more (--all)`)
}

function dataFiles(dir) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'schemas') found.push(...dataFiles(full))
    } else if (entry.name.endsWith('.json')) found.push(full)
  }
  return found
}

let problems = 0

// ── 1. Interface and page texts ────────────────────────────────────────────────
const localeDir = path.join(ROOT, 'src/locales')
const es = readJson(path.join(localeDir, 'es.json'))
console.log('\n1. Interface and page texts (src/locales)\n')
for (const [language, name] of Object.entries(LANGUAGES)) {
  const result = compareLocale(es, readJson(path.join(localeDir, `${language}.json`)))
  console.log(
    `  ${name} (${language}.json): ${result.translated} of ${result.total} texts — ` +
      percent(result.translated, result.total)
  )
  const groups = [
    ['missing (the site shows the Spanish text)', result.missing],
    ['empty', result.empty],
    ['different {parameters} than Spanish', result.params],
    ['not in es.json (unused, can be deleted)', result.extra]
  ]
  for (const [label, keys] of groups) {
    if (!keys.length) continue
    console.log(`    ${keys.length} ${label}:`)
    list(keys)
    problems += keys.length
  }
}

// ── 2. Content texts in the data files ─────────────────────────────────────────
console.log('\n2. Content texts { es, en, fr } in src/data\n')
const totals = { total: 0, en: 0, fr: 0 }
const rows = []
for (const file of dataFiles(path.join(ROOT, 'src/data'))) {
  const result = dataCoverage(readJson(file))
  if (!result.total) continue
  totals.total += result.total
  totals.en += result.en
  totals.fr += result.fr
  rows.push([relative(file), result])
}
const width = Math.max(...rows.map(([file]) => file.length))
console.log(`  ${'file'.padEnd(width)}  texts  English  Français`)
for (const [file, result] of rows) {
  console.log(
    `  ${file.padEnd(width)}  ${String(result.total).padStart(5)}  ${percent(result.en, result.total).padStart(7)}  ${percent(result.fr, result.total).padStart(8)}`
  )
}
console.log(
  `  ${'TOTAL'.padEnd(width)}  ${String(totals.total).padStart(5)}  ${percent(totals.en, totals.total).padStart(7)}  ${percent(totals.fr, totals.total).padStart(8)}`
)
for (const [file, result] of rows) {
  for (const language of Object.keys(LANGUAGES)) {
    const missing = result.missing[language]
    if (!missing.length) continue
    problems += missing.length
    if (SHOW_ALL) {
      console.log(`\n  ${file}: ${missing.length} texts without "${language}"`)
      list(missing, '    ')
    }
  }
}
if (!SHOW_ALL && problems)
  console.log('\n  (npm run i18n:report -- --all lists every missing text)')

console.log(
  problems ? `\n${problems} text(s) still to translate.` : '\n✓ Everything is translated.'
)
if (STRICT && problems) process.exit(1)
