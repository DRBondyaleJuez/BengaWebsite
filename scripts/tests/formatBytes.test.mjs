/**
 * Tests for src/utils/formatBytes.js and the error paths of the /admin/audios endpoints. Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatBytes } from '../../src/utils/formatBytes.js'
import { handleAudioRequest } from '../lib/audio-admin.mjs'

test('sizes are shown with a readable unit', () => {
  assert.equal(formatBytes(0), '0 B')
  assert.equal(formatBytes(1536), '1.5 KB')
  assert.equal(formatBytes(5 * 1024 * 1024), '5 MB')
  assert.equal(formatBytes(null), '—')
})

test('endpoints refuse unknown addresses, unknown words and empty recordings', async () => {
  assert.equal((await handleAudioRequest({ method: 'GET', pathname: '/nope' })).status, 404)
  const unknown = await handleAudioRequest({
    method: 'PUT',
    pathname: '/upload',
    query: { key: 'no-such-word-key' },
    body: Buffer.from('x')
  })
  assert.equal(unknown.status, 400)
  assert.match(unknown.json.error, /desconocida/)
})
