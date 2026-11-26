/**
 * «Enviar cambios» (tasks L5.3 and L5.6 of docs/LD-ROADMAP.md): send ONLY what changed in the
 * workspace since the last read, check every answer, re-read what was sent to verify it, and
 * update base.json.
 *
 *   planPush(workspace, options)  → the preview: one item per record with the exact fields
 *                                   (before → after), warnings, and the payloads (pure)
 *   runPush({ workspace, plan, client, ... })  → sends the plan; returns the new workspace
 *
 * Order of a run: new sentences → new entries (POST, with import_id) → entry changes
 * (batch-update) → sentence changes (PATCH) → new relations → photos → deletions (only with
 * `deletions: true`, always confirmed twice in the admin) → verification (GET of each record).
 *
 * Never sent: local-only fields (review unless «Enviar esta marca», suggestions, history, links to
 * the site), records in conflict, audio (phase L6). Things the API cannot remove (a tag, a
 * dialect, a citation, a sentence link) are listed as warnings for you to do on the LD website.
 */
import { latest } from './snapshot.mjs'
import { recordStatus, getPath, isMediaPath, canonicalValue, sameValue } from './diff.mjs'
import { syncStateOf, ldFieldsOf } from './admin-api.mjs'
import { fieldLabel } from '../../../src/utils/ldFieldLabels.js'
import { LD_LIMITS } from '../../../src/config/ld.js'

const SNAKE = {
  toneClass: 'tone_class',
  linguisticHistory: 'linguistic_history',
  scientificNames: 'scientific_names',
  partsOfSpeech: 'parts_of_speech',
  semanticDomains: 'semantic_domains',
  writeInDomains: 'write_in_semantic_domains',
  nounClass: 'noun_class',
  pluralForm: 'plural_form',
  conceptId: 'concept_id',
  translations: 'translation',
  speakerId: 'speaker_id'
}
const snake = (field) => SNAKE[field] || field
const MULTI = new Set(['notes', 'linguisticHistory', 'glosses', 'definition', 'translations'])
/** Lists LD only adds to (a PATCH never removes from them). */
const ADDITIVE = new Set(['tags', 'dialects', 'citations', 'sentenceIds'])
/** Lists LD replaces as a whole. */
const REPLACED = new Set(['scientificNames', 'partsOfSpeech', 'semanticDomains', 'writeInDomains'])
const SCALARS = new Set([
  'lexeme',
  'homograph',
  'phonetic',
  'interlinearization',
  'morphology',
  'toneClass',
  'nounClass',
  'pluralForm',
  'variant',
  'conceptId',
  'text',
  'speakerId'
])

const isEmpty = (value) => canonicalValue(value) === 'null'
const clean = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => !isEmpty(value)))

/** Items of `after` not in `before` (compared like diff.mjs: NFC, any key order). */
function added(before = [], after = []) {
  const known = new Set((before || []).map(canonicalValue))
  return (after || []).filter((item) => !known.has(canonicalValue(item)))
}
const removed = (before, after) => added(after, before)

// ---- payloads ----------------------------------------------------------------------------------

export function sensePayload(sense) {
  return clean({
    id: sense.id,
    glosses: sense.glosses,
    definition: sense.definition,
    parts_of_speech: sense.partsOfSpeech,
    semantic_domains: sense.semanticDomains,
    write_in_semantic_domains: sense.writeInDomains,
    noun_class: sense.nounClass,
    plural_form: sense.pluralForm,
    variant: sense.variant,
    concept_id: sense.conceptId,
    citations: sense.citations,
    example_sentences: (sense.sentenceIds || []).map((id) => ({ id }))
  })
}

const reviewPayload = (review) => ({ category: review.category, note: review.note })

/** A whole new entry for POST /entries. */
export function entryPayload(entry) {
  return clean({
    id: entry.id,
    lexeme: entry.lexeme,
    homograph: entry.homograph,
    phonetic: entry.phonetic,
    interlinearization: entry.interlinearization,
    morphology: entry.morphology,
    tone_class: entry.toneClass,
    notes: entry.notes,
    linguistic_history: entry.linguisticHistory,
    scientific_names: entry.scientificNames,
    dialects: entry.dialects,
    tags: entry.tags,
    citations: entry.citations,
    review: entry.review?.sendToLd ? reviewPayload(entry.review) : null,
    senses: entry.senses.map(sensePayload)
  })
}

/** A whole new sentence for POST /sentences. */
export function sentencePayload(sentence) {
  const meta = Object.fromEntries(
    Object.entries(sentence.translationStatus || {}).map(([lang, status]) => [lang, { status }])
  )
  return clean({
    id: sentence.id,
    text: sentence.text,
    translation: sentence.translations,
    translation_meta: meta,
    speaker_id: sentence.speakerId,
    citations: sentence.citations
  })
}

/**
 * Turns the changed paths of one record into a PATCH body (only those fields).
 * @returns {{ patch: object, changes: object[], warnings: string[], relations: object[],
 *   deletions: object[], photos: object[] }}
 */
export function buildPatch(kind, base, local, paths) {
  const patch = { id: local.id }
  const changes = []
  const warnings = []
  const relations = []
  const deletions = []
  const photos = []
  const senses = new Map() // id → sense patch
  const sensePatch = (id) => {
    if (!senses.has(id)) senses.set(id, { id })
    return senses.get(id)
  }
  const note = (path, text) => changes.push({ path, label: fieldLabel(path, local), note: text })
  const change = (path, before, after) =>
    changes.push({ path, label: fieldLabel(path, local), before, after })

  for (const path of paths) {
    const sense = path.match(/^senses\[([^\]]+)\](?:\.(.+))?$/)
    if (kind === 'entries' && path.startsWith('audio[')) {
      note(path, 'audio nuevo: se envía con «Copiar audios» (fase L6)')
      continue
    }
    if (kind === 'sentences' && path.startsWith('audio[')) {
      note(path, 'audio nuevo: se envía con «Copiar audios» (fase L6)')
      continue
    }
    if (path.startsWith('relations[')) {
      const now = getPath(local, path)
      const before = getPath(base, path)
      if (now && !before) {
        if (now.type.startsWith('custom:')) {
          warnings.push('Una relación de tipo propio solo se puede crear en la web de LD.')
          continue
        }
        relations.push(
          clean({
            from_entry_id: local.id,
            to_entry_id: now.to,
            from_sense_id: now.fromSense,
            to_sense_id: now.toSense,
            type: now.type
          })
        )
        change(path, null, `${now.type} → ${now.to}`)
      } else if (before && !now) {
        deletions.push({ kind: 'relationship', id: before.id, label: fieldLabel(path, base) })
      }
      continue
    }
    if (sense && !sense[2]) {
      const id = sense[1]
      const now = local.senses.find((item) => item.id === id)
      if (now) {
        senses.set(id, sensePayload(now))
        change(path, null, now.glosses?.es || now.glosses?.en || '(sentido nuevo)')
      } else {
        deletions.push({ kind: 'sense', id, label: fieldLabel(path, base) })
      }
      continue
    }
    if (isMediaPath(path)) {
      const photo = getPath(local, path)
      if (photo?.pendingFile && sense) photos.push({ senseId: sense[1], photo })
      else if (!photo) warnings.push(`${fieldLabel(path, base)}: bórrala en la web de LD.`)
      if (photo?.pendingFile) note(path, 'imagen nueva: se sube')
      continue
    }
    if (kind === 'sentences' && path === 'senseIds') continue // sent from the entry side
    const fieldPath = sense ? sense[2] : path
    const target = sense ? sensePatch(sense[1]) : patch
    const [field, lang] = fieldPath.split('.')
    const before = getPath(base, path)
    const after = getPath(local, path)
    if (field === 'translationStatus') {
      target.translation_meta = {
        ...target.translation_meta,
        [lang]: after ? { status: after } : null
      }
      change(path, before, after)
    } else if (MULTI.has(field)) {
      target[snake(field)] = { ...target[snake(field)], [lang]: after ?? '' }
      change(path, before, after)
    } else if (ADDITIVE.has(field)) {
      const more = added(before, after)
      const less = removed(before, after)
      if (more.length) {
        if (field === 'sentenceIds') {
          target.example_sentences = more.map((id) => ({ id }))
          change(path, null, `${more.length} oración(es) enlazada(s)`)
        } else {
          target[snake(field)] = more
          change(path, null, more.map((item) => item.slug || item).join(', '))
        }
      }
      if (less.length) {
        warnings.push(
          `${fieldLabel(path, local)}: quitar ${less.map((item) => item.slug || item).join(', ')} solo se puede en la web de LD.`
        )
      }
    } else if (REPLACED.has(field)) {
      target[snake(field)] = after?.length ? after : null
      change(path, before, after)
    } else if (SCALARS.has(field)) {
      if (field === 'lexeme' && isEmpty(after)) {
        warnings.push('La palabra no puede quedar vacía.')
        continue
      }
      target[snake(field)] = isEmpty(after) ? null : after
      change(path, before, after)
    } else {
      warnings.push(`${fieldLabel(path, local)}: este campo no se envía desde aquí.`)
    }
  }
  if (senses.size) patch.senses = [...senses.values()]
  return { patch, changes, warnings, relations, deletions, photos }
}

// ---- plan ----------------------------------------------------------------------------------------

const label = (kind, record) => (kind === 'entries' ? record.lexeme : record.text)

/**
 * The preview of «Enviar cambios».
 * @param {{ entries, sentences, base }} workspace
 * @param {{ only?: string[], deletions?: boolean, limit?: number }} options
 *   only: ids to send (entries or sentences; empty = all); limit: most records per run
 * @returns {{ entries: object[], sentences: object[], counts, limit, more: number }}
 */
export function planPush(workspace, { only = [], deletions = false, limit } = {}) {
  const max = limit ?? LD_LIMITS.recordsPerPush
  const wanted = only.length ? new Set(only) : null
  const items = []
  for (const kind of ['sentences', 'entries']) {
    const records = workspace[kind] || {}
    const baseRecords = workspace.base[kind] || {}
    for (const id of new Set([...Object.keys(records), ...Object.keys(baseRecords)])) {
      const local = records[id] || null
      const base = baseRecords[id] || null
      if (!local && !base) continue
      const { status, local: paths } = recordStatus(base, local, base, kind)
      const reviewChange =
        kind === 'entries' &&
        local?.review?.sendToLd &&
        !sameValue(reviewPayload(local.review), base?.ldReview && reviewPayload(base.ldReview))
      if (status === 'unchanged' && !reviewChange) continue
      const item = { id, kind, label: label(kind, local || base), changes: [], warnings: [] }
      if (local?.sync?.state === 'conflict') {
        item.status = 'blocked'
        item.warnings.push('Tiene un conflicto con Living Dictionaries: resuélvelo en su ficha.')
      } else if (status === 'new') {
        item.status = 'create'
        item.payload = kind === 'entries' ? entryPayload(local) : sentencePayload(local)
        item.changes.push({ path: '*', label: 'todo', note: 'registro nuevo' })
        const media = (local.audio || []).filter((audio) => audio.pendingFile)
        if (media.length) item.warnings.push('Sus audios se envían con «Copiar audios» (fase L6).')
        if (kind === 'entries') {
          item.photos = local.senses.flatMap((sense) =>
            (sense.photos || [])
              .filter((photo) => photo.pendingFile)
              .map((photo) => ({ senseId: sense.id, photo }))
          )
          item.relations = (local.relations || [])
            .filter((relation) => !relation.type.startsWith('custom:'))
            .map((relation) =>
              clean({
                from_entry_id: id,
                to_entry_id: relation.to,
                from_sense_id: relation.fromSense,
                to_sense_id: relation.toSense,
                type: relation.type
              })
            )
        }
      } else if (status === 'deleted-locally') {
        item.status = 'delete'
        item.deletions = [
          { kind: kind === 'entries' ? 'entry' : 'sentence', id, label: item.label }
        ]
        item.changes.push({ path: '*', label: 'todo', note: 'se borra en Living Dictionaries' })
      } else {
        const built = buildPatch(kind, base, local, paths)
        if (reviewChange) {
          built.patch.review = reviewPayload(local.review)
          built.changes.push({
            path: 'review',
            label: 'marca «Necesita revisión»',
            before: base?.ldReview?.note || null,
            after: local.review.note
          })
        }
        Object.assign(item, {
          status: 'update',
          payload: built.patch,
          relations: built.relations,
          photos: built.photos,
          deletions: built.deletions
        })
        item.changes.push(...built.changes)
        item.warnings.push(...built.warnings)
        for (const deletion of built.deletions) {
          item.changes.push({ path: deletion.id, label: deletion.label, note: 'se borra en LD' })
        }
        const sendsSomething =
          Object.keys(built.patch).length > 1 ||
          built.relations.length ||
          built.photos.length ||
          (deletions && built.deletions.length)
        if (!sendsSomething) item.status = 'skipped'
      }
      if (item.deletions?.length && !deletions) {
        if (item.status === 'delete') item.status = 'skipped'
        item.warnings.push('Incluye borrados: marca «Incluir borrados» para enviarlos.')
        item.deletions = []
      }
      items.push(item)
    }
  }
  // which ones go in this run
  let taken = 0
  let more = 0
  for (const item of items) {
    if (!['create', 'update', 'delete'].includes(item.status)) continue
    if (wanted && !wanted.has(item.id)) {
      item.status = 'skipped'
      item.warnings.push('No está en la selección de este envío.')
      continue
    }
    if (taken >= max) {
      item.status = 'skipped'
      item.warnings.push(`Pasa del límite de ${max} por envío: irá en el siguiente.`)
      more += 1
      continue
    }
    taken += 1
  }
  const counts = {}
  for (const item of items) counts[item.status] = (counts[item.status] || 0) + 1
  const byLabel = (a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' })
  return {
    entries: items.filter((item) => item.kind === 'entries').sort(byLabel),
    sentences: items.filter((item) => item.kind === 'sentences').sort(byLabel),
    counts,
    limit: max,
    more
  }
}

// ---- reading back what LD has ---------------------------------------------------------------------

const vernacularOf = (value) =>
  value && typeof value === 'object'
    ? (value.default ?? Object.values(value)[0] ?? null)
    : value || null
const glossesOf = (value) => {
  if (!value || typeof value !== 'object') return value ? { es: value } : null
  const result = clean(
    Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'default'))
  )
  return Object.keys(result).length ? result : null
}
const listOf = (value) => (Array.isArray(value) ? value : value ? [value] : [])

/** GET /entries/{id} answer → the fields of a workspace record (diff.mjs paths). */
export function fromApiEntry(json) {
  const entry = json.entry || json
  const main = entry.main || entry
  return {
    id: entry.id,
    lexeme: vernacularOf(main.lexeme),
    homograph: main.homograph || null,
    phonetic: main.phonetic || null,
    interlinearization: main.interlinearization || null,
    morphology: main.morphology || null,
    toneClass: main.tone_class || null,
    notes: glossesOf(main.notes),
    linguisticHistory: glossesOf(main.linguistic_history),
    scientificNames: listOf(main.scientific_names),
    citations: listOf(main.citations).map((item) =>
      item.locator ? { slug: item.slug, locator: item.locator } : { slug: item.slug }
    ),
    senses: (entry.senses || []).map((sense) => ({
      id: sense.id,
      glosses: glossesOf(sense.glosses),
      definition: glossesOf(sense.definition),
      partsOfSpeech: listOf(sense.parts_of_speech),
      semanticDomains: listOf(sense.semantic_domains).map(String),
      writeInDomains: listOf(sense.write_in_semantic_domains),
      nounClass: sense.noun_class || null,
      pluralForm: vernacularOf(sense.plural_form),
      variant: vernacularOf(sense.variant),
      conceptId: sense.concept_id || null,
      citations: listOf(sense.citations).map((item) =>
        item.locator ? { slug: item.slug, locator: item.locator } : { slug: item.slug }
      ),
      sentenceIds: (sense.sentences || []).map((sentence) => sentence.id),
      photos: (sense.photos || []).map((photo) => ({
        id: photo.id,
        storagePath: photo.storage_path,
        source: photo.source || null,
        photographer: photo.photographer || null
      }))
    })),
    relations: (entry.relationships || [])
      .filter((relation) => relation.direction !== 'inverse')
      .map((relation) => ({
        id: relation.id,
        type: relation.custom ? `custom:${relation.type}` : relation.type,
        to: relation.related?.entry_id,
        fromSense: null,
        toSense: relation.related?.sense_id || null
      })),
    updatedAt: latest([entry.updated_at, ...(entry.senses || []).map((sense) => sense.updated_at)])
  }
}

/** GET /sentences/{id} answer → workspace sentence fields. */
export function fromApiSentence(json) {
  const sentence = json.sentence || json
  const translationStatus = {}
  for (const [lang, value] of Object.entries(sentence.translation_meta || {})) {
    const status = typeof value === 'string' ? value : value?.status
    if (['es', 'en', 'fr'].includes(lang) && status) translationStatus[lang] = status
  }
  return {
    id: sentence.id,
    text: vernacularOf(sentence.text),
    translations: glossesOf(sentence.translation),
    translationStatus,
    speakerId: sentence.speaker_id || null,
    citations: listOf(sentence.citations),
    updatedAt: sentence.updated_at || null
  }
}

/** Paths that a read-back can confirm (tags, dialects, review and media are not in the answer). */
const VERIFIABLE = (path) =>
  !/^(tags|dialects|review|audio|relations)/.test(path) && !isMediaPath(path)

/**
 * Relations of an entry after a push: the ones read before, minus the ones deleted, plus the ones
 * created now (with the id LD gave them, found in the read-back by type and target).
 */
function mergeRelations(previous, item, fresh) {
  const deleted = new Set(
    (item.deletions || []).filter((d) => d.kind === 'relationship').map((d) => d.id)
  )
  const result = previous.filter((relation) => !deleted.has(relation.id))
  for (const created of item.relations || []) {
    const there = fresh.find((r) => r.type === created.type && r.to === created.to_entry_id)
    result.push({
      id: there?.id ?? null,
      type: created.type,
      to: created.to_entry_id,
      fromSense: created.from_sense_id ?? null,
      toSense: created.to_sense_id ?? null
    })
  }
  return result
}

// ---- run ----------------------------------------------------------------------------------------

const chunks = (list, size) => {
  const out = []
  for (let index = 0; index < list.length; index += size) out.push(list.slice(index, index + size))
  return out
}

/**
 * Sends a plan. Mutates nothing it receives; returns the new { entries, sentences, base }.
 * @param {{ workspace, plan, client, importId, deletions, log, now, readFile }} options
 *   client: ldClient(); log: runlog item(); readFile(path) → bytes (photos)
 */
export async function runPush({
  workspace,
  plan,
  client,
  importId,
  deletions = false,
  log = () => {},
  now = () => new Date().toISOString(),
  readFile
}) {
  const entries = structuredClone(workspace.entries)
  const sentences = structuredClone(workspace.sentences)
  const base = structuredClone(workspace.base)
  const records = { entries, sentences }
  const sending = [...plan.sentences, ...plan.entries].filter((item) =>
    ['create', 'update', 'delete'].includes(item.status)
  )
  const failed = new Map() // id → error
  const done = new Set()
  const fail = (item, operation, error) => {
    failed.set(item.id, error)
    log({
      id: item.id,
      word: item.label,
      kind: item.kind,
      operation,
      status: 'failed',
      http: error.status ?? null,
      category: error.category || 'unknown',
      message: error.message
    })
  }
  const ok = (item, operation, fields = []) => {
    done.add(item.id)
    log({ id: item.id, word: item.label, kind: item.kind, operation, status: 'ok', fields })
  }
  const step = async (items, operation, send) => {
    for (const item of items) {
      if (client.halted) {
        fail(item, operation, {
          message: 'Envío detenido tras 3 fallos seguidos',
          category: 'network'
        })
        continue
      }
      if (failed.has(item.id)) continue
      try {
        await send(item)
      } catch (error) {
        fail(item, operation, error)
      }
    }
  }
  const of = (kind, status) =>
    sending.filter((item) => item.kind === kind && item.status === status)

  // 1. new sentences (before entries can link them)
  await step(of('sentences', 'create'), 'create', async (item) => {
    await client.call('POST', '/sentences', { body: item.payload })
    ok(item, 'create')
  })

  // 2. new entries, in batches, with the import id
  for (const batch of chunks(of('entries', 'create'), LD_LIMITS.batchSize)) {
    if (client.halted) break
    try {
      const answer = await client.postEntries(
        batch.map((item) => item.payload),
        importId
      )
      const results = answer.results || []
      if (results.length !== batch.length) {
        throw Object.assign(
          new Error(`LD devolvió ${results.length} resultados para ${batch.length}`),
          {
            category: 'server'
          }
        )
      }
      batch.forEach((item, index) => {
        const result = results[index]
        if (result.status === 'created' || result.status === 'exists') ok(item, 'create')
        else
          fail(item, 'create', { message: result.error || result.status, category: 'validation' })
      })
    } catch (error) {
      for (const item of batch) fail(item, 'create', error)
    }
  }

  // 3. changed entries, only the changed fields
  const updates = of('entries', 'update').filter((item) => Object.keys(item.payload).length > 1)
  for (const batch of chunks(updates, LD_LIMITS.batchSize)) {
    if (client.halted) break
    try {
      const answer = await client.batchUpdate(batch.map((item) => item.payload))
      const results = answer.results || []
      if (results.length !== batch.length) {
        throw Object.assign(
          new Error(`LD devolvió ${results.length} resultados para ${batch.length}`),
          {
            category: 'server'
          }
        )
      }
      if (answer.halted_error)
        throw Object.assign(new Error(answer.halted_error), { category: 'server' })
      batch.forEach((item, index) => {
        const result = results[index]
        if (result.status === 'updated' || result.status === 'unchanged') {
          ok(
            item,
            'update',
            item.changes.map((change) => change.label)
          )
        } else {
          fail(item, 'update', {
            message: result.error || result.status,
            category: result.status === 'not_found' ? 'not_found' : 'validation'
          })
        }
      })
    } catch (error) {
      for (const item of batch) fail(item, 'update', error)
    }
  }

  // 4. changed sentences
  await step(of('sentences', 'update'), 'update', async (item) => {
    const { id, ...patch } = item.payload
    if (Object.keys(patch).length) await client.patchSentence(id, patch)
    ok(
      item,
      'update',
      item.changes.map((change) => change.label)
    )
  })

  // 5. relations and photos of entries that were sent
  const withExtras = sending.filter((item) => item.kind === 'entries' && !failed.has(item.id))
  const relations = withExtras.flatMap((item) => (item.relations || []).map((r) => ({ item, r })))
  for (const batch of chunks(relations, LD_LIMITS.batchSize)) {
    if (client.halted) break
    try {
      const answer = await client.postRelationships(batch.map(({ r }) => r))
      ;(answer.results || []).forEach((result, index) => {
        if (result.status === 'failed') {
          fail(batch[index].item, 'relation', { message: result.error, category: 'validation' })
        }
      })
    } catch (error) {
      for (const { item } of batch) fail(item, 'relation', error)
    }
  }
  const photos = withExtras.flatMap((item) => (item.photos || []).map((p) => ({ item, ...p })))
  for (const { item, senseId, photo } of photos.slice(0, LD_LIMITS.mediaPerRun)) {
    if (client.halted || failed.has(item.id)) continue
    try {
      const form = new FormData()
      form.append('id', photo.id)
      if (photo.source) form.append('source', photo.source)
      if (photo.photographer) form.append('photographer', photo.photographer)
      const name = photo.pendingFile.split('/').pop()
      form.append('file', new Blob([readFile(photo.pendingFile)]), name)
      await client.call('POST', `/senses/${senseId}/photos`, { form, kind: 'media' })
      log({ id: item.id, word: item.label, kind: 'entries', operation: 'photo', status: 'ok' })
    } catch (error) {
      fail(item, 'photo', error)
    }
  }

  // 6. deletions (only when asked; the admin confirms them twice)
  if (deletions) {
    const PATHS = {
      relationship: (id) => `/relationships/${id}`,
      sense: (id) => `/senses/${id}`,
      sentence: (id) => `/sentences/${id}`,
      entry: (id) => `/entries/${id}`
    }
    const ORDER = ['relationship', 'sense', 'sentence', 'entry']
    const list = sending
      .flatMap((item) => (item.deletions || []).map((deletion) => ({ item, ...deletion })))
      .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))
    for (const { item, kind, id, label: what } of list) {
      if (client.halted || failed.has(item.id)) continue
      try {
        await client.call('DELETE', PATHS[kind](id))
        log({
          id: item.id,
          word: item.label,
          kind: item.kind,
          operation: 'delete',
          status: 'ok',
          fields: [what]
        })
        if (kind === 'entry') delete base.entries[id]
        if (kind === 'sentence') delete base.sentences[id]
        done.add(item.id)
      } catch (error) {
        fail(item, 'delete', error)
      }
    }
  }

  // 7. verify: read every sent record back and compare the fields that were sent
  for (const item of sending) {
    if (item.status === 'delete' || failed.has(item.id) || !done.has(item.id)) continue
    const local = records[item.kind][item.id]
    try {
      const fresh =
        item.kind === 'entries'
          ? fromApiEntry(await client.call('GET', `/entries/${item.id}?include=relationships`))
          : fromApiSentence(await client.sentence(item.id))
      const previous = base[item.kind][item.id]
      // base = what LD has now for the fields the answer carries; the rest stays as read before
      const merged = previous ? structuredClone(previous) : ldFieldsOf(structuredClone(local))
      for (const key of Object.keys(fresh)) {
        if (key !== 'senses' && key !== 'relations') merged[key] = fresh[key]
      }
      if (item.kind === 'entries') {
        merged.senses = fresh.senses.map((sense) => {
          const before = (previous || local).senses?.find((s) => s.id === sense.id) || {}
          return { ...before, ...sense }
        })
        merged.relations = mergeRelations(previous?.relations || [], item, fresh.relations)
        merged.audio = previous?.audio || []
        merged.dialects = [...new Set([...(previous?.dialects || []), ...(local.dialects || [])])]
        merged.tags = [...new Set([...(previous?.tags || []), ...(local.tags || [])])]
        if (local.review?.sendToLd) merged.ldReview = { ...reviewPayload(local.review), by: 'ld' }
        for (const { senseId, photo } of item.photos || []) {
          const there = merged.senses
            .find((s) => s.id === senseId)
            ?.photos?.find((p) => p.id === photo.id)
          const mine = local.senses
            .find((s) => s.id === senseId)
            ?.photos?.find((p) => p.id === photo.id)
          if (there && mine) {
            delete mine.pendingFile
            mine.storagePath = there.storagePath
          }
        }
        // the sentences now linked in LD: their base gets the link too
        for (const sense of merged.senses) {
          for (const sentenceId of sense.sentenceIds || []) {
            const sentenceBase = base.sentences[sentenceId]
            if (sentenceBase && !(sentenceBase.senseIds || []).includes(sense.id)) {
              sentenceBase.senseIds = [...(sentenceBase.senseIds || []), sense.id]
              const sentence = sentences[sentenceId]
              if (sentence && sentence.sync?.state !== 'conflict') {
                sentence.sync = { ...sentence.sync, state: syncStateOf(sentence, sentenceBase) }
              }
            }
          }
        }
      } else {
        merged.audio = previous?.audio || []
        merged.senseIds = previous?.senseIds || []
      }
      const sentPaths = item.changes.map((change) => change.path)
      const differing = recordStatus(merged, local, merged, item.kind).local.filter(VERIFIABLE)
      const wrong = differing.filter((path) => {
        if (
          item.status !== 'create' &&
          !sentPaths.some((sent) => path === sent || path.startsWith(sent + '.'))
        )
          return false
        const field = path.split('.').pop()
        if (ADDITIVE.has(field) || field === 'senseIds') {
          return added(getPath(merged, path), getPath(local, path)).length > 0
        }
        return true
      })
      base[item.kind][item.id] = merged
      local.sync = {
        ...local.sync,
        state: wrong.length ? 'error' : syncStateOf(local, merged),
        ldUpdatedAt: fresh.updatedAt,
        version: (local.sync?.version ?? 0) + 1,
        lastError: wrong.length
          ? {
              category: 'conflict',
              message: `Enviado, pero LD tiene otro valor en: ${wrong.map((p) => fieldLabel(p, local)).join(', ')}`,
              at: now()
            }
          : null
      }
      log({
        id: item.id,
        word: item.label,
        kind: item.kind,
        operation: 'verify',
        status: wrong.length ? 'failed' : 'ok',
        ...(wrong.length ? { category: 'conflict' } : {}),
        fields: wrong.map((p) => fieldLabel(p, local))
      })
    } catch (error) {
      log({
        id: item.id,
        word: item.label,
        kind: item.kind,
        operation: 'verify',
        status: 'failed',
        http: error.status ?? null,
        category: error.category || 'unknown',
        message: error.message
      })
    }
  }

  // 8. errors on the records that failed
  for (const [id, error] of failed) {
    const record = entries[id] || sentences[id]
    if (!record) continue
    record.sync = {
      ...record.sync,
      state: 'error',
      version: (record.sync?.version ?? 0) + 1,
      lastError: {
        category: error.category || 'unknown',
        message: String(error.message || ''),
        at: now()
      }
    }
  }
  // deleted ones are gone from base too: nothing left to send
  return { entries, sentences, base, failed: failed.size, sent: done.size }
}
