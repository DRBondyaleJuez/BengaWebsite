/**
 * Tests for the content schemas (src/data/schemas). Run with:  npm test
 *
 * They check three things:
 *   1. the example files are accepted (so the examples in docs/CONTENT-GUIDE.md are correct);
 *   2. the real chapters-index.json is accepted;
 *   3. typical mistakes are rejected (so the rules really protect the content).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { loadSchemas, baseWordOf, SCHEMA_DIR } from '../lib/schemas.mjs'
import { ROOT } from '../lib/collect-words.mjs'
import { toAudioId } from '../../src/utils/audioId.js'

const check = loadSchemas()
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const example = (name) => readJson(path.join(SCHEMA_DIR, 'examples', name))
const clone = (value) => JSON.parse(JSON.stringify(value))

/** Fails with the readable error list, so a broken example is easy to fix. */
function assertValid(name, data) {
  const result = check(name, data)
  assert.ok(result.valid, `${name} should be valid:\n  ${result.errors.join('\n  ')}`)
}
function assertInvalid(name, data, why) {
  assert.equal(check(name, data).valid, false, `${name} should be rejected: ${why}`)
}

test('example files follow their schema', () => {
  assertValid('lexicon', example('lexicon.example.json'))
  assertValid('section', example('section-noun-class-1.example.json'))
  assertValid('section', example('section-verb-kalaka.example.json'))
  assertValid('exercise', example('exercise.example.json'))
})

test('the real chapters-index.json follows its schema', () => {
  assertValid('chapters-index', readJson(path.join(ROOT, 'src/data/chapters-index.json')))
})

test('every example lexicon id is the word key of its base word', () => {
  for (const [id, entry] of Object.entries(example('lexicon.example.json').entries)) {
    assert.equal(id, toAudioId(baseWordOf(entry)), `entry "${id}"`)
  }
})

test('lexicon rejects typical mistakes', () => {
  const base = example('lexicon.example.json')
  const withEntry = (id, entry) => ({ entries: { ...clone(base.entries), [id]: entry } })
  const noun = clone(base.entries.epokolo)

  assertInvalid(
    'lexicon',
    withEntry('epokolo', { ...noun, singular: null, plural: null }),
    'a noun needs a singular or a plural'
  )
  assertInvalid(
    'lexicon',
    withEntry('epokolo', { ...noun, meaning: { en: 'Hat' } }),
    'Spanish meaning is required'
  )
  assertInvalid('lexicon', withEntry('epokolo', { ...noun, nounClass: 8 }), 'noun classes are 1-7')
  assertInvalid(
    'lexicon',
    withEntry('epokolo', { ...noun, audioId: 'x' }),
    'audio ids are never stored'
  )
  assertInvalid('lexicon', withEntry('Epokolo', noun), 'ids are lower-case word keys')
  assertInvalid(
    'lexicon',
    withEntry('epokolo', { ...noun, editorial: { status: 'fixed' } }),
    'unknown editorial status'
  )
  assertInvalid(
    'lexicon',
    withEntry('kalaka', {
      type: 'verb',
      word: 'kalaka',
      meaning: { es: 'hablar' },
      conjugation: 5
    }),
    'conjugations are 1-4'
  )
})

test('unreadable meanings are allowed as null (never guess)', () => {
  const base = example('lexicon.example.json')
  const entries = clone(base.entries)
  entries.epokolo.meaning = null
  assertValid('lexicon', { entries })
})

test('section rejects typical mistakes', () => {
  const section = example('section-noun-class-1.example.json')
  const withBlock = (block) => ({ ...clone(section), blocks: [block] })

  assertInvalid(
    'section',
    withBlock({ type: 'examples', title: { es: 'X' } }),
    'examples need entries or items'
  )
  assertInvalid('section', withBlock({ type: 'note', variant: 'info' }), 'a note needs text')
  assertInvalid('section', withBlock({ type: 'video', url: 'x' }), 'unknown block type')
  assertInvalid(
    'section',
    withBlock({ type: 'paragraph', text: 'texto sin idioma' }),
    'texts must be { es: ... }'
  )
  assertInvalid('section', { ...clone(section), blocks: [] }, 'a section needs at least one block')
})

test('exercise needs items or a generator, not both', () => {
  const exercise = example('exercise.example.json')
  const { generator, ...withoutGenerator } = exercise
  assertInvalid('exercise', withoutGenerator, 'neither items nor generator')
  assertInvalid(
    'exercise',
    { ...exercise, items: [{ prompt: 'Epokolo', answer: 'Bepokolo' }] },
    'both'
  )
  assertValid('exercise', {
    ...withoutGenerator,
    items: [{ prompt: 'Epokolo', answer: 'Bepokolo' }]
  })
  assert.ok(generator)
})
