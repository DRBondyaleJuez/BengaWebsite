/**
 * Read and write a field of a dictionary record by its path, e.g. `senses[0].glosses.fr`.
 * Pure functions (no imports), shared with the tests in scripts/tests/dictionaryPaths.test.mjs.
 * The forms of /admin/living-dictionary use them to edit one record without mutating props
 * (cards send `set(path, value)` and the page applies it) and to apply accepted suggestions.
 */

/** 'senses[0].glosses.fr' → ['senses', 0, 'glosses', 'fr'] (numbers for array positions). */
export function parsePath(path) {
  const keys = []
  for (const part of String(path).split('.')) {
    const match = /^([^[\]]*)((?:\[\d+\])*)$/.exec(part)
    if (!match) throw new Error(`Ruta no válida: ${path}`)
    if (match[1]) keys.push(match[1])
    for (const index of match[2].matchAll(/\[(\d+)\]/g)) keys.push(Number(index[1]))
  }
  if (!keys.length) throw new Error(`Ruta no válida: ${path}`)
  return keys
}

/** The value at `path`, or undefined when some step is missing. */
export function getPath(target, path) {
  let current = target
  for (const key of parsePath(path)) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[key]
  }
  return current
}

/**
 * Sets the value at `path` (mutating `target`), creating the objects or arrays on the way.
 * `undefined` removes the field. Returns `target`.
 */
export function setPath(target, path, value) {
  const keys = parsePath(path)
  let current = target
  keys.slice(0, -1).forEach((key, position) => {
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = typeof keys[position + 1] === 'number' ? [] : {}
    }
    current = current[key]
  })
  const last = keys[keys.length - 1]
  if (value === undefined) {
    if (Array.isArray(current)) current.splice(last, 1)
    else delete current[last]
  } else current[last] = value
  return target
}

/** Nothing typed: null, empty text, empty list or an object without values. */
export function isEmptyValue(value) {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.values(value).every(isEmptyValue)
  return false
}

/**
 * Sets a field of `draft` as the user left it, keeping "empty" the way the saved record had it,
 * so emptying a field does not look like a change when the record never had that field:
 * saved absent → the field is removed · saved a list → [] · otherwise → null.
 * @param {object} draft  record being edited (mutated)
 * @param {object} saved  the record as last saved or loaded (not mutated)
 */
export function setField(draft, saved, path, value) {
  if (isEmptyValue(value)) {
    const before = getPath(saved, path)
    value = before === undefined ? undefined : Array.isArray(before) ? [] : null
  }
  return setPath(draft, path, value)
}

/** JSON with sorted keys and no undefined values: equal records give equal text (change check). */
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

/**
 * A text in several languages with one language changed: { es, en, fr } minus the empty ones
 * (null when nothing is left). Other keys (e.g. `default`) are kept.
 */
export function withLanguage(current, lang, text) {
  const next = { ...(current || {}) }
  if (String(text ?? '').trim() === '') delete next[lang]
  else next[lang] = text
  return Object.keys(next).length ? next : null
}
