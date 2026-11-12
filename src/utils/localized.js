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
