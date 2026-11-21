/**
 * Tests for src/utils/csv.js (reading docs/ocr/ocr-doubts.csv in /admin/ocr). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { parseCsv } from '../../src/utils/csv.js'
import { ROOT } from '../lib/collect-words.mjs'

test('header row gives the field names; quotes, commas and BOM are handled', () => {
  const text = '\uFEFFid,word,note\r\np1-w2,"Ekâi, ebe","say ""hi"""\r\np1-w3,Bova,\r\n'
  assert.deepEqual(parseCsv(text), [
    { id: 'p1-w2', word: 'Ekâi, ebe', note: 'say "hi"' },
    { id: 'p1-w3', word: 'Bova', note: '' }
  ])
})

test('the real OCR doubts file has an id and a page box on every row', () => {
  const file = path.join(ROOT, 'docs/ocr/ocr-doubts.csv')
  const rows = parseCsv(fs.readFileSync(file, 'utf8'))
  assert.ok(rows.length > 0)
  for (const row of rows) {
    assert.match(row.id, /^p\d+-w\d+$/)
    assert.equal(row.id.split('-')[0], `p${row.pdf_page}`)
    assert.ok(Number(row.x1) > Number(row.x0) && Number(row.y1) > Number(row.y0), row.id)
  }
})
