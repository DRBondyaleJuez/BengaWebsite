/**
 * Tests for scripts/lib/ld/client.mjs: queueing, pauses, retries, halting, categories.
 * No network: fake fetch and a fake clock. Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gzipSync } from 'node:zlib'
import { ldClient, errorCategory, downloadSnapshot, LdError } from '../lib/ld/client.mjs'

/** Fake clock: sleep() moves time forward instantly and records the pauses. */
function fakeClock() {
  let time = 1000
  const sleeps = []
  return {
    now: () => time,
    sleep: async (ms) => {
      sleeps.push(ms)
      time += ms
    },
    sleeps
  }
}

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers })

test('requests go one at a time with the minimum pause between writes', async () => {
  const clock = fakeClock()
  const calls = []
  const client = ldClient({
    apiKey: 'ldk_x',
    dictionary: 'benga',
    base: 'https://x/api/v1',
    ...clock,
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return json({ results: [] })
    }
  })
  await Promise.all([client.postEntries([], 'a'), client.batchUpdate([])])
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url, 'https://x/api/v1/dictionaries/benga/entries')
  assert.equal(calls[1].url, 'https://x/api/v1/dictionaries/benga/entries/batch-update')
  assert.equal(calls[0].options.redirect, 'error')
  assert.equal(calls[0].options.headers.Authorization, 'Bearer ldk_x')
  assert.match(calls[0].options.headers['User-Agent'], /^benga-portal-ld-bridge\//)
  assert.deepEqual(clock.sleeps, [500]) // second write waited half a second
})

test('429 and 5xx are retried with Retry-After or backoff, then succeed', async () => {
  const clock = fakeClock()
  const answers = [
    json({ error: 'slow down' }, 429, { 'Retry-After': '3' }),
    json({ error: 'oops' }, 502),
    json({ speakers: [] })
  ]
  const events = []
  const client = ldClient({
    dictionary: 'benga',
    ...clock,
    onEvent: (event) => events.push(event.type),
    fetchImpl: async () => answers.shift()
  })
  assert.deepEqual(await client.speakers(), { speakers: [] })
  assert.deepEqual(clock.sleeps, [3000, 4000])
  assert.deepEqual(events, ['request', 'retry', 'request', 'retry', 'request', 'response'])
})

test('a 400 is not retried and carries a category', async () => {
  const clock = fakeClock()
  let count = 0
  const client = ldClient({
    dictionary: 'benga',
    ...clock,
    fetchImpl: async () => {
      count++
      return json({ error: { message: 'unknown speaker_id' } }, 400)
    }
  })
  await assert.rejects(client.postEntries([], 'x'), (error) => {
    assert.ok(error instanceof LdError)
    assert.equal(error.status, 400)
    assert.equal(error.category, 'speaker_missing')
    return true
  })
  assert.equal(count, 1)
})

test('three failures in a row halt the client', async () => {
  const clock = fakeClock()
  const client = ldClient({
    dictionary: 'benga',
    ...clock,
    fetchImpl: async () => json({ error: 'bad key' }, 401)
  })
  for (let i = 0; i < 3; i++) await assert.rejects(client.speakers(), /401: bad key/)
  assert.equal(client.halted, true)
  await assert.rejects(client.speakers(), /se detuvo/)
})

test('network errors are retried and then reported as network', async () => {
  const clock = fakeClock()
  const client = ldClient({
    dictionary: 'benga',
    ...clock,
    limits: { maxTries: 2 },
    fetchImpl: async () => {
      throw new Error('ECONNRESET')
    }
  })
  await assert.rejects(client.speakers(), (error) => error.category === 'network')
})

test('mediaUrl returns the redirect target without following it', async () => {
  const client = ldClient({
    dictionary: 'benga',
    ...fakeClock(),
    fetchImpl: async (url, options) => {
      assert.equal(options.redirect, 'manual')
      return new Response(null, {
        status: 302,
        headers: { Location: 'https://media.example/benga/audio/a.wav' }
      })
    }
  })
  assert.equal(
    await client.mediaUrl('benga/audio/a.wav'),
    'https://media.example/benga/audio/a.wav'
  )
})

test('snapshot is downloaded without a key and unzipped', async () => {
  const bytes = await downloadSnapshot('benga', {
    base: 'https://snap',
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://snap/benga.db.gz')
      assert.equal(options.headers.Authorization, undefined)
      return new Response(gzipSync(Buffer.from('SQLite format 3')))
    }
  })
  assert.equal(bytes.toString(), 'SQLite format 3')
})

test('error categories', () => {
  assert.equal(errorCategory(401), 'auth')
  assert.equal(errorCategory(404), 'not_found')
  assert.equal(errorCategory(400, 'source slug not found'), 'source_missing')
  assert.equal(errorCategory(413), 'media_too_big')
  assert.equal(errorCategory(503), 'server')
  assert.equal(errorCategory(null), 'network')
})
