/**
 * Which recordings a «play all» button plays: the URL of each word that HAS a recording,
 * in order, each file once. Pure (tests: scripts/tests/playQueue.test.mjs).
 *
 *   playableUrls(['Bova', 'Mova', 'Bova'], (w) => (w === 'Mova' ? null : `x/${w}.mp3`))
 *     → ['x/Bova.mp3']
 *
 * @param {string[]} words
 * @param {(word: string) => string|null} urlOf - src/services/wordLinks.js getAudioUrl
 * @returns {string[]}
 */
export function playableUrls(words, urlOf) {
  const urls = []
  for (const word of words) {
    const url = word ? urlOf(word) : null
    if (url && !urls.includes(url)) urls.push(url)
  }
  return urls
}
