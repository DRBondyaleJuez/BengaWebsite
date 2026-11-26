/**
 * «Traer de LD» (task L5.2): read the dictionary from its public snapshot, compare it with the
 * workspace and merge LD's changes in without losing yours.
 *
 *   readRemote()           snapshot → { entries, sentences, speakers, readAt } (cached 10 min)
 *   planPull(workspace, remote)       → changeset (diff.mjs) = the preview
 *   applyPull(workspace, remote, at)  → new { entries, sentences, base } (pure)
 *
 * Rules: a field LD changed and you did not → LD's value. A field you changed → yours (it is sent
 * with «Enviar cambios»). Both changed differently → yours stays, the record is marked "conflict"
 * with both values (sync.conflicts) for you to choose (L5.5). Deleted in LD: removed here if you
 * had not changed it, else kept as a conflict. Records only here ("new") are untouched.
 */
import fs from 'node:fs'
import path from 'node:path'
import { downloadSnapshot } from './client.mjs'
import { openSnapshot, readSnapshot } from './snapshot.mjs'
import { diffWorkspace, mergeRemote } from './diff.mjs'
import { toWorkspaceRecord } from './workspace.mjs'
import { syncStateOf, canonical, ldFieldsOf } from './admin-api.mjs'
import { ROOT } from '../collect-words.mjs'

const CACHE_DIR = path.join(ROOT, 'ld-sync/cache')
const CACHE_MINUTES = 10

/**
 * The dictionary as the snapshot has it. The snapshot file is kept for 10 minutes, so a preview
 * followed by «Aplicar» downloads it once. The snapshot can be ~30 min behind the dictionary.
 */
export async function readRemote(dictionary, { fresh = false, fetchImpl } = {}) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  const file = path.join(CACHE_DIR, `${dictionary}.db`)
  const meta = path.join(CACHE_DIR, `${dictionary}.json`)
  let bytes
  let readAt
  let fromCache = false
  if (!fresh && fs.existsSync(file) && fs.existsSync(meta)) {
    const info = JSON.parse(fs.readFileSync(meta, 'utf8'))
    if (Date.now() - Date.parse(info.readAt) < CACHE_MINUTES * 60 * 1000) {
      bytes = fs.readFileSync(file)
      readAt = info.readAt
      fromCache = true
    }
  }
  if (!bytes) {
    bytes = await downloadSnapshot(dictionary, fetchImpl ? { fetchImpl } : {})
    readAt = new Date().toISOString()
    fs.writeFileSync(file, bytes)
    fs.writeFileSync(meta, JSON.stringify({ readAt }) + '\n')
  }
  const snapshot = await openSnapshot(bytes)
  try {
    return { ...readSnapshot(snapshot.db), readAt, fromCache }
  } finally {
    snapshot.close()
  }
}

/** What a pull would do: the changeset between base, workspace and the remote state. */
export function planPull(workspace, remote) {
  return diffWorkspace({
    base: workspace.base,
    workspace,
    remote: { entries: remote.entries, sentences: remote.sentences }
  })
}

const withoutUpdatedAt = (record) => {
  if (!record) return record
  const { updatedAt, ...rest } = record
  void updatedAt
  return rest
}

/**
 * Applies a pull. Pure: returns new objects, the caller saves them.
 * @returns {{ entries, sentences, base, summary: { updated, added, removed, conflicts } }}
 */
export function applyPull(workspace, remote, pulledAt) {
  const summary = { updated: [], added: [], removed: [], conflicts: [] }
  const result = { entries: {}, sentences: {} }
  for (const kind of ['entries', 'sentences']) {
    const label = (record) => (kind === 'entries' ? record.lexeme : record.text)
    const local = workspace[kind]
    const base = workspace.base[kind] || {}
    const there = remote[kind]
    const ids = new Set([...Object.keys(local), ...Object.keys(there)])
    for (const id of ids) {
      const l = local[id]
      const r = there[id]
      const b = base[id]
      if (!l) {
        // new in LD (or deleted here while it still exists there: keep the deletion pending)
        if (r && !b) {
          result[kind][id] = toWorkspaceRecord(r, null)
          summary.added.push(label(r))
        }
        continue
      }
      if (!r) {
        if (!b)
          result[kind][id] = l // only here
        else if (syncStateOf(l, b) === 'synced') summary.removed.push(label(l))
        else {
          result[kind][id] = {
            ...l,
            sync: {
              ...l.sync,
              state: 'conflict',
              conflicts: [{ field: '*', base: null, local: null, remote: null }]
            }
          }
          summary.conflicts.push(label(l))
        }
        continue
      }
      const { record, conflicts } = mergeRemote(
        b ? withoutUpdatedAt(b) : withoutUpdatedAt(r),
        l,
        withoutUpdatedAt(r),
        kind
      )
      if (kind === 'entries') record.ldReview = r.ldReview ?? null
      const state = conflicts.length ? 'conflict' : syncStateOf(record, r)
      const { conflicts: previous, ...sync } = l.sync || {}
      const { sync: oldSync, ...oldFields } = l
      const { sync: newSync, ...newFields } = record
      void newSync
      // the version goes up only when the record really changed (it protects open forms)
      const changed =
        canonical(oldFields) !== canonical(newFields) ||
        (oldSync?.state || 'synced') !== state ||
        canonical(previous || []) !== canonical(conflicts)
      record.sync = {
        ...sync,
        state,
        ldUpdatedAt: r.updatedAt ?? null,
        version: (l.sync?.version ?? 0) + (changed ? 1 : 0),
        lastError: state === 'synced' ? null : (l.sync?.lastError ?? null),
        ...(conflicts.length ? { conflicts } : {})
      }
      if (conflicts.length) summary.conflicts.push(label(record))
      else if (canonical(ldFieldsOf(record)) !== canonical(ldFieldsOf(l))) {
        summary.updated.push(label(record))
      }
      result[kind][id] = record
    }
  }
  return {
    entries: result.entries,
    sentences: result.sentences,
    base: { pulledAt, entries: remote.entries, sentences: remote.sentences },
    summary
  }
}
