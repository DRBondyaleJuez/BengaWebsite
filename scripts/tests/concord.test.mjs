/**
 * Tests for src/utils/concord.js (variable adjectives: class prefix + stem). Run: npm test
 * The expected forms are the book's own table (PDF p. 18), as shown on /capitulo-3/adjetivos-regulares.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { inflect } from '../../src/utils/concord.js'
import { ROOT } from '../lib/collect-words.mjs'

const lexicon = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/lexicon/adjectives.json'), 'utf8')
).entries

test('regular adjectives: class prefix + stem', () => {
  const bobe = lexicon.bobe
  assert.equal(inflect(bobe, 1, 'singular'), 'ebe')
  assert.equal(inflect(bobe, 2, 'plural'), 'mabe')
  assert.equal(inflect(bobe, 4, 'singular'), 'bobe')
  assert.equal(inflect(bobe, 6, 'plural'), 'lobe')
  assert.equal(inflect(lexicon.bovindo, 5, 'plural'), 'bavindo')
})

test('irregular forms come from the entry (būamu takes a linking y)', () => {
  const buamu = lexicon.b_u_amu
  assert.equal(inflect(buamu, 1, 'singular'), 'eyamu')
  assert.equal(inflect(buamu, 2, 'plural'), 'maiyamu')
  assert.equal(inflect(buamu, 6, 'plural'), 'loyamu')
})

test('invariable adjectives never change', () => {
  assert.equal(inflect(lexicon.tanana, 3, 'plural'), 'Tanana')
})
