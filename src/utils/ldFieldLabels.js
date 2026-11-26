/**
 * Spanish names of dictionary field paths (scripts/lib/ld/diff.mjs), for previews, conflicts
 * and sync logs: `senses[<id>].glosses.fr` → «Sentido 1 · traducción (francés)».
 * Pure, no imports: used by the admin pages and by the Node sync scripts.
 */

const FIELDS = {
  lexeme: 'palabra',
  homograph: 'número de homógrafo',
  phonetic: 'pronunciación (AFI)',
  interlinearization: 'glosa interlineal',
  morphology: 'morfología',
  toneClass: 'clase tonal',
  notes: 'notas',
  linguisticHistory: 'historia lingüística',
  scientificNames: 'nombres científicos',
  dialects: 'dialectos',
  tags: 'etiquetas',
  citations: 'fuentes',
  glosses: 'traducción',
  definition: 'definición',
  partsOfSpeech: 'categoría gramatical',
  semanticDomains: 'dominios semánticos',
  writeInDomains: 'dominios (texto libre)',
  nounClass: 'clase nominal',
  pluralForm: 'plural',
  variant: 'variante',
  conceptId: 'concepto',
  sentenceIds: 'oraciones de ejemplo',
  text: 'oración',
  translations: 'traducción',
  translationStatus: 'estado de la traducción',
  speakerId: 'hablante',
  textId: 'texto',
  senseIds: 'palabras enlazadas',
  audio: 'audio',
  photos: 'imagen',
  relations: 'relación'
}
const LANGUAGES = { es: 'español', en: 'inglés', fr: 'francés', default: 'benga' }

/**
 * @param {string} path  field path of diff.mjs
 * @param {object} [record] the entry, to number its senses («Sentido 2»)
 */
export function fieldLabel(path, record = null) {
  if (path === '*') return 'la entrada entera'
  const parts = path.split(/\.(?![^[]*\])/)
  const words = []
  for (const part of parts) {
    const match = part.match(/^(\w+)(?:\[([^\]]+)\])?$/)
    if (!match) {
      words.push(part)
      continue
    }
    const [, name, key] = match
    if (name === 'senses') {
      const index = (record?.senses || []).findIndex((sense) => sense.id === key)
      words.push(index >= 0 ? `Sentido ${index + 1}` : 'Sentido')
    } else if (LANGUAGES[name] && words.length) {
      words[words.length - 1] += ` (${LANGUAGES[name]})`
    } else if (name === 'relations' && key) {
      words.push(`relación «${key.split('|')[0]}»`)
    } else {
      words.push(FIELDS[name] || name)
    }
  }
  if (parts.length === 1 && /^senses\[/.test(path)) return `${words[0]} (entero)`
  return words.join(' · ')
}
