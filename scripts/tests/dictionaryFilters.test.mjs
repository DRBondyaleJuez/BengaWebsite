/**
 * Tests for src/utils/dictionaryFilters.js (search, filters and order of the dictionary admin
 * tables). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  plain,
  editDistance,
  matchesText,
  filtersFromQuery,
  queryFromFilters,
  activeFilterCount,
  entryRow,
  filterRows,
  sortRows,
  paginate
} from '../../src/utils/dictionaryFilters.js'

const entry = (lexeme, sense = {}, extra = {}) => ({
  id: lexeme,
  lexeme,
  senses: [
    { id: `${lexeme}-1`, partsOfSpeech: [], semanticDomains: [], sentenceIds: [], ...sense }
  ],
  audio: [],
  siteKeys: [],
  suggestions: [],
  review: null,
  sync: { state: 'synced' },
  ...extra
})
const rows = [
  entry(
    'Ele',
    {
      glosses: { es: 'Árbol', en: 'Tree', fr: 'Arbre' },
      partsOfSpeech: ['n'],
      semanticDomains: ['1.4'],
      nounClass: '1',
      sentenceIds: ['s1']
    },
    { audio: [{ id: 'a' }], siteKeys: ['ele'] }
  ),
  entry('Enâ', {
    glosses: { es: 'La mano', en: 'The hand' },
    partsOfSpeech: ['n'],
    semanticDomains: ['2.1'],
    nounClass: '1'
  }),
  entry(
    'Iyamba',
    { glosses: { es: 'Cocinar', en: 'To cook', fr: 'Cuisiner' }, partsOfSpeech: ['v'] },
    { review: { category: 'other', note: '?' }, sync: { state: 'local-changes' } }
  ),
  entry(
    'Hanga',
    { glosses: { es: 'Bandera' }, nounClass: '7' },
    { sync: { state: 'new' }, suggestions: [{}] }
  )
].map(entryRow)

test('plain text and edit distance', () => {
  assert.equal(plain('Árbol'), 'arbol')
  assert.equal(plain('Hāngā'), 'hanga') // decomposed ā as in the dictionary data
  assert.equal(editDistance('arbol', 'arbl'), 1)
  assert.equal(editDistance('mano', 'amno'), 1) // transposition
  assert.equal(editDistance('cocinar', 'bandera', 2), 3) // stops early
})

test('search ignores accents and tolerates typos on longer words', () => {
  assert.ok(matchesText('Ele Árbol Tree', 'arbol'))
  assert.ok(matchesText('Ele Árbol Tree', 'arbl', 1))
  assert.ok(!matchesText('Ele Árbol Tree', 'arbl', 0))
  assert.ok(!matchesText('Ele Árbol Tree', 'elx', 1)) // 3-letter words must match exactly
  assert.ok(matchesText('Enâ La mano', 'ena mano'))
  assert.ok(matchesText('anything', ''))
})

test('query ↔ filters round trip with defaults left out', () => {
  const filters = filtersFromQuery({
    q: 'mano',
    pos: 'n,v',
    audio: 'no',
    tol: '7',
    orden: 'x',
    pagina: '3'
  })
  assert.deepEqual(filters.pos, ['n', 'v'])
  assert.equal(filters.tol, 1)
  assert.equal(filters.orden, 'az')
  assert.equal(filters.pagina, 3)
  assert.deepEqual(queryFromFilters(filters), { q: 'mano', pos: 'n,v', audio: 'no', pagina: '3' })
  assert.equal(activeFilterCount(filters), 3)
})

test('rows summarise the senses', () => {
  const [ele, ena] = rows
  assert.equal(ele.es, 'Árbol')
  assert.equal(ele.audioCount, 1)
  assert.equal(ele.exampleCount, 1)
  assert.equal(ele.linked, true)
  assert.equal(ena.missing.fr, true)
  assert.equal(ena.missing.es, false)
})

test('filters', () => {
  const words = (filters) =>
    filterRows(rows, { ...filtersFromQuery({}), ...filters }).map((r) => r.lexeme)
  assert.deepEqual(words({ pos: ['v'] }), ['Iyamba'])
  assert.deepEqual(words({ dom: ['2.1'] }), ['Enâ'])
  assert.deepEqual(words({ nc: ['ninguna'] }), ['Iyamba'])
  assert.deepEqual(words({ audio: 'si' }), ['Ele'])
  assert.deepEqual(words({ falta: ['fr'] }), ['Enâ', 'Hanga'])
  assert.deepEqual(words({ falta: ['pos'] }), ['Hanga'])
  assert.deepEqual(words({ revision: 'si' }), ['Iyamba'])
  assert.deepEqual(words({ revision: 'other' }), ['Iyamba'])
  assert.deepEqual(words({ revision: 'no' }).length, 3)
  assert.deepEqual(words({ estado: ['local-changes', 'new'] }), ['Iyamba', 'Hanga'])
  assert.deepEqual(words({ web: 'no' }).length, 3)
  assert.deepEqual(words({ sugerencias: 'si' }), ['Hanga'])
  assert.deepEqual(words({ q: 'cocnar', tol: 1 }), ['Iyamba'])
})

test('sorting and pages', () => {
  assert.deepEqual(
    sortRows(rows).map((r) => r.lexeme),
    ['Ele', 'Enâ', 'Hanga', 'Iyamba']
  )
  assert.deepEqual(sortRows(rows, 'za').map((r) => r.lexeme)[0], 'Iyamba')
  assert.deepEqual(
    sortRows(rows, 'recientes')
      .map((r) => r.lexeme)
      .slice(0, 2),
    ['Hanga', 'Iyamba']
  )
  assert.deepEqual(sortRows(rows, 'revision')[0].lexeme, 'Iyamba')
  const page = paginate(rows, 9, 3)
  assert.equal(page.page, 2)
  assert.equal(page.pages, 2)
  assert.equal(page.rows.length, 1)
})

test('sentence rows and filters', async () => {
  const { sentenceRow, sentenceFiltersFromQuery, filterSentenceRows, sortSentenceRows } =
    await import('../../src/utils/dictionaryFilters.js')
  const words = { 'Ele-1': { entryId: 'Ele', lexeme: 'Ele' } }
  const sentences = [
    sentenceRow(
      {
        id: 's1',
        text: 'Ele ya mboka',
        translations: { es: 'El árbol del pueblo', en: 'The village tree' },
        translationStatus: { en: 'machine' },
        senseIds: ['Ele-1'],
        audio: [{ id: 'a' }],
        suggestions: [{ id: 'g', field: 'translations.fr', value: 'x' }],
        sync: { state: 'synced' }
      },
      words
    ),
    sentenceRow(
      { id: 's2', text: 'Âve le njale', translations: null, senseIds: [], sync: { state: 'new' } },
      words
    )
  ]
  assert.deepEqual(sentences[0].machine, ['en'])
  assert.equal(sentences[0].wordsText, 'Ele')
  const pick = (query) =>
    filterSentenceRows(sentences, sentenceFiltersFromQuery(query)).map((row) => row.id)
  assert.deepEqual(pick({ falta: 'fr' }), ['s1', 's2'])
  assert.deepEqual(pick({ falta: 'es' }), ['s2'])
  assert.deepEqual(pick({ maquina: 'si' }), ['s1'])
  assert.deepEqual(pick({ palabra: 'no' }), ['s2'])
  assert.deepEqual(pick({ audio: 'si' }), ['s1'])
  assert.deepEqual(pick({ sugerencias: 'si' }), ['s1'])
  assert.deepEqual(pick({ sugerencias: 'no' }), ['s2'])
  assert.deepEqual(pick({ q: 'arbol pueblo' }), ['s1'])
  assert.deepEqual(pick({ estado: 'new' }), ['s2'])
  assert.deepEqual(
    sortSentenceRows(sentences).map((row) => row.id),
    ['s2', 's1']
  )
  assert.deepEqual(sortSentenceRows(sentences, 'recientes')[0].id, 's2')
})
