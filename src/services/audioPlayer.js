/**
 * ONE audio player for the whole site.
 *
 * Before: every BengaWord had its own <audio>, so two words could play at the same time and a
 * missing file failed silently. Now every play button goes through this service:
 *
 *   play('https://…/epokolo.mp3')   → stops whatever was playing, then plays this URL
 *   play(sameUrl again)            → stops it (the button works as play/stop)
 *   stop()                         → stops everything
 *   playAll([url, url, …])         → plays the files one after another («play all» buttons);
 *                                    a file that fails is skipped; stop() or any play() ends it
 *   audioState                     → reactive { url, status, error, queue }: components read it to
 *                                    show the right icon. status: 'idle' | 'loading' | 'playing'
 *                                    queue = the URLs of the running «play all» (empty otherwise)
 *
 *   <button @click="play(url)">{{ audioState.url === url && audioState.status === 'playing' ? '⏸' : '▶' }}</button>
 *
 * The list of words that HAVE a recording is the word registry ("audio": "recorded"):
 * BengaWord only shows a play button for those (see src/services/wordLinks.js).
 */
import { reactive } from 'vue'

export const audioState = reactive({
  url: null, // the URL being loaded or played, or null
  status: 'idle',
  error: null, // URL of the last file that could not be played (for a warning icon)
  queue: [] // URLs of the running «play all» (the one playing included); empty otherwise
})

let pending = [] // URLs of «play all» still to play after the current one

let audio = null // created on the first play: no sound object exists until a visitor clicks

function player() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('ended', () => next())
    audio.addEventListener('error', () => {
      if (!audioState.url) return
      console.warn(`Audio unavailable: ${audioState.url}`)
      audioState.error = audioState.url
      next()
    })
  }
  return audio
}

function reset() {
  audioState.url = null
  audioState.status = 'idle'
  audioState.queue = []
  pending = []
}

/** The current file ended (or failed): the next of «play all», or back to idle. */
function next() {
  const url = pending.shift()
  if (url) start(url)
  else reset()
}

export function stop() {
  if (audio) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load() // cancels a download in progress
  }
  reset()
}

/** Plays `url`, stopping any other sound. Calling it again for the same URL stops it. */
export async function play(url) {
  if (!url) return
  if (audioState.url === url) {
    stop()
    return
  }
  stop()
  await start(url)
}

/** Plays the files one after another. Calling it again with the same list stops it. */
export async function playAll(urls) {
  const list = urls.filter(Boolean)
  if (!list.length) return
  const running = audioState.queue.length && audioState.queue.join() === list.join()
  stop()
  if (running) return
  audioState.queue = list
  pending = list.slice(1)
  await start(list[0])
}

async function start(url) {
  const element = player()
  if (!element) return
  audioState.url = url
  audioState.status = 'loading'
  audioState.error = null
  element.src = url
  try {
    await element.play()
    if (audioState.url === url) audioState.status = 'playing'
  } catch (error) {
    // AbortError = another play() started before this one loaded: not a real failure
    if (error.name !== 'AbortError' && audioState.url === url) {
      console.warn(`Audio playback failed: ${url}`, error)
      audioState.error = url
      next()
    }
  }
}
