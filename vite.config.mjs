/**
 * Vite configuration: how the site is served during development (`npm run serve`)
 * and built for publishing (`npm run build`). Replaces the old vue.config.js (vue-cli).
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2' // TODO(task 1.2): switch to @vitejs/plugin-vue for Vue 3

/** Requests from this computer only (the dev server can also be reached from the local network). */
const LOCAL_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']

/**
 * Dev-server endpoint used by the /admin/palabras page to save the word registry.
 * PUT /__dev/word-registry  with body { words: { <key>: { word, livingDictionaryId, ... } } }
 * It only exists during `npm run serve`; the published site has no server at all.
 */
function wordRegistryEndpoint() {
  return {
    name: 'word-registry-endpoint',
    apply: 'serve', // never part of `npm run build`
    configureServer(server) {
      server.middlewares.use('/__dev/word-registry', (request, response) => {
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
            const { words } = JSON.parse(body)
            if (!words || typeof words !== 'object') throw new Error('missing "words"')
            // Same writer as the npm scripts, so the file format never differs.
            const { saveRegistry } = await import('./scripts/lib/registry.mjs')
            await saveRegistry(words)
            reply(200, 'ok')
          } catch (error) {
            reply(400, error.message)
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), wordRegistryEndpoint()],
  resolve: {
    // '@/...' means 'src/...' (same shortcut as before; also set in jsconfig.json for the editor)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // The styles still use older Sass features that Sass 3 will remove: `@import`,
        // global functions and darken()/lighten(). They work today; the warnings only add noise.
        // TODO(REVIEW-LOG R-017): move to `@use` + `sass:color`, then remove this line.
        silenceDeprecations: ['import', 'global-builtin', 'color-functions']
      }
    }
  },
  server: {
    port: 8080 // same address as before: http://localhost:8080
  }
})
