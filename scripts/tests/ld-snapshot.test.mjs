/**
 * Tests for scripts/lib/ld/snapshot.mjs and workspace.mjs (snapshot rows → workspace records).
 * A fake database answers by table name, so no SQLite is needed. Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readSnapshot, cleanMulti, vernacular } from '../lib/ld/snapshot.mjs'
import { toWorkspaceRecord } from '../lib/ld/workspace.mjs'
import { loadSchemas } from '../lib/schemas.mjs'

const ENTRY = '1820bdc3-3418-4600-862f-3692f6a36bd8'
const SENSE = '5b2a1f0e-6c1d-4f8a-9a3e-2d4c6b8e0f12'
const SENTENCE = '9d0e3c2b-1a4f-4b6e-8c7d-5e6f7a8b9c0d'
const AUDIO = '0ea67f0a-4ae1-4484-bc15-04000e8077ae'

const tables = {
  entries: [
    {
      id: ENTRY,
      lexeme: '{"default":"Ele"}',
      homograph: null,
      phonetic: '',
      notes: '{"es":""}',
      scientific_names: null,
      citations: '[{"slug":"salvado-y-cos-1891","locator":"p. 14"}]',
      review: null,
      updated_at: '2026-03-01T21:58:27.715Z'
    }
  ],
  senses: [
    {
      id: SENSE,
      entry_id: ENTRY,
      glosses: '{"en":"Tree","es":"Árbol","fr":"Arbre"}',
      definition: '{"es":""}',
      parts_of_speech: '["n"]',
      semantic_domains: '["1.4","5.2"]',
      noun_class: '1ª Clase',
      plural_form: '{"default":"Bele"}'
    }
  ],
  sentences: [
    {
      id: SENTENCE,
      text: '{"default":"Ele ya mboka endi na malongo"}',
      translation: '{"es":"El árbol del pueblo tiene flores","en":""}',
      translation_meta: '{"es":{"status":"reviewed"}}',
      updated_at: '2026-03-01T21:58:27.715Z'
    }
  ],
  senses_in_sentences: [{ sense_id: SENSE, sentence_id: SENTENCE }],
  audio: [{ id: AUDIO, entry_id: ENTRY, storage_path: 'benga/audio/a.wav' }],
  audio_speakers: [{ audio_id: AUDIO, speaker_id: 'spk-1' }],
  tags: [{ id: 't1', name: 'benga-portal-2026', private: 1 }],
  entry_tags: [{ entry_id: ENTRY, tag_id: 't1' }],
  speakers: [{ id: 'spk-1', name: 'Upango Bondyale Oko' }]
}
const fakeDb = {
  prepare: (sql) => ({
    all: () => {
      if (sql.includes('sqlite_master')) {
        const name = sql.match(/name = '(\w+)'/)[1]
        return tables[name] ? [{ name }] : []
      }
      return tables[sql.match(/FROM (\w+)/)[1]] || []
    }
  })
}

test('multi-language values: empty texts dropped, vernacular read', () => {
  assert.deepEqual(cleanMulti('{"es":"","en":"Tree"}'), { en: 'Tree' })
  assert.equal(cleanMulti('{"es":""}'), null)
  assert.equal(vernacular('{"default":"Benâ"}'), 'Benâ')
  assert.equal(vernacular(null), null)
})

test('snapshot rows become entries and sentences with links, audio and speakers', () => {
  const { entries, sentences } = readSnapshot(fakeDb)
  const entry = entries[ENTRY]
  assert.equal(entry.lexeme, 'Ele')
  assert.equal(entry.phonetic, null)
  assert.equal(entry.notes, null)
  assert.deepEqual(entry.tags, []) // private import tags are not content
  const [sense] = entry.senses
  assert.deepEqual(sense.glosses, { en: 'Tree', es: 'Árbol', fr: 'Arbre' })
  assert.equal(sense.definition, null)
  assert.equal(sense.nounClass, '1ª Clase') // copied as it is, never "corrected"
  assert.equal(sense.pluralForm, 'Bele')
  assert.deepEqual(sense.sentenceIds, [SENTENCE])
  assert.deepEqual(entry.audio, [
    { id: AUDIO, storagePath: 'benga/audio/a.wav', speakerIds: ['spk-1'] }
  ])
  const sentence = sentences[SENTENCE]
  assert.deepEqual(sentence.translations, { es: 'El árbol del pueblo tiene flores' })
  assert.deepEqual(sentence.translationStatus, { es: 'reviewed' })
  assert.deepEqual(sentence.senseIds, [SENSE])
})

test('records follow the dictionary schema (base and workspace)', () => {
  const check = loadSchemas()
  const { entries, sentences } = readSnapshot(fakeDb)
  const base = { kind: 'base', pulledAt: 'x', entries, sentences }
  assert.deepEqual(check('dictionary', base).errors, [])
  const previous = {
    siteKeys: ['ele'],
    review: null,
    suggestions: [],
    sync: { state: 'synced', version: 4 }
  }
  const record = toWorkspaceRecord(entries[ENTRY], previous)
  assert.equal(record.updatedAt, undefined)
  assert.deepEqual(record.siteKeys, ['ele'])
  assert.deepEqual(record.sync, {
    state: 'synced',
    ldUpdatedAt: '2026-03-01T21:58:27.715Z',
    version: 4,
    lastError: null
  })
  const workspace = { kind: 'entries', entries: { [ENTRY]: record } }
  assert.deepEqual(check('dictionary', workspace).errors, [])
})
