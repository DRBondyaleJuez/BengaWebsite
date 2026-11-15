/**
 * ONE-TIME MIGRATION (roadmap task 2.4): builds src/data/lexicon/nouns.json from the chapter-2 pages.
 *
 *   node scripts/extract-ch2.mjs            → print the report only
 *   node scripts/extract-ch2.mjs --write    → also write src/data/lexicon/nouns.json
 *
 * Where the nouns come from (in this order; the first one wins when a word appears twice):
 *
 *   NounClass1-7.vue, IrregularNouns.vue, VerbalNouns.vue   data() blocks = the checked content
 *        │
 *        ├─ noun-practice-deck.json   extra words from the book's «Vocabulario» (PDF pages 15-17)
 *        ▼
 *   lexicon/nouns.json   { "entries": { "epokolo": { type: "noun", nounClass: 1, ... } } }
 *
 * Each entry also gets source.pdfPage: the PDF page where its singular (or plural) is printed.
 * Pages are found with `pdftotext` (the PDF has OCR damage, so some words are not found;
 * those get the page range of their class and are listed in the report for task 2.4.2).
 *
 * Not taken: the verbs in VerbalNouns.vue (Tândâkâ, Longaka…). They go to lexicon/verbs.json (Phase 6).
 *
 * After task 2.5 the practice deck is deleted and nouns.json becomes the source of truth:
 * edit it directly and don't run this script again (it refuses to run without the deck).
 * TODO(Phase 3): delete this script when the noun pages read lexicon/nouns.json.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT, readVueData } from './lib/collect-words.mjs'
import { toAudioId } from '../src/utils/audioId.js'

const WRITE = process.argv.includes('--write')
const VIEWS = path.join(ROOT, 'src/views/chapter-2')
const DECK_FILE = path.join(ROOT, 'src/data/chapter-2/noun-practice-deck.json')
const OUT_FILE = path.join(ROOT, 'src/data/lexicon/nouns.json')
const PDF_FILE = path.join(ROOT, 'public/downloads/salvado-y-cos-gramatica-benga.pdf')

/** PDF pages of each part of chapter 2 (AGENTS.md → Source of Truth). */
const PAGES = {
  1: [8, 9],
  2: [9, 10],
  3: [10, 11],
  4: [11, 12],
  5: [12, 12],
  6: [12, 13],
  7: [13, 14],
  irregular: [14, 14],
  verbal: [14, 15],
  vocabulary: [15, 17]
}

/**
 * Which data() arrays hold nouns, and how to read them.
 *   shape: 'pair' = { singular: {word, meaning}, plural: {word, meaning} }
 *          'same' = { word, meaning } with singular = plural (class 7 never changes)
 *          'pluralOnly' / 'singularOnly' = { word, meaning } that exists in one number only
 *          'nominal' = { nominalForm, meaning } (verbal nouns; the book gives no plural)
 */
const GROUPS = [
  { file: 'NounClass1.vue', list: 'mainExamples', nounClass: 1, shape: 'pair' },
  { file: 'NounClass1.vue', list: 'yVariants', nounClass: 1, shape: 'pair', tags: ['y-variant'] },
  { file: 'NounClass2.vue', list: 'iExamples', nounClass: 2, shape: 'pair' },
  { file: 'NounClass2.vue', list: 'diExamples', nounClass: 2, shape: 'pair' },
  {
    file: 'NounClass2.vue',
    list: 'exceptionExamples',
    nounClass: 2,
    shape: 'pair',
    tags: ['class-exception']
  },
  {
    file: 'NounClass2.vue',
    list: 'liquidExamples',
    nounClass: 2,
    shape: 'pluralOnly',
    tags: ['liquid', 'plural-only']
  },
  {
    file: 'NounClass2.vue',
    list: 'classSixExamples',
    nounClass: 2,
    shape: 'pair',
    tags: ['class-exception', 'plural-class-6']
  },
  { file: 'NounClass3.vue', list: 'uExamples', nounClass: 3, shape: 'pair' },
  { file: 'NounClass3.vue', list: 'muExamples', nounClass: 3, shape: 'pair' },
  {
    file: 'NounClass3.vue',
    list: 'exceptionExamples',
    nounClass: 3,
    shape: 'pair',
    tags: ['class-exception']
  },
  { file: 'NounClass4.vue', list: 'boExamples', nounClass: 4, shape: 'pair' },
  { file: 'NounClass4.vue', list: 'buExamples', nounClass: 4, shape: 'pair' },
  {
    file: 'NounClass4.vue',
    list: 'exceptionExamples',
    nounClass: 4,
    shape: 'pair',
    tags: ['class-exception']
  },
  { file: 'NounClass5.vue', list: 'examples', nounClass: 5, shape: 'pair' },
  {
    file: 'NounClass5.vue',
    list: 'exceptionExamples',
    nounClass: 5,
    shape: 'pair',
    tags: ['class-exception']
  },
  { file: 'NounClass6.vue', list: 'examples', nounClass: 6, shape: 'pair' },
  {
    file: 'NounClass6.vue',
    list: 'exceptionExamples',
    nounClass: 6,
    shape: 'pair',
    tags: ['class-exception']
  },
  // NounClass6.vue → classTwoExceptions repeats NounClass2.vue → classSixExamples (merged below).
  {
    file: 'NounClass6.vue',
    list: 'classTwoExceptions',
    nounClass: 2,
    shape: 'pair',
    tags: ['class-exception', 'plural-class-6'],
    pages: 6
  },
  { file: 'NounClass7.vue', list: 'words', nounClass: 7, shape: 'same' },
  {
    file: 'IrregularNouns.vue',
    list: 'pluralOnlyNouns',
    nounClass: 'irregular',
    shape: 'pluralOnly',
    tags: ['plural-only']
  },
  {
    file: 'IrregularNouns.vue',
    list: 'singularOnlyNouns',
    nounClass: 'irregular',
    shape: 'singularOnly',
    tags: ['singular-only']
  },
  {
    file: 'VerbalNouns.vue',
    list: 'abstractNounsExamples',
    nounClass: 2,
    shape: 'pair',
    tags: ['verbal-noun', 'abstract'],
    pages: 'verbal'
  },
  {
    file: 'VerbalNouns.vue',
    list: 'abstractNouns',
    nounClass: 2,
    shape: 'nominal',
    tags: ['verbal-noun', 'abstract'],
    pages: 'verbal'
  },
  {
    file: 'VerbalNouns.vue',
    list: 'agentNounsExamples',
    nounClass: 3,
    shape: 'pair',
    tags: ['verbal-noun', 'agent'],
    pages: 'verbal'
  },
  {
    file: 'VerbalNouns.vue',
    list: 'agentNouns',
    nounClass: 3,
    shape: 'nominal',
    tags: ['verbal-noun', 'agent'],
    pages: 'verbal'
  },
  // The book doesn't say which class the "modo" nouns belong to → nounClass null.
  {
    file: 'VerbalNouns.vue',
    list: 'modalityNouns',
    nounClass: null,
    shape: 'nominal',
    tags: ['verbal-noun', 'manner'],
    pages: 'verbal'
  }
]

// ── PDF page lookup ──────────────────────────────────────────────────────────

/** "Ebūela" → "ebuela": lower case, no accents, so OCR'd Spanish accents (Ebúela) match too. */
const plain = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** { 8: Set("ejanganangobo", "libro", …), 9: … } — the words printed on each PDF page. */
function readPdfWords() {
  const pages = {}
  for (let page = PAGES[1][0]; page <= PAGES.vocabulary[1]; page += 1) {
    try {
      const text = execFileSync('pdftotext', [
        '-enc',
        'UTF-8',
        '-f',
        String(page),
        '-l',
        String(page),
        PDF_FILE,
        '-'
      ]).toString('utf8')
      pages[page] = new Set(
        plain(text)
          .split(/[^a-z]+/)
          .filter(Boolean)
      )
    } catch {
      console.warn('  ! pdftotext not available: pages will be the class page ranges')
      return null
    }
  }
  return pages
}

/** First page in [first, last] where the word (every part of it) is printed, or null. */
function findPage(pdfWords, word, [first, last]) {
  if (!pdfWords || !word) return null
  const parts = plain(word)
    .split(/[^a-z]+/)
    .filter(Boolean)
  for (let page = first; page <= last; page += 1) {
    if (parts.every((part) => pdfWords[page].has(part))) return page
  }
  return null
}

// ── Building entries ─────────────────────────────────────────────────────────

const text = (spanish) => (spanish ? { es: spanish } : null)
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1)

/** Turns one item of a data() array into a lexicon entry (without source). */
function toEntry(item, group) {
  const base = { type: 'noun', nounClass: group.nounClass }
  switch (group.shape) {
    case 'pair':
      return {
        ...base,
        singular: { word: item.singular.word },
        plural: { word: item.plural.word },
        meaning: text(item.singular.meaning),
        ...(item.plural.meaning && item.plural.meaning !== item.singular.meaning
          ? { meaningPlural: text(item.plural.meaning) }
          : {})
      }
    case 'same':
      return {
        ...base,
        singular: { word: item.word },
        plural: { word: item.word },
        meaning: text(item.meaning)
      }
    case 'pluralOnly':
      return { ...base, singular: null, plural: { word: item.word }, meaning: text(item.meaning) }
    case 'singularOnly':
      return { ...base, singular: { word: item.word }, plural: null, meaning: text(item.meaning) }
    case 'nominal':
      return {
        ...base,
        singular: { word: capitalise(item.nominalForm) },
        plural: null,
        meaning: text(item.meaning),
        notes: 'Verbal noun: the book gives no plural for this form.'
      }
  }
  throw new Error(`Unknown shape ${group.shape}`)
}

/** A deck card ({ singular, plural, translation, pluralTranslation, nounClass: "Clase 1" }) → entry. */
function deckToEntry(card) {
  return {
    type: 'noun',
    nounClass: Number(card.nounClass.replace('Clase ', '')),
    singular: { word: card.singular },
    plural: { word: card.plural },
    meaning: text(card.translation),
    ...(card.pluralTranslation && card.pluralTranslation !== card.translation
      ? { meaningPlural: text(card.pluralTranslation) }
      : {}),
    tags: ['vocabulary']
  }
}

const baseWord = (entry) => (entry.singular || entry.plural).word
const sameForms = (a, b) =>
  a.singular?.word === b.singular?.word && a.plural?.word === b.plural?.word
/**
 * Same word seen from another list, e.g. class-7 "Tito / Tito" and irregular "— / Tito"
 * (plural only): every form that both have is equal, one of them just lacks a form.
 */
const compatibleForms = (a, b) =>
  ['singular', 'plural'].every(
    (number) => !a[number] || !b[number] || a[number].word === b[number].word
  )

/** Adds tags without repeating them. */
function addTags(entry, tags = []) {
  const all = [...new Set([...(entry.tags || []), ...tags])]
  if (all.length) entry.tags = all
}

/** Puts the fields in the same order in every entry (easier to read and to diff). */
function ordered(entry) {
  const order = [
    'type',
    'nounClass',
    'singular',
    'plural',
    'meaning',
    'meaningPlural',
    'source',
    'editorial',
    'tags',
    'notes'
  ]
  return Object.fromEntries(order.filter((key) => key in entry).map((key) => [key, entry[key]]))
}

function main() {
  if (!fs.existsSync(DECK_FILE)) {
    console.error(
      'noun-practice-deck.json is gone: the migration was already done (task 2.5).\n' +
        'Edit src/data/lexicon/nouns.json directly instead of running this script.'
    )
    process.exit(1)
  }

  const pdfWords = readPdfWords()
  const entries = new Map() // id → entry
  const report = { merged: [], homonyms: [], differences: [], notInPdf: [] }

  const listOf = new Map() // id → the list it came from, e.g. "NounClass7.vue → words"

  /**
   * Adds an entry, or merges it into an existing one with the same id.
   * The same word twice in ONE list is a homonym (class 7: Njadi = yunque, Njadi = primogénito)
   * and gets the id "njadi~2"; the same word in two lists is one word seen twice.
   */
  function add(entry, origin, pageRange) {
    const list = origin.split('[')[0]
    let id = toAudioId(baseWord(entry))
    if (entries.has(id) && listOf.get(id) === list) {
      let n = 2
      while (entries.has(`${id}~${n}`)) n += 1
      id = `${id}~${n}`
      report.homonyms.push(`${id}: ${baseWord(entry)} = ${entry.meaning?.es} (${origin})`)
    }
    const existing = entries.get(id)
    if (existing) {
      if (sameForms(existing, entry)) {
        addTags(existing, entry.tags)
        report.merged.push(`${id}: ${origin}`)
      } else if (compatibleForms(existing, entry)) {
        // Keep the entry with both forms, remember the other list in tags + an editor note.
        addTags(existing, entry.tags)
        const note = `Also listed in ${list}.`
        existing.notes = existing.notes ? `${existing.notes} ${note}` : note
        report.merged.push(`${id}: ${origin} (one form only there)`)
      } else {
        report.differences.push(
          `${id}: kept ${existing.singular?.word ?? '—'} / ${existing.plural?.word ?? '—'}, ` +
            `${origin} has ${entry.singular?.word ?? '—'} / ${entry.plural?.word ?? '—'}`
        )
      }
      return
    }
    const page =
      findPage(pdfWords, entry.singular?.word, pageRange) ??
      findPage(pdfWords, entry.plural?.word, pageRange)
    if (page) entry.source = { pdfPage: page }
    else {
      const [first, last] = pageRange
      entry.source = { pdfPage: first === last ? first : `${first}-${last}` }
      report.notInPdf.push(`${id} (${baseWord(entry)}, ${origin})`)
    }
    entries.set(id, entry)
    listOf.set(id, list)
  }

  for (const group of GROUPS) {
    const data = readVueData(path.join(VIEWS, group.file))
    const items = data?.[group.list]
    if (!Array.isArray(items)) throw new Error(`${group.file}: data() has no list "${group.list}"`)
    const pageRange = PAGES[group.pages ?? group.nounClass]
    items.forEach((item, index) => {
      const entry = toEntry(item, group)
      addTags(entry, group.tags)
      add(entry, `${group.file} → ${group.list}[${index}]`, pageRange)
    })
  }

  const deck = JSON.parse(fs.readFileSync(DECK_FILE, 'utf8'))
  let deckOnly = 0
  deck.forEach((card, index) => {
    const entry = deckToEntry(card)
    const id = toAudioId(baseWord(entry))
    const existing = entries.get(id)
    if (existing) {
      // The page wins; only report real differences (spelling, class, meaning).
      const problems = []
      if (!sameForms(existing, entry))
        problems.push(`forms ${card.singular} / ${card.plural} vs page ${baseWord(existing)}`)
      if (existing.nounClass !== entry.nounClass)
        problems.push(`class ${entry.nounClass} vs page ${existing.nounClass}`)
      if (existing.meaning?.es !== entry.meaning.es)
        problems.push(`meaning «${entry.meaning.es}» vs page «${existing.meaning?.es}»`)
      if (problems.length) report.differences.push(`${id}: deck[${index}] ${problems.join('; ')}`)
      return
    }
    deckOnly += 1
    add(entry, `deck[${index}]`, PAGES.vocabulary)
  })

  const lexicon = {
    _about:
      'Chapter-2 nouns, built by scripts/extract-ch2.mjs (task 2.4) from the noun pages and the practice deck. Guide: docs/CONTENT-GUIDE.md',
    entries: Object.fromEntries([...entries].map(([id, entry]) => [id, ordered(entry)]))
  }

  console.log(`\nNouns: ${entries.size} entries (${deckOnly} only in the practice deck)`)
  const print = (title, lines) => {
    console.log(`\n${title}: ${lines.length}`)
    lines.forEach((line) => console.log(`  ${line}`))
  }
  print('Same word listed twice (merged)', report.merged)
  print('Homonyms (same spelling twice in one list)', report.homonyms)
  print('Differences (the first source was kept)', report.differences)
  print('Not found in the PDF text (page range used; check in task 2.4.2)', report.notInPdf)

  if (WRITE) {
    fs.writeFileSync(OUT_FILE, JSON.stringify(lexicon, null, 2) + '\n')
    console.log(`\nWrote ${path.relative(ROOT, OUT_FILE)}`)
  } else console.log('\n(report only; add --write to create the file)')
}

main()
