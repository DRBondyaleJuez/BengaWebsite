/** Tests for src/utils/dictionaryChecks.js. Run: npm test */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  orthographyWarnings,
  senseWarnings,
  entryChecklist,
  bookGloss,
  dictionaryGloss,
  sameGloss,
  sitePages
} from '../../src/utils/dictionaryChecks.js'

test('orthography: letters Benga does not use and Spanish accents', () => {
  assert.deepEqual(orthographyWarnings('Mabē ndâlâ'), [])
  assert.deepEqual(orthographyWarnings(''), [])
  assert.deepEqual(orthographyWarnings(null), [])
  const letters = orthographyWarnings('Ceqra')
  assert.equal(letters.length, 1)
  assert.match(letters[0], /«c», «q», «r»/)
  const accents = orthographyWarnings('Mabé')
  assert.equal(accents.length, 1)
  assert.match(accents[0], /«é»/)
  assert.equal(orthographyWarnings('Ñáz').length, 2)
})

test('orthography: a decomposed accent is checked as NFC, â ē ū are fine', () => {
  assert.equal(orthographyWarnings('Mabé').length, 1)
  assert.deepEqual(orthographyWarnings('Mabē â ū'), [])
  assert.equal(orthographyWarnings('Cá').length, 2)
})

test('senseWarnings checks plural and variant', () => {
  const warnings = senseWarnings({ pluralForm: 'Bele', variant: 'Xele' })
  assert.deepEqual(warnings.pluralForm, [])
  assert.equal(warnings.variant.length, 1)
})

test('checklist: what is missing and where to jump', () => {
  const entry = {
    senses: [
      { glosses: { es: 'a', en: 'b', fr: 'c' }, partsOfSpeech: ['n'], semanticDomains: ['1'] },
      { glosses: { es: 'x' }, partsOfSpeech: [], semanticDomains: ['2'], sentenceIds: ['s'] }
    ],
    audio: []
  }
  const items = Object.fromEntries(entryChecklist(entry).map((item) => [item.id, item]))
  assert.equal(items.es.ok, true)
  assert.equal(items.en.ok, false)
  assert.equal(items.en.target, 'sentido-2')
  assert.equal(items.pos.target, 'sentido-2')
  assert.equal(items.domain.ok, true)
  assert.equal(items.audio.ok, false)
  assert.equal(items.audio.target, 'card-audio')
  assert.equal(items.example.ok, true)
  const complete = entryChecklist({
    senses: [
      {
        glosses: { es: 'a', en: 'b', fr: 'c' },
        partsOfSpeech: ['n'],
        semanticDomains: ['1'],
        sentenceIds: ['s']
      }
    ],
    audio: [{ id: 'a' }]
  })
  assert.ok(complete.every((item) => item.ok))
})

const nouns = {
  ek_a_i: {
    nounClass: 1,
    singular: { word: 'Ekâi' },
    plural: { word: 'Bekâi' },
    meaning: { es: 'Plátano', en: 'Plantain' },
    meaningPlural: { es: 'Plátanos', en: 'Plantains' }
  }
}
const adjectives = { bobe: { kind: 'variable', word: 'bobe', meaning: { es: 'Malo' } } }

test('bookGloss finds the book gloss by headword, plural or site key', () => {
  const found = bookGloss({ lexeme: 'Ekâi', senses: [] }, { nouns, adjectives })
  assert.equal(found.kind, 'noun')
  assert.equal(found.meaning.es, 'Plátano')
  assert.equal(found.plural, false)
  const plural = bookGloss({ lexeme: 'Bekâi', senses: [] }, { nouns, adjectives })
  assert.equal(plural.plural, true)
  assert.equal(plural.meaning.es, 'Plátanos')
  const viaPlural = bookGloss(
    { lexeme: 'Otro', senses: [{ pluralForm: 'Bekâi' }] },
    { nouns, adjectives }
  )
  assert.equal(viaPlural.id, 'ek_a_i')
  const viaKey = bookGloss({ lexeme: 'Otro', senses: [] }, { nouns, adjectives }, ['ek_a_i'])
  assert.equal(viaKey.id, 'ek_a_i')
  assert.equal(bookGloss({ lexeme: 'Bobe', senses: [] }, { nouns, adjectives }).kind, 'adjective')
  assert.equal(bookGloss({ lexeme: 'Nada', senses: [] }, { nouns, adjectives }), null)
})

test('dictionaryGloss and sameGloss', () => {
  const entry = { senses: [{ glosses: { es: 'Plátano' } }, { glosses: { es: 'Fruta' } }] }
  assert.equal(dictionaryGloss(entry, 'es'), 'Plátano · Fruta')
  assert.equal(dictionaryGloss(entry, 'fr'), '')
  assert.ok(sameGloss('Plátano', 'platano'))
  assert.ok(!sameGloss('Plátano', 'Fruta'))
  assert.ok(!sameGloss('', ''))
})

test('sitePages maps files to the pages of the site', () => {
  const sections = [
    { path: '/capitulo-2/clase-1', title: 'Clase 1', sectionFile: 'sections/ch-2/class-1.json' },
    { path: '/capitulo-1/alfabeto', title: 'Alfabeto', component: 'chapter-1/AlphabetSection.vue' },
    {
      path: '/capitulo-2/irregulares',
      title: 'Irregulares',
      component: 'chapter-2/IrregularNouns.vue'
    },
    { path: '/capitulo-3/adjetivos-regulares', title: 'Regulares' },
    { path: '/capitulo-3/adjetivos-invariables', title: 'Invariables' }
  ]
  const pages = sitePages(
    [
      'src/data/lexicon/nouns.json',
      'src/data/sections/ch-2/class-1.json',
      'src/views/chapter-1/AlphabetSection.vue',
      'src/data/chapter-1/alphabet.json',
      'src/data/chapter-2/irregular-nouns.json',
      'src/data/lexicon/word-registry.json'
    ],
    { sections, noun: { nounClass: 1 } }
  )
  assert.deepEqual(
    pages.map((page) => page.path),
    ['/capitulo-2/clase-1', '/capitulo-1/alfabeto', '/capitulo-2/irregulares']
  )
  const adjective = sitePages(['src/data/lexicon/adjectives.json'], {
    sections,
    adjective: { kind: 'invariable' }
  })
  assert.deepEqual(adjective, [{ path: '/capitulo-3/adjetivos-invariables', title: 'Invariables' }])
  assert.deepEqual(sitePages(['src/data/lexicon/nouns.json'], { sections }), [])
})
