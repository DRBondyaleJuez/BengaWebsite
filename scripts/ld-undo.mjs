/**
 * npm run ld:undo -- <import_id> — «Deshacer un envío» (task L5.6): deletes in Living
 * Dictionaries the entries CREATED by one push (every push stamps its new entries with an
 * import_id, shown in the run log). Changes to entries that already existed are not undone.
 *
 *   node scripts/ld-undo.mjs <import_id> --check            count only (dry run, writes nothing)
 *   node scripts/ld-undo.mjs <import_id> --confirm <count>   delete exactly that many
 *
 * The deleted entries stay in the local copy as "new" (not sent): delete them there too if you
 * don't want them. Needs LD_API_KEY in .env.local. Logged in ld-sync/runs/.
 */
import { loadEnvLocal } from './lib/cloudinary.mjs'
import { ldClient } from './lib/ld/client.mjs'
import { loadWorkspace, saveBase, saveEntries } from './lib/ld/workspace.mjs'
import { startRun, listRuns, readRun } from './lib/ld/runlog.mjs'
import { LD_DICTIONARY_ID, LD_IMPORT_PREFIX } from '../src/config/ld.js'

const args = process.argv.slice(2)
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const checkOnly = args.includes('--check')
const importId = args.find(
  (arg) => !arg.startsWith('--') && arg !== option('--confirm') && arg !== option('--run-id')
)
const confirmCount = option('--confirm') === undefined ? undefined : Number(option('--confirm'))
const log = startRun({
  kind: 'undo',
  mode: checkOnly ? 'check' : 'apply',
  runId: option('--run-id')
})

try {
  if (!importId || !importId.startsWith(`${LD_IMPORT_PREFIX}-`)) {
    throw new Error(`Indica el import_id de un envío (empieza por «${LD_IMPORT_PREFIX}-»)`)
  }
  if (!checkOnly && !Number.isInteger(confirmCount)) {
    throw new Error('Para borrar, primero --check y luego --confirm <número que dio --check>')
  }
  loadEnvLocal()
  const apiKey = process.env.LD_API_KEY
  if (!apiKey)
    throw Object.assign(new Error('Falta LD_API_KEY=ldk_… en .env.local'), { category: 'auth' })
  const client = ldClient({ apiKey, dictionary: process.env.LD_DICTIONARY_ID || LD_DICTIONARY_ID })
  const workspace = loadWorkspace()
  const word = (id) => workspace.entries[id]?.lexeme || workspace.base.entries[id]?.lexeme || id

  const count = await client.batchDelete(importId, { dryRun: true })
  const sample = (count.sample_entry_ids || []).map(word)
  log.run.importId = importId
  log.setPreview({ importId, count: count.count, sample })
  console.log(`El envío ${importId} creó ${count.count} entradas en Living Dictionaries.`)
  if (sample.length) console.log(`  Por ejemplo: ${sample.join(', ')}`)
  if (checkOnly) {
    log.finish('done')
    console.log(
      `\n(Solo recuento.) Para borrarlas: node scripts/ld-undo.mjs ${importId} --confirm ${count.count}`
    )
    process.exit(0)
  }
  if (confirmCount !== count.count) {
    throw Object.assign(
      new Error(
        `Confirmaste ${confirmCount} pero ahora son ${count.count}: vuelve a contar con --check`
      ),
      { category: 'conflict' }
    )
  }
  const result = await client.batchDelete(importId, { confirmCount })
  // What that push created is no longer in LD: forget it in base, keep it here as "new". The dry
  // run only lists a sample, so the created entries are taken from the push's run log.
  let local = 0
  const ids = new Set()
  const pushes = listRuns().filter((run) => run.importId === importId && run.kind === 'push')
  for (const run of pushes) {
    for (const item of readRun(run.id)?.items || []) {
      if (item.operation === 'create' && item.status === 'ok' && item.kind === 'entries')
        ids.add(item.id)
    }
  }
  for (const id of ids) {
    delete workspace.base.entries[id]
    const entry = workspace.entries[id]
    if (entry) {
      entry.sync = { ...entry.sync, state: 'new', version: (entry.sync?.version ?? 0) + 1 }
      local += 1
    }
    log.item({ id, word: word(id), kind: 'entries', operation: 'delete', status: 'ok' })
  }
  await saveBase(workspace.base)
  await saveEntries(workspace.entries, workspace.base.pulledAt)
  log.finish('done')
  console.log(`✓ Borradas ${result.count} entradas en Living Dictionaries.`)
  if (local)
    console.log(
      `  ${local} siguen en la copia local como «nuevas»: bórralas aquí si no las quieres.`
    )
} catch (error) {
  if (error.status === 404) {
    error.message =
      'Ese envío no creó palabras nuevas (solo cambió las que ya había): no hay nada que deshacer con él.'
    error.category = 'not_found'
  }
  log.finish('failed', { message: error.message, category: error.category || 'unknown' })
  console.error(`✗ ${error.message}`)
  process.exit(1)
}
