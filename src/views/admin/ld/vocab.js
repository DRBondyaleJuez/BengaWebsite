/**
 * Vocabularies of the dictionary admin (src/data/dictionary/vocab/*.json) ready for the selects,
 * plus label helpers. Same data as scripts/lib/ld/vocab.mjs uses on the Node side.
 */
import partsOfSpeech from '@/data/dictionary/vocab/parts-of-speech.json'
import semanticDomains from '@/data/dictionary/vocab/semantic-domains.json'
import relationTypes from '@/data/dictionary/vocab/relation-types.json'
import reviewCategories from '@/data/dictionary/vocab/review-categories.json'
import { normalizeText } from '@/components/admin/searchText'

const groupOf = new Map()
for (const group of partsOfSpeech.groups) {
  for (const code of group.codes) groupOf.set(code, group.label.es)
}
const posByCode = new Map(partsOfSpeech.items.map((item) => [item.code, item]))
const domainByKey = new Map(semanticDomains.items.map((item) => [item.key, item]))
const reviewById = new Map(reviewCategories.items.map((item) => [item.id, item]))

/** Options for ChipSelect, in the groups' order. */
export const POS_OPTIONS = partsOfSpeech.groups.flatMap((group) =>
  group.codes.map((code) => ({
    value: code,
    label: posByCode.get(code)?.es || code,
    group: group.label.es,
    help: posByCode.get(code)?.help?.es
  }))
)

/** Options for TreeSelect: { value, label, parent }. */
export const DOMAIN_OPTIONS = semanticDomains.items.map((item) => ({
  value: item.key,
  label: item.es,
  parent: item.parent
}))

export const RELATION_TYPES = relationTypes.items
export const REVIEW_CATEGORIES = reviewCategories.items

export const posLabel = (code) => posByCode.get(code)?.es || code
export const posGroup = (code) => groupOf.get(code) || 'Otros'
export const domainLabel = (key) => domainByKey.get(key)?.es || key
export const reviewLabel = (id) => reviewById.get(id)?.es || id

/** Text used to search a record: lower case, no accents (and NFC, so â typed or stored match). */
export const searchable = (...parts) =>
  normalizeText(parts.flat().filter(Boolean).join(' ').normalize('NFC'))
