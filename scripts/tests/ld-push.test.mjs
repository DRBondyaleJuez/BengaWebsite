import { test } from 'node:test'
import assert from 'node:assert/strict'
import { planPush, runPush, buildPatch, entryPayload, fromApiEntry } from '../lib/ld/push.mjs'

const S1 = '11111111-1111-4111-8111-111111111111'
const S2 = '22222222-2222-4222-8222-222222222222'
const SENT = '33333333-3333-4333-8333-333333333333'
const ID = (n) => `aaaaaaaa-aaaa-4aaa-8aaa-${String(n).padStart(12, '0')}`

const ldEntry = (n, lexeme, sense = {}) => ({
  id: ID(n),
  lexeme,
  homograph: null,
  tags: [],
  senses: [{ id: n === 1 ? S1 : S2, glosses: { es: lexeme }, nounClass: '1ª Clase', ...sense }],
  audio: [],
  relations: [],
  ldReview: null
})
const local = (record) => ({
  ...record,
  siteKeys: [],
  review: null,
  suggestions: [],
  sync: { state: 'local-changes', version: 1 }
})

function workspaceWith(changes = {}) {
  const ele = ldEntry(1, 'Ele')
  const beja = ldEntry(2, 'Beja')
  const workspace = {
    base: {
      pulledAt: '2026-11-26T00:00:00Z',
      entries: { [ele.id]: ele, [beja.id]: beja },
      sentences: {}
    },
    entries: {
      [ele.id]: { ...local(ele), senses: [{ ...ele.senses[0], nounClass: '1' }], ...changes },
      [beja.id]: { ...local(beja), sync: { state: 'synced', version: 1 } }
    },
    sentences: {}
  }
  return workspace
}

test('buildPatch sends only the changed fields, glosses per language', () => {
  const base = ldEntry(1, 'Ele')
  const now = {
    ...base,
    tags: ['flora'],
    senses: [{ ...base.senses[0], glosses: { es: 'Ele', fr: 'Arbre' }, partsOfSpeech: ['n'] }]
  }
  const { patch, changes, warnings } = buildPatch('entries', base, now, [
    'tags',
    `senses[${S1}].glosses.fr`,
    `senses[${S1}].partsOfSpeech`
  ])
  assert.deepEqual(patch, {
    id: base.id,
    tags: ['flora'],
    senses: [{ id: S1, glosses: { fr: 'Arbre' }, parts_of_speech: ['n'] }]
  })
  assert.equal(changes.length, 3)
  assert.deepEqual(warnings, [])
})

test('buildPatch: removals the API cannot do become warnings; removed language sends ""', () => {
  const base = { ...ldEntry(1, 'Ele'), tags: ['flora'] }
  base.senses[0].glosses = { es: 'Ele', en: 'Tree' }
  const now = { ...base, tags: [], senses: [{ ...base.senses[0], glosses: { es: 'Ele' } }] }
  const { patch, warnings } = buildPatch('entries', base, now, ['tags', `senses[${S1}].glosses.en`])
  assert.deepEqual(patch.senses, [{ id: S1, glosses: { en: '' } }])
  assert.equal(patch.tags, undefined)
  assert.match(warnings[0], /solo se puede en la web de LD/)
})

test('planPush: updates, review flag only when asked, conflicts blocked, limit', () => {
  const workspace = workspaceWith()
  let plan = planPush(workspace)
  assert.deepEqual(
    plan.entries.map((item) => [item.label, item.status]),
    [['Ele', 'update']]
  )
  assert.deepEqual(plan.entries[0].payload, {
    id: ID(1),
    senses: [{ id: S1, noun_class: '1' }]
  })

  workspace.entries[ID(2)].review = { category: 'other', note: '¿Es correcto?', sendToLd: false }
  assert.equal(planPush(workspace).entries.length, 1) // local review is not sent
  workspace.entries[ID(2)].review.sendToLd = true
  plan = planPush(workspace)
  assert.deepEqual(plan.entries.find((item) => item.label === 'Beja').payload, {
    id: ID(2),
    review: { category: 'other', note: '¿Es correcto?' }
  })

  workspace.entries[ID(1)].sync.state = 'conflict'
  assert.equal(planPush(workspace).entries.find((i) => i.label === 'Ele').status, 'blocked')

  workspace.entries[ID(1)].sync.state = 'local-changes'
  plan = planPush(workspace, { limit: 1 })
  assert.deepEqual(
    plan.entries.map((item) => item.status),
    ['skipped', 'update']
  )
  assert.equal(plan.more, 1)
  plan = planPush(workspace, { only: [ID(1)] })
  assert.equal(plan.entries.find((i) => i.label === 'Ele').status, 'update')
  assert.equal(plan.entries.find((i) => i.label === 'Beja').status, 'skipped')
})

test('planPush: new entries are created whole; deletions need the option', () => {
  const workspace = workspaceWith()
  const fresh = { ...local(ldEntry(3, 'Dina')), sync: { state: 'new', version: 1 } }
  workspace.entries[fresh.id] = fresh
  delete workspace.entries[ID(2)]
  let plan = planPush(workspace)
  const dina = plan.entries.find((item) => item.label === 'Dina')
  assert.equal(dina.status, 'create')
  assert.deepEqual(dina.payload, entryPayload(fresh))
  assert.equal(dina.payload.review, undefined)
  assert.equal(plan.entries.find((item) => item.label === 'Beja').status, 'skipped')
  plan = planPush(workspace, { deletions: true })
  assert.equal(plan.entries.find((item) => item.label === 'Beja').status, 'delete')
})

function fakeClient(answers = {}) {
  const calls = []
  return {
    calls,
    halted: false,
    async postEntries(entries, importId) {
      calls.push(['postEntries', entries.length, importId])
      return { results: entries.map((e) => ({ status: 'created', entry_id: e.id })) }
    },
    async batchUpdate(entries) {
      calls.push(['batchUpdate', entries.map((e) => e.id)])
      return (
        answers.batchUpdate || {
          results: entries.map((e) => ({ status: 'updated', entry_id: e.id }))
        }
      )
    },
    async call(method, path) {
      calls.push([method, path])
      const id = path.match(/entries\/([^?]+)/)?.[1]
      return answers.read?.(id) ?? { entry: { id, main: {}, senses: [] } }
    },
    async sentence(id) {
      calls.push(['GET sentence', id])
      return { sentence: { id } }
    },
    async patchSentence() {},
    async postRelationships() {
      return { results: [] }
    }
  }
}

const apiRead = (lexeme, nounClass) => (id) => ({
  entry: {
    id,
    updated_at: '2026-11-27T10:00:00Z',
    main: { lexeme: { default: lexeme } },
    senses: [{ id: S1, glosses: { es: lexeme }, noun_class: nounClass, sentences: [] }],
    relationships: []
  }
})

test('runPush sends, verifies by reading back and updates base and state', async () => {
  const workspace = workspaceWith()
  const plan = planPush(workspace)
  const client = fakeClient({ read: apiRead('Ele', '1') })
  const items = []
  const result = await runPush({
    workspace,
    plan,
    client,
    importId: 'x',
    log: (i) => items.push(i)
  })
  assert.deepEqual(client.calls[0], ['batchUpdate', [ID(1)]])
  assert.equal(result.entries[ID(1)].sync.state, 'synced')
  assert.equal(result.base.entries[ID(1)].senses[0].nounClass, '1')
  assert.equal(result.base.entries[ID(1)].updatedAt, '2026-11-27T10:00:00Z')
  assert.deepEqual(
    items.map((i) => [i.operation, i.status]),
    [
      ['update', 'ok'],
      ['verify', 'ok']
    ]
  )
  assert.equal(workspace.entries[ID(1)].sync.state, 'local-changes') // input untouched
})

test('runPush marks an error when LD did not keep the value', async () => {
  const workspace = workspaceWith()
  const plan = planPush(workspace)
  const client = fakeClient({ read: apiRead('Ele', '1ª Clase') })
  const result = await runPush({ workspace, plan, client, importId: 'x' })
  assert.equal(result.entries[ID(1)].sync.state, 'error')
  assert.match(result.entries[ID(1)].sync.lastError.message, /clase nominal/)
})

test('runPush records a failed item with its category', async () => {
  const workspace = workspaceWith()
  const plan = planPush(workspace)
  const client = fakeClient({
    batchUpdate: { results: [{ status: 'failed', entry_id: ID(1), error: 'bad noun class' }] }
  })
  const items = []
  const result = await runPush({
    workspace,
    plan,
    client,
    importId: 'x',
    log: (i) => items.push(i)
  })
  assert.equal(result.failed, 1)
  assert.equal(result.entries[ID(1)].sync.state, 'error')
  assert.equal(items[0].category, 'validation')
  assert.equal(client.calls.length, 1) // no read-back of a failed item
})

test('fromApiEntry reads the API shape (main, senses[].sentences)', () => {
  const record = fromApiEntry({
    entry: {
      id: ID(1),
      main: { lexeme: { default: 'Hāngā' }, notes: { es: 'n' } },
      senses: [
        {
          id: S1,
          glosses: { es: 'Bandera', en: '' },
          parts_of_speech: ['n'],
          plural_form: { default: 'Hāngā' },
          sentences: [{ id: SENT }]
        }
      ],
      relationships: [
        { id: 'r1', type: 'synonym', direction: 'forward', related: { entry_id: ID(2) } },
        { id: 'r2', type: 'synonym', direction: 'inverse', related: { entry_id: ID(3) } }
      ]
    }
  })
  assert.equal(record.lexeme, 'Hāngā')
  assert.deepEqual(record.notes, { es: 'n' })
  assert.deepEqual(record.senses[0].glosses, { es: 'Bandera' })
  assert.equal(record.senses[0].pluralForm, 'Hāngā')
  assert.deepEqual(record.senses[0].sentenceIds, [SENT])
  assert.deepEqual(
    record.relations.map((r) => r.id),
    ['r1']
  )
})

test('runPush deletes only with the option and forgets the record in base', async () => {
  const workspace = workspaceWith()
  delete workspace.entries[ID(2)]
  const plan = planPush(workspace, { deletions: true })
  assert.equal(plan.entries.find((item) => item.label === 'Beja').restorable, true)
  const client = fakeClient({ read: apiRead('Ele', '1') })
  const result = await runPush({ workspace, plan, client, importId: 'x', deletions: true })
  assert.ok(
    client.calls.some(([method, path]) => method === 'DELETE' && path === `/entries/${ID(2)}`)
  )
  assert.equal(result.base.entries[ID(2)], undefined)

  const without = await runPush({
    workspace,
    plan: planPush(workspace),
    client: fakeClient({ read: apiRead('Ele', '1') }),
    importId: 'x'
  })
  assert.ok(without.base.entries[ID(2)])
})
