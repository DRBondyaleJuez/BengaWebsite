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
import {
  loadRegistry,
  saveRegistry,
  normaliseEntry,
  relative,
  REGISTRY_FILE
} from './lib/registry.mjs'
import { planAudioSync } from './lib/audio-sync.mjs'
import { cloudinaryConfig, listAudioFiles, MISSING_CONFIG_MESSAGE } from './lib/cloudinary.mjs'

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const UNMARK = args.includes('--unmark')
const listFile = args.includes('--list') ? args[args.indexOf('--list') + 1] : null

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
    if (!cloudinaryConfig()) throw new Error(MISSING_CONFIG_MESSAGE)
    files = (await listAudioFiles()).map((file) => file.id)
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
