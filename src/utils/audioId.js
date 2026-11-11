/**
 * THE rule that turns a Benga word into its "word key".
 *
 * The same key is used for:
 *   - the audio file name on Cloudinary:  <key>.mp3
 *   - the entry in the word registry:     src/data/lexicon/word-registry.json
 *
 * Rule (see AGENTS.md → "Audio ID Convention"):
 *   1. lower-case everything
 *   2. plain letters a-z and digits stay as they are
 *   3. an accented letter becomes  _ + plain letter + _      (â → _a_, ū → _u_)
 *      two accented letters in a row share one underscore     (ūē → _u_e_)
 *   4. several words (or a hyphenated form) are joined with "-"
 *   5. anything else (punctuation, apostrophes, brackets) is dropped
 *
 * Examples:
 *   toAudioId('Whâki')      → 'wh_a_ki'
 *   toAudioId('Mūēngi')     → 'm_u_e_ngi'
 *   toAudioId('Pēki Pēki')  → 'p_e_ki-p_e_ki'
 *   toAudioId('Ekâi ebe')   → 'ek_a_i-ebe'
 *
 * This file must stay free of imports: the Node scripts in /scripts use it too,
 * so the website and the scripts can never disagree about a key.
 */

const PLAIN_CHARACTER = /^[a-z0-9]$/
const COMBINING_ACCENTS = /[̀-ͯ]/g
const WORD_SEPARATORS = /[\s‐-―-]+/ // spaces and any kind of hyphen/dash

/**
 * Converts ONE word (no spaces) to its key part.
 * @param {string} word
 * @returns {string}
 */
function wordToKey(word) {
  let key = ''
  for (const character of word.toLowerCase().normalize('NFC')) {
    if (PLAIN_CHARACTER.test(character)) {
      key += character
      continue
    }
    const plain = character.normalize('NFD').replace(COMBINING_ACCENTS, '')
    if (PLAIN_CHARACTER.test(plain)) {
      key += `_${plain}_`
    }
    // Any other character (.,;:?!'"()…) is simply left out.
  }
  return key.replace(/_{2,}/g, '_')
}

/**
 * Converts a Benga word or phrase to its word key (audio id).
 * @param {string} text - e.g. 'Mūēngi' or 'Ekâi ebe'
 * @returns {string|null} the key, or null when the text has no letters at all
 */
export function toAudioId(text) {
  if (text === null || text === undefined) return null
  const key = String(text).trim().split(WORD_SEPARATORS).map(wordToKey).filter(Boolean).join('-')
  return key || null
}
