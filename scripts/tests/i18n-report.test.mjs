/**
 * Tests for scripts/lib/i18n-report.mjs (npm run i18n:report). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  flattenMessages,
  messageParams,
  compareLocale,
  dataCoverage,
  percent
} from '../lib/i18n-report.mjs'

test('locale files are compared key by key with Spanish', () => {
  const es = { home: { title: 'Inicio', count: '{n} palabras', only: 'Solo en español' } }
  const en = { home: { title: 'Home', count: '{number} words' }, old: 'Unused' }
  const result = compareLocale(es, en)
  assert.equal(result.total, 3)
  assert.equal(result.translated, 2)
  assert.deepEqual(result.missing, ['home.only'])
  assert.deepEqual(result.params, ['home.count']) // {n} vs {number}
  assert.deepEqual(result.extra, ['old'])
})

test('parameters ignore literal characters', () => {
  assert.deepEqual(messageParams("Clase {number} {'@'} {name}"), ['name', 'number'])
  assert.deepEqual(flattenMessages({ a: { b: 'x' }, c: 'y' }), { 'a.b': 'x', c: 'y' })
})

test('data files: every { es } text is counted, Benga words are not', () => {
  const data = {
    entries: {
      epokolo: {
        singular: { word: 'Epokolo' },
        meaning: { es: 'Sombrero', en: 'Hat' },
        meaningPlural: { es: 'Sombreros', en: 'Hats', fr: 'Chapeaux' }
      }
    },
    notes: [{ es: 'Nota' }]
  }
  const result = dataCoverage(data)
  assert.equal(result.total, 3)
  assert.equal(result.en, 2)
  assert.equal(result.fr, 1)
  assert.deepEqual(result.missing.en, ['notes[0]'])
  assert.deepEqual(result.missing.fr, ['entries.epokolo.meaning', 'notes[0]'])
  assert.equal(percent(2, 3), '66 %')
})
