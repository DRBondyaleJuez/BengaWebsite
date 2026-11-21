/**
 * Finds every Benga word that the website shows together with an audio id.
 *
 * It reads two kinds of files:
 *   - src/data/**\/*.json        content stored as data
 *   - src/data/lexicon/*.json    lexicon files: every singular / plural / word (no audio ids there)
 *   - src/data/sections/**       section files: every "word" and "benga" text
 *   - src/views/**\/*.vue        content still written inside a page's data() block
 *                               (TODO(task 2.4): once all content lives in JSON, drop this part)
 *
 * A "word" is recognised by its audio field. Every pair below is understood:
 *   { word: 'Epokolo', audio: 'epokolo' }                  (also bengaForm / audioId)
 *   { singular: 'Ekâi', singularAudioId: 'ek_a_i' }        (<name> + <name>AudioId)
 *   { imperative: 'Kalaka', imperativeAudio: 'kalaka' }    (<name> + <name>Audio)
 *   { nominalForm: 'ikala', nominalAudio: 'ikala' }        (<name>Form + <name>Audio)
 * Words typed directly in a template are found too:  <BengaWord word="ulongi" />
 *
 * Each result: { word, storedAudioId, file, path }
 *   storedAudioId = the audio id typed next to the word (null for template words)
 *   path          = where inside the file, e.g. "mainExamples[2].singular"
 */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { inflect } from '../../src/utils/concord.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SRC = path.join(ROOT, 'src')

/** Keys that hold the word itself when the audio key is just "audio" / "audioId". */
const PLAIN_WORD_KEYS = ['word', 'bengaForm', 'bengaSentence', 'benga', 'form', 'text']
/**
 * Fields that hold a Benga word in the data files that no longer carry audio ids (task 4.1):
 * only the files of PLAIN_WORD_FILES, whose pages show these words with BengaWord.
 */
const BENGA_FIELDS = [
  'word',
  'bengaForm',
  'bengaSentence',
  'imperative',
  'nominalForm',
  'actionForm'
]
const PLAIN_WORD_FILES = /chapter-2[\\/](irregular-nouns|verbal-nouns)\.json$/
const PLAIN_AUDIO_KEYS = ['audio', 'audioId']
const PREFIXED_AUDIO_KEY = /^(.+?)Audio(Id)?$/

/** Files in src/data/lexicon that list words but are not lexicon files. */
const LEXICON_META_FILES = ['word-registry.json', 'word-usage.json']

/**
 * Lexicon files (nouns.json…) have no audio ids: every form of every entry is a word the site
 * shows (e.g. the practice game builds its cards from nouns.json).
 */
function lexiconWords(file) {
  const relativeFile = path.relative(ROOT, file).replace(/\\/g, '/')
  const results = []
  for (const [id, entry] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')).entries)) {
    for (const form of ['singular', 'plural']) {
      if (entry[form]?.word)
        results.push({
          word: entry[form].word,
          storedAudioId: null,
          file: relativeFile,
          path: `${id}.${form}`
        })
    }
    if (entry.word)
      results.push({ word: entry.word, storedAudioId: null, file: relativeFile, path: id })
  }
  return results
}

/**
 * Phrases a page COMPUTES instead of storing: the chapter-3 table «noun + adjective» for every
 * class (regular-adjectives.json → commonAdjectives + exampleNouns, forms from the lexicon with
 * the concord rule of src/utils/concord.js). Same result as RegularAdjectivesSection.vue.
 */
function concordPhrases(data) {
  if (!Array.isArray(data.commonAdjectives) || !data.exampleNouns) return []
  const lexicon = JSON.parse(
    fs.readFileSync(path.join(SRC, 'data/lexicon/adjectives.json'), 'utf8')
  ).entries
  const results = []
  for (const id of data.commonAdjectives) {
    const adjective = lexicon[id]
    if (!adjective) continue
    for (const [nounClass, nouns] of Object.entries(data.exampleNouns)) {
      for (const number of ['singular', 'plural']) {
        const word = `${nouns[number]} ${inflect(adjective, Number(nounClass), number)}`
        results.push({
          word,
          storedAudioId: null,
          path: `commonAdjectives(${id}).${nounClass}.${number}`
        })
      }
    }
  }
  return results
}

/**
 * Section files have no audio ids either: every `word` (example items, sound cards) and every
 * `benga` (table cells, dialogue lines) is a Benga text the site shows. Words given by lexicon id
 * ("entries") are found through the lexicon files.
 */
function sectionWords(file) {
  const relativeFile = path.relative(ROOT, file).replace(/\\/g, '/')
  const results = []
  const walk = (value, where) => {
    if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${where}[${index}]`))
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        if ((key === 'word' || key === 'benga') && typeof child === 'string')
          results.push({ word: child.trim(), storedAudioId: null, file: relativeFile, path: where })
        else walk(child, where ? `${where}.${key}` : key)
      }
    }
  }
  walk(JSON.parse(fs.readFileSync(file, 'utf8')), '')
  return results
}

/** Folders of pages that show no Benga content (the admin page lists the registry itself). */
const IGNORED_VIEW_FOLDERS = [/[\\/]views[\\/]admin[\\/]/]

/** <BengaWord ... word="ulongi" ...>  (a fixed word, not :word="variable") */
const TEMPLATE_WORD = /<BengaWord\b[^>]*?\sword="([^"]+)"/g

function listFiles(dir, extension) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...listFiles(full, extension))
    else if (entry.name.endsWith(extension)) found.push(full)
  }
  return found
}

/** Walks any value and collects { word, storedAudioId, path } pairs. */
function findPairs(value, currentPath, results, plainFields = false) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findPairs(item, `${currentPath}[${index}]`, results, plainFields)
    )
    return
  }
  if (!value || typeof value !== 'object') return

  for (const [key, audioValue] of Object.entries(value)) {
    if (typeof audioValue !== 'string') continue
    let word
    if (PLAIN_AUDIO_KEYS.includes(key)) {
      const wordKey = PLAIN_WORD_KEYS.find((candidate) => typeof value[candidate] === 'string')
      word = wordKey ? value[wordKey] : null
    } else {
      const match = key.match(PREFIXED_AUDIO_KEY)
      if (!match) continue
      const prefix = match[1]
      word = typeof value[prefix] === 'string' ? value[prefix] : value[`${prefix}Form`]
    }
    if (typeof word === 'string' && word.trim()) {
      results.push({ word: word.trim(), storedAudioId: audioValue, path: currentPath || '(root)' })
    }
  }
  // Content moved to JSON without the (legacy) audio ids: the Benga fields themselves
  const hasAudio = Object.keys(value).some(
    (key) => PLAIN_AUDIO_KEYS.includes(key) || PREFIXED_AUDIO_KEY.test(key)
  )
  if (plainFields && !hasAudio) {
    for (const key of BENGA_FIELDS) {
      if (typeof value[key] === 'string' && value[key].trim())
        results.push({
          word: value[key].trim(),
          storedAudioId: null,
          path: `${currentPath}.${key}`
        })
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === 'object') {
      findPairs(child, currentPath ? `${currentPath}.${key}` : key, results, plainFields)
    }
  }
}

/**
 * Runs the <script> of a .vue file in a sandbox and returns what data() returns.
 * Imports of JSON files are loaded for real; any other import becomes an empty stub.
 */
function readVueData(file) {
  const source = fs.readFileSync(file, 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)
  if (!script) return null

  const requireJson = createRequire(file)
  const code = script[1]
    .replace(/^import\s+(\w+)\s+from\s+['"](@\/[^'"]+\.json)['"];?/gm, (_, name, jsonPath) => {
      return `const ${name} = __json(${JSON.stringify(jsonPath)})`
    })
    // Other imports (components, helpers) are not needed to read data(): replace them by stubs.
    .replace(/^import\s+(\w+)\s+from\s+['"][^'"]+['"];?/gm, 'const $1 = {}')
    .replace(/^import\s+\{([^}]*)\}\s+from\s+['"][^'"]+['"];?/gm, (_, names) => {
      return names
        .split(',')
        .map((name) =>
          name
            .trim()
            .split(/\s+as\s+/)
            .pop()
        )
        .filter(Boolean)
        .map((name) => `const ${name} = undefined`)
        .join('\n')
    })
    .replace(/export\s+default\s+/, 'module.exports = ')

  const sandbox = {
    module: { exports: {} },
    __json: (aliasPath) => requireJson(path.join(SRC, aliasPath.slice(2))),
    console
  }
  try {
    vm.runInNewContext(code, sandbox, { filename: file, timeout: 2000 })
    const component = sandbox.module.exports
    if (typeof component.data !== 'function') return null
    const fakeThis = { $t: (key) => key, $route: { params: {}, query: {} } }
    return component.data.call(fakeThis)
  } catch (error) {
    console.warn(`  ! could not read data() of ${path.relative(ROOT, file)}: ${error.message}`)
    return null
  }
}

/** @returns {{ word: string, storedAudioId: string, file: string, path: string }[]} */
export function collectWords() {
  const results = []

  for (const file of listFiles(path.join(SRC, 'data'), '.json')) {
    if (file.includes(`${path.sep}lexicon${path.sep}`)) {
      if (!LEXICON_META_FILES.includes(path.basename(file))) results.push(...lexiconWords(file))
      continue // the registry itself is not content
    }
    if (file.includes(`${path.sep}schemas${path.sep}`)) continue // schemas and their examples are not site content
    if (file.includes(`${path.sep}sections${path.sep}`)) {
      results.push(...sectionWords(file))
      continue
    }
    const pairs = []
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    findPairs(data, '', pairs, PLAIN_WORD_FILES.test(file))
    pairs.push(...concordPhrases(data))
    pairs.forEach((pair) =>
      results.push({ ...pair, file: path.relative(ROOT, file).replace(/\\/g, '/') })
    )
  }

  for (const file of listFiles(path.join(SRC, 'views'), '.vue')) {
    if (IGNORED_VIEW_FOLDERS.some((pattern) => pattern.test(file))) continue
    const pairs = []
    const data = readVueData(file)
    if (data) findPairs(data, '', pairs)
    const template = fs.readFileSync(file, 'utf8')
    for (const match of template.matchAll(TEMPLATE_WORD)) {
      pairs.push({ word: match[1].trim(), storedAudioId: null, path: '<template>' })
    }
    pairs.forEach((pair) =>
      results.push({ ...pair, file: path.relative(ROOT, file).replace(/\\/g, '/') })
    )
  }

  return results
}

export { ROOT, readVueData }
