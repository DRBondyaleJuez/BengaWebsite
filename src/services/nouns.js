/**
 * Read access to the noun lexicon (src/data/lexicon/nouns.json) for pages and games.
 *
 *   getNouns()                              → every noun entry, each with its id
 *   getNouns({ nounClass: 1 })              → only class 1
 *   getNouns({ withBothForms: true })       → only nouns that have a singular AND a plural
 *
 * Each result: { id: 'epokolo', type: 'noun', nounClass: 1, singular: { word }, plural: { word },
 *               meaning: { es }, meaningPlural?, source, tags? }
 * Show meanings with $localized(entry.meaning) (see src/utils/localized.js).
 */
import nouns from '@/data/lexicon/nouns.json'

const ALL_NOUNS = Object.entries(nouns.entries).map(([id, entry]) => ({ id, ...entry }))

/** How each noun class forms its plural, as shown in the practice game (book chapter 2). */
export const PLURAL_RULES = {
  1: 'e- → be-',
  2: 'i/di- → ma-',
  3: 'u/mú- → me/mi-',
  4: 'bo/ba- → mi-',
  5: 'mo- → ba-',
  6: 'v- → l-',
  7: 'invariable (singular = plural)'
}

export function getNouns({ nounClass, withBothForms = false } = {}) {
  return ALL_NOUNS.filter(
    (entry) =>
      (nounClass === undefined || entry.nounClass === nounClass) &&
      (!withBothForms || (entry.singular && entry.plural))
  )
}
