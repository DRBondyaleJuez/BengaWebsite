/**
 * Rules for the audio and photos of the dictionary admin (/admin/living-dictionary): which files
 * are accepted, how big, and where a recording or picture is played from. Pure functions (no
 * other imports than linkRules.js) used by the browser forms and by scripts/lib/ld/admin-api.mjs; tests in
 * scripts/tests/mediaRules.test.mjs. The addresses come from src/config/external.js.
 */

import { audioUrlFor } from './linkRules.js'

const MB = 1024 * 1024

/** Biggest file accepted per kind (LD's own limits are checked again when sending, phase L6). */
export const MEDIA_LIMITS = { audio: 25 * MB, photo: 10 * MB }

export const MEDIA_EXTENSIONS = {
  audio: ['mp3', 'wav', 'webm', 'ogg', 'm4a', 'aac', 'flac', 'opus'],
  photo: ['jpg', 'jpeg', 'png', 'webp', 'gif']
}

const CONTENT_TYPES = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  webm: 'audio/webm',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  flac: 'audio/flac',
  opus: 'audio/ogg',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif'
}

/** Extension of a file name in lower case, or null when it is not an accepted `kind`. */
export function mediaExtension(fileName, kind) {
  const match = /\.([a-z0-9]{2,5})$/i.exec(String(fileName || ''))
  const extension = match ? match[1].toLowerCase() : null
  return extension && (MEDIA_EXTENSIONS[kind] || []).includes(extension) ? extension : null
}

export const contentTypeOf = (fileName) =>
  CONTENT_TYPES[String(fileName).split('.').pop().toLowerCase()] || 'application/octet-stream'

/** Spanish message when the file cannot be accepted, or null when it can. */
export function validateMedia({ kind, fileName, size }) {
  if (!MEDIA_LIMITS[kind]) return 'Tipo de archivo desconocido (audio o foto)'
  if (!mediaExtension(fileName, kind)) {
    return `Formato no admitido. Admitidos: ${MEDIA_EXTENSIONS[kind].join(', ')}`
  }
  if (!size) return 'El archivo está vacío'
  if (size > MEDIA_LIMITS[kind]) {
    return `El archivo pesa demasiado (máximo ${MEDIA_LIMITS[kind] / MB} MB)`
  }
  return null
}

/** Names the server gives to local pending files: <uuid>.<ext>. Anything else is refused. */
export const isPendingMediaName = (name) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{2,5}$/.test(String(name))

/**
 * Where to play (or show) a recording or picture:
 *   copied to Cloudinary (audio.cloudinary) → ${cloudinaryBase}/<name>.mp3
 *   in Living Dictionaries (storagePath)    → ${ldMediaBase}/<storagePath>
 *   only local, waiting to be sent          → ${localBase}/<file name>
 * @returns {string|null}
 */
export function mediaUrlFor(media, { cloudinaryBase, ldMediaBase, localBase }) {
  if (!media) return null
  if (media.cloudinary) {
    return audioUrlFor(media.cloudinary, { audio: 'recorded' }, cloudinaryBase)
  }
  if (media.storagePath) return `${ldMediaBase}/${media.storagePath}`
  if (media.pendingFile) return `${localBase}/${String(media.pendingFile).split('/').pop()}`
  return null
}

/** Not in Living Dictionaries yet: only a local file. */
export const isPendingMedia = (media) => Boolean(media && !media.storagePath && media.pendingFile)
