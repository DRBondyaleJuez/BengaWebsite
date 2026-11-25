/**
 * npm run ld:link — links the dictionary workspace with the website's words (task L1.3).
 *
 *   npm run ld:link              fills siteKeys in entries.json and empty livingDictionaryId
 *                                in word-registry.json, prints a report
 *   npm run ld:link -- --check   report only
 *
 * The full report is also written to ld-sync/link-report.md (git-ignored).
 * Never changes spellings or meanings (REVIEW-LOG R-037).
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/collect-words.mjs'
import { loadRegistry, saveRegistry, USAGE_FILE } from './lib/registry.mjs'
import { loadWorkspace, saveEntries } from './lib/ld/workspace.mjs'
import { linkEntries, groupByFile } from './lib/ld/link.mjs'

const checkOnly = process.argv.includes('--check')
const workspace = loadWorkspace()
if (!Object.keys(workspace.entries).length) {
  console.error('No hay espacio de trabajo: ejecuta primero npm run ld:pull')
  process.exit(1)
}
const registry = loadRegistry()
const usage = fs.existsSync(USAGE_FILE) ? JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8')).words : {}
const { siteKeys, registryUpdates, report } = linkEntries(workspace.entries, registry, usage)

const lines = []
const out = (text = '') => lines.push(text)
const list = (items, format) =>
  items.map((item) => `- ${format(item)}`).forEach((line) => out(line))

out(`# Enlace diccionario ↔ web (${new Date().toISOString().slice(0, 10)})`)
out()
out(`- Palabras de la web enlazadas a una entrada: ${report.linked.length}`)
out(`- Ids de diccionario nuevos en word-registry: ${Object.keys(registryUpdates).length}`)
out(`- Entradas del diccionario que no están en la web: ${report.dictionaryOnly.length}`)
out(`- Palabras de la web que no están en el diccionario: ${report.siteOnly.length}`)
out()
out('## Escritura parecida con otros acentos (revisar, no se cambia nada)')
list(
  report.spellingDifferences,
  (d) => `web «${d.site}» · diccionario «${d.dictionary.join('», «')}»`
)
out()
out('## Varias entradas posibles (no se rellena el id)')
list(report.ambiguous, (a) => `«${a.word}» → ${a.entries.join(' | ')}`)
out()
out('## Id distinto ya puesto en word-registry (no se cambia)')
list(
  report.idConflicts,
  (c) => `«${c.word}»: registro → «${c.registryEntry}», coincide con «${c.match}»`
)
out()
out('## Id en word-registry que ya no existe en el diccionario')
list(report.staleIds, (s) => `«${s.word}» (${s.id})`)
out()
out('## Entradas del diccionario sin palabra en la web')
list(report.dictionaryOnly, (d) => d.word)
out()
out('## Palabras de la web que faltan en el diccionario, por archivo')
for (const [file, words] of groupByFile(report.siteOnly)) {
  out(`### ${file} (${words.length})`)
  out(words.join(', '))
  out()
}

const reportFile = path.join(ROOT, 'ld-sync', 'link-report.md')
fs.mkdirSync(path.dirname(reportFile), { recursive: true })
fs.writeFileSync(reportFile, lines.join('\n') + '\n')
console.log(lines.slice(0, 7).join('\n'))
console.log(
  `- Diferencias de acentos: ${report.spellingDifferences.length} · ambiguas: ${report.ambiguous.length} · ids distintos: ${report.idConflicts.length} · ids caducados: ${report.staleIds.length}`
)
console.log(`\nInforme completo: ld-sync/link-report.md`)

if (checkOnly) process.exit(0)

let changedEntries = 0
for (const [id, keys] of Object.entries(siteKeys)) {
  const entry = workspace.entries[id]
  if (JSON.stringify(entry.siteKeys || []) !== JSON.stringify(keys)) {
    entry.siteKeys = keys
    changedEntries++
  }
}
if (changedEntries) {
  const pulledAt = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/dictionary/entries.json'), 'utf8')
  ).pulledAt
  await saveEntries(workspace.entries, pulledAt)
}
for (const [key, id] of Object.entries(registryUpdates)) registry[key].livingDictionaryId = id
if (Object.keys(registryUpdates).length) await saveRegistry(registry)
console.log(
  `✓ ${changedEntries} entradas con enlaces actualizados · ${Object.keys(registryUpdates).length} ids añadidos a word-registry.json`
)
