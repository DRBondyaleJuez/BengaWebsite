/**
 * Tests for the content checks (scripts/lib/validate.mjs). Run with:  npm test
 *
 * Each test builds a tiny, correct content set, breaks ONE thing, and checks that
 * `npm run validate` would report exactly that problem.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSchemas } from '../lib/schemas.mjs'
import { validateContent } from '../lib/validate.mjs'

const check = loadSchemas()
const NOUNS = 'src/data/lexicon/nouns.json'
const SECTION = 'src/data/sections/ch-2/class-1.json'

/** A small content set with no problems. Each test changes one thing. */
function goodContent() {
  return {
    chaptersIndex: {
      chapters: [
        {
          id: 'chapter2',
          number: 2,
          titleKey: 'chapters.chapter2.title',
          path: '/capitulo-2',
          component: 'chapter-2/ChapterTwoIndex.vue',
          sections: [
            {
              id: 'class1',
              path: '/capitulo-2/clase-1',
              titleKey: 'x.class1',
              sectionFile: 'sections/ch-2/class-1.json'
            }
          ]
        }
      ]
    },
    registry: {
      words: {
        epokolo: {
          word: 'Epokolo',
          livingDictionaryId: null,
          audio: 'missing',
          audioFile: null,
          notes: ''
        }
      }
    },
    lexicons: {
      [NOUNS]: {
        entries: {
          epokolo: {
            type: 'noun',
            nounClass: 1,
            singular: { word: 'Epokolo' },
            plural: { word: 'Bepokolo' },
            meaning: { es: 'Sombrero' }
          }
        }
      }
    },
    sections: {
      [SECTION]: {
        id: 'ch2-noun-class-1',
        chapter: 2,
        title: { es: 'Primera Clase Nominal' },
        blocks: [{ type: 'examples', entries: ['epokolo'] }]
      }
    },
    exercises: {
      'src/data/exercises/x.json': {
        id: 'ch2-pluralize-class-1',
        section: 'ch2-noun-class-1',
        kind: 'fill-in',
        title: { es: 'Forma el plural' },
        generator: { ask: 'pluralize', count: 5 }
      }
    },
    pageWords: [{ word: 'Epokolo', storedAudioId: 'epokolo', file: 'src/views/A.vue', path: 'x' }],
    fileExists: () => true
  }
}

const run = (content) => validateContent(content, check)
const only = (result, level) => result.problems.filter((problem) => problem.level === level)

test('a correct content set has no problems', () => {
  const result = run(goodContent())
  assert.deepEqual(result.problems, [])
  assert.equal(result.stats.lexiconEntries, 1)
})

test('schema problems are errors, with the place in the file', () => {
  const content = goodContent()
  content.lexicons[NOUNS].entries.epokolo.nounClass = 9
  const errors = only(run(content), 'error')
  assert.equal(errors[0].check, 'schema')
  assert.match(errors[0].where, /entries\/epokolo\/nounClass/)
})

test('a lexicon id must be the word key of its base word', () => {
  const content = goodContent()
  const entry = content.lexicons[NOUNS].entries.epokolo
  content.lexicons[NOUNS].entries = { epokol: entry }
  content.sections[SECTION].blocks[0].entries = ['epokol']
  const [error] = only(run(content), 'error')
  assert.equal(error.check, 'ids')
  assert.match(error.message, /expected "epokolo"/)
})

test('the same id in two lexicon files is an error', () => {
  const content = goodContent()
  content.lexicons['src/data/lexicon/other.json'] = structuredClone(content.lexicons[NOUNS])
  const [error] = only(run(content), 'error')
  assert.equal(error.check, 'ids')
  assert.match(error.message, /also used in src\/data\/lexicon\/nouns\.json/)
})

test('a homonym (~2) without the first word is a warning', () => {
  const content = goodContent()
  const entry = content.lexicons[NOUNS].entries.epokolo
  content.lexicons[NOUNS].entries = { 'epokolo~2': entry }
  content.sections[SECTION].blocks[0].entries = ['epokolo~2']
  const result = run(content)
  assert.equal(only(result, 'error').length, 0)
  assert.match(only(result, 'warning')[0].message, /Homonym "epokolo~2"/)
})

test('a section that refers to a missing word is an error', () => {
  const content = goodContent()
  content.sections[SECTION].blocks.push({ type: 'vocabulary', entries: ['ndonda'] })
  const [error] = only(run(content), 'error')
  assert.equal(error.check, 'references')
  assert.match(error.message, /"ndonda"/)
})

test('an exercise for a missing section is an error', () => {
  const content = goodContent()
  content.exercises['src/data/exercises/x.json'].section = 'ch9-nothing'
  const [error] = only(run(content), 'error')
  assert.equal(error.check, 'references')
})

test('chapter index: repeated URL and missing section file are errors', () => {
  const content = goodContent()
  const sections = content.chaptersIndex.chapters[0].sections
  sections.push({
    id: 'class2',
    path: '/capitulo-2/clase-1',
    titleKey: 'x.class2',
    component: 'chapter-2/X.vue'
  })
  content.fileExists = () => false
  const messages = only(run(content), 'error').map((problem) => problem.message)
  assert.ok(messages.some((message) => /used by two sections/.test(message)))
  assert.ok(messages.some((message) => /sectionFile .* doesn't exist/.test(message)))
  assert.ok(messages.some((message) => /component "chapter-2\/X.vue" doesn't exist/.test(message)))
  assert.ok(messages.some((message) => /component "chapter-2\/ChapterTwoIndex.vue"/.test(message)))
})

test('registry: key that no longer matches its word is a warning', () => {
  const content = goodContent()
  content.registry.words.epokolo.word = 'Epokolō'
  const [warning] = only(run(content), 'warning')
  assert.equal(warning.check, 'registry')
})

test('orthography: non-Benga letters and Spanish accents are warnings', () => {
  const content = goodContent()
  content.lexicons[NOUNS].entries.epokolo.plural.word = 'Bepokoro'
  content.pageWords.push({
    word: 'Itánde',
    storedAudioId: null,
    file: 'src/views/B.vue',
    path: 'y'
  })
  const warnings = only(run(content), 'warning').filter(
    (problem) => problem.check === 'orthography'
  )
  assert.equal(warnings.length, 2)
  assert.match(warnings[0].message, /contains r/)
  assert.match(warnings[1].message, /Spanish accent á/)
})

test('legacy audio ids: one note per word, listing every file', () => {
  const content = goodContent()
  const use = { word: 'Mbalanga', storedAudioId: 'malanga', path: 'z' }
  content.pageWords.push(
    { ...use, file: 'src/data/deck.json' },
    { ...use, file: 'src/views/C.vue' }
  )
  const notes = only(run(content), 'info')
  assert.equal(notes.length, 1)
  assert.equal(notes[0].file, 'src/data/deck.json, src/views/C.vue')
  assert.equal(only(run(content), 'error').length, 0) // notes never fail the check
})
