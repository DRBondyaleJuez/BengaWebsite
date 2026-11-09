import { LIVING_DICTIONARY_SEARCH } from '@/config/external'

/**
 * Builds the Living Dictionary link for a Benga word.
 *
 * The dictionary has no "one page per word" address we can predict, so the
 * link opens its search with the word already typed in. The site expects the
 * search as a small JSON object in the `q` parameter:
 *
 *   getDictionaryUrl('Epokolo')
 *   // → https://livingdictionaries.app/benga/entries?q=%7B%22query%22%3A%22epokolo%22%7D
 *   //   (decoded: ...entries?q={"query":"epokolo"})
 *
 * TODO(task 2.2): add unit tests for this helper.
 *
 * @param {string} word - Benga word as written on the page (any case).
 * @returns {string} Full URL to open in a new tab.
 */
export function getDictionaryUrl(word) {
  const query = JSON.stringify({ query: String(word).toLowerCase() })
  return `${LIVING_DICTIONARY_SEARCH}?q=${encodeURIComponent(query)}`
}
