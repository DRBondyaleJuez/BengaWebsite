/**
 * Suggestions of /admin/living-dictionary (task L4.7): a proposed value for one field of an entry
 * or sentence (usually from Claude), waiting for a person to accept, edit-and-accept or reject.
 * Pure functions (tested in scripts/tests/dictionarySuggestions.test.mjs). Accepting writes the
 * value at the field's path and adds a line to the record's local `history` (never sent).
 * Suggestions are never applied by themselves, and never invent Benga: a person decides.
 */
import { getPath, setField, parsePath } from './dictionaryPaths.js'

/** Why a suggestion cannot be applied to this record (Spanish), or null when it can. */
export function suggestionProblem(record, field) {
  let keys
  try {
    keys = parsePath(field)
  } catch {
    return 'La ruta del campo no es válida'
  }
  let current = record
  for (const key of keys) {
    if (typeof key === 'number') {
      if (!Array.isArray(current) || key >= current.length) {
        return 'El campo ya no existe en esta ficha (¿se quitó un sentido?)'
      }
    }
    current = current == null ? undefined : current[key]
  }
  return null
}

const historyLine = (suggestion, from, to, action, { at, by }) => ({
  at,
  field: suggestion.field,
  from: from === undefined ? null : from,
  to: to === undefined ? null : to,
  by,
  action
})

/**
 * Accepts a suggestion on `draft` (mutated): writes `value` (the proposed one, or the edited one)
 * at the field, adds the history line and removes the suggestion.
 * @param {object} draft  record being edited
 * @param {object} saved  record as last saved (to keep "empty" like it was, see setField)
 * @returns {object} the history line added
 */
export function acceptSuggestion(
  draft,
  saved,
  suggestionId,
  value,
  { at = new Date().toISOString(), by = 'human' } = {}
) {
  const suggestion = (draft.suggestions || []).find((item) => item.id === suggestionId)
  if (!suggestion) throw new Error('La sugerencia ya no existe')
  const problem = suggestionProblem(draft, suggestion.field)
  if (problem) throw new Error(problem)
  const from = getPath(draft, suggestion.field)
  setField(draft, saved, suggestion.field, value)
  const line = historyLine(
    suggestion,
    from,
    getPath(draft, suggestion.field),
    'accepted-suggestion',
    {
      at,
      by
    }
  )
  draft.history = [...(draft.history || []), line]
  draft.suggestions = draft.suggestions.filter((item) => item.id !== suggestionId)
  return line
}

/**
 * Rejects a suggestion on `draft` (mutated): the field is left as it is, the suggestion is
 * removed and the history line keeps the proposed value in `to` (it was NOT applied).
 */
export function rejectSuggestion(
  draft,
  suggestionId,
  { at = new Date().toISOString(), by = 'human' } = {}
) {
  const suggestion = (draft.suggestions || []).find((item) => item.id === suggestionId)
  if (!suggestion) throw new Error('La sugerencia ya no existe')
  const current = suggestionProblem(draft, suggestion.field)
    ? null
    : getPath(draft, suggestion.field)
  const line = historyLine(suggestion, current, suggestion.value, 'rejected-suggestion', { at, by })
  draft.history = [...(draft.history || []), line]
  draft.suggestions = draft.suggestions.filter((item) => item.id !== suggestionId)
  return line
}

/** Text → value for the «Editar y aceptar» box: lists are comma separated, JSON for the rest. */
export function parseEditedValue(text, original) {
  if (Array.isArray(original) && original.every((item) => typeof item === 'string')) {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (original !== null && typeof original === 'object') return JSON.parse(text)
  return text
}

/** Value → text for that box (the inverse of parseEditedValue). */
export function editableText(value) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value.join(', ')
  }
  if (value !== null && typeof value === 'object') return JSON.stringify(value, null, 2)
  return value == null ? '' : String(value)
}

const FIELD_NAMES = {
  lexeme: 'Palabra',
  homograph: 'Homógrafo',
  phonetic: 'Pronunciación (IPA)',
  morphology: 'Morfología',
  interlinearization: 'Interlineal',
  toneClass: 'Clase tonal',
  scientificNames: 'Nombres científicos',
  dialects: 'Dialectos',
  tags: 'Etiquetas',
  notes: 'Notas',
  linguisticHistory: 'Historia lingüística',
  text: 'Oración',
  translations: 'Traducción',
  glosses: 'Traducción',
  definition: 'Definición',
  partsOfSpeech: 'Categoría gramatical',
  semanticDomains: 'Dominio semántico',
  nounClass: 'Clase nominal',
  pluralForm: 'Plural',
  variant: 'Variante'
}
const LANGUAGES = { es: 'español', en: 'inglés', fr: 'francés' }

/** Readable name of a field path: `senses[0].glosses.fr` → «Sentido 1 · Traducción (francés)». */
export function fieldLabel(path) {
  let keys
  try {
    keys = parsePath(path)
  } catch {
    return path
  }
  const parts = []
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key === 'senses' && typeof keys[i + 1] === 'number') {
      parts.push(`Sentido ${keys[i + 1] + 1}`)
      i++
    } else if (LANGUAGES[key] && parts.length) {
      parts[parts.length - 1] += ` (${LANGUAGES[key]})`
    } else parts.push(FIELD_NAMES[key] || String(key))
  }
  return parts.join(' · ')
}
