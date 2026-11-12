/**
 * The RULES for a word's audio and dictionary links, as pure functions (no files, no settings),
 * so they can be tested on their own (scripts/tests/linkRules.test.mjs).
 *
 * src/services/wordLinks.js feeds them the word registry and the addresses from
 * src/config/external.js; components use that service, never these functions directly.
 */

/**
 * Recording of a word, or null when it hasn't been recorded yet.
 *
 *   audioUrlFor('epokolo', { audio: 'recorded' }, 'https://cdn/x')               → 'https://cdn/x/epokolo.mp3'
 *   audioUrlFor('epokolo', { audio: 'recorded', audioFile: 'old' }, 'https://cdn/x') → 'https://cdn/x/old.mp3'
 *   audioUrlFor('epokolo', { audio: 'missing' }, 'https://cdn/x')                → null
 *
 * @param {string|null} key - the word key (src/utils/audioId.js)
 * @param {object|null} entry - the word's registry entry, or null if it isn't registered
 * @param {string} audioBase - folder of the recordings
 * @returns {string|null}
 */
export function audioUrlFor(key, entry, audioBase) {
  if (!key || !entry || entry.audio !== 'recorded') return null
  return `${audioBase}/${entry.audioFile || key}.mp3`
}

/**
 * Living Dictionary search page with the word typed in (the dictionary expects the search
 * as a small JSON object in the `q` parameter).
 *
 *   dictionarySearchUrl('Epokolo', 'https://ld/benga/entries')
 *     → 'https://ld/benga/entries?q=%7B%22query%22%3A%22epokolo%22%7D'   (q={"query":"epokolo"})
 *
 * @param {string} word
 * @param {string} searchBase
 * @returns {string}
 */
export function dictionarySearchUrl(word, searchBase) {
  const query = JSON.stringify({ query: String(word).toLowerCase() })
  return `${searchBase}?q=${encodeURIComponent(query)}`
}

/**
 * Living Dictionary link: the exact entry when its id is known, otherwise the search.
 *
 * @param {string} word
 * @param {object|null} entry - registry entry (may have `livingDictionaryId`)
 * @param {{ entryBase: string, searchBase: string }} bases
 * @returns {string}
 */
export function dictionaryUrlFor(word, entry, { entryBase, searchBase }) {
  if (entry && entry.livingDictionaryId) return `${entryBase}/${entry.livingDictionaryId}`
  return dictionarySearchUrl(word, searchBase)
}
