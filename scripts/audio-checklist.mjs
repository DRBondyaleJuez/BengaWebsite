/**
 * npm run audio:checklist
 *
 * Writes docs/audio/recording-checklist.csv: every Benga word and phrase of the site with its
 * audio id (the file name to record: <audioId>.mp3), meaning, book page, where it is used and
 * whether it is already recorded. Open it in Excel / Google Sheets; words still to record come first.
 *
 * Run `npm run words:sync` first so new words are in the registry. Guide: docs/AUDIO-GUIDE.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/collect-words.mjs'
import { loadRegistry, USAGE_FILE, relative } from './lib/registry.mjs'
import { buildChecklist, toCsv } from './lib/audio-checklist.mjs'

const OUTPUT = path.join(ROOT, 'docs/audio/recording-checklist.csv')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

const lexiconDir = path.join(ROOT, 'src/data/lexicon')
const lexicons = fs
  .readdirSync(lexiconDir)
  .filter((name) => !['word-registry.json', 'word-usage.json'].includes(name))
  .map((name) => readJson(path.join(lexiconDir, name)))

const usage = fs.existsSync(USAGE_FILE) ? readJson(USAGE_FILE).words : {}
const rows = buildChecklist({ registry: loadRegistry(), usage, lexicons })

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, toCsv(rows))

const pending = rows.filter((row) => row.recorded === 'no')
const phrases = pending.filter((row) => row.type === 'phrase')
console.log(`Words and phrases: ${rows.length}`)
console.log(`Recorded:          ${rows.length - pending.length}`)
console.log(`To record:         ${pending.length} (${phrases.length} phrases)`)
console.log(`\n✓ Saved ${relative(OUTPUT)}`)
