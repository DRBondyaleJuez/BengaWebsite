/**
 * Turns the site's translatable texts into a flat list of rows, for the translations admin page
 * (/admin/translations). Pure functions, no imports; tested in scripts/tests/translationRows.test.mjs.
 *
 * A row is ONE text in ONE place, with its three languages side by side:
 *
 *   { id, kind: 'ui' | 'data', file, path, location,
 *     texts: { es, en, fr },          // '' when a language is missing
 *     benga: { field, value, path } | null,   // the Benga word the text is about (data files only)
 *     route, pdfPages }               // page of the site where it is shown, PDF page(s) of the book
 *
 *  kind 'ui'   = a message of src/locales/<lang>.json   (path = the key split at the dots)
 *  kind 'data' = a { es, en, fr } object of a data file (path = where the object is in the file)
 *
 * `fieldAddress(row, lang)` says which file and path hold one of the row's languages, which is what
 * the save endpoint needs. Guide: docs/TRANSLATIONS.md
 */

export const LANGUAGES = ['es', 'en', 'fr']

/**
 * Fields that hold a Benga word, in the order they are tried when looking for "the Benga word this
 * text is about" next to a text. (Benga words are never translated, see AGENTS.md.)
 */
export const BENGA_FIELDS = [
  'word',
  'bengaForm',
  'bengaSentence',
  'benga',
  'imperative',
  'nominalForm',
  'actionForm',
  'example'
]

/** Some texts are about one particular Benga field, not the first one found. */
const BENGA_FIELD_OF_TEXT = {
  imperativeMeaning: ['imperative'],
  actionFormMeaning: ['actionForm']
}

/** Page of the site (route) of each `pages.<name>` group of es.json. Other groups are shared. */
export const UI_PAGE_ROUTES = {
  chapter1Index: '/capitulo-1',
  alphabet: '/capitulo-1/alfabeto',
  chapter2Index: '/capitulo-2',
  nounsIntro: '/capitulo-2/introduccion',
  nounClass: '/capitulo-2/clase-1',
  irregularNouns: '/capitulo-2/irregulares',
  verbalNouns: '/capitulo-2/verbales',
  practice: '/capitulo-2/practica',
  chapter3Index: '/capitulo-3',
  regularAdjectives: '/capitulo-3/adjetivos-regulares',
  invariableAdjectives: '/capitulo-3/adjetivos-invariables',
  comparatives: '/capitulo-3/comparativos-superlativos',
  numerals: '/capitulo-3/numerales-ordinales',
  home: '/',
  about: '/sobre-el-autor',
  resources: '/recursos'
}

/** Data files that are drawn by one fixed page (section files come from chapters-index.json). */
const STATIC_FILE_ROUTES = {
  'author-info.json': '/sobre-el-autor',
  'chapter-1/alphabet.json': '/capitulo-1/alfabeto',
  'chapter-2/irregular-nouns.json': '/capitulo-2/irregulares',
  'chapter-2/verbal-nouns.json': '/capitulo-2/verbales',
  'chapter-3/regular-adjectives.json': '/capitulo-3/adjetivos-regulares',
  'chapter-3/invariable-adjectives.json': '/capitulo-3/adjetivos-invariables',
  'chapter-3/comparatives-superlatives.json': '/capitulo-3/comparativos-superlativos',
  'chapter-3/numerals-ordinals.json': '/capitulo-3/numerales-ordinales'
}

/** PDF pages of data files that do not record them themselves (AGENTS.md → Source of Truth). */
const STATIC_FILE_PDF_PAGES = {
  'chapter-2/irregular-nouns.json': '14',
  'chapter-2/verbal-nouns.json': '14-15',
  'chapter-3/regular-adjectives.json': '18'
}

/**
 * { 'chapter-2/…json': '/capitulo-2/…' } for every data file that has its own page:
 * the fixed ones above plus the section files listed in chapters-index.json.
 */
export function fileRoutes(chaptersIndex) {
  const routes = { ...STATIC_FILE_ROUTES }
  for (const chapter of chaptersIndex.chapters) {
    for (const section of chapter.sections) {
      if (section.sectionFile) routes[section.sectionFile] = section.path
    }
  }
  return routes
}

/** True for a translated text: { es: '…' } plus optional en / fr (and nothing else). */
export function isTranslatedText(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.es === 'string' &&
    Object.keys(value).every((key) => LANGUAGES.includes(key))
  )
}

/** ['blocks', 0, 'text'] → 'blocks[0].text' */
export function pathToString(path) {
  return path.reduce(
    (text, part) =>
      typeof part === 'number' ? `${text}[${part}]` : text ? `${text}.${part}` : part,
    ''
  )
}

/** The page that shows a lexicon entry: its noun class page, or the page of its kind. */
function lexiconRoute(file, entry) {
  if (file === 'lexicon/adjectives.json') {
    return entry.kind === 'invariable'
      ? '/capitulo-3/adjetivos-invariables'
      : '/capitulo-3/adjetivos-regulares'
  }
  if (Number.isInteger(entry.nounClass)) return `/capitulo-2/clase-${entry.nounClass}`
  const verbal = (entry.tags || []).includes('verbal-noun')
  return verbal ? '/capitulo-2/verbales' : '/capitulo-2/irregulares'
}

/** The Benga word a text is about: found in the object that holds the text (or in the entry). */
function findBenga(path, parents) {
  const key = path[path.length - 1]
  const holder = parents[parents.length - 1] // the object that contains the { es } text
  if (!holder || Array.isArray(holder)) return null
  const preferred = BENGA_FIELD_OF_TEXT[key] || BENGA_FIELDS
  for (const field of preferred) {
    if (typeof holder[field] === 'string' && holder[field].trim()) {
      return { field, value: holder[field], path: [...path.slice(0, -1), field] }
    }
  }
  return null
}

/** Lexicon entries: «meaning» is about the singular, «meaningPlural» about the plural (the other one when a word has only one form). */
function findLexiconBenga(entryPath, entry, key) {
  const forms = key === 'meaningPlural' ? ['plural', 'singular'] : ['singular', 'plural']
  for (const form of forms) {
    const value = entry[form]
    if (value && typeof value === 'object' && typeof value.word === 'string' && value.word) {
      return {
        field: form === 'plural' ? 'plural' : 'word',
        value: value.word,
        path: [...entryPath, form, 'word']
      }
    }
  }
  // adjectives: the word sits in the entry itself
  if (typeof entry.word === 'string' && entry.word) {
    return { field: 'word', value: entry.word, path: [...entryPath, 'word'] }
  }
  return null
}

/**
 * Every translatable text of one data file.
 * @param {string} file  path inside src/data, e.g. 'lexicon/nouns.json'
 * @param {object} data  the parsed file
 * @param {object} [options] { routes: fileRoutes(chaptersIndex) }
 */
export function scanData(file, data, options = {}) {
  const routes = options.routes || {}
  const rows = []
  const isLexicon = file.startsWith('lexicon/') && data && data.entries
  const fileRoute = routes[file] || null
  const filePages =
    (data && data.source && data.source.pdfPage) || STATIC_FILE_PDF_PAGES[file] || null

  const walk = (value, path, parents) => {
    if (isTranslatedText(value)) {
      if (!value.es.trim()) return
      const key = path[path.length - 1]
      let route = fileRoute
      let pdfPages = filePages
      let benga = findBenga(path, parents)
      if (isLexicon && path[0] === 'entries') {
        const entry = data.entries[path[1]]
        const entryPath = ['entries', path[1]]
        route = lexiconRoute(file, entry)
        pdfPages = (entry.source && entry.source.pdfPage) || null
        if (path.length === 3) benga = findLexiconBenga(entryPath, entry, key)
      }
      rows.push({
        id: `${file}#${pathToString(path)}`,
        kind: 'data',
        file,
        path,
        location: pathToString(path),
        texts: { es: value.es, en: value.en || '', fr: value.fr || '' },
        benga,
        route,
        pdfPages: pdfPages === null ? null : String(pdfPages)
      })
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, [...path, index], [...parents, value]))
    } else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value))
        walk(item, [...path, key], [...parents, value])
    }
  }
  walk(data, [], [])
  return rows
}

/** { 'a.b': 'text' } for a locale file (only text values). */
function flatten(messages, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(messages || {})) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') flatten(value, path, out)
    else if (typeof value === 'string') out[path] = value
  }
  return out
}

/** The page of the site that uses a message: `pages.<name>.…` → its page; shared messages → null. */
export function uiRoute(key) {
  const parts = key.split('.')
  if (parts[0] === 'pages') return UI_PAGE_ROUTES[parts[1]] || null
  return null
}

/** Every message of the locale files, one row each. `locales` = { es, en, fr } (parsed files). */
export function scanLocales(locales) {
  const es = flatten(locales.es)
  const en = flatten(locales.en)
  const fr = flatten(locales.fr)
  return Object.entries(es)
    .filter(([, text]) => text.trim())
    .map(([key, text]) => ({
      id: `ui:${key}`,
      kind: 'ui',
      file: 'src/locales',
      path: key.split('.'),
      location: key,
      texts: { es: text, en: en[key] || '', fr: fr[key] || '' },
      benga: null,
      route: uiRoute(key),
      pdfPages: null
    }))
}

/**
 * Where to read or write one language of a row (file relative to the repository root):
 *   data → { file: 'src/data/lexicon/nouns.json', path: ['entries', 'bova', 'meaning', 'en'] }
 *   ui   → { file: 'src/locales/en.json',         path: ['pages', 'home', 'welcome'] }
 */
export function fieldAddress(row, lang) {
  if (row.kind === 'ui') return { file: `src/locales/${lang}.json`, path: row.path }
  return { file: `src/data/${row.file}`, path: [...row.path, lang] }
}

/** Where the Benga word of a row is stored (always a data file). */
export function bengaAddress(row) {
  return row.benga ? { file: `src/data/${row.file}`, path: row.benga.path } : null
}

/** '8-9' / '8' / 8 → { from: 8, to: 9 }; anything else → null */
export function parsePages(pages) {
  const match = /^(\d+)(?:\s*[-–]\s*(\d+))?$/.exec(String(pages ?? '').trim())
  if (!match) return null
  const from = Number(match[1])
  return { from, to: match[2] ? Number(match[2]) : from }
}

/**
 * Book page of a PDF page. In the part of the book from the noun section on, printed page = PDF
 * page + 6 (AGENTS.md, REVIEW-LOG R-020); before that nobody has checked the offset.
 */
export function printedPage(pdfPage) {
  return pdfPage >= 8 ? pdfPage + 6 : null
}

/**
 * The doubts (docs/translations/doubts.json) that apply to a row: a doubt lists the Spanish text(s)
 * it is about, in `es` (one text or a list); the same Spanish text in several places matches in all.
 */
export function doubtsOfRow(row, doubts) {
  const spanish = row.texts.es.trim()
  return doubts.filter((doubt) => {
    if (doubt.es === undefined || doubt.es === null) return false
    const list = Array.isArray(doubt.es) ? doubt.es : [doubt.es]
    return list.some((text) => text.trim() === spanish)
  })
}

/**
 * The doubts after ticking «resuelta» on some Spanish texts: those texts leave the doubt; a doubt
 * with no text left disappears. `resolved` = { '<doubt id>': ['Spanish text', …] }, and a note
 * without any text (a general note) is resolved with `{ '<id>': true }`.
 */
export function resolveDoubts(doubts, resolved) {
  const result = []
  for (const doubt of doubts) {
    const done = resolved[doubt.id]
    if (!done) {
      result.push(doubt)
    } else if (done === true || doubt.es === undefined || doubt.es === null) {
      // the whole doubt is resolved
    } else if (Array.isArray(doubt.es)) {
      const left = doubt.es.filter((text) => !done.includes(text))
      if (left.length) result.push({ ...doubt, es: left })
    } else if (!done.includes(doubt.es)) {
      result.push(doubt)
    }
  }
  return result
}

/**
 * A Spanish text was edited: the doubts about the old text now follow the new one (otherwise they
 * would match nothing and be forgotten).
 */
export function renameInDoubts(doubts, from, to) {
  return doubts.map((doubt) => {
    if (doubt.es === undefined || doubt.es === null) return doubt
    if (Array.isArray(doubt.es)) {
      return doubt.es.includes(from)
        ? { ...doubt, es: doubt.es.map((text) => (text === from ? to : text)) }
        : doubt
    }
    return doubt.es === from ? { ...doubt, es: to } : doubt
  })
}
