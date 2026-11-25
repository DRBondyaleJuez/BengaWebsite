/**
 * npm run ld:pull — reads the whole Benga Living Dictionary from its public snapshot (ONE request,
 * no key) into the local workspace src/data/dictionary/ (task L1.2 of docs/LD-ROADMAP.md).
 *
 *   npm run ld:pull            first pull, or refresh records that have no local changes
 *   npm run ld:pull -- --check only print the report, write nothing
 *
 * Records you changed locally (sync.state ≠ synced) are never overwritten here: the run stops and
 * lists them. Merging both sides is task L5.2.
 */
import { downloadSnapshot } from './lib/ld/client.mjs'
import { openSnapshot, readSnapshot } from './lib/ld/snapshot.mjs'
import {
  loadWorkspace,
  saveBase,
  saveEntries,
  saveSentences,
  toWorkspaceRecord
} from './lib/ld/workspace.mjs'
import { LD_DICTIONARY_ID } from '../src/config/ld.js'

const checkOnly = process.argv.includes('--check')
const dictionary = process.env.LD_DICTIONARY_ID || LD_DICTIONARY_ID

console.log(`Descargando el snapshot público de «${dictionary}»…`)
const bytes = await downloadSnapshot(dictionary)
const pulledAt = new Date().toISOString()
const snapshot = await openSnapshot(bytes)
let data
try {
  data = readSnapshot(snapshot.db)
} finally {
  snapshot.close()
}

const workspace = loadWorkspace()
const unsent = [
  ...Object.values(workspace.entries).map((entry) => [entry.lexeme, entry.sync?.state]),
  ...Object.values(workspace.sentences).map((sentence) => [sentence.text, sentence.sync?.state])
].filter(([, state]) => state && state !== 'synced')

// ---- report -------------------------------------------------------------------------------------
const entries = Object.values(data.entries)
const sentences = Object.values(data.sentences)
const senses = entries.flatMap((entry) => entry.senses.map((sense) => ({ entry, sense })))
const missing = (lang) =>
  senses.filter(({ sense }) => !sense.glosses?.[lang]).map(({ entry }) => entry.lexeme)
const bySpelling = new Map()
for (const entry of entries) {
  const key = entry.lexeme.normalize('NFC').toLowerCase()
  bySpelling.set(key, [...(bySpelling.get(key) || []), entry])
}
const duplicates = [...bySpelling.values()].filter(
  (group) => group.length > 1 && new Set(group.map((entry) => entry.homograph)).size < group.length
)
const unique = (words) => [...new Set(words)]
const line = (label, words) =>
  console.log(`  ${label}: ${words.length}${words.length ? ` (${unique(words).join(', ')})` : ''}`)

console.log(`\nDiccionario «${dictionary}» (${pulledAt})`)
console.log(
  `  Entradas: ${entries.length} · sentidos: ${senses.length} · oraciones: ${sentences.length}`
)
console.log(
  `  Audios: ${entries.reduce((n, e) => n + e.audio.length, 0)} de palabras, ${sentences.reduce((n, s) => n + s.audio.length, 0)} de oraciones`
)
for (const lang of ['es', 'en', 'fr']) line(`Sentidos sin traducción ${lang}`, missing(lang))
line(
  'Sentidos sin categoría gramatical',
  senses.filter(({ sense }) => !sense.partsOfSpeech.length).map(({ entry }) => entry.lexeme)
)
line(
  'Entradas sin audio',
  entries.filter((e) => !e.audio.length).map((e) => e.lexeme)
)
line(
  'Oraciones sin audio',
  sentences.filter((s) => !s.audio.length).map((s) => s.text)
)
line(
  'Oraciones sin traducción al español',
  sentences.filter((s) => !s.translations?.es).map((s) => s.text)
)
line(
  'Oraciones sin palabra enlazada',
  sentences.filter((s) => !s.senseIds.length).map((s) => s.text)
)
line(
  'Misma escritura sin número de homógrafo',
  duplicates.flat().map((entry) => entry.lexeme)
)
line(
  'Hablantes',
  data.speakers.map((speaker) => speaker.name)
)

if (checkOnly) {
  console.log('\n(Solo comprobación: no se escribió nada.)')
  process.exit(0)
}
if (unsent.length) {
  console.error(
    `\n✗ Hay ${unsent.length} cambios locales sin enviar; no se sobrescribe nada:\n  ${unsent
      .map(([label, state]) => `${label} (${state})`)
      .join('\n  ')}\n  Envíalos primero o espera a la fusión de la tarea L5.2.`
  )
  process.exit(1)
}

// ---- write --------------------------------------------------------------------------------------
const newEntries = {}
for (const entry of entries) {
  newEntries[entry.id] = toWorkspaceRecord(entry, workspace.entries[entry.id])
}
const newSentences = {}
for (const sentence of sentences) {
  newSentences[sentence.id] = toWorkspaceRecord(sentence, workspace.sentences[sentence.id])
}
const removed = Object.keys(workspace.entries).filter((id) => !data.entries[id]).length

await saveBase({ pulledAt, entries: data.entries, sentences: data.sentences })
await saveEntries(newEntries, pulledAt)
await saveSentences(newSentences, pulledAt)
console.log(
  `\n✓ Escrito src/data/dictionary/ (entries.json, sentences.json, base.json)${removed ? ` · ${removed} entradas ya no están en el diccionario` : ''}`
)
console.log('  Siguiente: npm run ld:link (enlaza con las palabras de la web) y npm run validate')
