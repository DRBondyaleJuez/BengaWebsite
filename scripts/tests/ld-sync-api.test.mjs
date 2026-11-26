import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { argsFor, handleSyncRequest, isSyncRunning } from '../lib/ld/sync-api.mjs'

const ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'

test('argsFor builds the command line and refuses bad options', () => {
  assert.deepEqual(argsFor('pull', 'check', { fresh: true }), ['--check', '--fresh'])
  assert.deepEqual(argsFor('push', 'apply', { only: [ID], deletions: true }), [
    '--only',
    ID,
    '--deletions'
  ])
  assert.deepEqual(argsFor('undo', 'apply', { importId: 'benga-portal-2026', confirmCount: 3 }), [
    'benga-portal-2026',
    '--confirm',
    '3'
  ])
  assert.throws(() => argsFor('push', 'apply', { only: ['x; rm -rf'] }))
  assert.throws(() => argsFor('undo', 'check', { importId: '../x' }))
  assert.throws(() => argsFor('undo', 'apply', { importId: 'a' }))
})

test('start runs one script at a time and locks edits while applying', async () => {
  const runsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ld-runs-'))
  const calls = []
  const child = new EventEmitter()
  const spawnImpl = (command, args) => {
    calls.push(args)
    return child
  }
  const deps = { spawnImpl, runsDir }
  const started = await handleSyncRequest(
    { method: 'POST', parts: ['start'], body: { kind: 'push', mode: 'apply', options: {} } },
    deps
  )
  assert.equal(started.status, 202)
  assert.match(calls[0].join(' '), /ld-push\.mjs --run-id \S+-push-apply$/)
  assert.equal(isSyncRunning(), true)
  const second = await handleSyncRequest(
    { method: 'POST', parts: ['start'], body: { kind: 'pull', mode: 'check' } },
    deps
  )
  assert.equal(second.status, 409)
  const status = await handleSyncRequest({ method: 'GET', parts: ['status'] }, deps)
  assert.equal(status.json.running.kind, 'push')
  child.emit('close', 0)
  assert.equal(isSyncRunning(), false)
  const runs = await handleSyncRequest({ method: 'GET', parts: ['runs'] }, deps)
  assert.deepEqual(runs.json.runs, [])
  const missing = await handleSyncRequest({ method: 'GET', parts: ['runs', 'nope'] }, deps)
  assert.equal(missing.status, 404)
  fs.rmSync(runsDir, { recursive: true, force: true })
})
