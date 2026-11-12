/**
 * Loads the content schemas (src/data/schemas/*.schema.json) into one JSON Schema checker (Ajv).
 * Used by the schema tests now and by the content validator later (roadmap task 2.3).
 *
 *   const check = loadSchemas()
 *   const result = check('lexicon', data)   // → { valid: true } or { valid: false, errors: [...] }
 */
import fs from 'node:fs'
import path from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import { ROOT } from './collect-words.mjs'

export const SCHEMA_DIR = path.join(ROOT, 'src/data/schemas')

/** Schema names = file names without ".schema.json": common, lexicon, section, exercise, chapters-index */
export function loadSchemas() {
  const ajv = new Ajv2020({
    allErrors: true, // report every problem, not only the first
    discriminator: true, // pick the right entry/block type from its "type" field → clearer errors
    strict: true, // reject typos in the schemas themselves (unknown keywords)
    strictTypes: false, // shared field lists (e.g. commonFields) don't repeat "type": "object"
    strictRequired: false
  })
  const names = []
  for (const file of fs.readdirSync(SCHEMA_DIR).filter((name) => name.endsWith('.schema.json'))) {
    ajv.addSchema(JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf8')))
    names.push(file.replace('.schema.json', ''))
  }

  return function check(name, data) {
    if (!names.includes(name))
      throw new Error(`Unknown schema "${name}". Known: ${names.join(', ')}`)
    const validate = ajv.getSchema(`https://benga-grammar.local/schemas/${name}.schema.json`)
    const valid = validate(data)
    return { valid, errors: valid ? [] : validate.errors.map(describeError) }
  }
}

/** Turns an Ajv error into one readable line, e.g. "/entries/miba/meaning: must have required property 'es'". */
function describeError(error) {
  const where = error.instancePath || '(file)'
  const extra =
    error.params && error.params.allowedValues ? ` ${error.params.allowedValues.join(' | ')}` : ''
  return `${where}: ${error.message}${extra}`
}

/** The word a lexicon entry is filed under (its id is the word key of this word). */
export function baseWordOf(entry) {
  if (entry.type === 'noun') return (entry.singular || entry.plural).word
  return entry.word
}
