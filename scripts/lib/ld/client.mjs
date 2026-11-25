/**
 * The ONE client of the Living Dictionaries API (https://livingdictionaries.app/api/v1) used by
 * every script and dev endpoint. Rules: docs/LD-ROADMAP.md sections 3–4.
 *
 * - One request at a time, with a minimum pause per kind (read / write / media).
 * - 429, 5xx and network errors are retried with backoff (Retry-After when the server sends it).
 * - After 3 failed requests in a row the client stops (`halted`) so a broken run can't hammer
 *   the server; create a new client to try again.
 * - Writes never follow redirects (a redirect would silently turn a POST into a GET).
 * - `onEvent` receives every request/response/retry/error: the sync log is built from it.
 * - The key is only sent in the Authorization header, never logged.
 *
 * Tests: scripts/tests/ld-client.test.mjs (fake fetch, fake clock, no network).
 */
import { gunzipSync } from 'node:zlib'

export const LD_API = 'https://livingdictionaries.app/api/v1'
export const LD_SNAPSHOT_BASE = 'https://snapshots.livingdictionaries.app/dictionaries'
export const USER_AGENT = 'benga-portal-ld-bridge/1.0'

/** Pauses between requests of each kind, in ms (section 4 of the roadmap). */
export const DEFAULT_LIMITS = {
  minInterval: { read: 250, write: 500, media: 1000 },
  maxTries: 5,
  maxConsecutiveFailures: 3,
  maxBackoffMs: 30000
}

/** Error with the HTTP status and one of the sync-log categories (LD-ROADMAP section 5). */
export class LdError extends Error {
  constructor(message, { status = null, category = 'unknown', body = null } = {}) {
    super(message)
    this.name = 'LdError'
    this.status = status
    this.category = category
    this.body = body
  }
}

/** HTTP status (+ server message) → error category used by logs, badges and filters. */
export function errorCategory(status, message = '') {
  const text = String(message).toLowerCase()
  if (status === null || status === undefined) return 'network'
  if (status === 401 || status === 403) return 'auth'
  if (status === 404) return 'not_found'
  if (status === 409) return 'conflict'
  if (status === 413) return 'media_too_big'
  if (status === 415) return 'media_format'
  if (status === 429) return 'rate_limited'
  if (status >= 500) return 'server'
  if (status === 400 || status === 422) {
    if (text.includes('speaker')) return 'speaker_missing'
    if (text.includes('source') || text.includes('slug')) return 'source_missing'
    if (text.includes('too large') || text.includes('size')) return 'media_too_big'
    return 'validation'
  }
  return 'unknown'
}

const RETRYABLE = (status) => status === null || status === 429 || status >= 500

function retryDelay(response, attempt, maxBackoffMs) {
  const header = response?.headers?.get?.('retry-after')
  const seconds = Number(header)
  if (header && Number.isFinite(seconds)) return Math.min(seconds * 1000, maxBackoffMs)
  return Math.min(2000 * 2 ** (attempt - 1), maxBackoffMs) // 2 s, 4 s, 8 s, 16 s…
}

const realSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {object} options
 * @param {string} [options.apiKey]   ldk_… (not needed for the snapshot)
 * @param {string} options.dictionary  dictionary id or slug (benga)
 */
export function ldClient({
  apiKey,
  dictionary,
  base = LD_API,
  fetchImpl = fetch,
  sleep = realSleep,
  now = Date.now,
  onEvent = () => {},
  limits = {}
}) {
  const settings = {
    ...DEFAULT_LIMITS,
    ...limits,
    minInterval: { ...DEFAULT_LIMITS.minInterval, ...limits.minInterval }
  }
  const root = `${base}/dictionaries/${encodeURIComponent(dictionary)}`
  const state = { halted: false, consecutiveFailures: 0, lastRequestAt: 0 }
  let queue = Promise.resolve()

  /** Runs `task` after every earlier request has finished (one at a time). */
  function enqueue(task) {
    const run = queue.then(task, task)
    queue = run.catch(() => {})
    return run
  }

  async function waitTurn(kind) {
    const gap = settings.minInterval[kind] ?? settings.minInterval.read
    const wait = state.lastRequestAt + gap - now()
    if (wait > 0) await sleep(wait)
    state.lastRequestAt = now()
  }

  function headers(extra = {}) {
    const result = { 'User-Agent': USER_AGENT, ...extra }
    if (apiKey) result.Authorization = `Bearer ${apiKey}`
    return result
  }

  async function parse(response) {
    const text = await response.text()
    try {
      return text ? JSON.parse(text) : null
    } catch {
      return { raw: text }
    }
  }

  /**
   * One API call. kind: 'read' (GET), 'write' (POST/PATCH/DELETE JSON), 'media' (uploads).
   * Resolves with the JSON body; rejects with an LdError.
   */
  function call(method, path, { body, form, kind } = {}) {
    const requestKind = kind || (method === 'GET' ? 'read' : 'write')
    return enqueue(async () => {
      if (state.halted) {
        throw new LdError('El cliente se detuvo tras varios errores seguidos', {
          category: 'network'
        })
      }
      const isWrite = method !== 'GET'
      for (let attempt = 1; ; attempt++) {
        await waitTurn(requestKind)
        const started = now()
        onEvent({ type: 'request', method, path, attempt })
        let response = null
        let networkError = null
        try {
          response = await fetchImpl(`${root}${path}`, {
            method,
            headers: headers(body ? { 'Content-Type': 'application/json' } : {}),
            body: form || (body ? JSON.stringify(body) : undefined),
            redirect: isWrite ? 'error' : 'follow'
          })
        } catch (error) {
          networkError = error
        }
        const status = response ? response.status : null
        if (response && response.ok) {
          state.consecutiveFailures = 0
          const json = await parse(response)
          onEvent({ type: 'response', method, path, status, ms: now() - started })
          return json
        }
        const json = response ? await parse(response) : null
        const message =
          networkError?.message ||
          json?.error?.message ||
          json?.error ||
          json?.message ||
          json?.raw?.slice(0, 300) ||
          ''
        if (RETRYABLE(status) && attempt < settings.maxTries) {
          const delay = retryDelay(response, attempt, settings.maxBackoffMs)
          onEvent({ type: 'retry', method, path, status, attempt, delay, message })
          await sleep(delay)
          continue
        }
        state.consecutiveFailures += 1
        if (state.consecutiveFailures >= settings.maxConsecutiveFailures) state.halted = true
        const category = errorCategory(status, message)
        onEvent({ type: 'error', method, path, status, category, message })
        throw new LdError(
          `Living Dictionaries ${method} ${path} → ${status ?? 'sin conexión'}: ${message}`,
          { status, category, body: json }
        )
      }
    })
  }

  const query = (params) => {
    const clean = Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    return clean.length ? `?${new URLSearchParams(clean)}` : ''
  }

  return {
    get halted() {
      return state.halted
    },
    call,
    // ---- reads ----
    dictionaryInfo: () => call('GET', ''),
    speakers: () => call('GET', '/speakers'),
    sources: () => call('GET', '/sources'),
    relationshipTypes: () => call('GET', '/relationship-types'),
    entry: (entryId) => call('GET', `/entries/${encodeURIComponent(entryId)}`),
    sentence: (sentenceId) => call('GET', `/sentences/${encodeURIComponent(sentenceId)}`),
    /** Entries whose headword is exactly `lexeme` (any orthography). */
    findEntries: (lexeme) => call('GET', `/entries${query({ lexeme, match: 'exact', limit: 20 })}`),
    /** One page of entries changed after `since` (ISO, exclusive), oldest first. */
    changedSince: (since, { include = 'senses', limit = 500, offset = 0 } = {}) =>
      call('GET', `/entries${query({ updated_since: since, include, limit, offset })}`),
    /** Where the bytes of a stored media file are (the API answers with a redirect). */
    async mediaUrl(storagePath) {
      return enqueue(async () => {
        await waitTurn('read')
        const response = await fetchImpl(`${root}/media/${storagePath}`, {
          method: 'GET',
          headers: headers(),
          redirect: 'manual'
        })
        const location = response.headers.get('location')
        if (response.status >= 300 && response.status < 400 && location) return location
        if (response.ok) return `${root}/media/${storagePath}` // served directly
        throw new LdError(`Living Dictionaries media ${storagePath} → ${response.status}`, {
          status: response.status,
          category: errorCategory(response.status)
        })
      })
    },
    // ---- writes ----
    postEntries: (entries, importId) =>
      call('POST', '/entries', { body: { entries, import_id: importId } }),
    batchUpdate: (entries) => call('POST', '/entries/batch-update', { body: { entries } }),
    patchEntry: (entryId, patch) =>
      call('PATCH', `/entries/${encodeURIComponent(entryId)}`, { body: patch }),
    patchSentence: (sentenceId, patch) =>
      call('PATCH', `/sentences/${encodeURIComponent(sentenceId)}`, { body: patch }),
    createSource: (source) => call('POST', '/sources', { body: source }),
    postRelationships: (relationships) =>
      call('POST', '/relationships', { body: { relationships } }),
    /** kind: 'entry' | 'sentence'. Attribution: speakerId and/or source (required by LD). */
    postAudio(kind, ownerId, { id, buffer, fileName, speakerId, source, replace }) {
      const form = new FormData()
      form.append('id', id)
      if (speakerId) form.append('speaker_id', speakerId)
      if (source) form.append('source', source)
      if (replace) form.append('replace', 'true')
      form.append('file', new Blob([buffer]), fileName)
      const owner = kind === 'entry' ? 'entries' : 'sentences'
      return call('POST', `/${owner}/${ownerId}/audio`, { form, kind: 'media' })
    }
  }
}

/**
 * Downloads the dictionary's public SQLite snapshot (no key) and returns the database bytes.
 * One request; the API guide says to use this instead of paging through all entries.
 */
export async function downloadSnapshot(
  dictionary,
  { fetchImpl = fetch, base = LD_SNAPSHOT_BASE } = {}
) {
  const response = await fetchImpl(`${base}/${encodeURIComponent(dictionary)}.db.gz`, {
    headers: { 'User-Agent': USER_AGENT }
  })
  if (!response.ok) {
    throw new LdError(`Snapshot de ${dictionary} → ${response.status}`, {
      status: response.status,
      category: errorCategory(response.status)
    })
  }
  return gunzipSync(Buffer.from(await response.arrayBuffer()))
}
