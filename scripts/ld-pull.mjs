/**
 * npm run ld:pull — «Traer de LD»: reads the Benga Living Dictionary from its public snapshot
 * (ONE request, no key) and merges its changes into the local workspace src/data/dictionary/
 * (tasks L1.2 and L5.2 of docs/LD-ROADMAP.md; rules in scripts/lib/ld/pull.mjs).
 *
 *   npm run ld:pull                  merge LD's changes (yours are kept; conflicts are marked)
 *   npm run ld:pull -- --check       only show what would change, write nothing
 *   npm run ld:pull -- --fresh       download again even if the snapshot was read < 10 min ago
 *   --run-id <id>                    (used by the admin) name of the run log in ld-sync/runs/
 *
 * Every run is logged in ld-sync/runs/ (git-ignored). Nothing is ever written to LD here.
 */
import { readRemote, planPull, applyPull } from './lib/ld/pull.mjs'
import {
  loadWorkspace,
  saveBase,
  saveEntries,
  saveSentences,
  saveSpeakers
} from './lib/ld/workspace.mjs'
import { startRun } from './lib/ld/runlog.mjs'
import { fieldLabel } from '../src/utils/ldFieldLabels.js'
import { LD_DICTIONARY_ID } from '../src/config/ld.js'

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const fresh = args.includes('--fresh')
const runId = args.includes('--run-id') ? args[args.indexOf('--run-id') + 1] : undefined
const dictionary = process.env.LD_DICTIONARY_ID || LD_DICTIONARY_ID

const log = startRun({ kind: 'pull', mode: checkOnly ? 'check' : 'apply', runId })

const STATUS = {
  'new-in-ld': 'nuevas en LD (se añaden aquí)',
  'changed-in-ld': 'cambiadas en LD (se actualizan aquí)',
  'both-changed': 'cambiadas aquí y en LD en campos distintos (se juntan)',
  conflict: 'en conflicto (el mismo campo cambió aquí y en LD: tú eliges)',
  'deleted-in-ld': 'borradas en LD',
  changed: 'con cambios tuyos sin enviar (no se tocan)',
  new: 'solo aquí, sin enviar (no se tocan)',
  'deleted-locally': 'borradas aquí, sin enviar (no se tocan)'
}

try {
  console.log(`Leyendo el snapshot público de «${dictionary}»…`)
  const remote = await readRemote(dictionary, { fresh })
  console.log(remote.fromCache ? `  (copia descargada a las ${remote.readAt})` : '  descargado')
  const workspace = loadWorkspace()
  const plan = planPull(workspace, remote)

  const labelled = (item, record) => ({
    ...item,
    labels: {
      remote: item.remote.map((path) => fieldLabel(path, record)),
      local: item.local.map((path) => fieldLabel(path, record)),
      conflicts: item.conflicts.map((path) => fieldLabel(path, record))
    }
  })
  const preview = {
    readAt: remote.readAt,
    counts: plan.counts,
    stale: plan.stale,
    entries: plan.entries.map((item) =>
      labelled(item, workspace.entries[item.id] || remote.entries[item.id])
    ),
    sentences: plan.sentences.map((item) => labelled(item, null))
  }
  log.setPreview(preview)

  console.log(`\nComparación con lo leído el ${workspace.base.pulledAt || '(nunca)'}:`)
  for (const [status, text] of Object.entries(STATUS)) {
    const items = [...preview.entries, ...preview.sentences].filter(
      (item) => item.status === status
    )
    if (!items.length) continue
    console.log(`  ${items.length} ${text}`)
    for (const item of items.slice(0, 15)) {
      const fields = [...item.labels.remote, ...item.labels.conflicts, ...item.labels.local]
      console.log(`     · ${item.label}${fields.length ? `: ${fields.join(', ')}` : ''}`)
    }
    if (items.length > 15) console.log(`     … y ${items.length - 15} más`)
  }
  if (!plan.entries.length && !plan.sentences.length) console.log('  Todo igual.')
  if (plan.stale.length) {
    console.log(
      `  (${plan.stale.length} registros de la copia pública son más antiguos que lo que ya enviaste y leíste: se ignoran: ${plan.stale.join(', ')})`
    )
  }

  if (checkOnly) {
    log.finish('done')
    console.log('\n(Solo comprobación: no se escribió nada.)')
    process.exit(0)
  }

  const result = applyPull(workspace, remote, remote.readAt)
  await saveSpeakers(remote.speakers)
  await saveBase(result.base)
  await saveEntries(result.entries, remote.readAt)
  await saveSentences(result.sentences, remote.readAt)
  const { stale, ...done } = result.summary
  void stale
  for (const [operation, words] of Object.entries(done)) {
    for (const word of words) log.item({ word, operation, status: 'ok' })
  }
  log.finish('done')
  const { updated, added, removed, conflicts } = result.summary
  console.log(
    `\n✓ Workspace actualizado: ${updated.length} actualizadas, ${added.length} nuevas, ${removed.length} quitadas, ${conflicts.length} en conflicto`
  )
  if (conflicts.length) {
    console.log(`  Conflictos (resuélvelos en la ficha): ${conflicts.join(', ')}`)
  }
  console.log('  Siguiente: npm run ld:link y npm run validate')
} catch (error) {
  log.finish('failed', { message: error.message, category: error.category || 'unknown' })
  console.error(`✗ ${error.message}`)
  process.exit(1)
}
