const { defineConfig } = require('@vue/cli-service')

/** Requests from this computer only (the dev server may also be reachable from the local network). */
const LOCAL_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']

/**
 * Dev-server endpoint used by the /admin/palabras page to save the word registry.
 * PUT /__dev/word-registry  with body { words: { <key>: { word, livingDictionaryId, ... } } }
 * It only exists during `npm run serve`; the published site has no server at all.
 */
function saveWordRegistry(request, response) {
  if (!LOCAL_ADDRESSES.includes(request.socket.remoteAddress)) {
    response.status(403).send('Only allowed from this computer')
    return
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
      response.send('ok')
    } catch (error) {
      response.status(400).send(error.message)
    }
  })
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      devServer.app.put('/__dev/word-registry', saveWordRegistry)
      return middlewares
    }
  }
})
