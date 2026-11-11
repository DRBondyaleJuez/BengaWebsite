/**
 * npm run words:sync          → update the word registry and print a report
 * npm run words:sync -- --check   → only report; exit with an error if words are missing
 *
 * What it does, step by step:
 *   1. Finds every Benga word the site shows (scripts/lib/collect-words.mjs).
 *   2. Turns each word into its key with the shared rule (src/utils/audioId.js).
 *   3. Adds any NEW key to src/data/lexicon/word-registry.json with default values.
 *      Existing entries are never changed: your edits (dictionary ids, audio, notes) are safe.
 *      Entries no longer used by any page are kept and listed in the report.
 *   4. Rewrites src/data/lexicon/word-usage.json (where each word appears).
 *   5. Prints things a human should look at (spelling variants, orthography, old audio ids).
 */
import { collectWords } from './lib/collect-words.mjs'
import {
  loadRegistry,
  saveRegistry,
  saveUsage,
  normaliseEntry,
  relative,
  REGISTRY_FILE
} from './lib/registry.mjs'
import { toAudioId } from '../src/utils/audioId.js'

const CHECK_ONLY = process.argv.includes('--check')

/** Letters that are not used in Benga spelling (AGENTS.md → Benga Orthography Rules). */
const NON_BENGA_LETTERS = /[cqrxzñ]/i
/** Spanish-style accents that should be â ē ū in Benga words. */
const SPANISH_ACCENTS = /[áéíóú]/i

function mostCommon(list) {
  const counts = new Map()
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function printList(title, lines, limit = 40) {
  if (!lines.length) return
  console.log(`\n${title} (${lines.length})`)
  lines.slice(0, limit).forEach((line) => console.log(`  - ${line}`))
  if (lines.length > limit) console.log(`  … and ${lines.length - limit} more`)
}

async function main() {
  const uses = collectWords()

  // Group every use of a word by its key.
  const usage = {}
  const oldAudioIds = []
  for (const use of uses) {
    const key = toAudioId(use.word)
    if (!key) continue
    usage[key] = usage[key] || { spellings: [], usedIn: [] }
    usage[key].spellings.push(use.word)
    if (!usage[key].usedIn.includes(use.file)) usage[key].usedIn.push(use.file)
    if (use.storedAudioId !== key) {
      oldAudioIds.push(
        `${use.word}: typed "${use.storedAudioId}", rule gives "${key}" (${use.file} → ${use.path})`
      )
    }
  }

  // Add new words, keep everything that already exists.
  const registry = loadRegistry()
  const added = []
  for (const [key, info] of Object.entries(usage)) {
    if (!registry[key]) {
      registry[key] = normaliseEntry({ word: mostCommon(info.spellings) })
      added.push(`${registry[key].word}  →  ${key}`)
    }
  }
  const unused = Object.keys(registry).filter((key) => !usage[key])

  // Things worth a human look.
  const variants = []
  const orthography = []
  for (const [key, info] of Object.entries(usage)) {
    const distinct = [...new Set(info.spellings.map((word) => word.normalize('NFC')))]
    const distinctIgnoringCase = [...new Set(distinct.map((word) => word.toLowerCase()))]
    if (distinctIgnoringCase.length > 1) variants.push(`${key}: ${distinct.join(' | ')}`)
    for (const word of distinct) {
      if (NON_BENGA_LETTERS.test(word))
        orthography.push(`${word}: contains c/q/r/x/z/ñ (${info.usedIn.join(', ')})`)
      if (SPANISH_ACCENTS.test(word))
        orthography.push(`${word}: Spanish accent, should be â/ē/ū? (${info.usedIn.join(', ')})`)
    }
  }

  // Store the usage as compact, readable lists.
  const usageForFile = {}
  for (const [key, info] of Object.entries(usage)) {
    usageForFile[key] = {
      spellings: [...new Set(info.spellings)],
      usedIn: info.usedIn.sort()
    }
  }

  console.log(`Word uses found on the site: ${uses.length}`)
  console.log(`Different words (keys):      ${Object.keys(usage).length}`)
  console.log(`Entries in the registry:     ${Object.keys(registry).length}`)
  printList('NEW words added to the registry', added, 20)
  printList(
    'Registry entries not used on any page (kept, check if still needed)',
    unused.map((key) => `${registry[key].word} → ${key}`)
  )
  printList('Different spellings that share one key (pick one spelling?)', variants)
  printList('Orthography warnings (AGENTS.md → Benga Orthography Rules)', orthography)
  printList(
    'Hand-typed audio ids that differ from the rule (no longer used by the site; often typos, sometimes a content doubt)',
    oldAudioIds,
    15
  )

  if (CHECK_ONLY) {
    if (added.length) {
      console.log(
        `\n✗ ${added.length} word(s) are missing from ${relative(REGISTRY_FILE)}. Run: npm run words:sync`
      )
      process.exitCode = 1
    } else {
      console.log('\n✓ The registry contains every word used on the site.')
    }
    return
  }

  await saveRegistry(registry)
  await saveUsage(usageForFile)
  console.log(`\n✓ Saved ${relative(REGISTRY_FILE)} and word-usage.json`)
}

main()
