/**
 * Tests for localized() (src/utils/localized.js). Run with:  npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { localized } from '../../src/utils/localized.js'

const hat = { es: 'Sombrero', en: 'Hat', fr: 'Chapeau' }

test('returns the text in the requested language', () => {
  assert.equal(localized(hat, 'es'), 'Sombrero')
  assert.equal(localized(hat, 'en'), 'Hat')
  assert.equal(localized(hat, 'fr'), 'Chapeau')
})

test('falls back to Spanish when the translation is missing or empty', () => {
  assert.equal(localized({ es: 'Sombrero' }, 'fr'), 'Sombrero')
  assert.equal(localized({ es: 'Sombrero', en: '' }, 'en'), 'Sombrero')
  assert.equal(localized({ es: 'Sombrero' }, 'de'), 'Sombrero') // unknown language
})

test('another fallback language can be chosen', () => {
  assert.equal(localized({ en: 'Hat' }, 'fr', 'en'), 'Hat')
})

test('plain strings (e.g. Benga words) pass through unchanged', () => {
  assert.equal(localized('Epokolo', 'en'), 'Epokolo')
  assert.equal(localized(7, 'es'), '7')
})

test('nothing to show gives an empty string, never "undefined"', () => {
  assert.equal(localized(null, 'es'), '')
  assert.equal(localized(undefined, 'es'), '')
  assert.equal(localized({}, 'es'), '')
  assert.equal(localized({ en: 'Hat' }, 'fr'), '') // neither French nor Spanish
})
