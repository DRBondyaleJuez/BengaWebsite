/**
 * Tests for scripts/lib/living-dictionary.mjs (the Living Dictionaries import). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  uuid5,
  resolvePartOfSpeech,
  resolveSemanticDomain,
  checkRow,
  findDuplicates,
  ldClient
} from '../lib/living-dictionary.mjs'

const audioFiles = new Map([
  ['epokolo.wav', 1000],
  ['big.mp3', 30 * 1024 * 1024]
])
const context = { dictionary: 'benga', line: 2, audioFiles }

test('uuid5 matches the RFC 4122 reference value', () => {
  // Python: uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')
  assert.equal(
    uuid5('python.org', '6ba7b810-9dad-11d1-80b4-00c04fd430c8'),
    '886313e1-3b8a-5372-9b90-0c9aee199e5d'
  )
})

test('parts of speech and semantic domains: code, English or Spanish name', () => {
  assert.equal(resolvePartOfSpeech('Sustantivo'), 'n')
  assert.equal(resolvePartOfSpeech('noun'), 'n')
  assert.equal(resolvePartOfSpeech('ADJ'), 'adj')
  assert.equal(resolvePartOfSpeech('palabra rara'), null)
  assert.equal(resolveSemanticDomain('5.3'), '5.3')
  assert.equal(resolveSemanticDomain('1.10'), '1.10')
  assert.equal(resolveSemanticDomain('ropa y adornos'), '5.4')
  assert.equal(resolveSemanticDomain('Body parts'), '2.1')
  assert.equal(resolveSemanticDomain('Cocina benga'), null)
})

test('a complete row becomes an entry with sense, example and audio', () => {
  const row = {
    word: 'Epokolo',
    plural: 'Bepokolo',
    gloss_es: 'Sombrero',
    gloss_en: 'Hat',
    part_of_speech: 'sustantivo',
    semantic_domain: 'Ropa y adornos; 5.1',
    noun_class: '1',
    example: 'Epokolo bobe',
    example_es: 'Sombrero malo',
    audio: 'Epokolo.WAV',
    speaker: 'Ana',
    book_page: '14'
  }
  const result = checkRow(row, { ...context, cite: 'salvado-y-cos' })
  assert.deepEqual(result.errors, [])
  assert.equal(result.key, 'epokolo')
  const sense = result.entry.senses[0]
  assert.deepEqual(sense.glosses, { es: 'Sombrero', en: 'Hat' })
  assert.deepEqual(sense.parts_of_speech, ['n'])
  assert.deepEqual(sense.semantic_domains, ['5.4', '5.1'])
  assert.equal(sense.plural_form, 'Bepokolo')
  assert.equal(sense.noun_class, '1')
  assert.equal(sense.example_sentences[0].text, 'Epokolo bobe')
  assert.deepEqual(result.entry.citations, [{ slug: 'salvado-y-cos', locator: 'p. 14' }])
  assert.equal(result.audio.length, 1)
  assert.equal(result.audio[0].ownerId, result.entry.id)
  assert.equal(result.audio[0].speaker, 'Ana')
  // Same row → same ids (sending twice is harmless)
  assert.equal(checkRow(row, context).entry.id, result.entry.id)
  assert.notEqual(checkRow({ ...row, homograph: '2' }, context).entry.id, result.entry.id)
})

test('problems: missing word or gloss, missing or too big audio, orthography', () => {
  const missing = checkRow({ gloss_es: 'x' }, context)
  assert.ok(missing.errors.some((e) => e.includes('falta la palabra')))
  const noGloss = checkRow({ word: 'Bova' }, context)
  assert.ok(noGloss.errors.some((e) => e.includes('falta la traducción')))
  const audio = checkRow({ word: 'Bova', gloss_es: 'Don', audio: 'nope.mp3' }, context)
  assert.ok(audio.errors.some((e) => e.includes('no está en la carpeta')))
  const big = checkRow({ word: 'Bova', gloss_es: 'Don', audio: 'big.mp3' }, context)
  assert.ok(big.errors.some((e) => e.includes('25 MB')))
  const spelling = checkRow({ word: 'Cará', gloss_es: 'x' }, context)
  assert.equal(spelling.warnings.filter((w) => w.includes('Cará')).length, 2)
  const exampleAudio = checkRow(
    { word: 'Bova', gloss_es: 'Don', example_audio: 'epokolo.wav' },
    context
  )
  assert.ok(exampleAudio.errors.some((e) => e.includes('audio del ejemplo')))
})

test('the same word twice without a homograph number is an error', () => {
  const rows = [
    checkRow({ word: 'Bova', gloss_es: 'Don' }, { ...context, line: 2 }),
    checkRow({ word: 'bova', gloss_es: 'Otro' }, { ...context, line: 3 }),
    checkRow({ word: 'Bova', homograph: '2', gloss_es: 'Otro' }, { ...context, line: 4 })
  ]
  findDuplicates(rows)
  assert.equal(rows[1].errors.length, 1)
  assert.equal(rows[2].errors.length, 0)
})

test('client: bearer key, dictionary in the path, batch body, no redirects', async () => {
  const calls = []
  const fakeFetch = async (url, options) => {
    calls.push({ url, options })
    return new Response(JSON.stringify({ results: [{ status: 'created' }] }), { status: 200 })
  }
  const client = ldClient({
    apiKey: 'ldk_test',
    dictionary: 'benga',
    base: 'https://x/api/v1',
    fetchImpl: fakeFetch
  })
  await client.postEntries([{ lexeme: 'Bova' }], 'batch-1')
  const [call] = calls
  assert.equal(call.url, 'https://x/api/v1/dictionaries/benga/entries')
  assert.equal(call.options.method, 'POST')
  assert.equal(call.options.headers.Authorization, 'Bearer ldk_test')
  assert.equal(call.options.redirect, 'error')
  assert.deepEqual(JSON.parse(call.options.body), {
    entries: [{ lexeme: 'Bova' }],
    import_id: 'batch-1'
  })

  const failing = ldClient({
    apiKey: 'ldk_test',
    dictionary: 'benga',
    fetchImpl: async () => new Response(JSON.stringify({ error: 'bad key' }), { status: 401 })
  })
  await assert.rejects(failing.speakers(), /401: bad key/)
})
