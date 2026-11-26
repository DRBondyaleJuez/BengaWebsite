/**
 * npm run ld:import -- <folder>                → CHECK only: reads the spreadsheet and the audio
 *                                                 files of <folder>, writes a preview, sends nothing
 * npm run ld:import -- <folder> --send         → also sends them to Living Dictionaries
 *
 * Options:
 *   --csv <file>        the spreadsheet (default: the only .csv file in <folder>)
 *   --source <slug>     attribute audio without a speaker to this source of the dictionary
 *   --cite <slug>       cite this source on every entry (book_page becomes "p. N")
 *   --import-id <id>    batch label (default: benga-portal-<date>); keeps the batch findable
 *
 * The folder holds the spreadsheet (Excel → Save as → "CSV UTF-8") and the audio files it names.
 * Output goes to <folder>/ld-import/: payload.json (exactly what is sent), preview.html (open it in
 * the browser) and, after --send, ledger.json (what was sent; a second run resumes from it).
 *
 * --send needs in .env.local (git-ignored): LD_API_KEY=ldk_…  and  LD_DICTIONARY_ID=benga
 * Guide and column list: docs/LIVING-DICTIONARY-IMPORT.md
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { parseCsv } from '../src/utils/csv.js'
import { loadEnvLocal } from './lib/cloudinary.mjs'
import { loadRegistry, saveRegistry, normaliseEntry } from './lib/registry.mjs'
import {
  AUDIO_EXTENSIONS,
  domainLabel,
  checkRow,
  findDuplicates,
  ldClient
} from './lib/living-dictionary.mjs'

const args = process.argv.slice(2)
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null)
const VALUE_OPTIONS = ['--csv', '--source', '--cite', '--import-id']
const folder = args.find((arg, i) => !arg.startsWith('--') && !VALUE_OPTIONS.includes(args[i - 1]))
const SEND = args.includes('--send')
const BATCH = 200

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

// ---- 1. read the folder -----------------------------------------------------------------------
if (!folder || !fs.existsSync(folder)) {
  fail('Uso: npm run ld:import -- <carpeta> [--send]   (ver docs/LIVING-DICTIONARY-IMPORT.md)')
}
const names = fs.readdirSync(folder)
const csvFile =
  option('--csv') || names.filter((name) => /\.csv$/i.test(name)).map((n) => path.join(folder, n))
if (Array.isArray(csvFile) && csvFile.length !== 1) {
  fail(`La carpeta debe tener exactamente un .csv (hay ${csvFile.length}); o usa --csv <archivo>`)
}
const spreadsheet = Array.isArray(csvFile) ? csvFile[0] : csvFile
const audioFiles = new Map(
  names
    .filter((name) => AUDIO_EXTENSIONS.test(name))
    .map((name) => [name.toLowerCase(), fs.statSync(path.join(folder, name)).size])
)
const realName = new Map(names.map((name) => [name.toLowerCase(), name]))

const dictionary = (loadEnvLocal(), process.env.LD_DICTIONARY_ID || 'benga')
const cite = option('--cite')
const rows = parseCsv(fs.readFileSync(spreadsheet, 'utf8'))
const checked = rows.map((row, index) =>
  checkRow(row, { dictionary, line: index + 2, audioFiles, cite })
)
findDuplicates(checked)

// ---- 2. report and preview --------------------------------------------------------------------
const outDir = path.join(folder, 'ld-import')
fs.mkdirSync(outDir, { recursive: true })
const payload = checked.map(({ entry, audio, line, key }) => ({ line, key, entry, audio }))
fs.writeFileSync(path.join(outDir, 'payload.json'), JSON.stringify(payload, null, 2) + '\n')
fs.writeFileSync(path.join(outDir, 'preview.html'), renderPreview(checked))

const errors = checked.filter((item) => item.errors.length)
const warnings = checked.filter((item) => item.warnings.length)
const audioCount = checked.reduce((sum, item) => sum + item.audio.length, 0)
const usedAudio = new Set(checked.flatMap((item) => item.audio.map((a) => a.file.toLowerCase())))
const unusedAudio = [...audioFiles.keys()].filter((name) => !usedAudio.has(name))

console.log(`Hoja:            ${path.basename(spreadsheet)} (${rows.length} filas)`)
console.log(`Diccionario:     ${dictionary}`)
console.log(`Entradas:        ${checked.length}`)
console.log(
  `Audios:          ${audioCount} (${unusedAudio.length} archivos de la carpeta sin usar)`
)
console.log(`Filas con error: ${errors.length} · con avisos: ${warnings.length}`)
for (const item of errors.slice(0, 30)) {
  console.log(`  ✗ línea ${item.line} (${item.word || '—'}): ${item.errors.join('; ')}`)
}
for (const item of warnings.slice(0, 30)) {
  console.log(`  ! línea ${item.line} (${item.word}): ${item.warnings.join('; ')}`)
}
if (unusedAudio.length) {
  console.log(
    `  ! audios sin fila: ${unusedAudio
      .slice(0, 10)
      .map((n) => realName.get(n))
      .join(', ')}`
  )
}
console.log(`\n✓ Vista previa: ${path.join(outDir, 'preview.html')}`)

if (!SEND) {
  console.log('(Solo comprobación. Para enviar: añade --send)')
  process.exit(errors.length ? 1 : 0)
}
if (errors.length) fail('Hay filas con errores: corrígelas antes de enviar.')

// ---- 3. send ----------------------------------------------------------------------------------
await send()

async function send() {
  const apiKey = process.env.LD_API_KEY
  if (!apiKey || !apiKey.startsWith('ldk_')) {
    fail('Falta LD_API_KEY=ldk_… en .env.local (se crea en livingdictionaries.app/<id>/agents)')
  }
  // LD_API_BASE only for tests against a local fake server
  const client = ldClient({ apiKey, dictionary, base: process.env.LD_API_BASE || undefined })
  const importId = option('--import-id') || `benga-portal-${new Date().toISOString().slice(0, 10)}`
  const source = option('--source')

  // a) Check everything BEFORE the first write
  const info = await client.dictionaryInfo()
  const dict = info.dictionary || info
  const glossLanguages = dict.gloss_languages || []
  console.log(
    `\nConectado a «${dict.name || dictionary}» (idiomas de traducción: ${glossLanguages.join(', ') || '?'})`
  )
  const usedLanguages = new Set()
  for (const { entry } of checked) {
    const sense = entry.senses[0]
    Object.keys(sense.glosses || {}).forEach((lang) => usedLanguages.add(lang))
    for (const sentence of sense.example_sentences || []) {
      Object.keys(sentence.translation || {}).forEach((lang) => usedLanguages.add(lang))
    }
  }
  const missingLanguages = [...usedLanguages].filter((lang) => !glossLanguages.includes(lang))
  if (glossLanguages.length && missingLanguages.length) {
    fail(
      `El diccionario no tiene estos idiomas de traducción: ${missingLanguages.join(', ')}. ` +
        'Añádelos en sus ajustes o quita esas columnas.'
    )
  }

  const speakerList = await client.speakers()
  const speakers = new Map(
    (speakerList.speakers || speakerList.data || speakerList || []).map((s) => [
      String(s.name || '')
        .trim()
        .toLowerCase(),
      s.id
    ])
  )
  const missingSpeakers = new Set()
  for (const item of checked.flatMap((c) => c.audio)) {
    if (item.speaker) {
      item.speakerId = speakers.get(item.speaker.toLowerCase())
      if (!item.speakerId) missingSpeakers.add(item.speaker)
    } else if (!source) missingSpeakers.add('(sin hablante y sin --source)')
  }
  if (missingSpeakers.size) {
    fail(
      `Hablantes que no existen en el diccionario: ${[...missingSpeakers].join(', ')}. ` +
        'Créalos en la página de colaboradores del diccionario (son personas reales; ' +
        'este programa no los inventa) o usa --source.'
    )
  }
  if (cite || source) {
    const sourceList = await client.sources()
    const slugs = new Set(
      (sourceList.sources || sourceList.data || sourceList || []).map((s) => s.slug)
    )
    for (const slug of [cite, source].filter(Boolean)) {
      if (!slugs.has(slug)) fail(`La fuente «${slug}» no existe en el diccionario (créala antes).`)
    }
  }

  // b) Ledger: resume instead of writing twice
  const ledgerFile = path.join(outDir, 'ledger.json')
  const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
  let ledger = fs.existsSync(ledgerFile) ? JSON.parse(fs.readFileSync(ledgerFile, 'utf8')) : null
  if (!ledger || ledger.payloadHash !== hash) {
    ledger = { importId, payloadHash: hash, entries: {}, audio: {}, alreadyInDictionary: {} }
  }
  const saveLedger = () => fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2) + '\n')

  // c) Words already in the dictionary are never overwritten: skipped and reported
  for (const item of checked) {
    if (ledger.entries[item.entry.id] || ledger.alreadyInDictionary[item.key]) continue
    const found = await client.findEntries(item.word)
    const list = found.entries || found.data || []
    const other = list.find((e) => e.id !== item.entry.id)
    if (other && !item.homograph) ledger.alreadyInDictionary[item.key] = other.id
  }
  saveLedger()
  const toWrite = checked.filter(
    (item) => !ledger.alreadyInDictionary[item.key] && !ledger.entries[item.entry.id]
  )

  // d) Entries in batches (a re-sent id is a harmless "exists")
  for (let i = 0; i < toWrite.length; i += BATCH) {
    const chunk = toWrite.slice(i, i + BATCH)
    const answer = await client.postEntries(
      chunk.map((item) => item.entry),
      ledger.importId
    )
    const results = answer.results || []
    if (results.length !== chunk.length) {
      fail(
        `Respuesta incompleta (${results.length} de ${chunk.length}): no se marca el lote como hecho`
      )
    }
    results.forEach((result, j) => {
      if (result.status === 'failed') {
        console.log(`  ✗ ${chunk[j].word}: ${result.error}`)
      } else ledger.entries[chunk[j].entry.id] = result.status
    })
    saveLedger()
    console.log(`  entradas ${i + chunk.length}/${toWrite.length}`)
  }

  // e) Audio of the entries that were written
  for (const item of checked) {
    if (!ledger.entries[item.entry.id]) continue
    for (const clip of item.audio) {
      if (ledger.audio[clip.id]) continue
      const buffer = fs.readFileSync(path.join(folder, realName.get(clip.file.toLowerCase())))
      try {
        await client.postAudio(clip.kind, clip.ownerId, {
          id: clip.id,
          buffer,
          fileName: clip.file,
          speakerId: clip.speakerId,
          source: clip.speakerId ? undefined : source
        })
        ledger.audio[clip.id] = 'uploaded'
        saveLedger()
      } catch (error) {
        console.log(`  ✗ audio ${clip.file}: ${error.message}`)
      }
    }
  }

  // f) Link the site's words to their new dictionary entries (never overwrites an existing id)
  const registry = loadRegistry()
  let linked = 0
  for (const item of checked) {
    const id =
      ledger.alreadyInDictionary[item.key] || (ledger.entries[item.entry.id] && item.entry.id)
    if (!id || item.homograph) continue
    const current = registry[item.key]
    if (current?.livingDictionaryId) continue
    registry[item.key] = normaliseEntry({
      ...(current || { word: item.word }),
      livingDictionaryId: id
    })
    linked++
  }
  if (linked) await saveRegistry(registry)

  const written = Object.keys(ledger.entries).length
  const skipped = Object.keys(ledger.alreadyInDictionary)
  console.log(`\nEnviadas: ${written} entradas · ${Object.keys(ledger.audio).length} audios`)
  console.log(
    `Ya existían en el diccionario (no se tocan): ${skipped.length}${skipped.length ? ' → ' + skipped.slice(0, 15).join(', ') : ''}`
  )
  console.log(`Enlazadas en word-registry.json: ${linked}. Lote: ${ledger.importId}`)
}

// ---- preview ----------------------------------------------------------------------------------
function escape(text) {
  return String(text ?? '').replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  )
}

function renderPreview(items) {
  const card = (item) => {
    const sense = item.entry.senses[0]
    const glosses = Object.entries(sense.glosses || {})
      .map(([lang, text]) => `<b>${lang}</b> ${escape(text)}`)
      .join(' · ')
    const domains = (sense.semantic_domains || [])
      .map((key) => `${key} ${escape(domainLabel(key))}`)
      .concat((sense.write_in_semantic_domains || []).map((d) => `${escape(d)} (texto libre)`))
      .join(', ')
    const example = sense.example_sentences?.[0]
    const audio = item.audio
      .map(
        (clip) =>
          `<div class="audio">${clip.kind === 'entry' ? 'Palabra' : 'Ejemplo'}: ${escape(clip.file)}` +
          ` · ${escape(clip.speaker || 'sin hablante')}<br><audio controls preload="none" src="../${encodeURIComponent(realName.get(clip.file.toLowerCase()) || clip.file)}"></audio></div>`
      )
      .join('')
    const problems = [
      ...item.errors.map((e) => `<li class="err">✗ ${escape(e)}</li>`),
      ...item.warnings.map((w) => `<li class="warn">! ${escape(w)}</li>`)
    ].join('')
    return `<article class="${item.errors.length ? 'has-err' : ''}">
  <h2>${escape(item.word || '(sin palabra)')}${item.homograph ? `<sup>${escape(item.homograph)}</sup>` : ''}
    <small>línea ${item.line}${sense.plural_form ? ` · plural ${escape(sense.plural_form)}` : ''}${sense.noun_class ? ` · clase ${escape(sense.noun_class)}` : ''}</small></h2>
  <p>${glosses || '<i>sin traducción</i>'}</p>
  <p class="meta">${escape((sense.parts_of_speech || []).join(', ') || 'sin categoría')}${domains ? ` · ${domains}` : ''}</p>
  ${
    example
      ? `<p class="ex">«${escape(example.text)}» — ${Object.entries(example.translation || {})
          .map(([l, t]) => `<b>${l}</b> ${escape(t)}`)
          .join(' · ')}</p>`
      : ''
  }
  ${item.entry.notes ? `<p class="meta">Nota: ${escape(item.entry.notes)}</p>` : ''}
  ${audio}
  ${problems ? `<ul>${problems}</ul>` : ''}
</article>`
  }
  const errorCount = items.filter((i) => i.errors.length).length
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vista previa · Living Dictionaries</title>
<style>
body{font-family:system-ui,sans-serif;margin:0 auto;max-width:900px;padding:16px;background:#f7f7f4;color:#222}
article{background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin:12px 0}
article.has-err{border-color:#c0392b;background:#fff6f5}
h2{margin:0 0 4px;font-size:1.25rem} h2 small{font-weight:normal;color:#777;font-size:.8rem;margin-left:8px}
.meta{color:#555;font-size:.9rem}.ex{font-style:italic}.audio{font-size:.85rem;margin-top:6px}
audio{height:32px;margin-top:2px}.err{color:#c0392b}.warn{color:#9a6700}ul{margin:6px 0 0;padding-left:18px}
.summary{display:flex;gap:12px;flex-wrap:wrap}.summary span{background:#fff;border:1px solid #ddd;border-radius:6px;padding:4px 10px}
</style></head><body>
<h1>Vista previa de la importación</h1>
<p>Esto es exactamente lo que se enviaría a Living Dictionaries (diccionario <b>${escape(dictionary)}</b>). Nada se ha enviado todavía.</p>
<div class="summary"><span>${items.length} entradas</span><span>${items.reduce((s, i) => s + i.audio.length, 0)} audios</span><span>${errorCount} con errores</span><span>${items.filter((i) => i.warnings.length).length} con avisos</span></div>
${items.map(card).join('\n')}
</body></html>
`
}
