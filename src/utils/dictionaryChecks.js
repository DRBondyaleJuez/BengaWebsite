/**
 * Checks shown in the word and sentence forms of /admin/living-dictionary (task L4.8):
 * orthography warnings, the completeness checklist, and the lookups for the card «En la web»
 * (book gloss, pages that use a word). Pure functions (the data comes in as arguments); tests in
 * scripts/tests/dictionaryChecks.test.mjs. Warnings only: nothing here ever changes Benga text.
 */
import { toAudioId } from './audioId.js'
import { plain } from './dictionaryFilters.js'

const NOT_BENGA = /[cqrxzñ]/gi
const SPANISH_ACCENTS = /[áéíóú]/gi

/**
 * Warnings for a Benga text (AGENTS.md, Benga orthography rules): letters that are not Benga
 * (c q r x z ñ) and Spanish accents (á é í ó ú; Benga writes â ē ū). Texts written with a
 * decomposed accent are compared as NFC. Returns Spanish messages, [] when all looks right.
 */
export function orthographyWarnings(text) {
  const value = String(text ?? '').normalize('NFC')
  const unique = (matches) => [...new Set((matches || []).map((letter) => letter.toLowerCase()))]
  const warnings = []
  const letters = unique(value.match(NOT_BENGA))
  if (letters.length) {
    warnings.push(
      `Tiene ${letters.map((letter) => `«${letter}»`).join(', ')}: el benga no usa c, q, r, x, z ni ñ. Solo es un aviso, no se corrige solo.`
    )
  }
  const accents = unique(value.match(SPANISH_ACCENTS))
  if (accents.length) {
    warnings.push(
      `Tiene ${accents.map((letter) => `«${letter}»`).join(', ')}: en benga las vocales con marca son â, ē y ū (no á é í ó ú). Solo es un aviso, no se corrige solo.`
    )
  }
  return warnings
}

/** Warnings of the fields of one sense that hold Benga text. */
export function senseWarnings(sense) {
  return {
    pluralForm: orthographyWarnings(sense.pluralForm),
    variant: orthographyWarnings(sense.variant)
  }
}

const everySense = (entry, test) => (entry.senses || []).every(test)
const firstSenseWithout = (entry, test) => (entry.senses || []).findIndex((sense) => !test(sense))

/**
 * The completeness checklist of a word: translation es/en/fr, part of speech and domain in every
 * sense, audio, an example. `target` is the id of the card to jump to (the first sense that lacks
 * it, for the per-sense items).
 * @returns {{ id: string, label: string, ok: boolean, target: string }[]}
 */
export function entryChecklist(entry) {
  const perSense = (id, label, test) => {
    const index = firstSenseWithout(entry, test)
    return {
      id,
      label,
      ok: everySense(entry, test),
      target: `sentido-${index < 0 ? 1 : index + 1}`
    }
  }
  return [
    perSense('es', 'Español', (sense) => Boolean(sense.glosses?.es)),
    perSense('en', 'Inglés', (sense) => Boolean(sense.glosses?.en)),
    perSense('fr', 'Francés', (sense) => Boolean(sense.glosses?.fr)),
    perSense('pos', 'Categoría', (sense) => (sense.partsOfSpeech || []).length > 0),
    perSense('domain', 'Dominio', (sense) => (sense.semanticDomains || []).length > 0),
    { id: 'audio', label: 'Audio', ok: (entry.audio || []).length > 0, target: 'card-audio' },
    {
      id: 'example',
      label: 'Ejemplo',
      ok: (entry.senses || []).some((sense) => (sense.sentenceIds || []).length > 0),
      target: 'card-ejemplos'
    }
  ]
}

/**
 * The book's own gloss of a dictionary word, read from the site's lexicon (nouns of chapter 2,
 * adjectives of chapter 3), looked up by the audio key of the headword, its plural or the
 * entry's site keys. Read only.
 * @returns {{ kind: 'noun'|'adjective', id: string, word: string, plural: boolean,
 *             meaning: object, nounClass?: number }|null}
 */
export function bookGloss(entry, { nouns = {}, adjectives = {} }, extraKeys = []) {
  const keys = new Set(
    [
      toAudioId(entry.lexeme),
      ...(entry.senses || []).map((sense) => toAudioId(sense.pluralForm)),
      ...extraKeys
    ].filter(Boolean)
  )
  for (const [id, noun] of Object.entries(nouns)) {
    if (keys.has(id) || keys.has(toAudioId(noun.singular?.word))) {
      return {
        kind: 'noun',
        id,
        word: noun.singular?.word,
        plural: false,
        meaning: noun.meaning || {},
        nounClass: noun.nounClass
      }
    }
    if (noun.plural?.word && keys.has(toAudioId(noun.plural.word))) {
      return {
        kind: 'noun',
        id,
        word: noun.plural.word,
        plural: true,
        meaning: noun.meaningPlural || noun.meaning || {},
        nounClass: noun.nounClass
      }
    }
  }
  for (const [id, adjective] of Object.entries(adjectives)) {
    if (keys.has(id) || keys.has(toAudioId(adjective.word))) {
      return {
        kind: 'adjective',
        id,
        word: adjective.word,
        plural: false,
        meaning: adjective.meaning || {}
      }
    }
  }
  return null
}

/** The dictionary's glosses of a language, all senses together ("Árbol · Madera"). */
export function dictionaryGloss(entry, lang) {
  return (entry.senses || [])
    .map((sense) => sense.glosses?.[lang])
    .filter(Boolean)
    .join(' · ')
}

/** Do the book's gloss and the dictionary's say the same (ignoring case and accents)? */
export const sameGloss = (book, dictionary) =>
  Boolean(book) && Boolean(dictionary) && plain(book) === plain(dictionary)

/**
 * The pages of the site that show a word, from the files word-usage.json lists for it.
 * Lexicon files have no page of their own: a noun is shown by its class page, an adjective by the
 * regular or invariable adjectives page. `sections` are the sections of chapters-index.json
 * ({ path, title, sectionFile?, component? }).
 * @returns {{ path: string, title: string }[]} without repeats, in the order found
 */
export function sitePages(usedIn, { sections = [], noun = null, adjective = null } = {}) {
  const byPath = new Map(sections.map((section) => [section.path, section]))
  const bySectionFile = new Map(
    sections.filter((s) => s.sectionFile).map((s) => [`src/data/${s.sectionFile}`, s])
  )
  const byComponent = new Map(
    sections.filter((s) => s.component).map((s) => [`src/views/${s.component}`, s])
  )
  const dataPages = {
    'src/data/chapter-1/alphabet.json': '/capitulo-1/alfabeto',
    'src/data/chapter-2/irregular-nouns.json': '/capitulo-2/irregulares',
    'src/data/chapter-2/verbal-nouns.json': '/capitulo-2/verbales',
    'src/data/chapter-3/regular-adjectives.json': '/capitulo-3/adjetivos-regulares',
    'src/data/chapter-3/invariable-adjectives.json': '/capitulo-3/adjetivos-invariables',
    'src/data/chapter-3/comparatives-superlatives.json': '/capitulo-3/comparativos-superlativos',
    'src/data/chapter-3/numerals-ordinals.json': '/capitulo-3/numerales-ordinales'
  }
  const pages = []
  const add = (section) => {
    if (section && !pages.some((page) => page.path === section.path)) {
      pages.push({ path: section.path, title: section.title })
    }
  }
  for (const file of usedIn || []) {
    if (file === 'src/data/lexicon/nouns.json') {
      if (noun?.nounClass) add(byPath.get(`/capitulo-2/clase-${noun.nounClass}`))
    } else if (file === 'src/data/lexicon/adjectives.json') {
      if (adjective) {
        add(
          byPath.get(
            adjective.kind === 'invariable'
              ? '/capitulo-3/adjetivos-invariables'
              : '/capitulo-3/adjetivos-regulares'
          )
        )
      }
    } else {
      add(bySectionFile.get(file) || byComponent.get(file) || byPath.get(dataPages[file]))
    }
  }
  return pages
}
