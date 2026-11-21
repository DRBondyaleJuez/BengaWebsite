/**
 * Tests for scripts/lib/audio-sync.mjs (what audio:sync changes in the registry). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileKey, planAudioSync } from '../lib/audio-sync.mjs'

test('file names: folder and extension are ignored', () => {
  assert.equal(fileKey('benga/en_a_.mp3'), 'en_a_')
  assert.equal(fileKey('en_a_'), 'en_a_')
  assert.equal(fileKey(' bova.MP3 '), 'bova')
})

test('plan: new recordings, kept ones, vanished files and unknown files', () => {
  const registry = {
    bova: { audio: 'missing' },
    mova: { audio: 'recorded' },
    gone: { audio: 'recorded' },
    other: { audio: 'missing', audioFile: 'old-name' },
    none: { audio: 'missing' }
  }
  const files = ['bova.mp3', 'mova', 'old-name.mp3', 'typo.mp3']

  const plan = planAudioSync(registry, files)
  assert.deepEqual(plan.changes, { bova: 'recorded', other: 'recorded' })
  assert.deepEqual(plan.alreadyRecorded, ['mova'])
  assert.deepEqual(plan.noLongerThere, ['gone'])
  assert.deepEqual(plan.unknownFiles, ['typo'])

  const unmark = planAudioSync(registry, files, { unmark: true })
  assert.equal(unmark.changes.gone, 'missing')
})
