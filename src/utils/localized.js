/**
 * Picks the right language from a translated text.
 *
 * Content files store visitor-facing texts as  { "es": "…", "en": "…", "fr": "…" }
 * (see docs/CONTENT-GUIDE.md). This returns the text in the visitor's language and falls
 * back to Spanish when that translation doesn't exist yet.
 *
 *   localized({ es: 'Sombrero', en: 'Hat' }, 'en')  → 'Hat'
 *   localized({ es: 'Sombrero' }, 'fr')             → 'Sombrero'   (no French yet)
 *   localized('Epokolo', 'en')                      → 'Epokolo'    (plain strings pass through)
 *   localized(null, 'es')                           → ''
 *
 * In components use the global shortcut `$localized(text)`, which already knows the current
 * language (set up in src/main.js). This file has no imports so Node scripts can use it too.
 *
 * @param {object|string|null|undefined} text - translated text, or a plain string
 * @param {string} locale - wanted language, e.g. 'en'
 * @param {string} [fallbackLocale='es'] - language used when `locale` is missing
 * @returns {string}
 */
export function localized(text, locale, fallbackLocale = 'es') {
  if (text === null || text === undefined) return ''
  if (typeof text !== 'object') return String(text)
  return text[locale] || text[fallbackLocale] || ''
}

/** True for a translated text object: { es: '…' } plus optional en / fr, nothing else. */
function isTranslatedText(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.es === 'string' &&
    Object.keys(value).every((key) => ['es', 'en', 'fr'].includes(key))
  )
}

/**
 * Same as `localized`, for a whole data structure: every translated text inside it becomes the
 * string of the wanted language; everything else (Benga words, numbers…) is copied unchanged.
 * Pages whose templates read plain strings use it on their data file:
 *
 *   localizeDeep({ title: { es: 'Adjetivos', en: 'Adjectives' }, word: 'bobe' }, 'en')
 *   → { title: 'Adjectives', word: 'bobe' }
 */
export function localizeDeep(value, locale, fallbackLocale = 'es') {
  if (isTranslatedText(value)) return localized(value, locale, fallbackLocale)
  if (Array.isArray(value)) return value.map((item) => localizeDeep(item, locale, fallbackLocale))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeDeep(item, locale, fallbackLocale)])
    )
  }
  return value
}
