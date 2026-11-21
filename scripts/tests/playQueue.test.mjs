/**
 * Tests for src/utils/playQueue.js (what «play all» plays). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { playableUrls } from '../../src/utils/playQueue.js'

test('only recorded words, in order, each file once', () => {
  const urlOf = (word) => (word === 'Mova' ? null : `x/${word}.mp3`)
  assert.deepEqual(playableUrls(['Bova', 'Mova', null, 'Ekâi', 'Bova'], urlOf), [
    'x/Bova.mp3',
    'x/Ekâi.mp3'
  ])
  assert.deepEqual(playableUrls([], urlOf), [])
})
