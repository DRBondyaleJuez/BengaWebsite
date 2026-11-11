/**
 * npm run words:import -- path/to/list.csv
 *
 * Fills the word registry from a spreadsheet (CSV, comma-separated, UTF-8, first row = headers).
 * Use it when you have a list, e.g. exported from Excel / Google Sheets, or one Claude prepared.
 *
 * Recognised columns (any order, only "word" or "key" is required):
 *   word                Benga word, e.g. Enâ          (its key is computed with the shared rule)
 *   key                 the key itself, e.g. en_a_    (use instead of "word" if you prefer)
 *   livingDictionaryId  id from the Living Dictionary entry URL (…/benga/entry/<id>)
 *   audio               missing | recorded
 *   audioFile           Cloudinary file name without .mp3, only if it differs from the key
 *   notes               free text
 *
 * Rules:
 *   - An EMPTY cell changes nothing (so a list with only dictionary ids leaves audio untouched).
 *   - A word that is not in the registry yet is ADDED (handy to prepare ids before the content exists).
 *
 * Example list:
 *   word,livingDictionaryId
 *   Enâ,9b0fb8a4-e76e-4d83-bf79-32a6dd3f23cc
 */
import fs from 'node:fs'
import {
  loadRegistry,
  saveRegistry,
  normaliseEntry,
  AUDIO_STATES,
  relative,
  REGISTRY_FILE
} from './lib/registry.mjs'
import { toAudioId } from '../src/utils/audioId.js'

const EDITABLE_COLUMNS = ['livingDictionaryId', 'audio', 'audioFile', 'notes']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Minimal CSV reader: commas, "quoted, values" and "" for a quote inside quotes. */
function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const source = text.replace(/^﻿/, '') // Excel adds an invisible BOM
  for (let i = 0; i < source.length; i++) {
    const character = source[i]
    if (quoted) {
      if (character === '"' && source[i + 1] === '"') {
        cell += '"'
        i++
      } else if (character === '"') quoted = false
      else cell += character
    } else if (character === '"') quoted = true
    else if (character === ',') {
      row.push(cell)
      cell = ''
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[i + 1] === '\n') i++
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else cell += character
  }
  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

async function main() {
  const file = process.argv[2]
  if (!file || !fs.existsSync(file)) {
    console.error('Usage: npm run words:import -- path/to/list.csv')
    process.exitCode = 1
    return
  }

  const [header, ...rows] = parseCsv(fs.readFileSync(file, 'utf8'))
  const columns = header.map((name) => name.trim())
  if (!columns.includes('word') && !columns.includes('key')) {
    console.error('The first row must contain a "word" or a "key" column.')
    process.exitCode = 1
    return
  }

  const registry = loadRegistry()
  const updated = []
  const added = []
  const problems = []

  rows.forEach((cells, index) => {
    const line = index + 2 // +1 for the header, +1 because lines start at 1
    const value = (name) => (cells[columns.indexOf(name)] || '').trim()
    const word = value('word')
    const key = value('key') || toAudioId(word)
    if (!key) return problems.push(`line ${line}: no word or key`)

    const changes = {}
    for (const column of EDITABLE_COLUMNS) {
      if (columns.includes(column) && value(column)) changes[column] = value(column)
    }
    if (changes.audio && !AUDIO_STATES.includes(changes.audio)) {
      problems.push(
        `line ${line} (${word || key}): audio must be ${AUDIO_STATES.join(' or ')}, got "${changes.audio}"`
      )
      delete changes.audio
    }
    if (changes.livingDictionaryId && !UUID.test(changes.livingDictionaryId)) {
      problems.push(
        `line ${line} (${word || key}): "${changes.livingDictionaryId}" does not look like a Living Dictionary id`
      )
    }

    if (registry[key]) {
      registry[key] = normaliseEntry({ ...registry[key], ...changes })
      updated.push(`${registry[key].word} → ${key}`)
    } else {
      registry[key] = normaliseEntry({ word: word || key, ...changes })
      added.push(`${registry[key].word} → ${key} (not used on any page yet)`)
    }
  })

  await saveRegistry(registry)
  console.log(`Read ${rows.length} row(s) from ${file}`)
  console.log(`Updated: ${updated.length}`)
  updated.forEach((item) => console.log(`  - ${item}`))
  console.log(`Added:   ${added.length}`)
  added.forEach((item) => console.log(`  - ${item}`))
  if (problems.length) {
    console.log(`Problems: ${problems.length}`)
    problems.forEach((item) => console.log(`  ! ${item}`))
  }
  console.log(`\n✓ Saved ${relative(REGISTRY_FILE)}`)
}

main()
