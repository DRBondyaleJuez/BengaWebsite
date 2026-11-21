/**
 * Vite configuration: how the site is served during development (`npm run serve`)
 * and built for publishing (`npm run build`). Replaces the old vue.config.js (vue-cli).
 */
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

export default defineConfig({
  plugins: [vue(), wordRegistryEndpoint(), ocrCorrectionsEndpoint(), translationsEndpoint()],
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
