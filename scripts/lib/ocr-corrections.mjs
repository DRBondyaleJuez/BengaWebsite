/**
 * Reads and writes docs/ocr/ocr-corrections.json: the corrections a person typed in /admin/ocr.
 * python scripts/ocr-pdf.py --reuse applies them to the text layer of the improved PDF.
 *
 *   { "corrections": { "p19-w156": { "pdfPage": 19, "ocr": "ña", "correction": "ūa",
 *                                    "comment": "…", "box": [556, 506, 575, 517], "updated": "2026-11-20" } } }
 *
 * The id is p<PDF page>-w<word number in the OCR output> (column "id" of docs/ocr/ocr-doubts.csv).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './collect-words.mjs'

export const CORRECTIONS_FILE = path.join(ROOT, 'docs/ocr/ocr-corrections.json')
const ABOUT =
  'Corrections of the improved OCR, typed in /admin/ocr (npm run serve) or by hand. Key = word id (p<PDF page>-w<word number>, see docs/ocr/ocr-doubts.csv). Applied by: python scripts/ocr-pdf.py --reuse. Guide: docs/OCR.md'
const ID = /^p(\d+)-w(\d+)$/

/** Keeps only meaningful fields and drops entries with neither a correction nor a comment. */
function clean(corrections) {
  const out = {}
  for (const [id, entry] of Object.entries(corrections)) {
    const match = ID.exec(id)
    if (!match) throw new Error(`Bad id "${id}" (expected p<page>-w<number>)`)
    const correction = String(entry.correction || '').trim()
    const comment = String(entry.comment || '').trim()
    if (!correction && !comment) continue
    out[id] = {
      pdfPage: Number(match[1]),
      ocr: String(entry.ocr || ''),
      correction,
      comment,
      ...(Array.isArray(entry.box) ? { box: entry.box.map(Number) } : {}),
      updated: entry.updated || new Date().toISOString().slice(0, 10)
    }
  }
  // Sorted by page, then word number: easy to read and to compare in git
  const order = (id) => ID.exec(id).slice(1).map(Number)
  return Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => {
      const [pa, wa] = order(a)
      const [pb, wb] = order(b)
      return pa - pb || wa - wb
    })
  )
}

export async function saveOcrCorrections(corrections) {
  const data = { _about: ABOUT, corrections: clean(corrections) }
  await fs.writeFile(CORRECTIONS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8')
}
