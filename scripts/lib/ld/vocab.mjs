/**
 * Living Dictionaries vocabularies with Spanish labels (parts of speech, semantic domains,
 * relation types, review categories). The data lives in src/data/dictionary/vocab/*.json; this
 * module loads it and resolves typed names ("Sustantivo", "Body parts") to LD codes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from '../collect-words.mjs'

const dir = path.join(ROOT, 'src/data/dictionary/vocab')
const load = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))

export const PARTS_OF_SPEECH = load('parts-of-speech.json').items
export const PART_OF_SPEECH_GROUPS = load('parts-of-speech.json').groups
export const SEMANTIC_DOMAINS = load('semantic-domains.json').items
export const RELATION_TYPES = load('relation-types.json').items
export const REVIEW_CATEGORIES = load('review-categories.json').items

/** Extra names people type, besides the codes and the official English / Spanish names. */
const POS_SYNONYMS = {
  nombre: 'n',
  expresion: 'phr',
  'marcador de clase': 'n.cls',
  ideofono: 'ideo',
  ideophone: 'ideo'
}

/** Lower case, no accents, single spaces: how typed names are compared. */
const simplify = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const posByCode = new Map(PARTS_OF_SPEECH.map((p) => [simplify(p.code), p.code]))
const posByName = new Map()
for (const p of PARTS_OF_SPEECH)
  for (const name of [p.en, p.es])
    if (!posByName.has(simplify(name))) posByName.set(simplify(name), p.code)

const domainByKey = new Map(SEMANTIC_DOMAINS.map((d) => [d.key, d.key]))
const domainByName = new Map()
for (const d of SEMANTIC_DOMAINS)
  for (const name of [d.en, d.es])
    if (!domainByName.has(simplify(name))) domainByName.set(simplify(name), d.key)

/** "n" | "Noun" | "sustantivo" → "n"; unknown → null. Codes win over names. */
export function resolvePartOfSpeech(value) {
  const typed = simplify(value)
  if (!typed) return null
  return posByCode.get(typed) || posByName.get(typed) || POS_SYNONYMS[typed] || null
}

/** "5.3" | "Food, cooking and foodways" | "Alimentos, cocina…" → "5.3"; unknown → null. */
export function resolveSemanticDomain(value) {
  const typed = simplify(value)
  if (!typed) return null
  return domainByKey.get(typed) || domainByName.get(typed) || null
}

/** Label of a part-of-speech code in 'es' or 'en'; the code itself when unknown. */
export function posLabel(code, lang = 'es') {
  const item = PARTS_OF_SPEECH.find((p) => p.code === code)
  return item ? item[lang] || item.es : code
}

/** Label of a semantic-domain key in 'es' or 'en'; the key itself when unknown. */
export function domainLabel(key, lang = 'es') {
  const item = SEMANTIC_DOMAINS.find((d) => d.key === key)
  return item ? item[lang] || item.es : key
}
