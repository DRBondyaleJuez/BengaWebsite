/**
 * Three-way change detection between the dictionary workspace and Living Dictionaries
 * (task L5.1 of docs/LD-ROADMAP.md). Pure functions, no files, no network.
 *
 *   base    = the record as last read from LD (base.json)
 *   local   = the workspace record (entries.json / sentences.json)
 *   remote  = the record as LD has it now (fresh snapshot or API read)
 *
 * Every record is flattened into FIELD PATHS, so changes are compared one field at a time:
 *   lexeme · notes.es · tags · relations[synonym|<to>||] · audio[<id>]
 *   senses[<id>] (the sense exists) · senses[<id>].glosses.fr · senses[<id>].partsOfSpeech
 * A path changed only here is a local change, only in LD a remote change, in both with different
 * values a conflict (same value on both sides = converged, nothing to do).
 *
 * Text is compared in NFC (LD stores some accents decomposed, a + U+0304), so a record that only
 * differs in Unicode form is NOT a change: we never send a "normalisation" of their wording.
 */

export const ENTRY_FIELDS = {
  scalars: ['lexeme', 'homograph', 'phonetic', 'interlinearization', 'morphology', 'toneClass'],
  multi: ['notes', 'linguisticHistory'],
  lists: ['scientificNames'], // order matters, replaced as a whole
  sets: ['dialects', 'tags', 'citations'] // order does not matter
}
export const SENSE_FIELDS = {
  scalars: ['nounClass', 'pluralForm', 'variant', 'conceptId'],
  multi: ['glosses', 'definition'],
  lists: [],
  sets: ['partsOfSpeech', 'semanticDomains', 'writeInDomains', 'citations', 'sentenceIds']
}
export const SENTENCE_FIELDS = {
  scalars: ['text', 'speakerId', 'textId'],
  multi: ['translations', 'translationStatus'],
  lists: [],
  sets: ['citations', 'senseIds']
}

/** Fields holding arrays: "empty" is [] for them, never null (dictionary.schema.json). */
const ARRAY_FIELDS = new Set(
  [ENTRY_FIELDS, SENSE_FIELDS, SENTENCE_FIELDS].flatMap((fields) => [
    ...fields.lists,
    ...fields.sets
  ])
)

const nfc = (value) => (typeof value === 'string' ? value.normalize('NFC') : value)

/** Stable text of a value: sorted keys, NFC strings, empty values = absent. */
export function canonicalValue(value) {
  if (value === undefined || value === null || value === '') return 'null'
  if (Array.isArray(value)) {
    return value.length ? `[${value.map(canonicalValue).join(',')}]` : 'null'
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value)
      .filter((key) => canonicalValue(value[key]) !== 'null')
      .sort()
    return keys.length
      ? `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalValue(value[key])}`).join(',')}}`
      : 'null'
  }
  return JSON.stringify(nfc(value))
}

export const sameValue = (a, b) => canonicalValue(a) === canonicalValue(b)

const setOf = (items) =>
  (items || [])
    .map((item) => canonicalValue(item))
    .filter((text) => text !== 'null')
    .sort()

export const relationKey = (relation) =>
  `${relation.type}|${relation.to}|${relation.fromSense || ''}|${relation.toSense || ''}`

function flattenFields(record, fields, prefix, out) {
  for (const field of fields.scalars) out.set(prefix + field, record[field] ?? null)
  for (const field of fields.lists) out.set(prefix + field, record[field] ?? null)
  for (const field of fields.sets) {
    const items = setOf(record[field])
    out.set(prefix + field, items.length ? items : null)
  }
  for (const field of fields.multi) {
    const value = record[field]
    if (value && typeof value === 'object') {
      for (const [lang, text] of Object.entries(value)) out.set(`${prefix}${field}.${lang}`, text)
    }
  }
}

/** Map of field path → value. Paths with an empty value may be missing (missing = empty). */
export function flatten(record, kind) {
  const out = new Map()
  if (!record) return out
  if (kind === 'sentences') {
    flattenFields(record, SENTENCE_FIELDS, '', out)
    for (const audio of record.audio || []) out.set(`audio[${audio.id}]`, audio)
    return out
  }
  flattenFields(record, ENTRY_FIELDS, '', out)
  for (const sense of record.senses || []) {
    const prefix = `senses[${sense.id}]`
    out.set(prefix, true)
    flattenFields(sense, SENSE_FIELDS, `${prefix}.`, out)
    for (const photo of sense.photos || []) out.set(`${prefix}.photos[${photo.id}]`, photo)
  }
  for (const audio of record.audio || []) out.set(`audio[${audio.id}]`, audio)
  for (const relation of record.relations || []) {
    out.set(`relations[${relationKey(relation)}]`, relation)
  }
  return out
}

/** Media paths are sent by the audio bridge (phase L6) and photo upload, not as field patches. */
export const isMediaPath = (path) => /(^audio\[|\.photos\[)/.test(path)

function changedPaths(fromMap, toMap) {
  const paths = new Set([...fromMap.keys(), ...toMap.keys()])
  return [...paths].filter((path) => !sameValue(fromMap.get(path), toMap.get(path)))
}

/**
 * @returns {{ local: string[], remote: string[], conflicts: string[], converged: string[] }}
 *   paths are sorted; a sense path `senses[x]` means the whole sense was added or removed.
 */
export function diffRecord(base, local, remote, kind) {
  const baseMap = flatten(base, kind)
  const localMap = flatten(local, kind)
  const remoteMap = flatten(remote, kind)
  const localChanged = new Set(changedPaths(baseMap, localMap))
  const remoteChanged = new Set(changedPaths(baseMap, remoteMap))
  const result = { local: [], remote: [], conflicts: [], converged: [] }
  for (const path of new Set([...localChanged, ...remoteChanged])) {
    const here = localChanged.has(path)
    const there = remoteChanged.has(path)
    if (here && there) {
      if (sameValue(localMap.get(path), remoteMap.get(path))) result.converged.push(path)
      else result.conflicts.push(path)
    } else if (here) result.local.push(path)
    else result.remote.push(path)
  }
  // A sense added or removed on one side: its field paths follow it (only the sense path is
  // kept). If the other side edited that sense meanwhile, the whole sense is one conflict.
  const ownerOf = (path) => path.match(/^(senses\[[^\]]+\])\./)?.[1]
  const isSense = (path) => /^senses\[[^\]]+\]$/.test(path)
  for (const side of ['local', 'remote']) {
    const other = side === 'local' ? 'remote' : 'local'
    for (const sensePath of result[side].filter(isSense)) {
      const touched = (list) => list.some((path) => ownerOf(path) === sensePath)
      const clash = touched(result[other]) || touched(result.conflicts)
      for (const key of Object.keys(result)) {
        result[key] = result[key].filter(
          (path) => ownerOf(path) !== sensePath && !(clash && path === sensePath)
        )
      }
      if (clash) result.conflicts.push(sensePath)
    }
  }
  for (const key of Object.keys(result)) result[key].sort()
  return result
}

/**
 * Status of one record and its changed paths.
 *   new (only here) · new-in-ld · changed · changed-in-ld · both-changed (different fields)
 *   conflict · deleted-locally · deleted-in-ld · unchanged
 */
export function recordStatus(base, local, remote, kind) {
  if (!base) {
    if (local && !remote) return { status: 'new', ...diffRecord(null, local, null, kind) }
    if (!local && remote) return { status: 'new-in-ld', ...diffRecord(null, null, remote, kind) }
    if (!local && !remote)
      return { status: 'unchanged', local: [], remote: [], conflicts: [], converged: [] }
    // Both have it but we never read it (e.g. sent and not re-read): every difference is a conflict.
    const diff = diffRecord(remote, local, remote, kind)
    return {
      status: diff.local.length ? 'conflict' : 'unchanged',
      ...diff,
      conflicts: diff.local,
      local: []
    }
  }
  if (!local && !remote)
    return { status: 'unchanged', local: [], remote: [], conflicts: [], converged: [] }
  if (!local) return { status: 'deleted-locally', ...diffRecord(base, base, remote, kind) }
  if (!remote) return { status: 'deleted-in-ld', ...diffRecord(base, local, base, kind) }
  const diff = diffRecord(base, local, remote, kind)
  let status = 'unchanged'
  if (diff.conflicts.length) status = 'conflict'
  else if (diff.local.length && diff.remote.length) status = 'both-changed'
  else if (diff.local.length) status = 'changed'
  else if (diff.remote.length) status = 'changed-in-ld'
  return { status, ...diff }
}

/**
 * Changeset of the whole workspace.
 * @param {{ base: {entries, sentences}, workspace: {entries, sentences}, remote: {entries, sentences} }} sides
 * @returns {{ entries: object[], sentences: object[], counts: Record<string, number> }}
 *   items: { id, label, status, local, remote, conflicts, converged } (unchanged ones left out)
 */
export function diffWorkspace({ base, workspace, remote }) {
  const counts = {}
  const run = (kind, label) => {
    const ids = new Set([
      ...Object.keys(base[kind] || {}),
      ...Object.keys(workspace[kind] || {}),
      ...Object.keys(remote[kind] || {})
    ])
    const items = []
    for (const id of ids) {
      const b = base[kind]?.[id] || null
      const l = workspace[kind]?.[id] || null
      const r = remote[kind]?.[id] || null
      const result = recordStatus(b, l, r, kind)
      if (result.status === 'unchanged' && !result.converged.length) continue
      counts[result.status] = (counts[result.status] || 0) + 1
      items.push({ id, label: label(l || r || b), ...result })
    }
    return items.sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
  }
  return {
    entries: run('entries', (record) => record.lexeme),
    sentences: run('sentences', (record) => record.text),
    counts
  }
}

// ---- reading and writing one path -------------------------------------------------------------

const SEGMENT = /^(\w+)(?:\[([^\]]+)\])?$/

function parsePath(path) {
  return path.split(/\.(?![^[]*\])/).map((segment) => {
    const match = segment.match(SEGMENT)
    if (!match) throw new Error(`Ruta no válida: ${path}`)
    return { name: match[1], key: match[2] ?? null }
  })
}

const elementKey = (name, item) => (name === 'relations' ? relationKey(item) : item.id)

/** Value at a path (an element path returns the element, e.g. the whole sense). */
export function getPath(record, path) {
  let node = record
  for (const { name, key } of parsePath(path)) {
    if (node === null || node === undefined) return undefined
    node = node[name]
    if (key !== null) node = (node || []).find((item) => elementKey(name, item) === key)
  }
  return node
}

/**
 * Copies the value at `path` from `source` into `target` (mutates target). Absent in source →
 * removed from target. Used to take LD's value (pull, «Usar la de LD»).
 */
export function copyPath(target, source, path) {
  const segments = parsePath(path)
  const last = segments.pop()
  let to = target
  let from = source
  for (const { name, key } of segments) {
    from = from?.[name]
    if (key !== null) from = (from || []).find((item) => elementKey(name, item) === key)
    let next = to[name]
    if (key !== null) next = (next || []).find((item) => elementKey(name, item) === key)
    if (next === undefined || next === null) {
      if (from === undefined || from === null) return target // nothing to copy or remove
      if (key !== null) {
        // element missing here (e.g. sense removed locally): bring the whole element
        to[name] = [...(to[name] || []), structuredClone(from)]
        return target
      }
      next = to[name] = {}
    }
    to = next
  }
  const value =
    last.key !== null
      ? (from?.[last.name] || []).find((item) => elementKey(last.name, item) === last.key)
      : from?.[last.name]
  if (last.key !== null) {
    const list = [...(to[last.name] || [])]
    const index = list.findIndex((item) => elementKey(last.name, item) === last.key)
    if (value === undefined) {
      if (index >= 0) list.splice(index, 1)
    } else if (index >= 0) list[index] = structuredClone(value)
    else list.push(structuredClone(value))
    to[last.name] = list
  } else if (value === undefined || value === null) {
    if (Array.isArray(to[last.name]) || ARRAY_FIELDS.has(last.name)) to[last.name] = []
    else if (segments.length && segments.at(-1).key === null && typeof to === 'object') {
      delete to[last.name] // a language of a multi-text
    } else to[last.name] = null
  } else {
    to[last.name] = structuredClone(value)
  }
  // a multi-text left empty becomes null
  if (segments.length && segments.at(-1).key === null) {
    const owner = segments.at(-1).name
    const parent = segments.length > 1 ? getPath(target, pathOf(segments.slice(0, -1))) : target
    if (parent && parent[owner] && !Object.keys(parent[owner]).length) parent[owner] = null
  }
  return target
}

const pathOf = (segments) =>
  segments.map(({ name, key }) => (key !== null ? `${name}[${key}]` : name)).join('.')

/**
 * Pull merge of one record: LD's changes are taken where you did not change the field; where
 * both changed differently, your value stays and the field is listed as a conflict.
 * @returns {{ record, conflicts: { field, base, local, remote }[] }}
 */
export function mergeRemote(base, local, remote, kind) {
  const { remote: remoteOnly, conflicts } = diffRecord(base, local, remote, kind)
  const record = structuredClone(local)
  for (const path of remoteOnly) copyPath(record, remote, path)
  return {
    record,
    conflicts: conflicts.map((field) => ({
      field,
      base: getPath(base, field) ?? null,
      local: getPath(local, field) ?? null,
      remote: getPath(remote, field) ?? null
    }))
  }
}
