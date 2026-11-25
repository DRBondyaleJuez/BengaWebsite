/**
 * Registers the Salvado y Cos book as a citation source on the Living Dictionary (task L0.4).
 *
 *   npm run ld:source              shows the record and whether it already exists (read only)
 *   npm run ld:source -- --create  creates it (only after the developer approved the record)
 *
 * Needs LD_API_KEY in .env.local. The record itself is LD_BOOK_SOURCE in src/config/ld.js.
 */
import { loadEnvLocal } from './lib/cloudinary.mjs'
import { ldClient } from './lib/ld/client.mjs'
import { LD_BOOK_SOURCE, LD_DICTIONARY_ID } from '../src/config/ld.js'

loadEnvLocal()
const apiKey = process.env.LD_API_KEY
if (!apiKey) {
  console.error('Falta LD_API_KEY=ldk_… en .env.local')
  process.exit(1)
}
const dictionary = process.env.LD_DICTIONARY_ID || LD_DICTIONARY_ID
const client = ldClient({ apiKey, dictionary })

console.log('Fuente que se registra en el diccionario:\n')
console.log(JSON.stringify(LD_BOOK_SOURCE, null, 2))

const { sources = [] } = await client.sources()
const existing = sources.find((source) => source.slug === LD_BOOK_SOURCE.slug)
if (existing) {
  console.log(`\nYa existe en «${dictionary}» (id ${existing.id}). Nada que hacer.`)
} else if (process.argv.includes('--create')) {
  const created = await client.createSource(LD_BOOK_SOURCE)
  console.log(`\nCreada en «${dictionary}»:`, created?.source?.id || created?.id || 'ok')
} else {
  console.log(`\nAún no existe en «${dictionary}». Para crearla: npm run ld:source -- --create`)
}
