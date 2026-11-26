import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffText } from '../../src/utils/textDiff.js'

test('diffText marks what is only in each text', () => {
  assert.deepEqual(diffText('Hāngā', 'Hanga'), [
    { type: 'same', text: 'H' },
    { type: 'del', text: 'ā' },
    { type: 'ins', text: 'a' },
    { type: 'same', text: 'ng' },
    { type: 'del', text: 'ā' },
    { type: 'ins', text: 'a' }
  ])
  assert.deepEqual(diffText('7ª Clase', '7'), [
    { type: 'same', text: '7' },
    { type: 'del', text: 'ª Clase' }
  ])
  assert.deepEqual(diffText('', 'Ele'), [{ type: 'ins', text: 'Ele' }])
  assert.deepEqual(diffText(null, null), [])
})

test('diffText compares in NFC (decomposed accents are the same letter)', () => {
  assert.deepEqual(diffText('Hāngā', 'Hāngā'), [{ type: 'same', text: 'Hāngā' }])
})
