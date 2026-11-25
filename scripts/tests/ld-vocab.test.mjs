import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PARTS_OF_SPEECH,
  PART_OF_SPEECH_GROUPS,
  SEMANTIC_DOMAINS,
  RELATION_TYPES,
  REVIEW_CATEGORIES,
  resolvePartOfSpeech,
  resolveSemanticDomain,
  posLabel,
  domainLabel
} from '../lib/ld/vocab.mjs'

test('parts of speech: unique codes, each in exactly one group', () => {
  const codes = PARTS_OF_SPEECH.map((p) => p.code)
  assert.equal(new Set(codes).size, codes.length)
  assert.equal(codes.length, 91)
  const grouped = PART_OF_SPEECH_GROUPS.flatMap((g) => g.codes)
  assert.equal(grouped.length, new Set(grouped).size)
  assert.deepEqual([...grouped].sort(), [...codes].sort())
  for (const p of PARTS_OF_SPEECH) assert.ok(p.es && p.en && p.help.es, p.code)
})

test('every Spanish and English label resolves to its code', () => {
  for (const p of PARTS_OF_SPEECH) {
    assert.equal(resolvePartOfSpeech(p.code), p.code)
    assert.equal(resolvePartOfSpeech(p.es), p.code, p.es)
    assert.equal(resolvePartOfSpeech(p.en), p.code, p.en)
  }
})

test('part of speech resolver examples', () => {
  assert.equal(resolvePartOfSpeech('Sustantivo'), 'n')
  assert.equal(resolvePartOfSpeech('noun'), 'n')
  assert.equal(resolvePartOfSpeech('ADJ'), 'adj')
  assert.equal(resolvePartOfSpeech('nombre'), 'n')
  assert.equal(resolvePartOfSpeech('expresión'), 'phr')
  assert.equal(resolvePartOfSpeech('num'), 'num')
  assert.equal(resolvePartOfSpeech('número'), 'no')
  assert.equal(resolvePartOfSpeech('palabra rara'), null)
  assert.equal(resolvePartOfSpeech(''), null)
  assert.equal(posLabel('adj'), 'adjetivo')
  assert.equal(posLabel('adj', 'en'), 'adjective')
})

test('semantic domains: unique keys, parents exist', () => {
  const keys = SEMANTIC_DOMAINS.map((d) => d.key)
  assert.equal(new Set(keys).size, keys.length)
  assert.equal(keys.length, 69)
  for (const d of SEMANTIC_DOMAINS) {
    assert.ok(d.es && d.en, d.key)
    if (d.parent !== null) assert.ok(keys.includes(d.parent), d.key)
  }
})

test('semantic domain resolver examples', () => {
  assert.equal(resolveSemanticDomain('5.3'), '5.3')
  assert.equal(resolveSemanticDomain('1.10'), '1.10')
  assert.equal(resolveSemanticDomain('ropa y adornos'), '5.4')
  assert.equal(resolveSemanticDomain('Body parts'), '2.1')
  assert.equal(resolveSemanticDomain('Cocina benga'), null)
  for (const d of SEMANTIC_DOMAINS) assert.equal(resolveSemanticDomain(d.es), d.key, d.es)
  assert.equal(domainLabel('2.1'), 'Partes del cuerpo')
})

test('relation types: inverses point back, symmetric ones have none', () => {
  const byType = new Map(RELATION_TYPES.map((r) => [r.type, r]))
  assert.equal(byType.size, RELATION_TYPES.length)
  for (const r of RELATION_TYPES) {
    assert.ok(r.es && r.help.es, r.type)
    if (r.symmetric) assert.equal(r.inverse, null, r.type)
    else assert.equal(byType.get(r.inverse)?.inverse, r.type, r.type)
  }
})

test('review categories are unique and complete', () => {
  const ids = REVIEW_CATEGORIES.map((c) => c.id)
  assert.equal(new Set(ids).size, 10)
  assert.ok(ids.includes('other'))
})
