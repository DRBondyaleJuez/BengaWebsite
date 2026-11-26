/**
 * Vite configuration: how the site is served during development (`npm run serve`)
 * and built for publishing (`npm run build`). Replaces the old vue.config.js (vue-cli).
 */
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** Requests from this computer only (the dev server can also be reached from the local network). */
const LOCAL_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']

/**
 * A dev-server endpoint that receives JSON from an admin page and saves it to a file.
 * Only during `npm run serve` (the published site has no server), only PUT, only from this computer.
 *   path:  URL, e.g. '/__dev/word-registry'
 *   save:  async (data) => { … }  — throws an Error with a readable message when data is wrong
 */
function localJsonEndpoint(name, path, save) {
  return {
    name,
    apply: 'serve', // never part of `npm run build`
    configureServer(server) {
      server.middlewares.use(path, (request, response) => {
        const reply = (status, text) => {
          response.statusCode = status
          response.end(text)
        }
        if (request.method !== 'PUT') return reply(405, 'Use PUT')
        if (!LOCAL_ADDRESSES.includes(request.socket.remoteAddress)) {
          return reply(403, 'Only allowed from this computer')
        }
        let body = ''
        request.on('data', (chunk) => (body += chunk))
        request.on('end', async () => {
          try {
            await save(JSON.parse(body))
            reply(200, 'ok')
          } catch (error) {
            reply(400, error.message)
          }
        })
      })
    }
  }
}

/** /admin/palabras saves the word registry: PUT { words: { <key>: { word, livingDictionaryId, … } } } */
const wordRegistryEndpoint = () =>
  localJsonEndpoint('word-registry-endpoint', '/__dev/word-registry', async ({ words }) => {
    if (!words || typeof words !== 'object') throw new Error('missing "words"')
    // Same writer as the npm scripts, so the file format never differs.
    const { saveRegistry } = await import('./scripts/lib/registry.mjs')
    await saveRegistry(words)
  })

/** /admin/ocr saves the OCR corrections: PUT { corrections: { "p19-w156": { correction, … } } } */
const ocrCorrectionsEndpoint = () =>
  localJsonEndpoint(
    'ocr-corrections-endpoint',
    '/__dev/ocr-corrections',
    async ({ corrections }) => {
      if (!corrections || typeof corrections !== 'object') throw new Error('missing "corrections"')
      const { saveOcrCorrections } = await import('./scripts/lib/ocr-corrections.mjs')
      await saveOcrCorrections(corrections)
    }
  )

/**
 * /admin/translations saves edited texts and the doubts that were resolved:
 * PUT { edits: [{ file, path, value }], doubts: [...] } (see scripts/lib/translations-save.mjs)
 */
const translationsEndpoint = () =>
  localJsonEndpoint('translations-endpoint', '/__dev/translations', async (body) => {
    const { saveTranslations } = await import('./scripts/lib/translations-save.mjs')
    await saveTranslations(body)
  })

/**
 * /admin/audios talks to Cloudinary through the dev server, so the API secret in `.env.local`
 * never reaches the browser (see scripts/lib/audio-admin.mjs for the three addresses).
 * Only from this computer; the recording travels as raw bytes in a PUT.
 */
const audioEndpoint = () => ({
  name: 'audio-endpoint',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__dev/audio', (request, response) => {
      const send = ({ status, json }) => {
        response.statusCode = status
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(json))
      }
      if (!LOCAL_ADDRESSES.includes(request.socket.remoteAddress)) {
        return send({ status: 403, json: { error: 'Only allowed from this computer' } })
      }
      const chunks = []
      let size = 0
      request.on('data', (chunk) => {
        size += chunk.length
        if (size <= 16 * 1024 * 1024) chunks.push(chunk) // anything bigger is refused below
      })
      request.on('end', async () => {
        const { handleAudioRequest } = await import('./scripts/lib/audio-admin.mjs')
        const url = new URL(request.url, 'http://localhost')
        send(
          size > 16 * 1024 * 1024
            ? { status: 413, json: { error: 'La grabación es demasiado grande' } }
            : await handleAudioRequest({
                method: request.method,
                pathname: url.pathname,
                query: Object.fromEntries(url.searchParams),
                body: Buffer.concat(chunks)
              })
        )
      })
    })
  }
})

/**
 * /admin/living-dictionary reads and edits the dictionary workspace (src/data/dictionary) through
 * /__dev/ld/* (routes in scripts/lib/ld/admin-api.mjs). Only from this computer, JSON only, one
 * request at a time. It never contacts Living Dictionaries: syncing is a separate step.
 */
/** Streams a local file for the dictionary admin; answers Range requests so audio can seek. */
function sendFile(request, response, { status, file, contentType }) {
  const { size } = fs.statSync(file)
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range || '')
  let start = 0
  let end = size - 1
  if (range && (range[1] || range[2])) {
    start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]))
    end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    response.statusCode = 206
    response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
  } else response.statusCode = status
  response.setHeader('Content-Type', contentType)
  response.setHeader('Accept-Ranges', 'bytes')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Length', end - start + 1)
  fs.createReadStream(file, { start, end }).pipe(response)
}

const livingDictionaryEndpoint = () => ({
  name: 'living-dictionary-endpoint',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__dev/ld', (request, response) => {
      const send = ({ status, json }) => {
        response.statusCode = status
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(json))
      }
      if (!LOCAL_ADDRESSES.includes(request.socket.remoteAddress)) {
        return send({ status: 403, json: { error: 'Only allowed from this computer' } })
      }
      // recordings and pictures arrive as base64 inside the JSON (up to 25 MB of audio)
      const LIMIT = 40 * 1024 * 1024
      let body = ''
      let tooBig = false
      request.on('data', (chunk) => {
        if (body.length + chunk.length > LIMIT) tooBig = true
        else body += chunk
      })
      request.on('end', async () => {
        try {
          if (tooBig)
            return send({ status: 413, json: { error: 'El archivo es demasiado grande' } })
          const { handleSerially, fileStore } = await import('./scripts/lib/ld/admin-api.mjs')
          const url = new URL(request.url, 'http://localhost')
          const result = await handleSerially(
            {
              method: request.method,
              pathname: url.pathname,
              body: body ? JSON.parse(body) : null
            },
            await fileStore()
          )
          // a pending recording or picture: stream the file (with Range, which audio needs)
          if (result.file) return sendFile(request, response, result)
          send(result)
        } catch (error) {
          send({ status: 500, json: { error: error.message } })
        }
      })
    })
  }
})

export default defineConfig({
  plugins: [
    vue(),
    wordRegistryEndpoint(),
    ocrCorrectionsEndpoint(),
    translationsEndpoint(),
    audioEndpoint(),
    livingDictionaryEndpoint()
  ],
  define: {
    // vue-i18n build options: full install, no legacy API (we use composition mode), no devtools
    // in the published site. Without them vue-i18n prints a warning in the console.
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  resolve: {
    // '@/...' means 'src/...' (same shortcut as before; also set in jsconfig.json for the editor)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: {
    port: 8080 // same address as before: http://localhost:8080
  }
})
