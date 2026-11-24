/**
 * Living Dictionaries import: turns rows of a spreadsheet (one Benga word each) into entries of the
 * Living Dictionaries Write API (https://livingdictionaries.app/api/v1). Used by
 * scripts/ld-import.mjs. Guide: docs/LIVING-DICTIONARY-IMPORT.md
 *
 * Pure parts (tested in scripts/tests/living-dictionary.test.mjs):
 *   uuid5()            fixed ids, so sending the same row twice never creates a duplicate
 *   resolvePartOfSpeech(), resolveSemanticDomain()   accept LD codes, English or Spanish names
 *   checkRow()         one spreadsheet row → { entry payload, audio files, problems }
 * Network part: ldClient() — only used with `--send`.
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

// ---- vocabularies -----------------------------------------------------------------------------

/**
 * Parts of speech: Living Dictionaries code → names people may type (English and Spanish).
 * The API itself also accepts its full list of codes; these are the common ones for Benga.
 */
const PARTS_OF_SPEECH = {
  n: ['noun', 'sustantivo', 'nombre'],
  'n pl': ['plural noun', 'sustantivo plural'],
  v: ['verb', 'verbo'],
  vt: ['transitive verb', 'verbo transitivo'],
  vi: ['intransitive verb', 'verbo intransitivo'],
  adj: ['adjective', 'adjetivo'],
  adv: ['adverb', 'adverbio'],
  pro: ['pronoun', 'pronombre'],
  prep: ['preposition', 'preposición'],
  conj: ['conjunction', 'conjunción'],
  int: ['interjection', 'interjección'],
  num: ['numeral', 'número'],
  dem: ['demonstrative', 'demostrativo'],
  phr: ['phrase', 'frase', 'expresión'],
  sent: ['sentence', 'oración'],
  ideo: ['ideophone', 'ideófono'],
  'pr.n': ['proper noun', 'nombre propio'],
  'n.cls': ['noun class marker', 'marcador de clase']
}

/**
 * The semantic domains of Living Dictionaries (site/src/lib/mappings/semantic-domains.ts in
 * github.com/livingtongues/living-dictionaries), with a Spanish name for the spreadsheet.
 */
export const SEMANTIC_DOMAINS = {
  1: ['Universe and the natural world', 'Universo y mundo natural'],
  1.1: ['Sky, weather and climate', 'Cielo, tiempo y clima'],
  1.2: ['Earth, geology and landscape', 'Tierra, geología y paisaje'],
  1.3: ['Water, bodies of water and the water cycle', 'Agua, masas de agua y ciclo del agua'],
  1.4: ['Plants, trees and other vegetation', 'Plantas, árboles y vegetación'],
  1.5: ['Animals', 'Animales'],
  1.6: ['Colors', 'Colores'],
  1.7: ['Birds', 'Aves'],
  1.8: ['Fish and marine creatures', 'Peces y animales marinos'],
  1.9: ['Insects and small creatures', 'Insectos y animales pequeños'],
  '1.10': ['Reptiles and amphibians', 'Reptiles y anfibios'],
  2: ['Humans, Social Relations and Organization', 'Personas, relaciones sociales y organización'],
  2.1: ['Body parts', 'Partes del cuerpo'],
  2.2: ['Body functions', 'Funciones del cuerpo'],
  2.3: ['Senses and perception', 'Sentidos y percepción'],
  2.4: ['Health, well-being and sickness', 'Salud, bienestar y enfermedad'],
  2.5: ['Life stages and rites of passage', 'Etapas de la vida y ritos de paso'],
  2.6: ['Kinship and relationships', 'Parentesco y relaciones'],
  2.7: ['Social activities and interactions', 'Actividades e interacciones sociales'],
  2.8: ['Government and Law', 'Gobierno y ley'],
  3: ['Language and Communication', 'Lengua y comunicación'],
  3.1: ['Mental actions', 'Acciones mentales'],
  3.2: ['Emotions', 'Emociones'],
  3.3: ['Education and learning', 'Educación y aprendizaje'],
  4: ['Names', 'Nombres'],
  4.1: ['Names of people and clans', 'Nombres de personas y clanes'],
  4.2: ['Place names', 'Nombres de lugares'],
  4.3: ['Sacred names', 'Nombres sagrados'],
  5: ['Daily life', 'Vida cotidiana'],
  5.1: ['Household', 'Hogar'],
  5.2: ['Agriculture', 'Agricultura'],
  5.3: ['Food, cooking and foodways', 'Comida y cocina'],
  5.4: ['Clothing and adornment', 'Ropa y adornos'],
  5.5: ['Cleanliness and hygiene', 'Limpieza e higiene'],
  5.6: ['Sleep', 'Sueño (dormir)'],
  5.7: ['Work and occupations', 'Trabajo y oficios'],
  5.8: ['Animal husbandry', 'Cría de animales'],
  5.9: ['Tools and weapons', 'Herramientas y armas'],
  '5.10': ['Finance and Business', 'Dinero y comercio'],
  5.11: ['Hunting and Fishing', 'Caza y pesca'],
  5.12: ['Art, crafts and textiles', 'Arte, artesanía y tejidos'],
  5.13: ['Construction', 'Construcción'],
  5.14: ['Sports and games', 'Deportes y juegos'],
  5.15: ['Transportation', 'Transporte'],
  5.16: ['Spirituality and Religion', 'Espiritualidad y religión'],
  5.17: ['Music and Entertainment', 'Música y entretenimiento'],
  6: ['Physical Actions', 'Acciones físicas'],
  6.1: ['Posture', 'Postura'],
  6.2: ['Motion', 'Movimiento'],
  6.3: ['Possession', 'Posesión'],
  6.4: ['Physical Impact', 'Golpes e impacto'],
  6.5: ['States and Characteristics', 'Estados y características'],
  7: ['Quantities and Quantifiers', 'Cantidades'],
  7.1: ['Numerals', 'Numerales'],
  7.2: ['Sizes and dimensions', 'Tamaños y dimensiones'],
  7.3: ['Units of Measure', 'Unidades de medida'],
  7.4: ['Quantifiers', 'Cuantificadores'],
  8: ['Time', 'Tiempo (cronológico)'],
  9: ['Location and Directions', 'Lugar y direcciones'],
  10: ['Grammar', 'Gramática'],
  10.1: ['Case Markers / Adpositions', 'Marcadores de caso / adposiciones'],
  10.2: ['TAM', 'Tiempo, aspecto y modo (TAM)'],
  10.3: ['Polarity', 'Polaridad'],
  10.4: [
    'Coordinators, Subordinators, Relativizers, Quotatives',
    'Coordinantes, subordinantes, relativos'
  ],
  10.5: ['Discourse Markers', 'Marcadores del discurso'],
  10.6: ['Interjections', 'Interjecciones'],
  10.7: ['Ideophones, Expressives & Onomatopoeia', 'Ideófonos y onomatopeyas'],
  10.8: ['Classifiers', 'Clasificadores'],
  10.9: ['Pro-forms', 'Proformas']
}

/** Lower case, no accents, single spaces: how typed names are compared. */
const simplify = (text) =>
  String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()

/** "n" | "Noun" | "sustantivo" → "n"; unknown → null. */
export function resolvePartOfSpeech(value) {
  const typed = simplify(value)
  if (!typed) return null
  for (const [code, names] of Object.entries(PARTS_OF_SPEECH)) {
    if (simplify(code) === typed || names.some((name) => simplify(name) === typed)) return code
  }
  return null
}

/** "5.3" | "Food, cooking and foodways" | "Comida y cocina" → "5.3"; unknown → null. */
export function resolveSemanticDomain(value) {
  const typed = simplify(value)
  if (!typed) return null
  for (const [key, names] of Object.entries(SEMANTIC_DOMAINS)) {
    if (key === typed || names.some((name) => simplify(name) === typed)) return key
  }
  return null
}

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

export const LD_API = 'https://livingdictionaries.app/api/v1'

/**
 * Tiny client of the Living Dictionaries Write API. The key (ldk_…) stays in .env.local.
 * Every method throws with the server's message when a request fails.
 */
export function ldClient({ apiKey, dictionary, base = LD_API, fetchImpl = fetch }) {
  const root = `${base}/dictionaries/${encodeURIComponent(dictionary)}`
  async function call(method, path, body, isForm = false) {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'benga-portal-ld-import/1.0'
    }
    if (body && !isForm) headers['Content-Type'] = 'application/json'
    const response = await fetchImpl(`${root}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      redirect: 'error' // a redirect would silently turn a POST into a GET (API guide)
    })
    const text = await response.text()
    let json
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      json = { raw: text }
    }
    if (!response.ok) {
      const message = json?.error?.message || json?.error || json?.message || text.slice(0, 300)
      throw new Error(`Living Dictionaries ${method} ${path} → ${response.status}: ${message}`)
    }
    return json
  }
  return {
    dictionaryInfo: () => call('GET', ''),
    speakers: () => call('GET', '/speakers'),
    sources: () => call('GET', '/sources'),
    /** Entries whose headword is exactly `lexeme`. */
    findEntries: (lexeme) =>
      call('GET', `/entries?${new URLSearchParams({ lexeme, match: 'exact', limit: '20' })}`),
    postEntries: (entries, importId) => call('POST', '/entries', { entries, import_id: importId }),
    /** kind: 'entry' | 'sentence' */
    postAudio: (kind, ownerId, { id, buffer, fileName, speakerId, source }) => {
      const form = new FormData()
      form.append('id', id)
      if (speakerId) form.append('speaker_id', speakerId)
      if (source) form.append('source', source)
      form.append('file', new Blob([buffer]), fileName)
      const owner = kind === 'entry' ? 'entries' : 'sentences'
      return call('POST', `/${owner}/${ownerId}/audio`, form, true)
    }
  }
}
