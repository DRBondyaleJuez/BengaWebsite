/**
 * The recording checklist: one row per Benga word or phrase the site shows, so a speaker knows
 * what to record and a coordinator what is still missing. Pure functions (tests:
 * scripts/tests/audio-checklist.test.mjs); the script is scripts/audio-checklist.mjs.
 *
 * Sources: word-registry.json (every word + audio state), word-usage.json (where it is used) and
 * the lexicon files (meaning and book page, only for words that are lexicon entries).
 */
import { toAudioId } from '../../src/utils/audioId.js'

export const CHECKLIST_COLUMNS = [
  'word',
  'audioId',
  'type',
  'meaning',
  'bookPage',
  'usedIn',
  'recorded'
]

/** Spanish meaning and book page of every lexicon form, by word key. */
export function lexiconInfo(lexicons) {
  const info = {}
  for (const lexicon of lexicons) {
    for (const entry of Object.values(lexicon.entries || {})) {
      const forms = [
        [entry.word, entry.meaning],
        [entry.singular?.word, entry.meaning || entry.meaningPlural],
        [entry.plural?.word, entry.meaningPlural || entry.meaning]
      ]
      for (const [word, meaning] of forms) {
        const key = word && toAudioId(word)
        if (key && !info[key])
          info[key] = { meaning: meaning?.es || '', bookPage: entry.source?.pdfPage ?? '' }
      }
    }
  }
  return info
}

/**
 * @param {{ registry: object, usage: object, lexicons: object[] }} sources
 * @returns {object[]} rows with CHECKLIST_COLUMNS; words still to record first
 */
export function buildChecklist({ registry, usage = {}, lexicons = [] }) {
  const info = lexiconInfo(lexicons)
  return Object.entries(registry)
    .map(([key, entry]) => ({
      word: entry.word,
      audioId: entry.audioFile || key,
      type: /\s/.test(entry.word.trim()) ? 'phrase' : 'word',
      meaning: info[key]?.meaning || '',
      bookPage: info[key]?.bookPage ?? '',
      usedIn: (usage[key]?.usedIn || []).join('; '),
      recorded: entry.audio === 'recorded' ? 'yes' : 'no'
    }))
    .sort(
      (a, b) =>
        (a.recorded === 'yes') - (b.recorded === 'yes') || a.word.localeCompare(b.word, 'es')
    )
}

function cell(value) {
  const text = String(value ?? '')
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** CSV text with a BOM (so Excel reads â ē ū correctly) and Windows line ends. */
export function toCsv(rows, columns = CHECKLIST_COLUMNS) {
  const lines = [
    columns.join(','),
    ...rows.map((row) => columns.map((c) => cell(row[c])).join(','))
  ]
  return '﻿' + lines.join('\r\n') + '\r\n'
}
