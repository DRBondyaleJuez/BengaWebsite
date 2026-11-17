/**
 * The concord rule of variable adjectives (book chapter 3; AGENTS.md → Chapter 3 Variable
 * Adjectives). Pure functions, shared by the site and tested in scripts/tests/concord.test.mjs.
 *
 *   inflect({ word: 'bobe', stem: '-be' }, 1, 'singular')          → 'ebe'
 *   inflect({ word: 'būamu', forms: { 2: { plural: 'maiyamu' } } }, 2, 'plural') → 'maiyamu'
 */
/** Concord prefixes of variable adjectives, per noun class: { 1: { singular: 'e', plural: 'be' }, … } */
export const CONCORD_PREFIXES = {
  1: { singular: 'e', plural: 'be' },
  2: { singular: 'i', plural: 'ma' },
  3: { singular: 'u', plural: 'me' },
  4: { singular: 'bo', plural: 'me' },
  5: { singular: 'u', plural: 'ba' },
  6: { singular: 'vi', plural: 'lo' },
  7: { singular: 'e', plural: 'i' }
}

/** The form of a variable adjective for a noun class (1-7) and number ('singular' | 'plural'). */
export function inflect(adjective, nounClass, number) {
  const explicit = adjective.forms && adjective.forms[nounClass]
  if (explicit && explicit[number]) return explicit[number]
  if (!adjective.stem) return adjective.word
  return CONCORD_PREFIXES[nounClass][number] + adjective.stem.replace(/^-/, '')
}
