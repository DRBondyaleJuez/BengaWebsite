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
  const files = new Map()
  let mediaCount = 0
  return {
    data,
    registry,
    saves,
    files,
    newMediaId: () => `00000000-0000-4000-8000-${String(++mediaCount).padStart(12, '0')}`,
    savePendingMedia: async (name, buffer) => {
      files.set(name, buffer)
      return `ld-sync/pending-media/${name}`
    },
    deletePendingMedia: async (pendingFile) => {
      files.delete(String(pendingFile).split('/').pop())
    },
    pendingMediaPath: (name) => (files.has(name) ? `/tmp/${name}` : null),
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

test('bulk actions: one save, skipped entries explained', async () => {
  const store = memoryStore()
  const created = await call(store, 'POST', '/entries', { lexeme: 'Epokolo' })
  const newId = created.json.entry.id
  store.saves.length = 0
  const ids = [ELE, newId, 'missing']
  const domain = await call(store, 'POST', '/entries/bulk', {
    ids,
    action: 'domain-add',
    value: { key: '5.4' }
  })
  assert.deepEqual(domain.json.changed, [ELE, newId])
  assert.equal(domain.json.skipped[0].reason, 'no existe')
  assert.deepEqual(store.saves, ['entries']) // one write for all
  assert.deepEqual(store.data.entries[ELE].senses[0].semanticDomains, ['5.4'])
  assert.equal(store.data.entries[ELE].sync.state, 'local-changes')
  assert.equal(store.data.entries[newId].sync.state, 'new')

  const again = await call(store, 'POST', '/entries/bulk', {
    ids: [ELE],
    action: 'domain-add',
    value: { key: '5.4' }
  })
  assert.equal(again.json.skipped[0].reason, 'ya lo tenía')

  const review = await call(store, 'POST', '/entries/bulk', {
    ids: [ELE],
    action: 'review-set',
    value: { category: 'other', note: '¿Es correcto?' }
  })
  assert.deepEqual(review.json.changed, [ELE])
  assert.equal(store.data.entries[ELE].review.by, 'human')
  assert.equal(store.data.entries[ELE].sync.state, 'local-changes') // review is local only

  const bad = await call(store, 'POST', '/entries/bulk', {
    ids: [ELE],
    action: 'review-set',
    value: {}
  })
  assert.equal(bad.status, 400)
  const unknown = await call(store, 'POST', '/entries/bulk', { ids: [ELE], action: 'explode' })
  assert.equal(unknown.status, 400)
})

test('bulk part of speech only for entries with one sense', async () => {
  const store = memoryStore()
  store.data.entries[ELE].senses.push({
    id: '6b2a1f0e-6c1d-4f8a-9a3e-2d4c6b8e0f12',
    partsOfSpeech: [],
    sentenceIds: []
  })
  const result = await call(store, 'POST', '/entries/bulk', {
    ids: [ELE],
    action: 'pos-set',
    value: { code: 'v' }
  })
  assert.deepEqual(result.json.changed, [])
  assert.match(result.json.skipped[0].reason, /varios sentidos/)
})

// ---- media (task L4.5 / L4.6) ----------------------------------------------------------------

const wavBody = (extra = {}) => ({
  kind: 'audio',
  fileName: 'toma.wav',
  dataBase64: Buffer.from('RIFFdata').toString('base64'),
  speakerId: '024ea143-a828-4ab7-ac73-9bcbb7e15d75',
  ...extra
})

test('new audio is kept as a pending file and marks the entry as changed', async () => {
  const store = memoryStore()
  const { status, json } = await call(store, 'POST', `/entries/${ELE}/media`, wavBody())
  assert.equal(status, 201)
  const [audio] = json.entry.audio
  assert.equal(audio.storagePath, null)
  assert.match(audio.pendingFile, /^ld-sync\/pending-media\/0{8}-0000-4000-8000-0{11}1\.wav$/)
  assert.deepEqual(audio.speakerIds, ['024ea143-a828-4ab7-ac73-9bcbb7e15d75'])
  assert.equal(json.entry.sync.state, 'local-changes')
  assert.equal(json.entry.sync.version, 1)
  assert.equal(store.files.size, 1)
  assert.equal(store.files.get(`${audio.id}.wav`).toString(), 'RIFFdata')
})

test('new audio for a sentence; photos only for words', async () => {
  const store = memoryStore()
  const created = await call(store, 'POST', '/sentences', { text: 'Akeva na beja' })
  const sentenceId = created.json.sentence.id
  const ok = await call(store, 'POST', `/sentences/${sentenceId}/media`, wavBody())
  assert.equal(ok.status, 201)
  assert.equal(ok.json.sentence.audio.length, 1)
  assert.equal(ok.json.sentence.sync.state, 'new')
  const photo = await call(
    store,
    'POST',
    `/sentences/${sentenceId}/media`,
    wavBody({ kind: 'photo', fileName: 'a.jpg' })
  )
  assert.equal(photo.status, 400)
})

test('a photo goes to the chosen sense', async () => {
  const store = memoryStore()
  const body = wavBody({ kind: 'photo', fileName: 'ele.PNG', senseId: SENSE, photographer: 'Ana' })
  const { status, json } = await call(store, 'POST', `/entries/${ELE}/media`, body)
  assert.equal(status, 201)
  const [photo] = json.entry.senses[0].photos
  assert.equal(photo.photographer, 'Ana')
  assert.match(photo.pendingFile, /\.png$/)
  const noSense = await call(store, 'POST', `/entries/${ELE}/media`, { ...body, senseId: 'nope' })
  assert.equal(noSense.status, 400)
})

test('media is refused when the format or size is wrong, and nothing is kept', async () => {
  const store = memoryStore()
  const bad = await call(store, 'POST', `/entries/${ELE}/media`, wavBody({ fileName: 'a.exe' }))
  assert.equal(bad.status, 400)
  assert.match(bad.json.error, /Formato/)
  const empty = await call(store, 'POST', `/entries/${ELE}/media`, wavBody({ dataBase64: '' }))
  assert.equal(empty.status, 400)
  assert.equal((await call(store, 'POST', `/entries/nope/media`, wavBody())).status, 404)
  assert.equal(store.files.size, 0)
  assert.equal(store.data.entries[ELE].audio.length, 0)
})

test('only pending media can be removed, and its file goes with it', async () => {
  const store = memoryStore()
  const added = await call(store, 'POST', `/entries/${ELE}/media`, wavBody())
  const mediaId = added.json.entry.audio[0].id
  const removed = await call(store, 'DELETE', `/entries/${ELE}/media/${mediaId}`)
  assert.equal(removed.status, 200)
  assert.equal(removed.json.entry.audio.length, 0)
  assert.equal(store.files.size, 0)
  assert.equal(removed.json.entry.sync.state, 'synced')
  assert.equal((await call(store, 'DELETE', `/entries/${ELE}/media/${mediaId}`)).status, 404)

  // a recording that is already in Living Dictionaries is not removed here
  store.data.entries[ELE].audio = [{ id: 'a1', storagePath: 'benga/audio/a1.wav', speakerIds: [] }]
  const sent = await call(store, 'DELETE', `/entries/${ELE}/media/a1`)
  assert.equal(sent.status, 409)
})

test('pending files are served by exact name only', async () => {
  const store = memoryStore()
  const added = await call(store, 'POST', `/entries/${ELE}/media`, wavBody())
  const name = added.json.entry.audio[0].pendingFile.split('/').pop()
  const file = await call(store, 'GET', `/pending-media/${name}`)
  assert.equal(file.status, 200)
  assert.equal(file.contentType, 'audio/wav')
  assert.ok(file.file.endsWith(name))
  assert.equal((await call(store, 'GET', '/pending-media/..%2f..%2f.env')).status, 404)
  assert.equal((await call(store, 'GET', '/pending-media/../entries.json')).status, 404)
  assert.equal((await call(store, 'GET', '/pending-media/0.wav')).status, 404)
})
