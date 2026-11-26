<!--
  AudioCard - card «Audio» of the word and sentence forms: the recordings of the record (play,
  speaker, where each one is stored), and a way to add one: record with the microphone or upload
  a file (up to 25 MB), choosing the speaker (default: LD_DEFAULT_SPEAKER). A new recording is
  saved locally as «pendiente de enviar» (sent to Living Dictionaries in phase L6).
  Props: audio (array, read only), upload (async function(payload) → true when saved),
         remove (async function(mediaId)), busy
-->
<template>
  <FormCard id="card-audio" title="Audio" :badge="String(audio.length)" :summary="summary">
    <ul v-if="audio.length" class="audio-card__list">
      <li v-for="item in audio" :key="item.id" class="audio-card__item">
        <button
          type="button"
          class="ld-btn audio-card__play"
          :disabled="!urlOf(item)"
          :aria-label="isPlaying(item) ? 'Parar' : 'Escuchar'"
          @click="play(urlOf(item))"
        >
          {{ isPlaying(item) ? '⏸' : '▶' }}
        </button>
        <span class="audio-card__info">
          <span>{{ speakerNames(item) }}</span>
          <small v-if="item.source">fuente: {{ item.source }}</small>
        </span>
        <span class="audio-card__badge" :class="`audio-card__badge--${where(item).cls}`">{{
          where(item).text
        }}</span>
        <button
          v-if="isPending(item)"
          type="button"
          class="ld-btn ld-btn--danger"
          :disabled="busy"
          @click="remove(item.id)"
        >
          Quitar
        </button>
      </li>
    </ul>
    <p v-else class="ld-help">Sin grabaciones todavía.</p>

    <fieldset class="audio-card__add">
      <legend>Añadir una grabación</legend>
      <label class="ld-field audio-card__speaker">
        Quién habla
        <select v-model="speakerId">
          <option v-for="speaker in speakers" :key="speaker.id" :value="speaker.id">
            {{ speaker.name }}
          </option>
        </select>
      </label>

      <div v-if="draft" class="audio-card__draft">
        <audio :src="draft.url" controls preload="auto"></audio>
        <button type="button" class="ld-btn" :disabled="busy || sending" @click="saveDraft">
          {{ sending ? 'Guardando…' : 'Guardar esta grabación' }}
        </button>
        <button type="button" class="ld-btn" :disabled="sending" @click="releaseDraft">
          Repetir
        </button>
      </div>
      <div v-else class="audio-card__buttons">
        <button
          v-if="!recording"
          type="button"
          class="ld-btn"
          :disabled="!canRecord || busy"
          :title="canRecord ? '' : 'Este navegador no puede grabar'"
          @click="startRecording"
        >
          ● Grabar
        </button>
        <button v-else type="button" class="ld-btn ld-btn--danger" @click="stopRecording">
          ■ Parar ({{ seconds }} s)
        </button>
        <label
          class="ld-btn audio-card__file"
          :class="{ 'audio-card__file--off': recording || busy }"
        >
          Subir un archivo
          <input
            type="file"
            :accept="accept"
            :disabled="Boolean(recording) || busy"
            @change="pickFile"
          />
        </label>
      </div>
      <p v-if="message" class="audio-card__message" role="alert">{{ message }}</p>
    </fieldset>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import speakersFile from '@/data/dictionary/speakers.json'
import { LD_DEFAULT_SPEAKER } from '@/config/ld'
import { play, stop, audioState } from '@/services/audioPlayer'
import { ldMediaUrl } from '@/services/ldMedia'
import { isPendingMedia, validateMedia, MEDIA_EXTENSIONS } from '@/utils/mediaRules'
import { toBase64 } from '../ldApi'

/** Extension for the recorded type (Chrome: webm, Safari: mp4, Firefox: ogg). */
const extensionOfType = (type) =>
  /mp4/.test(type) ? 'm4a' : /ogg/.test(type) ? 'ogg' : /wav/.test(type) ? 'wav' : 'webm'

export default {
  name: 'AudioCard',
  components: { FormCard },
  props: {
    audio: { type: Array, default: () => [] },
    upload: { type: Function, required: true },
    remove: { type: Function, required: true },
    busy: { type: Boolean, default: false }
  },
  data() {
    const speakers = [...speakersFile.speakers]
    if (!speakers.some((speaker) => speaker.id === LD_DEFAULT_SPEAKER.id)) {
      speakers.unshift({ ...LD_DEFAULT_SPEAKER })
    }
    return {
      speakers,
      speakerId: LD_DEFAULT_SPEAKER.id,
      accept: MEDIA_EXTENSIONS.audio.map((ext) => `.${ext}`).join(','),
      canRecord:
        typeof navigator !== 'undefined' &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== 'undefined',
      recording: null,
      seconds: 0,
      timer: null,
      draft: null,
      sending: false,
      message: ''
    }
  },
  computed: {
    summary() {
      const pending = this.audio.filter(isPendingMedia).length
      if (!this.audio.length) return 'Sin audio'
      return `${this.audio.length} grabación(es)${pending ? `, ${pending} pendiente(s) de enviar` : ''}`
    }
  },
  beforeUnmount() {
    this.stopStream()
    this.releaseDraft()
    stop()
  },
  methods: {
    play,
    urlOf: (item) => ldMediaUrl(item),
    isPending: isPendingMedia,
    isPlaying(item) {
      const url = ldMediaUrl(item)
      return Boolean(url) && audioState.url === url && audioState.status === 'playing'
    },
    speakerNames(item) {
      const names = (item.speakerIds || []).map(
        (id) => this.speakers.find((speaker) => speaker.id === id)?.name || 'hablante desconocido'
      )
      return names.join(', ') || 'Sin hablante'
    },
    where(item) {
      if (item.cloudinary) return { text: 'copiado a Cloudinary', cls: 'ok' }
      if (item.storagePath) return { text: 'en Living Dictionaries', cls: 'ok' }
      return { text: 'pendiente de enviar', cls: 'pending' }
    },
    async startRecording() {
      this.message = ''
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        const chunks = []
        recorder.addEventListener(
          'dataavailable',
          (event) => event.data.size && chunks.push(event.data)
        )
        recorder.addEventListener('stop', () => {
          this.stopStream()
          const type = recorder.mimeType || 'audio/webm'
          const blob = new Blob(chunks, { type })
          this.recording = null
          this.draft = {
            blob,
            url: URL.createObjectURL(blob),
            fileName: `grabacion.${extensionOfType(type)}`
          }
        })
        this.recording = { recorder, stream }
        this.seconds = 0
        this.timer = setInterval(() => (this.seconds += 1), 1000)
        recorder.start()
      } catch (error) {
        this.recording = null
        this.message = `No se pudo usar el micrófono: ${error.message}. Permite el acceso en el navegador.`
      }
    },
    stopRecording() {
      if (this.recording && this.recording.recorder.state !== 'inactive') {
        this.recording.recorder.stop()
      }
    },
    stopStream() {
      clearInterval(this.timer)
      this.recording?.stream.getTracks().forEach((track) => track.stop())
    },
    pickFile(event) {
      const [file] = event.target.files
      event.target.value = ''
      if (!file) return
      const problem = validateMedia({ kind: 'audio', fileName: file.name, size: file.size })
      if (problem) {
        this.message = problem
        return
      }
      this.message = ''
      this.draft = { blob: file, url: URL.createObjectURL(file), fileName: file.name }
    },
    releaseDraft() {
      if (this.draft) URL.revokeObjectURL(this.draft.url)
      this.draft = null
    },
    async saveDraft() {
      const { blob, fileName } = this.draft
      const problem = validateMedia({ kind: 'audio', fileName, size: blob.size })
      if (problem) {
        this.message = problem
        return
      }
      this.sending = true
      try {
        const saved = await this.upload({
          kind: 'audio',
          fileName,
          dataBase64: await toBase64(blob),
          speakerId: this.speakerId
        })
        if (saved) this.releaseDraft()
      } catch (error) {
        this.message = error.message
      } finally {
        this.sending = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.audio-card {
  &__list {
    margin: 0 0 $spacing-md;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm $spacing-md;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $color-surface-alt;
  }

  &__play {
    min-width: 2.5rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 8rem;

    small {
      color: $color-text-muted;
    }
  }

  &__badge {
    padding: 0 $spacing-sm;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;

    &--ok {
      background: rgba($color-success, 0.15);
      color: #1c6b2d;
    }

    &--pending {
      background: rgba($color-warning, 0.25);
      color: #7a5800;
    }
  }

  &__add {
    margin: 0;
    padding: $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;

    legend {
      padding: 0 $spacing-xs;
      font-weight: $font-weight-semibold;
    }
  }

  &__speaker {
    max-width: 22rem;
    margin-bottom: $spacing-md;
  }

  &__buttons,
  &__draft {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm $spacing-md;
  }

  &__file {
    position: relative;
    display: inline-block;
    overflow: hidden;

    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &--off {
      opacity: 0.5;
    }
  }

  &__message {
    margin: $spacing-sm 0 0;
    color: $color-error;
    font-size: $font-size-sm;
  }
}
</style>
