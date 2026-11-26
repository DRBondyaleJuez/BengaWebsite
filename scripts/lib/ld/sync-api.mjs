/**
 * Sync part of the local admin API (/__dev/ld/sync/*, tasks L5.2–L5.6). The admin never talks to
 * Living Dictionaries itself: it starts the same commands you can run by hand (ld-pull, ld-push,
 * ld-undo) as a child process and follows the run log they write in ld-sync/runs/. The API key
 * stays in those scripts (read from .env.local); this process never sees it.
 *
 *   GET  /sync/status          { running: { runId, kind, mode } | null }
 *   GET  /sync/runs            run list, newest first
 *   GET  /sync/runs/:id        one run with its preview and items
 *   POST /sync/start           { kind: pull|push|undo, mode: check|apply, options } → 202 { runId }
 *
 * One run at a time. While a run that writes (mode apply) is going, edits are refused (423) so a
 * push never sends a record that is being changed.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { ROOT } from '../collect-words.mjs'
import { listRuns, readRun, RUNS_DIR } from './runlog.mjs'

const SCRIPTS = {
  pull: 'scripts/ld-pull.mjs',
  push: 'scripts/ld-push.mjs',
  undo: 'scripts/ld-undo.mjs'
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

let current = null

/** True while a sync that writes is running: the workspace must not change meanwhile. */
export const isSyncRunning = () => Boolean(current && current.mode === 'apply')

const reply = (status, json) => ({ status, json })

/** Command-line arguments for a run, from the options sent by the page (validated). */
export function argsFor(kind, mode, options = {}) {
  const args = []
  if (mode === 'check') args.push('--check')
  if (kind === 'pull' && options.fresh) args.push('--fresh')
  if (kind === 'push') {
    const only = options.only || []
    if (!Array.isArray(only) || only.some((id) => !UUID.test(id))) {
      throw new Error('Lista de entradas no válida')
    }
    if (only.length) args.push('--only', only.join(','))
    if (options.deletions) args.push('--deletions')
  }
  if (kind === 'undo') {
    if (!/^[\w.-]+$/.test(options.importId || '')) throw new Error('Falta el import_id')
    args.push(options.importId)
    if (mode === 'apply') {
      if (!Number.isInteger(options.confirmCount)) throw new Error('Falta el número a confirmar')
      args.push('--confirm', String(options.confirmCount))
    }
  }
  return args
}

const stamp = () => new Date().toISOString().replace(/[:.]/g, '-')

/**
 * @param {{ method, parts: string[], body }} request  parts: path after /sync
 * @param {{ spawnImpl?, runsDir? }} [deps] for tests
 */
export async function handleSyncRequest({ method, parts, body }, deps = {}) {
  const { spawnImpl = spawn, runsDir = RUNS_DIR } = deps
  const [what, id] = parts
  if (method === 'GET' && what === 'status') {
    return reply(200, {
      running: current ? { runId: current.runId, kind: current.kind, mode: current.mode } : null
    })
  }
  if (method === 'GET' && what === 'runs' && !id) return reply(200, { runs: listRuns(runsDir) })
  if (method === 'GET' && what === 'runs') {
    const run = readRun(id, runsDir)
    return run ? reply(200, { run }) : reply(404, { error: `No existe el registro ${id}` })
  }
  if (method === 'POST' && what === 'start') {
    const { kind, mode, options } = body || {}
    if (!SCRIPTS[kind] || !['check', 'apply'].includes(mode)) {
      return reply(400, { error: 'Tipo de sincronización desconocido' })
    }
    if (current) {
      return reply(409, { error: 'Ya hay una sincronización en curso', runId: current.runId })
    }
    let args
    try {
      args = argsFor(kind, mode, options)
    } catch (error) {
      return reply(400, { error: error.message })
    }
    const runId = `${stamp()}-${kind}-${mode}`
    const child = spawnImpl(
      process.execPath,
      [
        '--experimental-sqlite',
        '--disable-warning=ExperimentalWarning',
        path.join(ROOT, SCRIPTS[kind]),
        ...args,
        '--run-id',
        runId
      ],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }
    )
    let output = ''
    const keep = (chunk) => (output = (output + chunk).slice(-4000))
    child.stdout?.on('data', keep)
    child.stderr?.on('data', keep)
    current = { runId, kind, mode, child }
    child.on('close', (code) => {
      current = null
      const run = readRun(runId, runsDir)
      if (code !== 0 && run?.status === 'running') {
        // the script stopped before it could finish its log
        run.status = 'failed'
        run.error = { message: output.trim().split('\n').slice(-3).join(' '), category: 'unknown' }
        run.finishedAt = new Date().toISOString()
        import('node:fs').then((fs) =>
          fs.writeFileSync(path.join(runsDir, `${runId}.json`), JSON.stringify(run, null, 2))
        )
      }
    })
    return reply(202, { runId })
  }
  return reply(405, { error: `${method} no se admite aquí` })
}
