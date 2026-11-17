/**
 * ONE audio player for the whole site.
 *
 * Before: every BengaWord had its own <audio>, so two words could play at the same time and a
 * missing file failed silently. Now every play button goes through this service:
 *
 *   play('https://…/epokolo.mp3')   → stops whatever was playing, then plays this URL
 *   play(sameUrl again)            → stops it (the button works as play/stop)
 *   stop()                         → stops everything
 *   audioState                     → reactive { url, status, error }: components read it to
 *                                    show the right icon. status: 'idle' | 'loading' | 'playing'
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
  error: null // URL of the last file that could not be played (for a warning icon)
})

let audio = null // created on the first play: no sound object exists until a visitor clicks

function player() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('ended', () => reset())
    audio.addEventListener('error', () => {
      if (!audioState.url) return
      console.warn(`Audio unavailable: ${audioState.url}`)
      audioState.error = audioState.url
      reset()
    })
  }
  return audio
}

function reset() {
  audioState.url = null
  audioState.status = 'idle'
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
      reset()
    }
  }
}
