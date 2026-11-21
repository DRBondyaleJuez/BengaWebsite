/**
 * Writes what a person edited in /admin/translations back to the content files.
 *
 *   edits:  [{ file: 'src/data/lexicon/nouns.json', path: ['entries','bova','meaning','en'], value: 'Gift' }, …]
 *           value null = remove that language (the site then shows Spanish)
 *   doubts: the whole new list of docs/translations/doubts.json (see src/utils/translationRows.js)
 *
 * Rules: only .json files inside src/data and src/locales; a path must already exist, except the
 * `en` / `fr` language of a text and the keys of en.json / fr.json (they may be new). After the
 * edits the key order is restored (es, en, fr in data; the order of es.json in en.json / fr.json)
 * and the files are formatted with Prettier, so a save only changes the lines that were edited.
 * The pure parts are tested in scripts/tests/translations-save.test.mjs.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './collect-words.mjs'
import { isTranslatedText, LANGUAGES } from '../../src/utils/translationRows.js'

export const DOUBTS_FILE = path.join(ROOT, 'docs/translations/doubts.json')
const DOUBTS_ABOUT =
  'Doubtful translations, shown highlighted in /admin/translations (npm run serve). A doubt lists the Spanish text(s) it is about in "es" (one text or a list; the same Spanish text in several places matches in all); a note without "es" is a general note. Resolved doubts are removed from this file from the page. Guide: docs/TRANSLATIONS.md'
const ALLOWED_FILE = /^src\/(data|locales)\/[A-Za-z0-9._/-]+\.json$/

/**
 * Sets data[path] = value (null removes the key). Missing parent objects are created only when
 * `createParents`; a missing last key only when `createLast` (otherwise it is probably a wrong path).
 */
export function setAtPath(
  data,
  pathParts,
  value,
  { createParents = false, createLast = false } = {}
) {
  if (!Array.isArray(pathParts) || !pathParts.length) throw new Error('empty path')
  let node = data
  for (const part of pathParts.slice(0, -1)) {
    if (node === null || typeof node !== 'object')
      throw new Error(`"${part}" is not inside an object`)
    if (!(part in node)) {
      if (!createParents) throw new Error(`path not found at "${part}"`)
      node[part] = {}
    }
    node = node[part]
  }
  const last = pathParts[pathParts.length - 1]
  if (node === null || typeof node !== 'object')
    throw new Error(`"${last}" is not inside an object`)
  if (value === null) delete node[last]
  else {
    if (!(last in node) && !createLast) throw new Error(`"${last}" does not exist`)
    node[last] = value
  }
}

/** Same object with the keys of es, en, fr in this order (other keys keep their place). */
export function orderTranslated(value) {
  if (isTranslatedText(value)) {
    return Object.fromEntries(
      LANGUAGES.filter((lang) => lang in value).map((lang) => [lang, value[lang]])
    )
  }
  if (Array.isArray(value)) return value.map(orderTranslated)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, orderTranslated(item)])
    )
  }
  return value
}

/** `other` with the keys of `reference` first, in the same order (recursively); extra keys last. */
export function orderLike(reference, other) {
  if (!reference || typeof reference !== 'object' || !other || typeof other !== 'object')
    return other
  const result = {}
  for (const key of Object.keys(reference)) {
    if (key in other) result[key] = orderLike(reference[key], other[key])
  }
  for (const key of Object.keys(other)) if (!(key in result)) result[key] = other[key]
  return result
}

/** Removes groups left empty after deleting texts (en.json / fr.json) */
export function dropEmptyGroups(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const result = {}
  for (const [key, item] of Object.entries(value)) {
    const cleaned = dropEmptyGroups(item)
    if (
      cleaned &&
      typeof cleaned === 'object' &&
      !Array.isArray(cleaned) &&
      !Object.keys(cleaned).length
    )
      continue
    result[key] = cleaned
  }
  return result
}

async function format(file, data) {
  const text = JSON.stringify(data, null, 2) + '\n'
  try {
    const prettier = await import('prettier')
    const config = (await prettier.resolveConfig(file)) || {}
    return await prettier.format(text, { ...config, parser: 'json', filepath: file })
  } catch {
    return text // Prettier not available: plain JSON is fine, `npm run format` can tidy it later
  }
}

/** Applies the edits file by file; nothing is written when any edit is wrong. */
export async function saveTranslations({ edits = [], doubts } = {}) {
  const byFile = new Map()
  for (const edit of edits) {
    if (
      typeof edit.file !== 'string' ||
      !ALLOWED_FILE.test(edit.file) ||
      edit.file.includes('..')
    ) {
      throw new Error(`file not allowed: ${edit.file}`)
    }
    if (edit.value !== null && typeof edit.value !== 'string')
      throw new Error('value must be text or null')
    if (!byFile.has(edit.file)) byFile.set(edit.file, [])
    byFile.get(edit.file).push(edit)
  }

  const output = new Map() // file → new data (all computed before anything is written)
  for (const [file, list] of byFile) {
    const data = JSON.parse(await fs.readFile(path.join(ROOT, file), 'utf8'))
    const isLocale = file.startsWith('src/locales/')
    for (const edit of list) {
      const last = edit.path[edit.path.length - 1]
      const isTranslation = isLocale || last === 'en' || last === 'fr'
      // Empty en / fr = remove it (the site shows Spanish); Spanish and Benga words cannot be empty
      const value = typeof edit.value === 'string' && !edit.value.trim() ? null : edit.value
      try {
        if (value === null && (!isTranslation || file.endsWith('/es.json'))) {
          throw new Error('only an English or French text can be removed')
        }
        setAtPath(data, edit.path, value, { createParents: isLocale, createLast: isTranslation })
      } catch (error) {
        throw new Error(`${file} → ${edit.path.join('.')}: ${error.message}`, { cause: error })
      }
    }
    if (isLocale) {
      const es = JSON.parse(await fs.readFile(path.join(ROOT, 'src/locales/es.json'), 'utf8'))
      const clean = file.endsWith('/es.json') ? data : dropEmptyGroups(data)
      output.set(file, orderLike(es, clean))
    } else {
      output.set(file, orderTranslated(data))
    }
  }

  if (doubts !== undefined) {
    if (!Array.isArray(doubts)) throw new Error('"doubts" must be a list')
    for (const [index, doubt] of doubts.entries()) {
      if (!doubt || typeof doubt.id !== 'string' || typeof doubt.note !== 'string') {
        throw new Error(`doubt ${index + 1}: needs "id" and "note"`)
      }
    }
  }

  for (const [file, data] of output) {
    await fs.writeFile(path.join(ROOT, file), await format(path.join(ROOT, file), data), 'utf8')
  }
  if (doubts !== undefined) {
    await fs.mkdir(path.dirname(DOUBTS_FILE), { recursive: true })
    const data = { _about: DOUBTS_ABOUT, doubts }
    await fs.writeFile(DOUBTS_FILE, await format(DOUBTS_FILE, data), 'utf8')
  }
  return { files: [...output.keys()], doubts: doubts === undefined ? null : doubts.length }
}
