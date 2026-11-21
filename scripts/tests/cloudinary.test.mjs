/**
 * Tests for the pure helpers of scripts/lib/cloudinary.mjs. Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { signUpload, summariseUsage } from '../lib/cloudinary.mjs'

test('upload signature: sorted name=value pairs, empty values left out, then the secret', () => {
  const expected = crypto
    .createHash('sha1')
    .update('overwrite=true&public_id=bova&timestamp=1700000000SECRET')
    .digest('hex')
  assert.equal(
    signUpload(
      { timestamp: '1700000000', public_id: 'bova', overwrite: 'true', empty: '' },
      'SECRET'
    ),
    expected
  )
})

test('usage summary adds up the audio files and tolerates missing fields', () => {
  const files = [{ bytes: 1000 }, { bytes: 2500 }]
  const usage = {
    plan: 'Free',
    storage: { usage: 5000, limit: 100000, used_percent: 5 },
    credits: { usage: 1.5 }
  }
  assert.deepEqual(summariseUsage(usage, files), {
    audioFiles: 2,
    audioBytes: 3500,
    plan: 'Free',
    storageBytes: 5000,
    storageLimitBytes: 100000,
    storageUsedPercent: 5,
    creditsUsed: 1.5,
    creditsLimit: null,
    creditsUsedPercent: null
  })
  assert.equal(summariseUsage({}, []).storageBytes, null)
})
