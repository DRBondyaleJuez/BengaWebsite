/**
 * Tests for scripts/lib/ld/link.mjs (dictionary entries ↔ website word keys). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { linkEntries, plainKey, groupByFile } from '../lib/ld/link.mjs'

const entry = (id, lexeme, pluralForm = null) => ({
  id,
  lexeme,
  homograph: null,
  senses: [{ id: `${id}-s`, pluralForm }]
})
const entries = {
  e1: entry('e1', 'Ele', 'Bele'),
  t1: entry('t1', 'Tombo'),
  t2: entry('t2', 'Tombo'),
  h1: entry('h1', 'Hāngā'),
  n1: entry('n1', 'Enâ'),
  d1: entry('d1', 'Ndabo', 'Ndabo / Mandabo'),
  x1: entry('x1', 'Akeva')
}
const registry = {
  ele: { word: 'Ele', livingDictionaryId: null },
  bele: { word: 'Bele', livingDictionaryId: null },
  tombo: { word: 'Tombo', livingDictionaryId: null },
  h_a_ng_a_: { word: 'Hângâ', livingDictionaryId: 'h1' },
  ena: { word: 'Ena', livingDictionaryId: null },
  ndabo: { word: 'Ndabo', livingDictionaryId: 'old-id' },
  epokolo: { word: 'Epokolo', livingDictionaryId: null }
}

test('plainKey drops accent marks of a word key', () => {
  assert.equal(plainKey('m_u_e_ngi'), 'muengi')
  assert.equal(plainKey('wh_a_ki'), 'whaki')
})

test('links by word key, fills only empty ids, reports the rest', () => {
  const { siteKeys, registryUpdates, report } = linkEntries(entries, registry, {
    epokolo: { usedIn: ['src/data/lexicon/nouns.json'] }
  })
  assert.deepEqual(siteKeys.e1, ['bele', 'ele']) // headword and simple plural
  assert.deepEqual(siteKeys.h1, ['h_a_ng_a_']) // â and ā give the same key
  assert.deepEqual(siteKeys.d1, ['ndabo']) // "Ndabo / Mandabo" is not one word
  assert.deepEqual(registryUpdates, { ele: 'e1', bele: 'e1' })
  assert.deepEqual(
    report.ambiguous.map((a) => a.word),
    ['Tombo']
  ) // two entries: id not filled
  assert.deepEqual(
    report.staleIds.map((s) => s.id),
    ['old-id']
  )
  assert.deepEqual(report.spellingDifferences, [{ key: 'ena', site: 'Ena', dictionary: ['Enâ'] }])
  assert.deepEqual(
    report.siteOnly.map((s) => s.key),
    ['epokolo']
  )
  assert.deepEqual(report.dictionaryOnly.map((d) => d.word).sort(), ['Akeva', 'Enâ'])
  assert.deepEqual(groupByFile(report.siteOnly), [['src/data/lexicon/nouns.json', ['Epokolo']]])
})

test('an existing different id is reported, never replaced', () => {
  const { registryUpdates, report } = linkEntries(entries, {
    ele: { word: 'Ele', livingDictionaryId: 'x1' }
  })
  assert.deepEqual(registryUpdates, {})
  assert.equal(report.idConflicts[0].registryEntry, 'Akeva')
})
