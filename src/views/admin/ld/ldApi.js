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

export const getSentences = () => request('GET', '/sentences').then((json) => json.sentences)
export const getSentence = (id) => request('GET', `/sentences/${id}`)
export const createSentence = (data) => request('POST', '/sentences', data)
export const saveSentence = (sentence) =>
  request('PUT', `/sentences/${sentence.id}`, { sentence, version: sentence.sync?.version ?? 0 })
export const deleteSentence = (id) => request('DELETE', `/sentences/${id}`)

/** Same change on many entries in one save: { ids, action, value } → { changed, skipped }. */
export const bulkEntries = (ids, action, value = {}) =>
  request('POST', '/entries/bulk', { ids, action, value })

/**
 * New audio or photo for an entry (`collection` 'entries') or a sentence ('sentences'):
 * { kind: 'audio'|'photo', senseId?, fileName, dataBase64, speakerId?, source?, photographer? }.
 * The file stays in ld-sync/pending-media until phase L6 sends it. Returns the changed record.
 */
export const addMedia = (collection, id, payload) =>
  request('POST', `/${collection}/${id}/media`, payload)

/** Removes a media item that was never sent (its local file goes too). */
export const removeMedia = (collection, id, mediaId) =>
  request('DELETE', `/${collection}/${id}/media/${mediaId}`)

/** A File or Blob as base64 text (without the data: prefix). */
export function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(blob)
  })
}
