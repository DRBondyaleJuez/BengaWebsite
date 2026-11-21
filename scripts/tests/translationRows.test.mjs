/**
 * Tests for src/utils/translationRows.js (the rows of /admin/translations). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  scanData,
  scanLocales,
  fieldAddress,
  bengaAddress,
  fileRoutes,
  doubtsOfRow,
  resolveDoubts,
  renameInDoubts,
  parsePages,
  printedPage,
  pathToString,
  uiRoute
} from '../../src/utils/translationRows.js'
import { ROOT } from '../lib/collect-words.mjs'

const readData = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', file), 'utf8'))

test('lexicon meanings: Benga word, class page and book page come from the entry', () => {
  const data = {
    entries: {
      bova: {
        nounClass: 4,
        singular: { word: 'Bova' },
        plural: { word: 'Mova' },
        meaning: { es: 'Don', en: 'Gift' },
        meaningPlural: { es: 'Dones' },
        source: { pdfPage: '11-12' }
      }
    }
  }
  const [singular, plural] = scanData('lexicon/nouns.json', data)
  assert.equal(singular.id, 'lexicon/nouns.json#entries.bova.meaning')
  assert.deepEqual(singular.texts, { es: 'Don', en: 'Gift', fr: '' })
  assert.equal(singular.benga.value, 'Bova')
  assert.deepEqual(singular.benga.path, ['entries', 'bova', 'singular', 'word'])
  assert.equal(plural.benga.value, 'Mova')
  assert.equal(singular.route, '/capitulo-2/clase-4')
  assert.equal(singular.pdfPages, '11-12')
  assert.deepEqual(fieldAddress(singular, 'fr'), {
    file: 'src/data/lexicon/nouns.json',
    path: ['entries', 'bova', 'meaning', 'fr']
  })
  assert.deepEqual(bengaAddress(singular), {
    file: 'src/data/lexicon/nouns.json',
    path: ['entries', 'bova', 'singular', 'word']
  })
})

test('other data files: the Benga word is the one next to the text', () => {
  const data = {
    nouns: [{ word: 'Elongi', meaning: { es: 'Enseñanza' }, other: 1 }],
    verbs: [{ imperative: 'Kala', nominalForm: 'ikala', imperativeMeaning: { es: 'habla tú' } }]
  }
  const rows = scanData('chapter-2/verbal-nouns.json', data, {
    routes: { 'chapter-2/verbal-nouns.json': '/capitulo-2/verbales' }
  })
  assert.equal(rows[0].benga.field, 'word')
  assert.equal(rows[0].location, 'nouns[0].meaning')
  assert.equal(rows[0].route, '/capitulo-2/verbales')
  assert.equal(rows[1].benga.value, 'Kala') // «imperativeMeaning» is about the imperative
  assert.equal(rows[1].pdfPages, '14-15') // known page of that file
})

test('texts without a Spanish value, and plain strings, are not rows', () => {
  const rows = scanData('x.json', { a: { es: '' }, b: 'Epokolo', c: { es: 'Hola', word: 'x' } })
  assert.deepEqual(rows, [])
})

test('locale messages become rows with the three languages and the page they belong to', () => {
  const rows = scanLocales({
    es: { pages: { home: { welcome: 'Bienvenido' } }, nav: { home: 'Inicio' } },
    en: { pages: { home: { welcome: 'Welcome' } } },
    fr: {}
  })
  assert.equal(rows.length, 2)
  assert.deepEqual(rows[0].texts, { es: 'Bienvenido', en: 'Welcome', fr: '' })
  assert.equal(rows[0].route, '/')
  assert.equal(rows[1].route, null) // shared text: no single page
  assert.deepEqual(fieldAddress(rows[0], 'en'), {
    file: 'src/locales/en.json',
    path: ['pages', 'home', 'welcome']
  })
  assert.equal(uiRoute('pages.verbalNouns.title'), '/capitulo-2/verbales')
})

test('pages: ranges, printed page, paths', () => {
  assert.deepEqual(parsePages('8-9'), { from: 8, to: 9 })
  assert.deepEqual(parsePages(14), { from: 14, to: 14 })
  assert.equal(parsePages('Ejemplos'), null)
  assert.equal(printedPage(8), 14)
  assert.equal(printedPage(3), null)
  assert.equal(pathToString(['blocks', 0, 'items', 2, 'text']), 'blocks[0].items[2].text')
})

test('doubts match by Spanish text and are removed text by text when resolved', () => {
  const row = { texts: { es: 'Vara' } }
  const doubts = [
    { id: 'd1', es: 'Vara', note: 'rod or staff?' },
    { id: 'd2', es: ['Vara', 'Banco'], note: 'both' },
    { id: 'd3', es: 'Otra', note: 'other' },
    { id: 'd4', note: 'general note' }
  ]
  assert.deepEqual(
    doubtsOfRow(row, doubts).map((d) => d.id),
    ['d1', 'd2']
  )
  const left = resolveDoubts(doubts, { d1: ['Vara'], d2: ['Vara'], d4: true })
  assert.deepEqual(left, [{ id: 'd2', es: ['Banco'], note: 'both' }, doubts[2]])
})

test('every real data file with texts has a page, and the section files match chapters-index', () => {
  const index = readData('chapters-index.json')
  const routes = fileRoutes(index)
  for (const chapter of index.chapters) {
    for (const section of chapter.sections) {
      if (section.sectionFile) assert.equal(routes[section.sectionFile], section.path)
    }
  }
  const files = [
    'author-info.json',
    'chapter-1/alphabet.json',
    'chapter-2/irregular-nouns.json',
    'chapter-2/verbal-nouns.json',
    'chapter-3/regular-adjectives.json',
    'chapter-3/invariable-adjectives.json',
    'chapter-3/comparatives-superlatives.json',
    'chapter-3/numerals-ordinals.json',
    'sections/ch-1/consonants.json',
    'sections/ch-2/class-3.json',
    'sections/ch-3/adjectives-intro.json'
  ]
  for (const file of files) {
    const rows = scanData(file, readData(file), { routes })
    assert.ok(rows.length > 0, file)
    assert.ok(
      rows.every((row) => row.route),
      `${file}: a text without a page`
    )
  }
  const nouns = scanData('lexicon/nouns.json', readData('lexicon/nouns.json'), { routes })
  assert.ok(nouns.length > 700)
  assert.ok(nouns.every((row) => row.route && row.benga))
})

test('an edited Spanish text keeps its doubts', () => {
  const doubts = [
    { id: 'd1', es: 'Vara', note: 'a' },
    { id: 'd2', es: ['Vara', 'Banco'], note: 'b' },
    { id: 'd3', note: 'general' }
  ]
  const renamed = renameInDoubts(doubts, 'Vara', 'Vara (bastón)')
  assert.equal(renamed[0].es, 'Vara (bastón)')
  assert.deepEqual(renamed[1].es, ['Vara (bastón)', 'Banco'])
  assert.deepEqual(renamed[2], doubts[2])
})
