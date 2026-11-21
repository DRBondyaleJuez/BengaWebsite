/**
 * Talking to Cloudinary from Node (the npm scripts and the dev-only /admin/audios endpoints).
 * The API key and secret come from `.env.local` (git-ignored) and never reach the browser.
 *
 *   CLOUDINARY_CLOUD_NAME=dp5rofjyx
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 *
 * Pure helpers (signing, usage summary) are tested in scripts/tests/cloudinary.test.mjs.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { ROOT } from './collect-words.mjs'

/** Reads KEY=value lines of .env.local (without overriding variables that are already set). */
export function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

/** @returns {{ cloud: string, key: string, secret: string, folder: string }|null} null when not set up */
export function cloudinaryConfig() {
  loadEnvLocal()
  const {
    CLOUDINARY_CLOUD_NAME: cloud,
    CLOUDINARY_API_KEY: key,
    CLOUDINARY_API_SECRET: secret
  } = process.env
  if (!cloud || !key || !secret) return null
  return { cloud, key, secret, folder: process.env.CLOUDINARY_FOLDER || '' }
}

export const MISSING_CONFIG_MESSAGE =
  'Falta CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET en el archivo ' +
  '.env.local (ver docs/AUDIO-GUIDE.md)'

function requireConfig() {
  const config = cloudinaryConfig()
  if (!config) throw new Error(MISSING_CONFIG_MESSAGE)
  return config
}

const basicAuth = ({ key, secret }) => 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')

async function adminGet(config, endpoint, query = {}) {
  const url = `https://api.cloudinary.com/v1_1/${config.cloud}/${endpoint}?${new URLSearchParams(query)}`
  const response = await fetch(url, { headers: { Authorization: basicAuth(config) } })
  if (!response.ok) {
    throw new Error(`Cloudinary respondió ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Every audio file of the account (Admin API, 500 per page).
 * @returns {Promise<{ id: string, bytes: number, format: string, version: number, duration: number|null }[]>}
 */
export async function listAudioFiles(config = requireConfig()) {
  const files = []
  let cursor = null
  do {
    const query = { max_results: '500' }
    if (config.folder) query.prefix = config.folder
    if (cursor) query.next_cursor = cursor
    const page = await adminGet(config, 'resources/video/upload', query)
    for (const resource of page.resources) {
      files.push({
        id: resource.public_id,
        bytes: resource.bytes || 0,
        format: resource.format || '',
        version: resource.version || 0,
        duration: resource.duration ?? null
      })
    }
    cursor = page.next_cursor || null
  } while (cursor)
  return files
}

/**
 * Space used and left. Cloudinary does not report the size of one folder, so the size of the audio
 * files is added up here; the account figures come from the usage report.
 * Pure: takes the raw `usage` answer. Missing fields give null instead of an error.
 */
export function summariseUsage(usage = {}, files = []) {
  const bytes = files.reduce((sum, file) => sum + file.bytes, 0)
  const storage = usage.storage || {}
  const credits = usage.credits || {}
  const number = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null)
  return {
    audioFiles: files.length,
    audioBytes: bytes,
    plan: usage.plan || null,
    storageBytes: number(storage.usage),
    storageLimitBytes: number(storage.limit),
    storageUsedPercent: number(storage.used_percent),
    creditsUsed: number(credits.usage ?? usage.credits_usage),
    creditsLimit: number(credits.limit),
    creditsUsedPercent: number(credits.used_percent)
  }
}

export async function getUsage(config = requireConfig()) {
  return adminGet(config, 'usage')
}

/** Cloudinary's upload signature: sha1 of the sorted "name=value" pairs joined by & plus the secret. */
export function signUpload(params, secret) {
  const text = Object.keys(params)
    .filter((name) => params[name] !== undefined && params[name] !== '')
    .sort()
    .map((name) => `${name}=${params[name]}`)
    .join('&')
  return crypto
    .createHash('sha1')
    .update(text + secret)
    .digest('hex')
}

/**
 * Uploads a recording. The file keeps the word's name (public id = audio id), replacing an older
 * one; the site asks for `<id>.mp3`, which Cloudinary converts from whatever format was uploaded.
 * @param {Buffer} buffer
 * @param {string} publicId - the audio id, e.g. "wh_a_ki"
 * @returns {Promise<{ id: string, bytes: number, format: string, version: number }>}
 */
export async function uploadAudio(buffer, publicId, mimeType = 'audio/webm') {
  const config = requireConfig()
  const params = {
    invalidate: 'true',
    overwrite: 'true',
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
    unique_filename: 'false',
    use_filename: 'false'
  }
  const form = new FormData()
  for (const [name, value] of Object.entries(params)) form.append(name, value)
  form.append('api_key', config.key)
  form.append('signature', signUpload(params, config.secret))
  form.append('file', new Blob([buffer], { type: mimeType }), `${publicId}.audio`)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloud}/video/upload`, {
    method: 'POST',
    body: form
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Cloudinary no aceptó el audio: ${result.error?.message || response.status}`)
  }
  return {
    id: result.public_id,
    bytes: result.bytes || 0,
    format: result.format || '',
    version: result.version || 0
  }
}
