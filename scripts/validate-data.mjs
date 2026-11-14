/**
 * npm run validate             → check all content and print a report (exit code 1 if there are errors)
 * npm run validate -- --all    → also print every line of long groups (normally the first 10)
 *
 * What it reads:
 *   src/data/chapters-index.json
 *   src/data/lexicon/word-registry.json
 *   src/data/lexicon/*.json          (every other file there is a lexicon file; from task 2.4)
 *   src/data/sections/**\/*.json     (from Phase 3)
 *   src/data/exercises/*.json        (from Phase 8)
 *   the Benga words of the current pages (same collector as `npm run words:sync`)
 *
 * The checks themselves are in scripts/lib/validate.mjs; this file only loads and prints.
 * How to read the report: docs/CONTENT-GUIDE.md → "Checking files".
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, collectWords } from './lib/collect-words.mjs'
import { loadSchemas } from './lib/schemas.mjs'
import { validateContent, CHECKS } from './lib/validate.mjs'

const SHOW_ALL = process.argv.includes('--all')
const LINES_PER_GROUP = 10
/** Files in src/data/lexicon that are not lexicon files. */
const NOT_LEXICON = ['word-registry.json', 'word-usage.json']

const relative = (file) => path.relative(ROOT, file).replace(/\\/g, '/')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

function listJson(dir, recursive = false) {
  if (!fs.existsSync(dir)) return []
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && recursive) found.push(...listJson(full, true))
    else if (entry.isFile() && entry.name.endsWith('.json')) found.push(full)
  }
  return found
}

/** Reads every file of a kind into { "relative/path.json": data }. Unreadable JSON becomes an error. */
function loadAll(files, unreadable) {
  const result = {}
  for (const file of files) {
    try {
      result[relative(file)] = readJson(file)
    } catch (error) {
      unreadable.push({ file: relative(file), message: error.message })
    }
  }
  return result
}

function main() {
  const data = path.join(ROOT, 'src/data')
  const unreadable = []
  const optional = (file) =>
    fs.existsSync(file) ? loadAll([file], unreadable)[relative(file)] : null

  const content = {
    chaptersIndex: optional(path.join(data, 'chapters-index.json')),
    registry: optional(path.join(data, 'lexicon/word-registry.json')),
    lexicons: loadAll(
      listJson(path.join(data, 'lexicon')).filter(
        (file) => !NOT_LEXICON.includes(path.basename(file))
      ),
      unreadable
    ),
    sections: loadAll(listJson(path.join(data, 'sections'), true), unreadable),
    exercises: loadAll(listJson(path.join(data, 'exercises')), unreadable),
    pageWords: collectWords(),
    fileExists: (relativePath) => fs.existsSync(path.join(ROOT, relativePath))
  }

  const { problems, stats } = validateContent(content, loadSchemas())
  for (const { file, message } of unreadable) {
    problems.unshift({
      level: 'error',
      check: 'schema',
      file,
      where: '(file)',
      message: `Not valid JSON: ${message}`,
      fix: 'Look for a missing comma or quote near the position shown'
    })
    stats.errors++
  }

  printReport(problems, stats)
  if (stats.errors > 0) process.exitCode = 1
}

function printReport(problems, stats) {
  const icon = { error: '✗', warning: '⚠', info: 'ℹ' }
  console.log('Content check')
  console.log(
    `  read: chapters-index, word registry (${stats.registryWords} words), ` +
      `${stats.lexiconFiles} lexicon file(s) (${stats.lexiconEntries} entries), ` +
      `${stats.sectionFiles} section file(s), ${stats.exerciseFiles} exercise file(s), ` +
      `${stats.pageWords} Benga words on the current pages`
  )

  for (const [check, title] of Object.entries(CHECKS)) {
    const group = problems.filter((problem) => problem.check === check)
    if (!group.length) {
      console.log(`\n✓ ${title}`)
      continue
    }
    const worst = ['error', 'warning', 'info'].find((level) => group.some((p) => p.level === level))
    console.log(`\n${icon[worst]} ${title} (${group.length})`)
    const shown = SHOW_ALL ? group : group.slice(0, LINES_PER_GROUP)
    for (const problem of shown) {
      console.log(`  ${icon[problem.level]} ${problem.file} → ${problem.where}`)
      console.log(`      ${problem.message}`)
      if (problem.fix)
        console.log(`      ${problem.level === 'info' ? 'Note' : 'Fix'}: ${problem.fix}`)
    }
    if (shown.length < group.length) {
      console.log(`  … and ${group.length - shown.length} more (npm run validate -- --all)`)
    }
  }

  console.log(
    `\n${stats.errors ? '✗' : '✓'} ${stats.errors} error(s), ${stats.warnings} warning(s), ${stats.infos} note(s)`
  )
  if (stats.errors)
    console.log('  Errors must be fixed; warnings need a human look; notes are known leftovers.')
}

main()
