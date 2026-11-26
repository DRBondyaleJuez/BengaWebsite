/**
 * Links dictionary workspace entries with the website's words (word-registry.json keys).
 * Task L1.3 of docs/LD-ROADMAP.md. Pure: takes data, returns the new links and a report;
 * scripts/ld-link.mjs reads and writes the files.
 *
 * Rules (REVIEW-LOG R-037):
 * - Same word key (toAudioId of the headword or of its plural form) → linked.
 * - Same letters but different accents → only REPORTED as a possible spelling difference.
 * - The registry's livingDictionaryId is filled only when empty and only when exactly one
 *   entry matches; an existing different id is reported, never replaced.
 */
import { toAudioId } from '../../../src/utils/audioId.js'

/** Key without accent marks: wh_a_ki → whaki (for "same word, other accents"). */
export const plainKey = (key) => key.replace(/_/g, '')

/** The single-word forms of an entry that can match a site word (headword, simple plural). */
function formsOf(entry) {
  const forms = [{ word: entry.lexeme, kind: 'lexeme' }]
  for (const sense of entry.senses) {
    const plural = sense.pluralForm
    if (plural && !/[/,:;]/.test(plural) && plural !== entry.lexeme)
      forms.push({ word: plural, kind: 'plural' })
  }
  return forms
}

/**
 * @param {Record<string, object>} entries  workspace entries (id → entry)
 * @param {Record<string, object>} registry word-registry words (key → { word, livingDictionaryId… })
 * @param {Record<string, object>} usage    word-usage words (key → { usedIn: [files] })
 */
export function linkEntries(entries, registry, usage = {}) {
  const byKey = new Map() // site key → [{ entry, kind }]
  const byPlain = new Map()
  for (const entry of Object.values(entries)) {
    for (const form of formsOf(entry)) {
      const key = toAudioId(form.word)
      if (!key) continue
      if (!byKey.has(key)) byKey.set(key, [])
      if (!byKey.get(key).some((match) => match.entry.id === entry.id))
        byKey.get(key).push({ entry, kind: form.kind })
      const plain = plainKey(key)
      if (!byPlain.has(plain)) byPlain.set(plain, [])
      byPlain.get(plain).push({ entry, key, kind: form.kind })
    }
  }

  const siteKeys = Object.fromEntries(Object.keys(entries).map((id) => [id, []]))
  const registryUpdates = {} // key → new livingDictionaryId
  const report = {
    linked: [],
    ambiguous: [],
    idConflicts: [],
    staleIds: [],
    spellingDifferences: [],
    siteOnly: [],
    dictionaryOnly: []
  }

  for (const [key, word] of Object.entries(registry)) {
    const matches = byKey.get(key) || []
    for (const match of matches) siteKeys[match.entry.id].push(key)
    const lexemeMatches = matches.filter((match) => match.kind === 'lexeme')
    const chosen = lexemeMatches.length ? lexemeMatches : matches
    const current = word.livingDictionaryId
    if (current && !entries[current]) report.staleIds.push({ key, word: word.word, id: current })

    if (chosen.length === 1) {
      const [{ entry, kind }] = chosen
      report.linked.push({ key, word: word.word, entry: entry.lexeme, kind })
      if (!current) registryUpdates[key] = entry.id
      else if (current !== entry.id && entries[current]) {
        report.idConflicts.push({
          key,
          word: word.word,
          registryEntry: entries[current].lexeme,
          match: entry.lexeme
        })
      }
    } else if (chosen.length > 1) {
      report.ambiguous.push({
        key,
        word: word.word,
        entries: chosen.map(
          ({ entry }) => entry.lexeme + (entry.homograph ? ` (${entry.homograph})` : '')
        )
      })
    } else {
      const similar = (byPlain.get(plainKey(key)) || []).filter((match) => match.key !== key)
      if (similar.length) {
        report.spellingDifferences.push({
          key,
          site: word.word,
          dictionary: [...new Set(similar.map((match) => match.entry.lexeme))]
        })
      } else if (!current) {
        report.siteOnly.push({ key, word: word.word, files: usage[key]?.usedIn || [] })
      }
    }
  }

  const linkedIds = new Set(
    Object.entries(siteKeys)
      .filter(([, keys]) => keys.length)
      .map(([id]) => id)
  )
  for (const entry of Object.values(entries)) {
    if (!linkedIds.has(entry.id)) report.dictionaryOnly.push({ id: entry.id, word: entry.lexeme })
  }
  for (const id of Object.keys(siteKeys)) siteKeys[id] = [...new Set(siteKeys[id])].sort()
  return { siteKeys, registryUpdates, report }
}

/** Groups site-only words by the data file they come from (for the report). */
export function groupByFile(items) {
  const groups = new Map()
  for (const item of items) {
    const file =
      item.files.find((name) => name.includes('lexicon/')) || item.files[0] || '(sin uso en la web)'
    if (!groups.has(file)) groups.set(file, [])
    groups.get(file).push(item.word)
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
}
