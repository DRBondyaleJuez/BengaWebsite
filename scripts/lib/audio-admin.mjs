/**
 * What the dev-only page /admin/audios asks of the dev server (wired in vite.config.mjs,
 * `/__dev/audio/...`). Only during `npm run serve`, only from this computer.
 *
 *   GET  /status          → { configured, files: [{ id, bytes, format, … }], usage }
 *                           (the audio files in Cloudinary and the space used)
 *   PUT  /sync            → marks as "recorded" every word that has a file (like audio:sync)
 *   PUT  /upload?key=<word key>&type=<mime>   body = the recording (raw bytes)
 *                         → uploads it to Cloudinary with the word's audio id as name and marks
 *                           the word "recorded"
 *
 * Returns { status, json } so it can be tested without a server.
 */
import { loadRegistry, saveRegistry, normaliseEntry } from './registry.mjs'
import { planAudioSync } from './audio-sync.mjs'
import {
  cloudinaryConfig,
  folderFor,
  getUsage,
  listAudioFiles,
  summariseUsage,
  uploadAudio,
  MISSING_CONFIG_MESSAGE
} from './cloudinary.mjs'

/** Largest recording accepted (a spoken word is a few hundred KB; this stops accidents). */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

const AUDIO_TYPE = /^audio\/[a-z0-9.+-]+$/i
const reply = (status, json) => ({ status, json })

export async function handleAudioRequest({ method, pathname, query = {}, body = null }) {
  try {
    if (method === 'GET' && pathname === '/status') return await status()
    if (method === 'PUT' && pathname === '/sync') return await sync()
    if (method === 'PUT' && pathname === '/upload') return await upload(query, body)
    return reply(404, { error: 'Dirección desconocida' })
  } catch (error) {
    return reply(400, { error: error.message })
  }
}

async function status() {
  if (!cloudinaryConfig()) {
    return reply(200, { configured: false, message: MISSING_CONFIG_MESSAGE })
  }
  const files = await listAudioFiles()
  // The usage report is a nice-to-have: a failure there must not hide the file list.
  const usage = await getUsage().catch(() => ({}))
  return reply(200, { configured: true, files, usage: summariseUsage(usage, files) })
}

async function sync() {
  const files = await listAudioFiles()
  const registry = loadRegistry()
  const plan = planAudioSync(
    registry,
    files.map((file) => file.id)
  )
  for (const [key, audio] of Object.entries(plan.changes)) {
    registry[key] = normaliseEntry({ ...registry[key], audio })
  }
  if (Object.keys(plan.changes).length) await saveRegistry(registry)
  return reply(200, {
    updated: Object.keys(plan.changes).length,
    unknownFiles: plan.unknownFiles
  })
}

async function upload({ key, type }, body) {
  const registry = loadRegistry()
  if (!key || !registry[key]) throw new Error('Palabra desconocida (clave no registrada)')
  if (!body || !body.length) throw new Error('La grabación está vacía')
  if (body.length > MAX_UPLOAD_BYTES)
    throw new Error('La grabación es demasiado grande (máx. 15 MB)')
  const mime = AUDIO_TYPE.test(type || '') ? type : 'audio/webm'

  const id = registry[key].audioFile || key
  const folder = folderFor(registry[key].word, cloudinaryConfig() || {})
  const result = await uploadAudio(body, id, mime, folder)
  registry[key] = normaliseEntry({ ...registry[key], audio: 'recorded' })
  await saveRegistry(registry)
  return reply(200, result)
}
