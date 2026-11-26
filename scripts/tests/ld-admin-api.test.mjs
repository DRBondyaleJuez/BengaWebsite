/**
 * Tests for scripts/lib/ld/admin-api.mjs (the /__dev/ld/* endpoints of the admin), with an
 * in-memory store instead of the files. Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleLdRequest, syncStateOf, canonical } from '../lib/ld/admin-api.mjs'

const ELE = '1820bdc3-3418-4600-862f-3692f6a36bd8'
const SENSE = '5b2a1f0e-6c1d-4f8a-9a3e-2d4c6b8e0f12'
const clone = (value) => JSON.parse(JSON.stringify(value))

const ldEle = {
  id: ELE,
  lexeme: 'Ele',
  senses: [{ id: SENSE, glosses: { es: 'Árbol' }, partsOfSpeech: ['n'], sentenceIds: [] }],
  audio: [],
  updatedAt: '2026-03-01T21:58:27.715Z'
}

function memoryStore() {
  const { updatedAt, ...fields } = ldEle
  const data = {
    entries: {
      [ELE]: {
        ...clone(fields),
        siteKeys: [],
        review: null,
        suggestions: [],
        sync: { state: 'synced', ldUpdatedAt: updatedAt, version: 0, lastError: null }
      }
    },
    sentences: {},
    base: { pulledAt: 'x', entries: { [ELE]: clone(ldEle) }, sentences: {} }
  }
  const registry = {
    ele: { word: 'Ele', livingDictionaryId: null },
    bele: { word: 'Bele', livingDictionaryId: null }
  }
  const saves = []
  return {
    data,
    registry,
    saves,
    load: async () => clone(data),
    saveEntries: async (entries) => {
      data.entries = clone(entries)
      saves.push('entries')
    },
    saveSentences: async (sentences) => {
      data.sentences = clone(sentences)
      saves.push('sentences')
    },
    loadRegistry: async () => clone(registry),
    saveRegistry: async (words) => {
      Object.assign(registry, clone(words))
      saves.push('registry')
    }
  }
}
const call = (store, method, pathname, body = null) =>
  handleLdRequest({ method, pathname, body }, store)

test('summary and list', async () => {
  const store = memoryStore()
  const { json } = await call(store, 'GET', '/summary')
  assert.equal(json.entries, 1)
  assert.equal(json.missingGloss.en, 1)
  assert.equal(json.entriesWithoutAudio, 1)
  assert.equal((await call(store, 'GET', '/entries')).json.entries.length, 1)
  assert.equal((await call(store, 'GET', `/entries/${ELE}`)).json.base.lexeme, 'Ele')
  assert.equal((await call(store, 'GET', '/entries/nope')).status, 404)
})

test('saving marks local changes, raises the version and links the site (L2.2)', async () => {
  const store = memoryStore()
  const entry = clone(store.data.entries[ELE])
  entry.senses[0].glosses.en = 'Tree'
  entry.senses[0].pluralForm = 'Bele'
  const saved = await call(store, 'PUT', `/entries/${ELE}`, { entry, version: 0 })
  assert.equal(saved.status, 200)
  assert.equal(saved.json.entry.sync.state, 'local-changes')
  assert.equal(saved.json.entry.sync.version, 1)
  assert.deepEqual(saved.json.entry.siteKeys, ['bele', 'ele'])
  assert.equal(store.registry.ele.livingDictionaryId, ELE)
  assert.equal(store.registry.bele.livingDictionaryId, ELE)

  // undoing the change makes it "synced" again
  const back = clone(saved.json.entry)
  delete back.senses[0].glosses.en
  back.senses[0].pluralForm = undefined
  delete back.senses[0].pluralForm
  const again = await call(store, 'PUT', `/entries/${ELE}`, { entry: back, version: 1 })
  assert.equal(again.json.entry.sync.state, 'synced')
})

test('a stale version is refused (two tabs) and bad data is rejected', async () => {
  const store = memoryStore()
  const entry = clone(store.data.entries[ELE])
  assert.equal((await call(store, 'PUT', `/entries/${ELE}`, { entry, version: 7 })).status, 409)
  entry.senses = []
  const bad = await call(store, 'PUT', `/entries/${ELE}`, { entry, version: 0 })
  assert.equal(bad.status, 400)
  assert.ok(bad.json.details.length)
  assert.deepEqual(store.saves, [])
})

test('creating: fixed id, duplicates refused, only local records can be deleted', async () => {
  const store = memoryStore()
  const created = await call(store, 'POST', '/entries', { lexeme: 'Epokolo' })
  assert.equal(created.status, 201)
  const { entry } = created.json
  assert.equal(entry.sync.state, 'new')
  assert.equal(entry.senses.length, 1)
  assert.equal((await call(store, 'POST', '/entries', { lexeme: 'Epokolo' })).status, 409)
  const second = await call(store, 'POST', '/entries', { lexeme: 'Epokolo', homograph: '2' })
  assert.notEqual(second.json.entry.id, entry.id)
  assert.notEqual(second.json.entry.senses[0].id, entry.senses[0].id)
  assert.equal((await call(store, 'POST', '/entries', { lexeme: ' ' })).status, 400)
  assert.equal((await call(store, 'DELETE', `/entries/${ELE}`)).status, 409) // exists in LD
  assert.equal((await call(store, 'DELETE', `/entries/${entry.id}`)).status, 200)
})

test('sentences: create and save', async () => {
  const store = memoryStore()
  const created = await call(store, 'POST', '/sentences', {
    text: 'Ele ya mboka',
    translations: { es: 'El árbol del pueblo' },
    senseIds: [SENSE]
  })
  assert.equal(created.status, 201)
  const sentence = created.json.sentence
  sentence.translations.en = 'The tree of the village'
  sentence.translationStatus = { en: 'machine' }
  const saved = await call(store, 'PUT', `/sentences/${sentence.id}`, { sentence, version: 1 })
  assert.equal(saved.status, 200)
  assert.equal(saved.json.sentence.sync.state, 'new')
  // the linked sense lists the sentence as an example; the entry now differs from LD
  assert.deepEqual(store.data.entries[ELE].senses[0].sentenceIds, [sentence.id])
  assert.equal(store.data.entries[ELE].sync.state, 'local-changes')
  // deleting the sentence removes the link again
  await call(store, 'DELETE', `/sentences/${sentence.id}`)
  assert.deepEqual(store.data.entries[ELE].senses[0].sentenceIds, [])
  assert.equal(store.data.entries[ELE].sync.state, 'synced')
})

test('sync state ignores local fields and key order', () => {
  const record = { ...clone(ldEle), siteKeys: ['ele'], review: { category: 'other', note: '?' } }
  assert.equal(syncStateOf(record, ldEle), 'synced')
  assert.equal(syncStateOf({ ...record, phonetic: 'ɛlɛ' }, ldEle), 'local-changes')
  assert.equal(syncStateOf(record, null), 'new')
  assert.equal(
    canonical({ b: 1, a: [2, { d: 1, c: 2 }] }),
    canonical({ a: [2, { c: 2, d: 1 }], b: 1 })
  )
})
