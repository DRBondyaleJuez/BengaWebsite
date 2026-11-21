/**
 * The checks of `npm run i18n:report` (translation coverage). Pure functions, tested in
 * scripts/tests/i18n-report.test.mjs; scripts/i18n-report.mjs reads the files and prints.
 *
 * Two kinds of translations (docs/TRANSLATIONS.md):
 *   1. Interface and page texts: src/locales/es.json, en.json, fr.json — the same keys in each.
 *   2. Content: data files where every visitor text is { "es": …, "en": …, "fr": … }.
 */

/** Flattens a locale file into { 'pages.home.title': 'Texto', … } (only text values). */
export function flattenMessages(messages, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') flattenMessages(value, path, out)
    else if (typeof value === 'string') out[path] = value
  }
  return out
}

/** {name} parameters of a message, sorted: 'Clase {number}' → ['number']. Literals {'@'} skipped. */
export function messageParams(message) {
  return [...message.matchAll(/\{\s*([A-Za-z_]\w*)\s*\}/g)].map((match) => match[1]).sort()
}

/**
 * Compares one language file with Spanish.
 * @returns {{ total, translated, missing: string[], extra: string[], empty: string[], params: string[] }}
 */
export function compareLocale(es, other) {
  const source = flattenMessages(es)
  const target = flattenMessages(other)
  const result = { total: 0, translated: 0, missing: [], extra: [], empty: [], params: [] }
  for (const [key, text] of Object.entries(source)) {
    result.total++
    if (!(key in target)) result.missing.push(key)
    else if (!target[key].trim()) result.empty.push(key)
    else {
      result.translated++
      if (messageParams(text).join() !== messageParams(target[key]).join()) result.params.push(key)
    }
  }
  result.extra = Object.keys(target).filter((key) => !(key in source))
  return result
}

/** True for a translated text: { es: '…' } plus optional en / fr. */
export function isTranslatedText(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.es === 'string' &&
    Object.keys(value).every((key) => ['es', 'en', 'fr'].includes(key))
  )
}

/**
 * Counts the translated texts of a data file.
 * @returns {{ total, en, fr, missing: { en: string[], fr: string[] } }}  missing = paths in the file
 */
export function dataCoverage(data) {
  const result = { total: 0, en: 0, fr: 0, missing: { en: [], fr: [] } }
  const walk = (value, path) => {
    if (isTranslatedText(value)) {
      if (!value.es.trim()) return // nothing to translate
      result.total++
      for (const language of ['en', 'fr']) {
        if (typeof value[language] === 'string' && value[language].trim()) result[language]++
        else result.missing[language].push(path)
      }
      return
    }
    if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${path}[${index}]`))
    else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) walk(item, path ? `${path}.${key}` : key)
    }
  }
  walk(data, '')
  return result
}

/** 87 of 100 → '87 %'; nothing to translate → '—' */
export function percent(part, total) {
  return total ? `${Math.floor((part / total) * 100)} %` : '—'
}
