/**
 * npm run ld:push — «Enviar cambios»: sends ONLY what changed in the workspace to the Benga Living
 * Dictionary (tasks L5.3 and L5.6 of docs/LD-ROADMAP.md; logic in scripts/lib/ld/push.mjs).
 *
 *   npm run ld:push:check                      preview: every record and field that would be sent
 *   npm run ld:push                            send (at most LD_LIMITS.recordsPerPush records)
 *   node scripts/ld-push.mjs --only <id,id>    send only these entries / sentences
 *   --deletions                                also send deletions (the admin confirms them twice)
 *   --run-id <id>                              (used by the admin) name of the run log
 *
 * Before sending it asks LD which entries changed since your last «Traer de LD»: those are held
 * back until you pull them. Every answer is checked and every sent record is read back. Needs
 * LD_API_KEY in .env.local. Run logs: ld-sync/runs/ (git-ignored).
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadEnvLocal } from './lib/cloudinary.mjs'
import { ldClient } from './lib/ld/client.mjs'
import { planPush, runPush } from './lib/ld/push.mjs'
import { loadWorkspace, saveBase, saveEntries, saveSentences } from './lib/ld/workspace.mjs'
import { startRun } from './lib/ld/runlog.mjs'
import { ROOT } from './lib/collect-words.mjs'
import { LD_DICTIONARY_ID, LD_IMPORT_PREFIX } from '../src/config/ld.js'

const args = process.argv.slice(2)
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const checkOnly = args.includes('--check')
const deletions = args.includes('--deletions')
const only = (option('--only') || '').split(',').filter(Boolean)
const dictionary = process.env.LD_DICTIONARY_ID || LD_DICTIONARY_ID

const log = startRun({
  kind: 'push',
  mode: checkOnly ? 'check' : 'apply',
  runId: option('--run-id')
})

const GROUPS = {
  blocked: '✗ no se pueden enviar',
  delete: '🗑 se borrarán en LD',
  create: '＋ nuevas',
  update: '✎ cambiadas',
  skipped: '· quedan para otro envío'
}
const show = (value) =>
  value === null || value === undefined || value === ''
    ? '(vacío)'
    : Array.isArray(value)
      ? value.join(', ')
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)

function printPlan(plan) {
  const items = [...plan.entries, ...plan.sentences]
  if (!items.length)
    return console.log('  Nada que enviar: la copia local es igual a lo último leído.')
  for (const [status, title] of Object.entries(GROUPS)) {
    const group = items.filter((item) => item.status === status)
    if (!group.length) continue
    console.log(`\n${title}: ${group.length}`)
    for (const item of group) {
      console.log(`  ${item.kind === 'sentences' ? 'oración ' : ''}${item.label}`)
      for (const change of item.changes) {
        console.log(
          `     ${change.label}: ${change.note || `${show(change.before)} → ${show(change.after)}`}`
        )
      }
      for (const warning of item.warnings) console.log(`     ⚠ ${warning}`)
    }
  }
}

/** Entry ids changed in LD since the last read (with a margin: the snapshot may lag ~30 min). */
async function changedInLd(client, pulledAt) {
  const ids = new Set()
  if (!pulledAt) return ids
  const since = new Date(Date.parse(pulledAt) - 35 * 60 * 1000).toISOString()
  for (let offset = 0; offset < 20000;) {
    const page = await client.changedSince(since, { include: 'senses', limit: 500, offset })
    const list = page.entries || page.data || []
    for (const entry of list) ids.add(entry.id)
    if (list.length < 500) break
    offset += list.length
  }
  return ids
}

try {
  const workspace = loadWorkspace()
  const plan = planPush(workspace, { only, deletions })
  console.log(`Cambios locales frente a lo leído el ${workspace.base.pulledAt || '(nunca)'}:`)
  printPlan(plan)
  if (plan.more)
    console.log(`\n(${plan.more} más quedan para el siguiente envío: límite ${plan.limit})`)

  if (checkOnly) {
    log.setPreview(plan)
    log.finish('done')
    console.log('\n(Solo vista previa: no se envió nada.)')
    process.exit(0)
  }

  loadEnvLocal()
  const apiKey = process.env.LD_API_KEY
  if (!apiKey)
    throw Object.assign(new Error('Falta LD_API_KEY=ldk_… en .env.local'), { category: 'auth' })
  const client = ldClient({ apiKey, dictionary })

  // gloss languages the dictionary accepts
  const info = await client.dictionaryInfo()
  const languages = info.dictionary?.gloss_languages || info.gloss_languages || []
  const missing = ['es', 'en', 'fr'].filter((lang) => languages.length && !languages.includes(lang))
  if (missing.length) {
    console.log(`  ⚠ El diccionario no tiene estas lenguas de traducción: ${missing.join(', ')}`)
  }

  // held back: entries that changed in LD after your last read
  const changed = await changedInLd(client, workspace.base.pulledAt)
  for (const item of [...plan.entries, ...plan.sentences]) {
    if (['create', 'update', 'delete'].includes(item.status) && changed.has(item.id)) {
      item.status = 'blocked'
      item.warnings.push(
        'Cambió en Living Dictionaries después de tu última lectura: trae los cambios primero.'
      )
    }
  }
  const importId = `${LD_IMPORT_PREFIX}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`
  log.run.importId = importId
  log.setPreview(plan)
  const sending = [...plan.entries, ...plan.sentences].filter((item) =>
    ['create', 'update', 'delete'].includes(item.status)
  )
  log.setTotal(sending.length)
  if (!sending.length) {
    log.finish('done')
    console.log('\nNada que enviar.')
    process.exit(0)
  }
  console.log(`\nEnviando ${sending.length} registros (import_id ${importId})…`)

  const result = await runPush({
    workspace,
    plan,
    client,
    importId,
    deletions,
    log: (item) => {
      log.item(item)
      const mark = item.status === 'ok' ? '✓' : '✗'
      console.log(
        `  ${mark} ${item.word} · ${item.operation}${item.message ? `: ${item.message}` : ''}`
      )
    },
    readFile: (file) => fs.readFileSync(path.join(ROOT, file))
  })
  await saveBase(result.base)
  await saveEntries(result.entries, workspace.base.pulledAt)
  await saveSentences(result.sentences, workspace.base.pulledAt)
  log.finish(client.halted ? 'halted' : 'done')
  console.log(
    `\n${result.failed ? '⚠' : '✓'} Enviados ${result.sent}, con error ${result.failed}. Registro: ld-sync/runs/${log.run.id}.json`
  )
  if (client.halted)
    console.log('  Se detuvo tras 3 fallos seguidos: revisa la conexión y reintenta.')
} catch (error) {
  log.finish('failed', { message: error.message, category: error.category || 'unknown' })
  console.error(`✗ ${error.message}`)
  process.exit(1)
}
