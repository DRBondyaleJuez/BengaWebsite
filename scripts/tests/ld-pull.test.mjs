import { test } from 'node:test'
import assert from 'node:assert/strict'
import { planPull, applyPull } from '../lib/ld/pull.mjs'
import { fieldLabel } from '../../src/utils/ldFieldLabels.js'

const S1 = '11111111-1111-4111-8111-111111111111'
const ID = (n) => `aaaaaaaa-aaaa-4aaa-8aaa-${String(n).padStart(12, '0')}`

const ldEntry = (n, lexeme, sense = {}) => ({
  id: ID(n),
  lexeme,
  senses: [
    { id: `${S1.slice(0, -2)}${String(n).padStart(2, '0')}`, glosses: { es: lexeme }, ...sense }
  ],
  audio: [],
  relations: [],
  ldReview: null,
  updatedAt: '2026-11-01T00:00:00Z'
})
const local = (record, sync = {}) => {
  const { updatedAt, ...rest } = record
  void updatedAt
  return {
    ...rest,
    siteKeys: [],
    review: null,
    suggestions: [],
    sync: { state: 'synced', version: 3, ...sync }
  }
}

function setup() {
  const same = ldEntry(1, 'Ele')
  const theirs = ldEntry(2, 'Beja')
  const mine = ldEntry(3, 'Dina')
  const both = ldEntry(4, 'Eko', { nounClass: '1' })
  const gone = ldEntry(5, 'Mbolo')
  const base = { pulledAt: 'x', entries: {}, sentences: {} }
  for (const record of [same, theirs, mine, both, gone]) base.entries[record.id] = record
  const workspace = {
    base,
    sentences: {},
    entries: {
      [same.id]: local(same),
      [theirs.id]: local(theirs),
      [mine.id]: { ...local(mine, { state: 'local-changes' }), lexeme: 'Dyna' },
      [both.id]: {
        ...local(both, { state: 'local-changes' }),
        senses: [{ ...both.senses[0], nounClass: '2' }]
      },
      [gone.id]: local(gone)
    }
  }
  const fresh = ldEntry(6, 'Ndabo')
  const remote = {
    sentences: {},
    entries: {
      [same.id]: same,
      [theirs.id]: {
        ...theirs,
        senses: [{ ...theirs.senses[0], glosses: { es: 'Beja', fr: 'X' } }]
      },
      [mine.id]: mine,
      [both.id]: { ...both, senses: [{ ...both.senses[0], nounClass: '3' }] },
      [fresh.id]: fresh
    }
  }
  return { workspace, remote, ids: { same, theirs, mine, both, gone, fresh } }
}

test('planPull lists what changed on each side', () => {
  const { workspace, remote } = setup()
  const plan = planPull(workspace, remote)
  assert.deepEqual(
    plan.entries.map((item) => [item.label, item.status]),
    [
      ['Beja', 'changed-in-ld'],
      ['Dyna', 'changed'],
      ['Eko', 'conflict'],
      ['Mbolo', 'deleted-in-ld'],
      ['Ndabo', 'new-in-ld']
    ]
  )
})

test('applyPull merges remote changes, keeps local ones and marks conflicts', () => {
  const { workspace, remote, ids } = setup()
  const { entries, base, summary } = applyPull(workspace, remote, '2026-11-27T00:00:00Z')
  assert.equal(entries[ids.theirs.id].senses[0].glosses.fr, 'X')
  assert.equal(entries[ids.theirs.id].sync.state, 'synced')
  assert.equal(entries[ids.mine.id].lexeme, 'Dyna')
  assert.equal(entries[ids.mine.id].sync.state, 'local-changes')
  assert.equal(entries[ids.both.id].senses[0].nounClass, '2')
  assert.equal(entries[ids.both.id].sync.state, 'conflict')
  assert.deepEqual(entries[ids.both.id].sync.conflicts[0], {
    field: `senses[${ids.both.senses[0].id}].nounClass`,
    base: '1',
    local: '2',
    remote: '3'
  })
  assert.equal(entries[ids.gone.id], undefined)
  assert.equal(entries[ids.fresh.id].sync.state, 'synced')
  assert.equal(base.pulledAt, '2026-11-27T00:00:00Z')
  assert.equal(base.entries[ids.both.id].senses[0].nounClass, '3')
  assert.deepEqual(summary.removed, ['Mbolo'])
  assert.deepEqual(summary.added, ['Ndabo'])
  assert.deepEqual(summary.conflicts, ['Eko'])
  assert.deepEqual(summary.updated, ['Beja'])
})

test('applyPull leaves the version alone when nothing changed', () => {
  const { workspace, remote, ids } = setup()
  const { entries } = applyPull(workspace, remote, 'now')
  assert.equal(entries[ids.same.id].sync.version, 3)
  assert.equal(entries[ids.theirs.id].sync.version, 4)
})

test('a record deleted in LD that you edited stays as a conflict', () => {
  const { workspace, remote, ids } = setup()
  workspace.entries[ids.gone.id].lexeme = 'Mbolu'
  const { entries } = applyPull(workspace, remote, 'now')
  assert.equal(entries[ids.gone.id].sync.state, 'conflict')
  assert.equal(entries[ids.gone.id].sync.conflicts[0].field, '*')
})

test('fieldLabel names paths in Spanish', () => {
  const record = { senses: [{ id: 'a' }, { id: 'b' }] }
  assert.equal(fieldLabel('senses[b].glosses.fr', record), 'Sentido 2 · traducción (francés)')
  assert.equal(fieldLabel('lexeme'), 'palabra')
  assert.equal(fieldLabel('senses[a]', record), 'Sentido 1 (entero)')
  assert.equal(fieldLabel('relations[synonym|x||]'), 'relación «synonym»')
  assert.equal(fieldLabel('*'), 'la entrada entera')
})

test('a snapshot older than base (lagging behind a push) is ignored', () => {
  const { workspace, remote, ids } = setup()
  workspace.base.entries[ids.theirs.id] = { ...ids.theirs, updatedAt: '2026-11-27T12:00:00Z' }
  const plan = planPull(workspace, remote)
  assert.deepEqual(plan.stale, ['Beja'])
  assert.equal(
    plan.entries.find((item) => item.label === 'Beja'),
    undefined
  )
  const { entries, base } = applyPull(workspace, remote, 'now')
  assert.equal(entries[ids.theirs.id].senses[0].glosses.fr, undefined)
  assert.equal(base.entries[ids.theirs.id].updatedAt, '2026-11-27T12:00:00Z')
})
