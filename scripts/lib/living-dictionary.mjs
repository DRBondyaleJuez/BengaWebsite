/**
 * Living Dictionaries import: turns rows of a spreadsheet (one Benga word each) into entries of the
 * Living Dictionaries Write API (https://livingdictionaries.app/api/v1). Used by
 * scripts/ld-import.mjs. Guide: docs/LIVING-DICTIONARY-IMPORT.md
 *
 * Pure parts (tested in scripts/tests/living-dictionary.test.mjs):
 *   uuid5()            fixed ids, so sending the same row twice never creates a duplicate
 *   resolvePartOfSpeech(), resolveSemanticDomain()   accept LD codes, English or Spanish names
 *   checkRow()         one spreadsheet row → { entry payload, audio files, problems }
 * Network part: ldClient() from ./ld/client.mjs — only used with `--send`.
 */
import crypto from 'node:crypto'
import { toAudioId } from '../../src/utils/audioId.js'

// ---- fixed ids ------------------------------------------------------------------------------

/** RFC 4122 name-based UUID (version 5, SHA-1). Same namespace + name → same id, always. */
export function uuid5(name, namespace) {
  const ns = Buffer.from(namespace.replace(/-/g, ''), 'hex')
  const hash = crypto.createHash('sha1').update(ns).update(String(name), 'utf8').digest()
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  const hex = hash.subarray(0, 16).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** The standard URL namespace of RFC 4122; our names are URLs of this project. */
const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
const idFor = (kind, dictionary, key) =>
  uuid5(`https://benga-portal/${dictionary}/${kind}/${key}`, URL_NAMESPACE)

// ---- vocabularies (src/data/dictionary/vocab, loaded by ./ld/vocab.mjs) ------------------------

import { resolvePartOfSpeech, resolveSemanticDomain, domainLabel } from './ld/vocab.mjs'
export { resolvePartOfSpeech, resolveSemanticDomain, domainLabel }

/** Several values in one cell: "n; adj" or "5.3 | 1.4". */
const splitCell = (value) =>
  String(value || '')
    .split(/[;|]/)
    .map((part) => part.trim())
    .filter(Boolean)

// ---- one spreadsheet row ----------------------------------------------------------------------

export const LANGUAGES = ['es', 'en', 'fr']
export const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a|ogg|webm|flac)$/i
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024
/** Letters that are not Benga (AGENTS.md → Benga Orthography Rules). */
const NON_BENGA = /[cqrxzñ]/i
const SPANISH_ACCENTS = /[áéíóú]/i

function multilingual(row, prefix) {
  const out = {}
  for (const lang of LANGUAGES) {
    const text = (row[`${prefix}_${lang}`] || '').trim()
    if (text) out[lang] = text
  }
  return Object.keys(out).length ? out : null
}

/**
 * Checks one row and builds what will be sent.
 * @param {object} row - columns of docs/LIVING-DICTIONARY-IMPORT.md (word, plural, gloss_es, …)
 * @param {{ dictionary: string, line: number, audioFiles: Map<string, number>, cite?: string }} context
 *   audioFiles: file name (lower case) → size in bytes, for the files of the audio folder
 * @returns {{ key, word, line, entry, audio: object[], errors: string[], warnings: string[] }}
 */
export function checkRow(row, { dictionary, line, audioFiles, cite }) {
  const errors = []
  const warnings = []
  const word = (row.word || '').trim().normalize('NFC')
  const homograph = (row.homograph || '').trim()
  const key = toAudioId(word)
  if (!word || !key) errors.push('falta la palabra benga (columna "word")')

  for (const [column, value] of [
    ['word', word],
    ['plural', row.plural]
  ]) {
    if (value && NON_BENGA.test(value))
      warnings.push(`${column} «${value}» tiene c/q/r/x/z/ñ, que no existen en benga`)
    if (value && SPANISH_ACCENTS.test(value))
      warnings.push(`${column} «${value}» tiene tilde española: ¿debería ser â/ē/ū?`)
  }

  const glosses = multilingual(row, 'gloss')
  if (!glosses) errors.push('falta la traducción (gloss_es, gloss_en o gloss_fr)')
  else if (!glosses.es) warnings.push('sin traducción al español (gloss_es)')

  const partsOfSpeech = []
  for (const typed of splitCell(row.part_of_speech)) {
    const code = resolvePartOfSpeech(typed)
    if (code) partsOfSpeech.push(code)
    else
      warnings.push(
        `categoría «${typed}» desconocida: se enviará tal cual (usa n, v, adj… o su nombre)`
      )
    if (!code) partsOfSpeech.push(typed)
  }

  const domains = []
  const writeInDomains = []
  for (const typed of splitCell(row.semantic_domain)) {
    const domainKey = resolveSemanticDomain(typed)
    if (domainKey) domains.push(domainKey)
    else {
      writeInDomains.push(typed)
      warnings.push(`campo semántico «${typed}» no está en la lista: se enviará como texto libre`)
    }
  }

  // Audio files
  const audio = []
  const addAudio = (column, kind) => {
    const name = (row[column] || '').trim()
    if (!name) return
    const size = audioFiles.get(name.toLowerCase())
    if (!AUDIO_EXTENSIONS.test(name))
      errors.push(`${column} «${name}»: formato de audio no admitido`)
    else if (size === undefined) errors.push(`${column} «${name}»: no está en la carpeta de audios`)
    else if (size > MAX_AUDIO_BYTES) errors.push(`${column} «${name}»: pasa de 25 MB`)
    else audio.push({ kind, file: name, speaker: (row.speaker || '').trim() || null })
  }
  addAudio('audio', 'entry')

  // Example sentence
  const exampleText = (row.example || '').trim().normalize('NFC')
  const exampleTranslation = multilingual(row, 'example')
  if (!exampleText && exampleTranslation)
    errors.push('hay traducción del ejemplo pero no el ejemplo')
  if (exampleText && !exampleTranslation) warnings.push('ejemplo sin traducción')
  if (row.example_audio && !exampleText) errors.push('hay audio del ejemplo pero no el ejemplo')
  if (exampleText) addAudio('example_audio', 'sentence')
  if (audio.some((item) => !item.speaker))
    warnings.push('audio sin hablante (columna speaker): hará falta --source para enviarlo')

  const name = `${key}#${homograph}`
  const entryId = idFor('entry', dictionary, name)
  const senseId = idFor('sense', dictionary, name)
  const sentenceId = exampleText ? idFor('sentence', dictionary, `${name}/${exampleText}`) : null
  for (const item of audio) {
    item.ownerId = item.kind === 'entry' ? entryId : sentenceId
    item.id = idFor('audio', dictionary, `${item.ownerId}/${item.file.toLowerCase()}`)
  }

  const page = (row.book_page || '').trim()
  const citations = cite ? [{ slug: cite, ...(page ? { locator: `p. ${page}` } : {}) }] : undefined
  const sense = {
    id: senseId,
    ...(glosses ? { glosses } : {}),
    ...(partsOfSpeech.length ? { parts_of_speech: partsOfSpeech } : {}),
    ...(domains.length ? { semantic_domains: domains } : {}),
    ...(writeInDomains.length ? { write_in_semantic_domains: writeInDomains } : {}),
    ...((row.noun_class || '').trim() ? { noun_class: row.noun_class.trim() } : {}),
    ...((row.plural || '').trim() ? { plural_form: row.plural.trim().normalize('NFC') } : {}),
    ...(exampleText
      ? {
          example_sentences: [
            {
              id: sentenceId,
              text: exampleText,
              ...(exampleTranslation ? { translation: exampleTranslation } : {}),
              ...(citations ? { citations } : {})
            }
          ]
        }
      : {})
  }
  const entry = {
    id: entryId,
    lexeme: word,
    ...(homograph ? { homograph } : {}),
    ...((row.notes || '').trim() ? { notes: row.notes.trim() } : {}),
    ...(citations ? { citations } : {}),
    senses: [sense]
  }
  return { key, word, homograph, line, entry, audio, errors, warnings }
}

/** Two rows with the same word and homograph number would be the same entry. */
export function findDuplicates(checked) {
  const seen = new Map()
  for (const item of checked) {
    if (!item.key) continue
    const name = `${item.key}#${item.homograph}`
    if (seen.has(name)) {
      item.errors.push(
        `misma palabra que la línea ${seen.get(name)}: pon un número en "homograph" si son palabras distintas`
      )
    } else seen.set(name, item.line)
  }
}

// ---- network ----------------------------------------------------------------------------------

// The client lives in ./ld/client.mjs (throttling, retries, logging); re-exported for ld-import.
export { ldClient, LD_API } from './ld/client.mjs'
