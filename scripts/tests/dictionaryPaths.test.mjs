/** Tests for src/utils/dictionaryPaths.js and dictionaryForm.js. Run: npm test */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  parsePath,
  getPath,
  setPath,
  setField,
  isEmptyValue,
  withLanguage,
  canonicalJson
} from '../../src/utils/dictionaryPaths.js'
import {
  nounClassChoice,
  emptySense,
  findSimilar,
  insertAt
} from '../../src/utils/dictionaryForm.js'

test('parsePath understands dots and array positions', () => {
  assert.deepEqual(parsePath('senses[0].glosses.fr'), ['senses', 0, 'glosses', 'fr'])
  assert.deepEqual(parsePath('lexeme'), ['lexeme'])
  assert.deepEqual(parsePath('a[1][2]'), ['a', 1, 2])
  assert.throws(() => parsePath('senses[x]'))
  assert.throws(() => parsePath(''))
})

test('getPath returns undefined for missing steps', () => {
  const entry = { senses: [{ glosses: { es: 'Árbol' } }], lexeme: 'Ele' }
  assert.equal(getPath(entry, 'senses[0].glosses.es'), 'Árbol')
  assert.equal(getPath(entry, 'senses[1].glosses.es'), undefined)
  assert.equal(getPath(entry, 'senses[0].glosses.fr.x'), undefined)
  assert.equal(getPath({ senses: [{ glosses: null }] }, 'senses[0].glosses.es'), undefined)
})

test('setPath creates what is missing and removes with undefined', () => {
  const entry = { senses: [{ glosses: null }] }
  setPath(entry, 'senses[0].glosses.fr', 'Arbre')
  assert.deepEqual(entry.senses[0].glosses, { fr: 'Arbre' })
  setPath(entry, 'notes.es', 'x')
  assert.deepEqual(entry.notes, { es: 'x' })
  setPath(entry, 'tags[0]', 'a')
  assert.deepEqual(entry.tags, ['a'])
  setPath(entry, 'senses[0].glosses.fr', undefined)
  assert.deepEqual(entry.senses[0].glosses, {})
})

test('setField keeps "empty" like the saved record had it', () => {
  const saved = { homograph: null, tags: ['a'], senses: [{ glosses: { es: 'x' } }] }
  const draft = JSON.parse(JSON.stringify(saved))
  setField(draft, saved, 'homograph', '')
  assert.equal(draft.homograph, null)
  setField(draft, saved, 'phonetic', '  ') // saved never had it → stays absent
  assert.ok(!('phonetic' in draft))
  setField(draft, saved, 'tags', [])
  assert.deepEqual(draft.tags, [])
  setField(draft, saved, 'senses[0].glosses', {})
  assert.equal(draft.senses[0].glosses, null)
  setField(draft, saved, 'lexeme', 'Ele')
  assert.equal(draft.lexeme, 'Ele')
})

test('isEmptyValue and withLanguage', () => {
  assert.ok(isEmptyValue({ es: '', en: ' ' }))
  assert.ok(!isEmptyValue({ es: 'a' }))
  assert.ok(!isEmptyValue(0))
  assert.deepEqual(withLanguage({ es: 'a' }, 'en', 'b'), { es: 'a', en: 'b' })
  assert.equal(withLanguage({ es: 'a' }, 'es', ''), null)
  assert.deepEqual(withLanguage(null, 'fr', 'x'), { fr: 'x' })
})

test('canonicalJson ignores key order and undefined', () => {
  const one = canonicalJson({ b: 1, a: [1, { d: 1, c: undefined }] })
  assert.equal(one, canonicalJson({ a: [1, { d: 1 }], b: 1 }))
  assert.notEqual(canonicalJson({ a: null }), canonicalJson({}))
})

test('nounClassChoice, emptySense', () => {
  assert.equal(nounClassChoice('3'), '3')
  assert.equal(nounClassChoice(null), '')
  assert.equal(nounClassChoice('8'), 'otra')
  assert.equal(emptySense('x').id, 'x')
  assert.deepEqual(emptySense('x').partsOfSpeech, [])
})

test('findSimilar: same letters ignoring accents, one letter apart, duplicates', () => {
  const entries = [
    { id: '1', lexeme: 'Ēkâi', homograph: null },
    { id: '2', lexeme: 'Ekaa', homograph: null },
    { id: '3', lexeme: 'Mabē', homograph: '2' },
    { id: '4', lexeme: 'Zzzz' }
  ]
  const found = findSimilar(entries, 'ekai')
  assert.deepEqual(
    found.map((item) => [item.entry.id, item.exact, item.duplicate]),
    [
      ['1', true, true],
      ['2', false, false]
    ]
  )
  assert.equal(findSimilar(entries, 'mabe', '2')[0].duplicate, true)
  assert.equal(findSimilar(entries, 'mabe', '1')[0].duplicate, false)
  assert.deepEqual(
    findSimilar(entries, 'ekai', null, '1').map((i) => i.entry.id),
    ['2']
  )
  assert.deepEqual(findSimilar(entries, ''), [])
  assert.deepEqual(findSimilar(entries, 'abc'), []) // short words must match exactly
})

test('insertAt replaces the selection and returns the caret', () => {
  assert.deepEqual(insertAt('Eke', 3, 3, 'â'), { value: 'Ekeâ', caret: 4 })
  assert.deepEqual(insertAt('Eke', 1, 2, 'ē'), { value: 'Eēe', caret: 2 })
  assert.deepEqual(insertAt('Eke', undefined, undefined, 'ū').value, 'Ekeū')
})
