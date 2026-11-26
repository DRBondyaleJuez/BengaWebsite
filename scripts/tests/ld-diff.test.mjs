import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  canonicalValue,
  diffRecord,
  recordStatus,
  diffWorkspace,
  getPath,
  copyPath,
  mergeRemote,
  isMediaPath
} from '../lib/ld/diff.mjs'

const S1 = '11111111-1111-4111-8111-111111111111'
const S2 = '22222222-2222-4222-8222-222222222222'
const E2 = '33333333-3333-4333-8333-333333333333'

function entry(overrides = {}) {
  return {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    lexeme: 'Ele',
    homograph: null,
    notes: null,
    tags: [],
    senses: [
      {
        id: S1,
        glosses: { es: 'Árbol', en: 'Tree' },
        partsOfSpeech: ['n'],
        semanticDomains: ['1.4'],
        nounClass: '1',
        sentenceIds: []
      }
    ],
    audio: [],
    relations: [],
    ...overrides
  }
}
const withSense = (record, changes) => ({
  ...record,
  senses: record.senses.map((sense, index) => (index === 0 ? { ...sense, ...changes } : sense))
})

test('canonicalValue: empty values are absent, NFC, key order ignored', () => {
  assert.equal(canonicalValue(''), 'null')
  assert.equal(canonicalValue([]), 'null')
  assert.equal(canonicalValue({ es: '' }), 'null')
  assert.equal(canonicalValue({ b: 1, a: 2 }), canonicalValue({ a: 2, b: 1 }))
  assert.equal(canonicalValue('Hāngā'), canonicalValue('Hāngā'))
})

test('no change when only the Unicode form differs', () => {
  const base = entry({ lexeme: 'Hāngā' })
  const local = entry({ lexeme: 'Hāngā' })
  assert.deepEqual(diffRecord(base, local, base, 'entries').local, [])
})

test('multi-language glosses compare per language', () => {
  const base = entry()
  const local = withSense(base, { glosses: { es: 'Árbol', en: 'Tree', fr: 'Arbre' } })
  const remote = withSense(base, { glosses: { es: 'Árbol grande', en: 'Tree' } })
  const diff = diffRecord(base, local, remote, 'entries')
  assert.deepEqual(diff.local, [`senses[${S1}].glosses.fr`])
  assert.deepEqual(diff.remote, [`senses[${S1}].glosses.es`])
  assert.deepEqual(diff.conflicts, [])
})

test('same field changed differently is a conflict; same value is converged', () => {
  const base = entry()
  const local = withSense(base, { nounClass: '2' })
  assert.deepEqual(
    diffRecord(base, local, withSense(base, { nounClass: '3' }), 'entries').conflicts,
    [`senses[${S1}].nounClass`]
  )
  const converged = diffRecord(base, local, withSense(base, { nounClass: '2' }), 'entries')
  assert.deepEqual(converged.conflicts, [])
  assert.deepEqual(converged.converged, [`senses[${S1}].nounClass`])
})

test('arrays: sets ignore order, a different list is one changed path', () => {
  const base = withSense(entry(), { semanticDomains: ['1.4', '5.2'] })
  assert.deepEqual(
    diffRecord(base, withSense(base, { semanticDomains: ['5.2', '1.4'] }), base, 'entries').local,
    []
  )
  assert.deepEqual(
    diffRecord(base, withSense(base, { partsOfSpeech: ['adj'] }), base, 'entries').local,
    [`senses[${S1}].partsOfSpeech`]
  )
})

test('senses are matched by id: an added sense is one path', () => {
  const base = entry()
  const local = {
    ...base,
    senses: [...base.senses, { id: S2, glosses: { es: 'Palo' }, partsOfSpeech: ['n'] }]
  }
  assert.deepEqual(diffRecord(base, local, base, 'entries').local, [`senses[${S2}]`])
})

test('a sense removed here but edited in LD is a conflict', () => {
  const base = entry()
  const local = { ...base, senses: [] }
  const remote = withSense(base, { nounClass: '7' })
  const diff = diffRecord(base, local, remote, 'entries')
  assert.deepEqual(diff.conflicts, [`senses[${S1}]`])
  assert.deepEqual(diff.remote, [])
})

test('relations and media paths', () => {
  const base = entry()
  const local = {
    ...base,
    relations: [{ type: 'synonym', to: E2, fromSense: null, toSense: null }]
  }
  const diff = diffRecord(base, local, base, 'entries')
  assert.deepEqual(diff.local, [`relations[synonym|${E2}||]`])
  assert.equal(isMediaPath('audio[x]'), true)
  assert.equal(isMediaPath(`senses[${S1}].photos[p]`), true)
  assert.equal(isMediaPath(`senses[${S1}].glosses.es`), false)
})

test('recordStatus covers new, deleted and changed records', () => {
  const base = entry()
  assert.equal(recordStatus(null, base, null, 'entries').status, 'new')
  assert.equal(recordStatus(null, null, base, 'entries').status, 'new-in-ld')
  assert.equal(recordStatus(base, null, base, 'entries').status, 'deleted-locally')
  assert.equal(recordStatus(base, base, null, 'entries').status, 'deleted-in-ld')
  assert.equal(recordStatus(base, base, base, 'entries').status, 'unchanged')
  const local = { ...base, lexeme: 'Hele' }
  const remote = { ...base, tags: ['flora'] }
  assert.equal(recordStatus(base, local, base, 'entries').status, 'changed')
  assert.equal(recordStatus(base, base, remote, 'entries').status, 'changed-in-ld')
  assert.equal(recordStatus(base, local, remote, 'entries').status, 'both-changed')
  assert.equal(recordStatus(base, local, { ...base, lexeme: 'Eele' }, 'entries').status, 'conflict')
})

test('sentences: translations per language, sense links as a set', () => {
  const base = { id: 's', text: 'Ele ja', translations: { es: 'Un árbol' }, senseIds: [S1, S2] }
  const local = { ...base, translations: { es: 'Un árbol', fr: 'Un arbre' }, senseIds: [S2, S1] }
  assert.deepEqual(diffRecord(base, local, base, 'sentences').local, ['translations.fr'])
})

test('diffWorkspace lists only records with changes, with counts', () => {
  const base = entry()
  const other = { ...entry(), id: E2, lexeme: 'Beja' }
  const result = diffWorkspace({
    base: { entries: { [base.id]: base, [E2]: other }, sentences: {} },
    workspace: { entries: { [base.id]: { ...base, lexeme: 'Hele' }, [E2]: other }, sentences: {} },
    remote: { entries: { [base.id]: base, [E2]: other }, sentences: {} }
  })
  assert.deepEqual(
    result.entries.map((item) => [item.label, item.status, item.local]),
    [['Hele', 'changed', ['lexeme']]]
  )
  assert.deepEqual(result.counts, { changed: 1 })
})

test('getPath and copyPath read and write one field', () => {
  const local = entry()
  const remote = withSense(entry({ notes: { es: 'Nota' } }), { glosses: { es: 'Árbol' } })
  assert.equal(getPath(remote, `senses[${S1}].glosses.es`), 'Árbol')
  copyPath(local, remote, 'notes.es')
  assert.deepEqual(local.notes, { es: 'Nota' })
  copyPath(local, remote, `senses[${S1}].glosses.en`) // removed in remote
  assert.deepEqual(local.senses[0].glosses, { es: 'Árbol' })
  copyPath(local, { ...remote, notes: null }, 'notes.es')
  assert.equal(local.notes, null)
  copyPath(local, { ...remote, tags: undefined }, 'tags')
  assert.deepEqual(local.tags, [])
})

test('mergeRemote takes LD changes and keeps local edits and conflicts', () => {
  const base = entry()
  const local = withSense({ ...base, lexeme: 'Hele' }, { nounClass: '2' })
  const remote = withSense(
    { ...base, tags: ['flora'], senses: [...base.senses, { id: S2, glosses: { es: 'Palo' } }] },
    { nounClass: '3' }
  )
  const { record, conflicts } = mergeRemote(base, local, remote, 'entries')
  assert.equal(record.lexeme, 'Hele')
  assert.deepEqual(record.tags, ['flora'])
  assert.equal(record.senses.length, 2)
  assert.equal(record.senses[0].nounClass, '2')
  assert.deepEqual(conflicts, [
    { field: `senses[${S1}].nounClass`, base: '1', local: '2', remote: '3' }
  ])
})

test('setPath writes a field or one language', async () => {
  const { setPath } = await import('../lib/ld/diff.mjs')
  const record = entry()
  setPath(record, `senses[${S1}].nounClass`, '7')
  assert.equal(record.senses[0].nounClass, '7')
  setPath(record, `senses[${S1}].glosses.fr`, 'Arbre')
  assert.deepEqual(record.senses[0].glosses, { es: 'Árbol', en: 'Tree', fr: 'Arbre' })
  setPath(record, 'notes.es', 'Una nota')
  assert.deepEqual(record.notes, { es: 'Una nota' })
  setPath(record, 'notes.es', '')
  assert.equal(record.notes, null)
})
