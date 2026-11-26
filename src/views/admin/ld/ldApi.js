/**
 * Browser side of the dictionary admin: calls the local endpoints /__dev/ld/* (served by the dev
 * server, scripts/lib/ld/admin-api.mjs). Every function returns the JSON answer or throws an
 * Error with the server's Spanish message (`error.status`, `error.details` when available).
 */
const BASE = '/__dev/ld'

async function request(method, path, body) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined
  })
  let json
  try {
    json = await response.json()
  } catch {
    json = null
  }
  if (!response.ok) {
    const error = new Error(json?.error || `Error ${response.status}`)
    error.status = response.status
    error.details = json?.details || []
    throw error
  }
  return json
}

export const getSummary = () => request('GET', '/summary')
export const getEntries = () => request('GET', '/entries').then((json) => json.entries)
export const getEntry = (id) => request('GET', `/entries/${id}`)
export const createEntry = (data) => request('POST', '/entries', data)
export const saveEntry = (entry) =>
  request('PUT', `/entries/${entry.id}`, { entry, version: entry.sync?.version ?? 0 })
export const deleteEntry = (id) => request('DELETE', `/entries/${id}`)
/** Brings back an entry deleted here that is still in Living Dictionaries. */
export const restoreEntry = (id) => request('POST', '/entries/restore', { id })

export const getSentences = () => request('GET', '/sentences').then((json) => json.sentences)
export const getSentence = (id) => request('GET', `/sentences/${id}`)
export const createSentence = (data) => request('POST', '/sentences', data)
export const saveSentence = (sentence) =>
  request('PUT', `/sentences/${sentence.id}`, { sentence, version: sentence.sync?.version ?? 0 })
export const deleteSentence = (id) => request('DELETE', `/sentences/${id}`)
export const restoreSentence = (id) => request('POST', '/sentences/restore', { id })

/** Same change on many entries in one save: { ids, action, value } → { changed, skipped }. */
export const bulkEntries = (ids, action, value = {}) =>
  request('POST', '/entries/bulk', { ids, action, value })

// ---- sync runs (scripts/lib/ld/sync-api.mjs) ----
export const getSyncStatus = () => request('GET', '/sync/status').then((json) => json.running)
export const getSyncRuns = () => request('GET', '/sync/runs').then((json) => json.runs)
export const getSyncRun = (id) => request('GET', `/sync/runs/${id}`).then((json) => json.run)
/** Starts ld:pull / ld:push / ld:undo; resolves with the runId to follow. */
export const startSync = (kind, mode, options = {}) =>
  request('POST', '/sync/start', { kind, mode, options }).then((json) => json.runId)

/** Polls a run until it ends; onProgress(run) gets every state. Resolves with the final run. */
export async function waitForRun(runId, onProgress = () => {}) {
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    let run = null
    try {
      run = await getSyncRun(runId)
    } catch (error) {
      if (error.status !== 404) throw error // the log file may not exist for a moment
    }
    if (!run) continue
    onProgress(run)
    if (run.status !== 'running') return run
  }
}
