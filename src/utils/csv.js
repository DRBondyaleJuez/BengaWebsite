/**
 * Reads CSV text (as written by Excel or Python's csv module) into objects, using the first row
 * as field names. Handles quoted cells ("a, b"), doubled quotes (""), Windows line ends and the
 * invisible BOM Excel adds at the start.
 *
 *   parseCsv('id,word\np1-w2,"Ekâi, ebe"\n')  →  [{ id: 'p1-w2', word: 'Ekâi, ebe' }]
 *
 * Used by /admin/ocr for docs/ocr/ocr-doubts.csv. Tests: scripts/tests/csv.test.mjs
 */
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const source = String(text).replace(/^\uFEFF/, '')

  for (let i = 0; i < source.length; i++) {
    const character = source[i]
    if (quoted) {
      if (character === '"' && source[i + 1] === '"') {
        cell += '"'
        i++
      } else if (character === '"') {
        quoted = false
      } else {
        cell += character
      }
    } else if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(cell)
      cell = ''
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }

  const [header = [], ...body] = rows.filter((cells) => cells.some((value) => value !== ''))
  return body.map((cells) => Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ''])))
}
