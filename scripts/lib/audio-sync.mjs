/**
 * Decides what `npm run audio:sync` changes in the word registry. Pure (tests:
 * scripts/tests/audio-sync.test.mjs); the Cloudinary calls are in scripts/audio-sync.mjs.
 *
 * A word is "recorded" when Cloudinary has a file called `<audioFile or key>` (the .mp3 extension
 * and any folder in front of the name don't matter).
 */

/** File names as they appear in Cloudinary ("folder/en_a_.mp3" or "en_a_") → "en_a_". */
export function fileKey(name) {
  return String(name)
    .trim()
    .replace(/^.*\//, '')
    .replace(/\.(mp3|wav|m4a|ogg|webm)$/i, '')
}

/**
 * @param {object} registry - word-registry words
 * @param {string[]} files - names of the files found in Cloudinary
 * @param {{ unmark?: boolean }} options - unmark: words whose file disappeared go back to "missing"
 * @returns {{ changes: object, newlyRecorded: string[], alreadyRecorded: string[],
 *   noLongerThere: string[], unknownFiles: string[] }}
 */
export function planAudioSync(registry, files, { unmark = false } = {}) {
  const present = new Set(files.map(fileKey))
  const changes = {}
  const newlyRecorded = []
  const alreadyRecorded = []
  const noLongerThere = []
  const used = new Set()

  for (const [key, entry] of Object.entries(registry)) {
    const file = entry.audioFile || key
    const there = present.has(file)
    if (there) used.add(file)
    if (there && entry.audio !== 'recorded') {
      changes[key] = 'recorded'
      newlyRecorded.push(key)
    } else if (there) {
      alreadyRecorded.push(key)
    } else if (entry.audio === 'recorded') {
      noLongerThere.push(key)
      if (unmark) changes[key] = 'missing'
    }
  }
  const unknownFiles = [...present].filter((file) => !used.has(file)).sort()
  return { changes, newlyRecorded, alreadyRecorded, noLongerThere, unknownFiles }
}
