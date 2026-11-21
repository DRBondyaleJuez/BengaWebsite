/**
 * npm run audio:sync                      → ask Cloudinary which recordings exist and mark those
 *                                           words as "recorded" in the word registry
 * npm run audio:sync -- --check           → only report, change nothing
 * npm run audio:sync -- --unmark          → also set words whose file disappeared back to "missing"
 * npm run audio:sync -- --list files.txt  → use a list of file names (one per line) instead of
 *                                           Cloudinary (no account needed; for tests and offline use)
 *
 * Needs a `.env.local` file in the project root (git-ignored, never commit it):
 *   CLOUDINARY_CLOUD_NAME=dp5rofjyx
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 *   CLOUDINARY_FOLDER=          (optional: only files whose public id starts with this folder)
 * The key and secret are used here only, to read the file list; they never reach the website.
 * Guide: docs/AUDIO-GUIDE.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/collect-words.mjs'
import {
  loadRegistry,
  saveRegistry,
  normaliseEntry,
  relative,
  REGISTRY_FILE
} from './lib/registry.mjs'
import { planAudioSync } from './lib/audio-sync.mjs'

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const UNMARK = args.includes('--unmark')
const listFile = args.includes('--list') ? args[args.indexOf('--list') + 1] : null

/** Reads KEY=value lines of .env.local (without overriding variables that are already set). */
function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match && !(match[1] in process.env))
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

/** Public ids of every audio file in the Cloudinary account (Admin API, 500 per page). */
async function listCloudinaryFiles() {
  const {
    CLOUDINARY_CLOUD_NAME: cloud,
    CLOUDINARY_API_KEY: key,
    CLOUDINARY_API_SECRET: secret
  } = process.env
  if (!cloud || !key || !secret) {
    throw new Error(
      'Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in .env.local ' +
        '(see the header of scripts/audio-sync.mjs), or use --list files.txt'
    )
  }
  const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
  const files = []
  let cursor = null
  do {
    const query = new URLSearchParams({ max_results: '500' })
    if (process.env.CLOUDINARY_FOLDER) query.set('prefix', process.env.CLOUDINARY_FOLDER)
    if (cursor) query.set('next_cursor', cursor)
    const url = `https://api.cloudinary.com/v1_1/${cloud}/resources/video/upload?${query}`
    const response = await fetch(url, { headers: { Authorization: auth } })
    if (!response.ok) {
      throw new Error(`Cloudinary answered ${response.status} ${response.statusText}`)
    }
    const page = await response.json()
    files.push(...page.resources.map((resource) => resource.public_id))
    cursor = page.next_cursor || null
  } while (cursor)
  return files
}

function printList(title, items, limit = 30) {
  if (!items.length) return
  console.log(`\n${title} (${items.length})`)
  items.slice(0, limit).forEach((item) => console.log(`  - ${item}`))
  if (items.length > limit) console.log(`  … and ${items.length - limit} more`)
}

async function main() {
  let files
  if (listFile) {
    files = fs
      .readFileSync(listFile, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim())
  } else {
    loadEnvLocal()
    files = await listCloudinaryFiles()
  }

  const registry = loadRegistry()
  const plan = planAudioSync(registry, files, { unmark: UNMARK })

  console.log(`Audio files found:           ${files.length}`)
  console.log(`Words in the registry:       ${Object.keys(registry).length}`)
  console.log(`Already marked as recorded:  ${plan.alreadyRecorded.length}`)
  printList(
    'Newly recorded (will be marked "recorded")',
    plan.newlyRecorded.map((key) => registry[key].word + ' → ' + key)
  )
  printList(
    UNMARK
      ? 'Marked "recorded" but the file is gone (will be set back to "missing")'
      : 'Marked "recorded" but the file is gone (use --unmark to reset them)',
    plan.noLongerThere.map((key) => registry[key].word + ' → ' + key)
  )
  printList(
    'Files that match no word of the site (typo in the file name? word not on a page yet?)',
    plan.unknownFiles
  )

  if (CHECK_ONLY) {
    console.log('\n(--check: nothing written)')
    return
  }
  const keys = Object.keys(plan.changes)
  if (!keys.length) {
    console.log('\n✓ The registry already matches Cloudinary.')
    return
  }
  for (const key of keys) {
    registry[key] = normaliseEntry({ ...registry[key], audio: plan.changes[key] })
  }
  await saveRegistry(registry)
  console.log(`\n✓ Updated ${keys.length} word(s) in ${relative(REGISTRY_FILE)}`)
}

main().catch((error) => {
  console.error(`✗ ${error.message}`)
  process.exitCode = 1
})
