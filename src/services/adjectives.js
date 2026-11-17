/**
 * Read access to the adjective lexicon (src/data/lexicon/adjectives.json) and the concord rule.
 *
 *   getAdjectives({ kind: 'invariable' })   → [{ id, word: 'De', meaning: { es: 'Derecho, recto' }, … }]
 *   getAdjective('bobe')                    → { id: 'bobe', word: 'bobe', stem: '-be', … }
 *   inflect(bobe, 1, 'singular')            → 'ebe'     (class prefix + stem)
 *   inflect(buamu, 2, 'plural')             → 'maiyamu' (irregular: from the entry's "forms")
 *
 * The rule (book chapter 3, AGENTS.md → Chapter 3 Variable Adjectives): a variable adjective
 * takes the concord prefix of the noun's class and number, then its stem. Entries only list
 * `forms` when the book's form doesn't follow that rule (būamu → eyamu, maiyamu…).
 */
import adjectives from '@/data/lexicon/adjectives.json'
import { CONCORD_PREFIXES, inflect } from '@/utils/concord'

export { CONCORD_PREFIXES, inflect }

const ALL = Object.entries(adjectives.entries).map(([id, entry]) => ({ id, ...entry }))

export function getAdjectives({ kind } = {}) {
  return ALL.filter((entry) => kind === undefined || entry.kind === kind)
}

export function getAdjective(id) {
  return ALL.find((entry) => entry.id === id) || null
}
