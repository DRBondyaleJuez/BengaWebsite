/**
 * Small rules of the word form of /admin/living-dictionary (tasks L4.x of docs/LD-ROADMAP.md).
 * Pure functions, tested in scripts/tests/dictionaryForm.test.mjs.
 */
import { plain, editDistance } from './dictionaryFilters.js'

/** The seven Benga noun classes of the book (chapter 2). Any other value is a free "otra" text. */
export const NOUN_CLASSES = ['1', '2', '3', '4', '5', '6', '7']

/** 'select' value for a stored noun class: '' (none), '1'…'7' or 'otra'. */
export function nounClassChoice(value) {
  if (!value) return ''
  return NOUN_CLASSES.includes(String(value)) ? String(value) : 'otra'
}

/** A new, empty meaning. `id` is any uuid v4 (the server never needs to derive it). */
export function emptySense(id) {
  return {
    id,
    glosses: null,
    partsOfSpeech: [],
    semanticDomains: [],
    nounClass: null,
    pluralForm: null,
    sentenceIds: []
  }
}

/**
 * Entries that look like the word being typed: same letters ignoring accents and case
 * (`exact`), or one letter apart for words of 4+ letters. An entry with the same homograph
 * number is a real duplicate (the server refuses it), others are only "the same spelling".
 * @param {object[]} entries workspace entries
 * @param {string} lexeme
 * @param {string|null} homograph
 * @param {string|null} exceptId the entry being edited, if any
 * @returns {{ entry: object, exact: boolean, duplicate: boolean }[]}
 */
export function findSimilar(entries, lexeme, homograph = null, exceptId = null) {
  const word = plain(lexeme)
  if (!word) return []
  const found = []
  for (const entry of entries) {
    if (entry.id === exceptId) continue
    const other = plain(entry.lexeme)
    const exact = other === word
    if (!exact && !(word.length >= 4 && editDistance(other, word, 1) <= 1)) continue
    found.push({
      entry,
      exact,
      duplicate: exact && String(entry.homograph || '1') === String(homograph || '1')
    })
  }
  return found.sort((a, b) => Number(b.exact) - Number(a.exact))
}

/** Inserts `text` into `value` replacing the selection; returns the new value and caret. */
export function insertAt(value, start, end, text) {
  const from = Math.min(start ?? value.length, end ?? value.length)
  const to = Math.max(start ?? value.length, end ?? value.length)
  return { value: value.slice(0, from) + text + value.slice(to), caret: from + text.length }
}
