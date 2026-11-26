/**
 * Local API of /admin/living-dictionary (tasks L2.1 and L2.2 of docs/LD-ROADMAP.md).
 * Served by the Vite dev server at /__dev/ld/* (vite.config.mjs), only during `npm run serve`
 * and only from this computer. It reads and writes the workspace files; it never talks to
 * Living Dictionaries (syncs are separate, manual commands: phase L5).
 *
 *   GET    /summary                 counts for the Panel
 *   GET    /entries                 every entry (workspace records)
 *   GET    /entries/:id             { entry, base, sentences } (base = as last read from LD)
 *   POST   /entries                 create: { lexeme, homograph?, senses? } → new entry ("new")
 *   PUT    /entries/:id             save: { entry, version } (409 if someone saved in between)
 *   DELETE /entries/:id             only entries that exist only here (state "new")
 *   POST   /entries/bulk            { ids, action, value }: same change on many entries (applyBulk)
 *   GET|POST|PUT|DELETE /sentences… same for sentences
 *
 * Every save: schema check, sync state from the comparison with base, version + 1, and the
 * site's word registry gets the entry's dictionary id when it was empty (L2.2).
 * handleLdRequest() takes a `store`, so tests use an in-memory one.
 */
import { loadSchemas } from '../schemas.mjs'
import { uuid5 } from '../living-dictionary.mjs'
import { toAudioId } from '../../../src/utils/audioId.js'
import { LD_DICTIONARY_ID } from '../../../src/config/ld.js'
import { linkEntries } from './link.mjs'
import { LOCAL_FIELDS } from './workspace.mjs'

const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
/** Same id rule as ld-import: sending the same word twice never creates two entries. */
export const newId = (kind, key) =>
  uuid5(`https://benga-portal/${LD_DICTIONARY_ID}/${kind}/${key}`, URL_NAMESPACE)

let schemaCheck = null
const check = (data) => (schemaCheck ||= loadSchemas())('dictionary', data)

/** JSON with sorted keys, to compare records regardless of key order. */
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

/** The fields Living Dictionaries has (local ones and read-only ones removed). */
export function ldFieldsOf(record) {
  const result = { ...record }
  for (const field of [...LOCAL_FIELDS, 'updatedAt', 'ldReview']) delete result[field]
  return result
}

/** synced / local-changes / new, from the comparison with the record last read from LD. */
export function syncStateOf(record, baseRecord) {
  if (!baseRecord) return 'new'
  return canonical(ldFieldsOf(record)) === canonical(ldFieldsOf(baseRecord))
    ? 'synced'
    : 'local-changes'
}

const reply = (status, json) => ({ status, json })
const notFound = (what) => reply(404, { error: `No existe: ${what}` })

function summary({ entries, sentences, base }) {
  const list = Object.values(entries)
  const senses = list.flatMap((entry) => entry.senses)
  const sentenceList = Object.values(sentences)
  const byState = {}
  for (const record of [...list, ...sentenceList]) {
    const state = record.sync?.state || 'synced'
    byState[state] = (byState[state] || 0) + 1
  }
  return {
    pulledAt: base.pulledAt || null,
    entries: list.length,
    senses: senses.length,
    sentences: sentenceList.length,
    byState,
    needsReview: list.filter((e) => e.review).length + sentenceList.filter((s) => s.review).length,
    suggestions: list.reduce((n, e) => n + (e.suggestions?.length || 0), 0),
    entriesWithoutAudio: list.filter((e) => !e.audio?.length).length,
    sentencesWithoutAudio: sentenceList.filter((s) => !s.audio?.length).length,
    missingGloss: Object.fromEntries(
      ['es', 'en', 'fr'].map((lang) => [lang, senses.filter((s) => !s.glosses?.[lang]).length])
    ),
    withoutPartOfSpeech: senses.filter((s) => !s.partsOfSpeech?.length).length,
    withoutDomain: senses.filter((s) => !s.semanticDomains?.length).length,
    linkedToSite: list.filter((e) => e.siteKeys?.length).length
  }
}

/** L2.2: fill empty livingDictionaryId values in the registry and refresh siteKeys. */
async function relinkSite(store, workspace) {
  const registry = await store.loadRegistry()
  const { siteKeys, registryUpdates } = linkEntries(workspace.entries, registry)
  let entriesChanged = false
  for (const [id, keys] of Object.entries(siteKeys)) {
    if (canonical(workspace.entries[id].siteKeys || []) !== canonical(keys)) {
      workspace.entries[id].siteKeys = keys
      entriesChanged = true
    }
  }
  for (const [key, id] of Object.entries(registryUpdates)) registry[key].livingDictionaryId = id
  if (Object.keys(registryUpdates).length) await store.saveRegistry(registry)
  return { entriesChanged, registryLinks: Object.keys(registryUpdates).length }
}

/**
 * A sentence is an example of the senses in its senseIds: keep each sense's sentenceIds in step
 * (added or removed), and update the sync state of the entries that changed.
 * @returns {boolean} whether some entry changed
 */
export function syncSentenceLinks(workspace, sentenceId, senseIds = []) {
  let changed = false
  for (const entry of Object.values(workspace.entries)) {
    let entryChanged = false
    for (const sense of entry.senses) {
      const linked = (sense.sentenceIds || []).includes(sentenceId)
      const wanted = senseIds.includes(sense.id)
      if (linked === wanted) continue
      sense.sentenceIds = wanted
        ? [...(sense.sentenceIds || []), sentenceId]
        : sense.sentenceIds.filter((id) => id !== sentenceId)
      entryChanged = true
    }
    if (entryChanged) {
      const state = syncStateOf(entry, workspace.base.entries?.[entry.id])
      entry.sync = { ...entry.sync, state, version: (entry.sync?.version ?? 0) + 1 }
      changed = true
    }
  }
  return changed
}

/**
 * Bulk actions of the entries table (task L3.5). Applies one change to many entries and returns
 * what changed and what was skipped (with the reason, in Spanish, for the result message).
 *   review-set { category, note } · review-clear · domain-add { key } (every sense)
 *   pos-set { code } (only entries with ONE sense: with several, which sense is meant is unclear)
 *   tag-add { name }
 */
export function applyBulk(
  workspace,
  { ids = [], action, value = {} },
  now = () => new Date().toISOString()
) {
  const changed = []
  const skipped = []
  for (const id of ids) {
    const entry = workspace.entries[id]
    if (!entry) {
      skipped.push({ id, reason: 'no existe' })
      continue
    }
    const before = canonical(entry)
    if (action === 'review-set') {
      if (!value.category || !value.note) throw new Error('Falta la categoría o la nota')
      entry.review = {
        category: value.category,
        note: value.note,
        by: 'human',
        at: now(),
        sendToLd: false
      }
    } else if (action === 'review-clear') {
      entry.review = null
    } else if (action === 'domain-add') {
      if (!value.key) throw new Error('Falta el dominio')
      for (const sense of entry.senses) {
        sense.semanticDomains = [...new Set([...(sense.semanticDomains || []), value.key])]
      }
    } else if (action === 'pos-set') {
      if (!value.code) throw new Error('Falta la categoría gramatical')
      if (entry.senses.length !== 1) {
        skipped.push({
          id,
          word: entry.lexeme,
          reason: 'tiene varios sentidos: elígela en su ficha'
        })
        continue
      }
      const sense = entry.senses[0]
      sense.partsOfSpeech = [...new Set([...(sense.partsOfSpeech || []), value.code])]
    } else if (action === 'tag-add') {
      const name = String(value.name || '').trim()
      if (!name) throw new Error('Falta la etiqueta')
      entry.tags = [...new Set([...(entry.tags || []), name])]
    } else {
      throw new Error(`Acción desconocida: ${action}`)
    }
    if (canonical(entry) === before) {
      skipped.push({ id, word: entry.lexeme, reason: 'ya lo tenía' })
      continue
    }
    const state = syncStateOf(entry, workspace.base.entries?.[id])
    entry.sync = {
      ...entry.sync,
      state: entry.sync?.state === 'conflict' && state !== 'synced' ? 'conflict' : state,
      version: (entry.sync?.version ?? 0) + 1
    }
    changed.push(id)
  }
  return { changed, skipped }
}

function emptySense(entryId) {
  return {
    id: newId('sense', `${entryId}#0`),
    glosses: null,
    partsOfSpeech: [],
    semanticDomains: [],
    nounClass: null,
    pluralForm: null,
    sentenceIds: []
  }
}

/**
 * @param {{ method, pathname, body }} request  body: parsed JSON (or null)
 * @param {object} store { load, saveEntries, saveSentences, loadRegistry, saveRegistry, now }
 */
export async function handleLdRequest({ method, pathname, body }, store) {
  const parts = pathname.split('/').filter(Boolean) // ['entries', '<id>']
  const [collection, id] = parts
  const workspace = await store.load()

  if (method === 'GET' && collection === 'summary') return reply(200, summary(workspace))

  if (method === 'POST' && collection === 'entries' && id === 'bulk') {
    let result
    try {
      result = applyBulk(workspace, body || {})
    } catch (error) {
      return reply(400, { error: error.message })
    }
    if (result.changed.length) {
      const validation = check({
        kind: 'entries',
        entries: Object.fromEntries(result.changed.map((key) => [key, workspace.entries[key]]))
      })
      if (!validation.valid)
        return reply(400, { error: 'Datos no válidos', details: validation.errors })
      await store.saveEntries(workspace.entries)
    }
    return reply(200, result)
  }

  const kinds = {
    entries: { file: 'entries', label: (r) => r.lexeme, save: store.saveEntries },
    sentences: { file: 'sentences', label: (r) => r.text, save: store.saveSentences }
  }
  const kind = kinds[collection]
  if (!kind || parts.length > 2) return notFound(pathname)
  const records = workspace[kind.file]
  const baseRecords = workspace.base[kind.file] || {}

  async function persist(record) {
    const result = check({ kind: kind.file, [kind.file]: { [record.id]: record } })
    if (!result.valid) return reply(400, { error: 'Datos no válidos', details: result.errors })
    records[record.id] = record
    let links = { registryLinks: 0 }
    if (kind.file === 'entries') links = await relinkSite(store, workspace)
    else if (syncSentenceLinks(workspace, record.id, record.senseIds || [])) {
      await store.saveEntries(workspace.entries)
    }
    await kind.save(records)
    return reply(200, {
      [collection === 'entries' ? 'entry' : 'sentence']: records[record.id],
      ...links
    })
  }

  if (method === 'GET' && !id) return reply(200, { [kind.file]: Object.values(records) })

  if (method === 'GET') {
    const record = records[id]
    if (!record) return notFound(id)
    const extra = {}
    if (kind.file === 'entries') {
      const sentenceIds = record.senses.flatMap((sense) => sense.sentenceIds || [])
      extra.sentences = sentenceIds
        .map((sentenceId) => workspace.sentences[sentenceId])
        .filter(Boolean)
    }
    return reply(200, { record, base: baseRecords[id] || null, ...extra })
  }

  if (method === 'POST' && !id) {
    const text = kind.file === 'entries' ? body?.lexeme : body?.text
    if (!text || !String(text).trim()) {
      return reply(400, {
        error: kind.file === 'entries' ? 'Falta la palabra' : 'Falta la oración'
      })
    }
    const homograph = body.homograph || null
    const recordId = newId(
      kind.file === 'entries' ? 'entry' : 'sentence',
      `${toAudioId(text)}#${homograph || 1}`
    )
    if (records[recordId] || baseRecords[recordId]) {
      return reply(409, {
        error: `Ya existe «${text}»${homograph ? ` (${homograph})` : ''}`,
        id: recordId
      })
    }
    const sync = { state: 'new', ldUpdatedAt: null, version: 1, lastError: null }
    const record =
      kind.file === 'entries'
        ? {
            id: recordId,
            lexeme: String(text).trim(),
            homograph,
            senses: body.senses?.length ? body.senses : [emptySense(recordId)],
            audio: [],
            relations: [],
            siteKeys: [],
            review: null,
            suggestions: [],
            sync
          }
        : {
            id: recordId,
            text: String(text).trim(),
            translations: body.translations || null,
            translationStatus: {},
            audio: [],
            senseIds: body.senseIds || [],
            siteKeys: [],
            review: null,
            suggestions: [],
            sync
          }
    const result = await persist(record)
    return result.status === 200 ? reply(201, result.json) : result
  }

  if (method === 'PUT' && id) {
    const current = records[id]
    if (!current) return notFound(id)
    const incoming = body?.[collection === 'entries' ? 'entry' : 'sentence']
    if (!incoming || incoming.id !== id)
      return reply(400, { error: 'El cuerpo no es este registro' })
    const currentVersion = current.sync?.version ?? 0
    if (body.version !== currentVersion) {
      return reply(409, {
        error:
          'Otra pestaña guardó este registro mientras lo editabas. Recarga para ver sus cambios.',
        version: currentVersion
      })
    }
    const state = syncStateOf(incoming, baseRecords[id])
    const record = {
      ...incoming,
      sync: {
        ...current.sync,
        ...incoming.sync,
        state: current.sync?.state === 'conflict' && state !== 'synced' ? 'conflict' : state,
        version: currentVersion + 1,
        lastError: state === 'synced' ? null : (current.sync?.lastError ?? null)
      }
    }
    return persist(record)
  }

  if (method === 'DELETE' && id) {
    const current = records[id]
    if (!current) return notFound(id)
    if (baseRecords[id]) {
      return reply(409, {
        error:
          'Está en Living Dictionaries: borrarlo allí es un paso aparte con confirmación (tarea L5.6).'
      })
    }
    delete records[id]
    if (kind.file === 'entries') await relinkSite(store, workspace)
    else if (syncSentenceLinks(workspace, id, [])) await store.saveEntries(workspace.entries)
    await kind.save(records)
    return reply(200, { deleted: id })
  }

  return reply(405, { error: `${method} no se admite aquí` })
}

/** The real store: the workspace files and the word registry. One write at a time. */
export async function fileStore() {
  const workspaceModule = await import('./workspace.mjs')
  const registryModule = await import('../registry.mjs')
  return {
    load: () => workspaceModule.loadWorkspace(),
    saveEntries: (entries) =>
      workspaceModule.saveEntries(entries, workspaceModule.loadWorkspace().base.pulledAt ?? null),
    saveSentences: (sentences) =>
      workspaceModule.saveSentences(
        sentences,
        workspaceModule.loadWorkspace().base.pulledAt ?? null
      ),
    loadRegistry: () => registryModule.loadRegistry(),
    saveRegistry: (words) => registryModule.saveRegistry(words)
  }
}

let writing = Promise.resolve()
/** Runs requests one after another so two saves never interleave their file writes. */
export function handleSerially(request, store) {
  const run = writing.then(() => handleLdRequest(request, store))
  writing = run.catch(() => {})
  return run
}
