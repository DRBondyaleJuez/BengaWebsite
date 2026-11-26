/**
 * Sync run logs (task L5.4): one JSON file per run in ld-sync/runs/ (git-ignored, REVIEW-LOG
 * R-044). The admin's Sincronización page reads them; scripts write them while they work, so a
 * page can follow the progress of a running sync.
 *
 *   { id, kind: pull|push|undo, mode: check|apply, status: running|done|failed|halted,
 *     startedAt, finishedAt, progress: { done, total }, preview, totals, items: [...], error }
 *   item: { id, word, operation, status: ok|failed|skipped, http, category, message, fields }
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from '../collect-words.mjs'

export const RUNS_DIR = path.join(ROOT, 'ld-sync/runs')

const stamp = (date) => date.toISOString().replace(/[:.]/g, '-')

/**
 * @param {{ kind, mode, runId?, dir?, now? }} options  runId: given by the admin when it starts
 *   the script, so the page knows which file to follow
 */
export function startRun({ kind, mode, runId, dir = RUNS_DIR, now = () => new Date() }) {
  fs.mkdirSync(dir, { recursive: true })
  const startedAt = now()
  const id = runId || `${stamp(startedAt)}-${kind}-${mode}`
  const file = path.join(dir, `${id}.json`)
  const run = {
    id,
    kind,
    mode,
    status: 'running',
    startedAt: startedAt.toISOString(),
    finishedAt: null,
    progress: { done: 0, total: 0 },
    preview: null,
    totals: {},
    items: [],
    error: null
  }
  let last = 0
  const write = (force = false) => {
    // at most a few writes per second while running; always on the last one
    if (!force && Date.now() - last < 300) return
    last = Date.now()
    const text = JSON.stringify(run, null, 2) + '\n'
    const temporary = `${file}.tmp`
    fs.writeFileSync(temporary, text)
    // Windows refuses to replace a file another process is reading (the admin polls it): retry,
    // then write in place (a reader may see a half file once; it just reads again)
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        fs.renameSync(temporary, file)
        return
      } catch (error) {
        if (!['EPERM', 'EBUSY', 'EACCES'].includes(error.code)) throw error
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30)
      }
    }
    fs.writeFileSync(file, text)
    fs.rmSync(temporary, { force: true })
  }
  write(true)
  return {
    run,
    file,
    setPreview(preview) {
      run.preview = preview
      write(true)
    },
    setTotal(total) {
      run.progress.total = total
      write()
    },
    item(item) {
      run.items.push(item)
      run.progress.done += 1
      run.totals[item.status] = (run.totals[item.status] || 0) + 1
      write()
    },
    finish(status = 'done', error = null) {
      run.status = status
      run.error = error
      run.finishedAt = now().toISOString()
      write(true)
      return run
    }
  }
}

/** Every run, newest first, without the items (for the list). */
export function listRuns(dir = RUNS_DIR) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      try {
        const run = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'))
        const { items, preview, ...rest } = run
        return {
          ...rest,
          itemCount: items.length,
          failedCount: items.filter((item) => item.status === 'failed').length,
          createdCount: items.filter((item) => item.operation === 'create' && item.status === 'ok')
            .length,
          hasPreview: Boolean(preview)
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export function readRun(id, dir = RUNS_DIR) {
  if (!/^[\w.-]+$/.test(id)) return null
  const file = path.join(dir, `${id}.json`)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null // being written right now: the page asks again
  }
}
