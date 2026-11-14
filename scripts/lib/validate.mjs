/**
 * The content checks behind `npm run validate` (roadmap task 2.3).
 *
 * validateContent() receives the content already loaded (no file reading here), so the checks can
 * be tested with small made-up data (scripts/tests/validate.test.mjs). scripts/validate-data.mjs
 * reads the real files and prints the report.
 *
 * Every problem found is one object:
 *   { level, check, file, where, message, fix }
 *     level   'error'   → the content is wrong; `npm run validate` fails (exit code 1)
 *             'warning' → probably wrong, a human should look
 *             'info'    → known, harmless leftovers (e.g. legacy audio ids), listed for cleanup
 *     check   which group of checks found it (see CHECKS below)
 *     file    file path, relative to the project
 *     where   position inside the file, e.g. "entries.miba.meaning" or "blocks[2]"
 *     fix     a short hint on how to solve it
 */
import { toAudioId } from '../../src/utils/audioId.js'
import { baseWordOf } from './schemas.mjs'

/** Group names, in report order, with a one-line explanation for the report. */
export const CHECKS = {
  schema: 'Files follow their rules (src/data/schemas)',
  ids: 'Ids are correct and unique',
  references: 'References point to things that exist',
  registry: 'Word registry is consistent',
  orthography: 'Benga spelling (AGENTS.md → Benga Orthography Rules)',
  legacy: 'Hand-typed audio ids left in old page data'
}

/** Letters that are not used in Benga spelling. */
const NON_BENGA_LETTERS = /[cqrxzñ]/i
/** Spanish-style accents; Benga uses â ē ū (and never accents i / o). */
const SPANISH_ACCENTS = /[áéíóú]/i
/** Lexicon id suffix for homonyms: "jaka~2". */
const HOMONYM = /~[0-9]+$/

/**
 * @param {object} content
 * @param {object|null} content.chaptersIndex - src/data/chapters-index.json
 * @param {object|null} content.registry - src/data/lexicon/word-registry.json
 * @param {Object<string, object>} content.lexicons - { "src/data/lexicon/nouns.json": data, ... }
 * @param {Object<string, object>} content.sections - { "src/data/sections/ch-2/class-1.json": data, ... }
 * @param {Object<string, object>} content.exercises - { "src/data/exercises/x.json": data, ... }
 * @param {Array} content.pageWords - Benga words found in the current pages (scripts/lib/collect-words.mjs)
 * @param {(path: string) => boolean} content.fileExists - is there a file at this project-relative path?
 * @param {(schema: string, data: object) => {valid: boolean, errors: string[]}} check - from loadSchemas()
 * @returns {{ problems: object[], stats: object }}
 */
export function validateContent(content, check) {
  const problems = []
  const add = (level, checkName, file, where, message, fix = '') =>
    problems.push({ level, check: checkName, file, where, message, fix })

  const {
    chaptersIndex = null,
    registry = null,
    lexicons = {},
    sections = {},
    exercises = {},
    pageWords = [],
    fileExists = () => true
  } = content

  // 1. Schemas ---------------------------------------------------------------------------------
  const schemaCheck = (schema, file, data) => {
    const result = check(schema, data)
    for (const error of result.errors) {
      const [where, ...rest] = error.split(': ')
      add(
        'error',
        'schema',
        file,
        where,
        rest.join(': '),
        `See src/data/schemas/${schema}.schema.json`
      )
    }
    return result.valid
  }
  if (chaptersIndex) schemaCheck('chapters-index', 'src/data/chapters-index.json', chaptersIndex)
  if (registry) schemaCheck('word-registry', 'src/data/lexicon/word-registry.json', registry)
  for (const [file, data] of Object.entries(lexicons)) schemaCheck('lexicon', file, data)
  for (const [file, data] of Object.entries(sections)) schemaCheck('section', file, data)
  for (const [file, data] of Object.entries(exercises)) schemaCheck('exercise', file, data)

  // 2. Lexicon ids ------------------------------------------------------------------------------
  const lexiconIds = new Map() // id → file
  for (const [file, data] of Object.entries(lexicons)) {
    for (const [id, entry] of Object.entries((data && data.entries) || {})) {
      if (lexiconIds.has(id)) {
        add(
          'error',
          'ids',
          file,
          `entries.${id}`,
          `Id "${id}" is also used in ${lexiconIds.get(id)}`,
          'Each word once: merge the two entries, or add ~2 if they are different words written the same way'
        )
      } else {
        lexiconIds.set(id, file)
      }
      let baseWord = null
      try {
        baseWord = baseWordOf(entry)
      } catch {
        continue // malformed entry: already reported by the schema check
      }
      const expected = toAudioId(baseWord)
      const baseId = id.replace(HOMONYM, '')
      if (expected && baseId !== expected) {
        add(
          'error',
          'ids',
          file,
          `entries.${id}`,
          `Id "${id}" doesn't match its word "${baseWord}" (expected "${expected}")`,
          `Rename the entry to "${expected}" (ids are computed with toAudioId)`
        )
      }
    }
  }
  for (const [id, file] of lexiconIds) {
    if (HOMONYM.test(id) && !lexiconIds.has(id.replace(HOMONYM, ''))) {
      add(
        'warning',
        'ids',
        file,
        `entries.${id}`,
        `Homonym "${id}" exists but "${id.replace(HOMONYM, '')}" doesn't`,
        'The first word written this way has no ~ suffix'
      )
    }
  }

  // 3. Section and exercise ids + references --------------------------------------------------
  const sectionIds = new Map()
  for (const [file, data] of Object.entries(sections)) {
    if (!data || !data.id) continue
    if (sectionIds.has(data.id)) {
      add(
        'error',
        'ids',
        file,
        'id',
        `Section id "${data.id}" is also used in ${sectionIds.get(data.id)}`,
        'Give each section its own id'
      )
    } else sectionIds.set(data.id, file)

    ;(data.blocks || []).forEach((block, index) => {
      const refs = []
      if (Array.isArray(block.entries)) refs.push(...block.entries) // examples, vocabulary
      if (block.type === 'conjugation' && block.verb) refs.push(block.verb)
      for (const ref of refs) {
        if (!lexiconIds.has(ref)) {
          add(
            'error',
            'references',
            file,
            `blocks[${index}] (${block.type})`,
            `Refers to "${ref}", which is not in any lexicon file`,
            'Add the word to the lexicon first, or fix the id'
          )
        }
      }
    })
  }
  const exerciseIds = new Set()
  for (const [file, data] of Object.entries(exercises)) {
    if (!data || !data.id) continue
    if (exerciseIds.has(data.id))
      add(
        'error',
        'ids',
        file,
        'id',
        `Exercise id "${data.id}" is used twice`,
        'Give each exercise its own id'
      )
    exerciseIds.add(data.id)
    if (data.section && !sectionIds.has(data.section)) {
      add(
        'error',
        'references',
        file,
        'section',
        `Belongs to section "${data.section}", which doesn't exist`,
        'Fix the section id'
      )
    }
  }

  // 4. Chapter index ----------------------------------------------------------------------------
  if (chaptersIndex && Array.isArray(chaptersIndex.chapters)) {
    const file = 'src/data/chapters-index.json'
    const seenPaths = new Set()
    const seenChapters = new Set()
    chaptersIndex.chapters.forEach((chapter, c) => {
      if (seenChapters.has(chapter.id))
        add('error', 'ids', file, `chapters[${c}]`, `Chapter id "${chapter.id}" appears twice`)
      seenChapters.add(chapter.id)
      const seenSections = new Set()
      ;(chapter.sections || []).forEach((section, s) => {
        const where = `chapters[${c}].sections[${s}]`
        if (seenSections.has(section.id))
          add(
            'error',
            'ids',
            file,
            where,
            `Section id "${section.id}" appears twice in ${chapter.id}`
          )
        seenSections.add(section.id)
        if (seenPaths.has(section.path))
          add('error', 'ids', file, where, `URL "${section.path}" is used by two sections`)
        seenPaths.add(section.path)
        if (section.sectionFile && !fileExists(`src/data/${section.sectionFile}`)) {
          add(
            'error',
            'references',
            file,
            where,
            `sectionFile "${section.sectionFile}" doesn't exist`,
            'Create the file or fix the path (relative to src/data)'
          )
        }
        if (section.component && !fileExists(`src/views/${section.component}`)) {
          add(
            'error',
            'references',
            file,
            where,
            `component "${section.component}" doesn't exist`,
            'Fix the path (relative to src/views)'
          )
        }
      })
    })
  }

  // 5. Word registry ------------------------------------------------------------------------------
  if (registry && registry.words) {
    const file = 'src/data/lexicon/word-registry.json'
    for (const [key, entry] of Object.entries(registry.words)) {
      if (!entry || typeof entry !== 'object') continue
      const expected = toAudioId(entry.word)
      if (expected && expected !== key) {
        add(
          'warning',
          'registry',
          file,
          `words.${key}`,
          `Key "${key}" doesn't match its word "${entry.word}" (that word gives "${expected}")`,
          'If the spelling was corrected, correct it on the page and run npm run words:sync (docs/WORD-REGISTRY.md → "Correct a word\'s spelling")'
        )
      }
      if (entry.audioFile && entry.audio !== 'recorded') {
        add(
          'warning',
          'registry',
          file,
          `words.${key}`,
          `Has audioFile "${entry.audioFile}" but audio is "${entry.audio}"`,
          'Set audio to "recorded" once the file is on Cloudinary, or remove audioFile'
        )
      }
    }
  }

  // 6. Orthography of every Benga text ------------------------------------------------------------
  const bengaTexts = [] // { text, file, where }
  for (const [file, data] of Object.entries(lexicons))
    bengaTexts.push(...bengaTextsInLexicon(file, data))
  for (const [file, data] of Object.entries(sections))
    bengaTexts.push(...bengaTextsInSection(file, data))
  for (const use of pageWords) bengaTexts.push({ text: use.word, file: use.file, where: use.path })

  const reported = new Set()
  for (const { text, file, where } of bengaTexts) {
    const id = `${file}|${text}`
    if (reported.has(id)) continue
    if (NON_BENGA_LETTERS.test(text)) {
      add(
        'warning',
        'orthography',
        file,
        where,
        `"${text}" contains ${text.match(NON_BENGA_LETTERS)[0]} (not a Benga letter)`,
        'Check the book: OCR often turns one letter into another'
      )
      reported.add(id)
    } else if (SPANISH_ACCENTS.test(text)) {
      add(
        'warning',
        'orthography',
        file,
        where,
        `"${text}" has the Spanish accent ${text.match(SPANISH_ACCENTS)[0]}`,
        'Benga writes â ē ū (á → â, é → ē, ú → ū)'
      )
      reported.add(id)
    }
  }

  // 7. Legacy audio ids in the current pages (harmless, removed in roadmap task 2.4) ---------------
  // Grouped by word + typed id: a page that reads a JSON file would otherwise list each word twice.
  const legacy = new Map()
  for (const use of pageWords) {
    if (!use.storedAudioId) continue
    const key = toAudioId(use.word)
    if (!key || use.storedAudioId === key) continue
    const id = `${use.word}|${use.storedAudioId}`
    if (!legacy.has(id)) legacy.set(id, { use, key, files: [] })
    if (!legacy.get(id).files.includes(use.file)) legacy.get(id).files.push(use.file)
  }
  for (const { use, key, files } of legacy.values()) {
    add(
      'info',
      'legacy',
      files.join(', '),
      use.path,
      `"${use.word}": typed id "${use.storedAudioId}", the rule gives "${key}"`,
      'Ignored by the site; disappears when the content moves to the lexicon'
    )
  }

  const count = (level) => problems.filter((problem) => problem.level === level).length
  return {
    problems,
    stats: {
      lexiconFiles: Object.keys(lexicons).length,
      lexiconEntries: lexiconIds.size,
      sectionFiles: Object.keys(sections).length,
      exerciseFiles: Object.keys(exercises).length,
      registryWords: registry && registry.words ? Object.keys(registry.words).length : 0,
      pageWords: pageWords.length,
      errors: count('error'),
      warnings: count('warning'),
      infos: count('info')
    }
  }
}

/** All Benga texts in a lexicon file, with where they are. */
function bengaTextsInLexicon(file, data) {
  const found = []
  for (const [id, entry] of Object.entries((data && data.entries) || {})) {
    if (!entry || typeof entry !== 'object') continue
    const where = `entries.${id}`
    for (const form of ['singular', 'plural']) {
      if (entry[form] && entry[form].word)
        found.push({ text: entry[form].word, file, where: `${where}.${form}` })
    }
    if (typeof entry.word === 'string') found.push({ text: entry.word, file, where })
    for (const [nounClass, forms] of Object.entries(entry.forms || {})) {
      for (const form of ['singular', 'plural']) {
        if (forms && forms[form])
          found.push({ text: forms[form], file, where: `${where}.forms.${nounClass}.${form}` })
      }
    }
  }
  return found
}

/** All Benga texts written directly in a section file (words referenced by id are checked in the lexicon). */
function bengaTextsInSection(file, data) {
  const found = []
  ;((data && data.blocks) || []).forEach((block, index) => {
    const where = `blocks[${index}] (${block.type})`
    for (const item of block.items || [])
      if (item && item.word) found.push({ text: item.word, file, where })
    for (const row of block.rows || []) {
      for (const cell of Array.isArray(row) ? row : [])
        if (cell && cell.benga) found.push({ text: cell.benga, file, where })
    }
    for (const tense of block.tenses || []) {
      for (const row of tense.rows || [])
        if (row.benga) found.push({ text: row.benga, file, where })
    }
    for (const line of block.lines || [])
      if (line.benga) found.push({ text: line.benga, file, where })
  })
  return found
}
