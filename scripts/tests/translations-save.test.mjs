/**
 * Tests for scripts/lib/translations-save.mjs (the writer of /admin/translations). Run: npm test
 * Only the pure parts: nothing here touches the real content files.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  setAtPath,
  orderTranslated,
  orderLike,
  dropEmptyGroups,
  saveTranslations
} from '../lib/translations-save.mjs'

test('setAtPath changes or removes a value, and refuses wrong paths', () => {
  const data = { entries: { bova: { meaning: { es: 'Don' } } } }
  setAtPath(data, ['entries', 'bova', 'meaning', 'es'], 'Regalo')
  assert.equal(data.entries.bova.meaning.es, 'Regalo')
  assert.throws(() => setAtPath(data, ['entries', 'bova', 'typo', 'es'], 'x'), /not found/)
  assert.throws(
    () => setAtPath(data, ['entries', 'bova', 'meaning', 'en'], 'Gift'),
    /does not exist/
  )
  setAtPath(data, ['entries', 'bova', 'meaning', 'en'], 'Gift', { createLast: true })
  assert.equal(data.entries.bova.meaning.en, 'Gift')
  setAtPath(data, ['entries', 'bova', 'meaning', 'en'], null)
  assert.ok(!('en' in data.entries.bova.meaning))
  const locale = {}
  setAtPath(locale, ['pages', 'home', 'welcome'], 'Welcome', {
    createParents: true,
    createLast: true
  })
  assert.deepEqual(locale, { pages: { home: { welcome: 'Welcome' } } })
})

test('translated texts keep the order es, en, fr', () => {
  const data = { a: [{ fr: 'Chapeau', es: 'Sombrero', en: 'Hat' }], b: { word: 'Epokolo' } }
  const ordered = orderTranslated(data)
  assert.deepEqual(Object.keys(ordered.a[0]), ['es', 'en', 'fr'])
  assert.deepEqual(ordered.b, { word: 'Epokolo' })
})

test('en.json / fr.json follow the key order of es.json', () => {
  const es = { a: '1', g: { x: '1', y: '2' }, z: '3' }
  const en = { z: 'three', g: { y: 'two', x: 'one' }, extra: 'e', a: 'one' }
  assert.equal(
    JSON.stringify(orderLike(es, en)),
    JSON.stringify({ a: 'one', g: { x: 'one', y: 'two' }, z: 'three', extra: 'e' })
  )
  assert.deepEqual(dropEmptyGroups({ a: { b: {} }, c: 'x' }), { c: 'x' })
})

test('wrong edits are refused before anything is written', async () => {
  await assert.rejects(
    saveTranslations({ edits: [{ file: 'package.json', path: ['name'], value: 'x' }] }),
    /not allowed/
  )
  await assert.rejects(
    saveTranslations({
      edits: [{ file: 'src/data/../../package.json', path: ['name'], value: 'x' }]
    }),
    /not allowed/
  )
  await assert.rejects(
    saveTranslations({
      edits: [{ file: 'src/locales/es.json', path: ['nav', 'home'], value: '' }]
    }),
    /can be removed/
  )
  await assert.rejects(
    saveTranslations({
      edits: [
        {
          file: 'src/data/lexicon/nouns.json',
          path: ['entries', 'nope', 'meaning', 'es'],
          value: 'x'
        }
      ]
    }),
    /not found/
  )
  await assert.rejects(saveTranslations({ doubts: [{ id: 'd1' }] }), /needs "id" and "note"/)
})
