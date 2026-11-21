/**
 * Everything that connects a Benga word to the outside world, in one place.
 *
 *   word ("Enâ") ──toAudioId──► key ("en_a_") ──► word registry entry
 *                                                   ├─ livingDictionaryId → dictionary link
 *                                                   └─ audio: "recorded"  → Cloudinary .mp3
 *
 * Pages and components only ever pass the WORD; they never build links themselves.
 * To change a link, edit src/data/lexicon/word-registry.json (or use /admin/palabras),
 * not the pages. Guide: docs/WORD-REGISTRY.md
 *
 * The rules themselves (how a URL is built) are in src/utils/linkRules.js and are tested there;
 * this file only connects them to the registry and to the addresses in src/config/external.js.
 */
import registry from '@/data/lexicon/word-registry.json'
import { toAudioId } from '@/utils/audioId'
import { audioUrlFor, dictionaryUrlFor } from '@/utils/linkRules'
import {
  CLOUDINARY_BASE,
  LIVING_DICTIONARY_ENTRY,
  LIVING_DICTIONARY_SEARCH
} from '@/config/external'

/**
 * Finds a word's key and its registry entry.
 * @param {string} word - e.g. 'Enâ'
 * @returns {{ key: string|null, entry: object|null }} entry is null for words not in the registry
 */
export function getWordEntry(word) {
  const key = toAudioId(word)
  return { key, entry: (key && registry.words[key]) || null }
}

/**
 * Pronunciation file of a word, or null when no recording exists yet.
 * Only words marked `"audio": "recorded"` in the registry get a URL, so the site
 * never shows a play button that leads to a missing file.
 * @param {string} word
 * @returns {string|null}
 */
export function getAudioUrl(word) {
  const { key, entry } = getWordEntry(word)
  return audioUrlFor(key, entry, CLOUDINARY_BASE)
}

/**
 * Living Dictionary link for a word.
 * With a known `livingDictionaryId` it opens the exact entry; otherwise it opens
 * the dictionary's search with the word typed in.
 * @param {string} word
 * @returns {string}
 */
export function getDictionaryUrl(word) {
  const { entry } = getWordEntry(word)
  return dictionaryUrlFor(word, entry, {
    entryBase: LIVING_DICTIONARY_ENTRY,
    searchBase: LIVING_DICTIONARY_SEARCH
  })
}
