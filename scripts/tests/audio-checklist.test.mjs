/**
 * Tests for scripts/lib/audio-checklist.mjs (the recording checklist). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildChecklist, toCsv, lexiconInfo } from '../lib/audio-checklist.mjs'

const lexicons = [
  {
    entries: {
      bova: {
        singular: { word: 'Bova' },
        plural: { word: 'Mova' },
        meaning: { es: 'Don' },
        meaningPlural: { es: 'Dones' },
        source: { pdfPage: '11-12' }
      },
      bueno: { word: 'būamu', meaning: { es: 'Bueno' } }
    }
  }
]

test('lexicon forms give their meaning and book page', () => {
  const info = lexiconInfo(lexicons)
  assert.deepEqual(info.bova, { meaning: 'Don', bookPage: '11-12' })
  assert.equal(info.mova.meaning, 'Dones')
  assert.equal(info.b_u_amu.meaning, 'Bueno')
})

test('rows: words to record first, phrases marked, recorded words last', () => {
  const registry = {
    mova: { word: 'Mova', audio: 'recorded', audioFile: null },
    bova: { word: 'Bova', audio: 'missing', audioFile: null },
    'ek_a_i-ebe': { word: 'Ekâi ebe', audio: 'missing', audioFile: 'old-name' }
  }
  const rows = buildChecklist({
    registry,
    usage: { bova: { usedIn: ['a.json', 'b.json'] } },
    lexicons
  })
  assert.deepEqual(
    rows.map((r) => r.word),
    ['Bova', 'Ekâi ebe', 'Mova']
  )
  assert.equal(rows[0].usedIn, 'a.json; b.json')
  assert.equal(rows[0].bookPage, '11-12')
  assert.equal(rows[1].type, 'phrase')
  assert.equal(rows[1].audioId, 'old-name')
  assert.equal(rows[2].recorded, 'yes')
})

test('csv: BOM, quotes and Windows line ends', () => {
  const csv = toCsv([{ word: 'a, b', audioId: 'x"y' }], ['word', 'audioId'])
  assert.equal(csv, '﻿word,audioId\r\n"a, b","x""y"\r\n')
})
