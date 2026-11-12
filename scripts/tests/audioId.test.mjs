/**
 * Tests for the word-key rule (src/utils/audioId.js).
 * Run with:  npm test
 *
 * Each line reads: the word on the left must give the key on the right.
 * If you change the rule in AGENTS.md, change these examples first.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toAudioId } from '../../src/utils/audioId.js'

test('examples from AGENTS.md', () => {
  assert.equal(toAudioId('Whâki'), 'wh_a_ki')
  assert.equal(toAudioId('Mabē'), 'mab_e_')
  assert.equal(toAudioId('Mūadi'), 'm_u_adi')
  assert.equal(toAudioId('Mūēngi'), 'm_u_e_ngi') // two accents in a row share one "_"
})

test('plain words are only lower-cased', () => {
  assert.equal(toAudioId('Epokolo'), 'epokolo')
  assert.equal(toAudioId('EPOKOLO'), 'epokolo')
})

test('several words are joined with a hyphen', () => {
  assert.equal(toAudioId('Pēki Pēki'), 'p_e_ki-p_e_ki')
  assert.equal(toAudioId('Ekâi ebe'), 'ek_a_i-ebe')
  assert.equal(toAudioId('De de de'), 'de-de-de')
  assert.equal(toAudioId('  Bokolo   bokolo '), 'bokolo-bokolo') // extra spaces ignored
})

test('a hyphen inside a form also becomes a single hyphen', () => {
  assert.equal(toAudioId('Pēki-Pēki'), 'p_e_ki-p_e_ki')
})

test('punctuation is dropped', () => {
  assert.equal(toAudioId('Mbo?'), 'mbo')
  assert.equal(toAudioId('(Ekâi)'), 'ek_a_i')
  assert.equal(toAudioId('Ekâi, ebe.'), 'ek_a_i-ebe')
})

test('different accent marks on the same letter give the same key', () => {
  // The online Living Dictionary writes "Hāngā"; the site writes "Hângâ".
  assert.equal(toAudioId('Hāngā'), toAudioId('Hângâ'))
  assert.equal(toAudioId('Hângâ'), 'h_a_ng_a_')
})

test('a word starting with an accented vowel', () => {
  assert.equal(toAudioId('ūaūa'), '_u_a_u_a')
})

test('empty input gives null', () => {
  assert.equal(toAudioId(''), null)
  assert.equal(toAudioId('  '), null)
  assert.equal(toAudioId('?!'), null)
  assert.equal(toAudioId(null), null)
  assert.equal(toAudioId(undefined), null)
})
