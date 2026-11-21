/**
 * Tests for the audio and dictionary link rules (src/utils/linkRules.js). Run with:  npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { audioUrlFor, dictionarySearchUrl, dictionaryUrlFor } from '../../src/utils/linkRules.js'

const AUDIO = 'https://res.cloudinary.com/demo/video/upload'
const BASES = {
  entryBase: 'https://livingdictionaries.app/benga/entry',
  searchBase: 'https://livingdictionaries.app/benga/entries'
}
const ENA_ID = '9b0fb8a4-e76e-4d83-bf79-32a6dd3f23cc'

test('audio: only recorded words get a URL', () => {
  assert.equal(audioUrlFor('en_a_', { audio: 'recorded' }, AUDIO), `${AUDIO}/en_a_.mp3`)
  assert.equal(audioUrlFor('en_a_', { audio: 'missing' }, AUDIO), null)
  assert.equal(audioUrlFor('en_a_', null, AUDIO), null) // word not in the registry
  assert.equal(audioUrlFor(null, { audio: 'recorded' }, AUDIO), null) // no key (no letters)
})

test('audio: audioFile replaces the key as file name', () => {
  assert.equal(
    audioUrlFor('en_a_', { audio: 'recorded', audioFile: 'ena-v2' }, AUDIO),
    `${AUDIO}/ena-v2.mp3`
  )
})

test('dictionary: exact entry when the id is known', () => {
  assert.equal(
    dictionaryUrlFor('Enâ', { livingDictionaryId: ENA_ID }, BASES),
    `${BASES.entryBase}/${ENA_ID}`
  )
})

test('dictionary: search when there is no id (or no registry entry)', () => {
  const search = `${BASES.searchBase}?q=%7B%22query%22%3A%22epokolo%22%7D`
  assert.equal(dictionaryUrlFor('Epokolo', { livingDictionaryId: null }, BASES), search)
  assert.equal(dictionaryUrlFor('Epokolo', null, BASES), search)
})

test('dictionary search: lower-case word inside q={"query": …}, accents kept', () => {
  const url = dictionarySearchUrl('Enâ', BASES.searchBase)
  const q = new URL(url).searchParams.get('q')
  assert.deepEqual(JSON.parse(q), { query: 'enâ' })
})
