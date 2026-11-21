<template>
  <div class="audio-admin">
    <header class="audio-admin__header">
      <h1>Audios de las palabras</h1>
      <p>
        Herramienta solo para desarrollo (no existe en la web publicada). Comprueba qué palabras
        benga tienen audio en <strong>Cloudinary</strong>, escúchalo, y graba o sube uno nuevo: se
        guarda con el nombre de la palabra (su «clave») y la palabra queda marcada como grabada, así
        la web muestra el botón de reproducir. Guía: <code>docs/AUDIO-GUIDE.md</code>
      </p>
      <ul class="audio-admin__stats">
        <li>
          <strong>{{ rows.length }}</strong> palabras y frases
        </li>
        <li>
          <strong>{{ stats.registered }}</strong> marcadas como grabadas
        </li>
        <li>
          <strong>{{ checked ? stats.inCloudinary : '?' }}</strong> en Cloudinary
        </li>
        <li :class="{ 'audio-admin__stat--warn': stats.mismatch }">
          <strong>{{ checked ? stats.mismatch : '?' }}</strong> con registro distinto
        </li>
      </ul>
    </header>

    <section class="audio-admin__cloud">
      <h2>Cloudinary</h2>
      <p v-if="!checked && !loading && !cloudError">Sin comprobar todavía.</p>
      <p v-if="loading">Consultando Cloudinary…</p>
      <p v-if="cloudError" class="audio-admin__message audio-admin__message--error">
        {{ cloudError }}
      </p>
      <template v-if="checked">
        <p>
          <strong>{{ usage.audioFiles }}</strong> audios ocupan
          <strong>{{ formatBytes(usage.audioBytes) }}</strong>
          <template v-if="usage.plan"> · plan {{ usage.plan }}</template>
        </p>
        <div v-if="usage.storageUsedPercent !== null || usage.creditsUsedPercent !== null">
          <div v-if="usage.storageBytes !== null" class="audio-admin__meter">
            <span
              >Almacenamiento de la cuenta: {{ formatBytes(usage.storageBytes) }}
              <template v-if="usage.storageLimitBytes">
                de {{ formatBytes(usage.storageLimitBytes) }} (quedan
                {{ formatBytes(usage.storageLimitBytes - usage.storageBytes) }})</template
              ></span
            >
            <progress
              v-if="usage.storageLimitBytes"
              :value="usage.storageBytes"
              :max="usage.storageLimitBytes"
            ></progress>
          </div>
          <div v-if="usage.creditsUsedPercent !== null" class="audio-admin__meter">
            <span
              >Créditos del plan usados: {{ usage.creditsUsed }}
              <template v-if="usage.creditsLimit"> de {{ usage.creditsLimit }}</template> ({{
                usage.creditsUsedPercent
              }}
              %)</span
            >
            <progress :value="usage.creditsUsedPercent" max="100"></progress>
          </div>
        </div>
        <p v-else class="audio-admin__hint">
          Cloudinary no ha dado el límite de tu plan; consúltalo en su panel (Settings → Usage).
        </p>
        <p class="audio-admin__hint">
          Cloudinary no mide una carpeta por separado: el tamaño de los audios se suma aquí; el
          espacio libre es el de toda la cuenta. En el plan gratuito el límite son los créditos
          mensuales: 1 crédito ≈ 1 GB guardado o 1 GB descargado por los visitantes.
        </p>
      </template>
      <div class="audio-admin__toolbar">
        <button class="audio-admin__button" :disabled="loading" @click="check">
          Comprobar Cloudinary
        </button>
        <button
          class="audio-admin__button"
          :disabled="loading || !checked || !stats.toMark"
          @click="syncRegistry"
        >
          Marcar como grabadas las que ya están ({{ stats.toMark }})
        </button>
      </div>
    </section>

    <section class="audio-admin__toolbar">
      <input
        v-model="search"
        class="audio-admin__search"
        type="search"
        placeholder="Buscar palabra o clave…"
        @input="page = 1"
      />
      <select v-model="filter" class="audio-admin__filter" @change="page = 1">
        <option v-for="option in filterOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </section>

    <p v-if="message" class="audio-admin__message" :class="`audio-admin__message--${message.type}`">
      {{ message.text }}
    </p>

    <table class="audio-admin__table">
      <thead>
        <tr>
          <th>Palabra / clave</th>
          <th>Estado</th>
          <th>Escuchar</th>
          <th>Grabar o subir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in pageRows" :key="row.key">
          <td>
            <span class="audio-admin__word" lang="bng">{{ row.word }}</span>
            <code class="audio-admin__key">{{ row.fileId }}</code>
            <span v-if="!row.usedIn.length" class="audio-admin__unused">sin usar en la web</span>
          </td>
          <td>
            <span
              class="audio-admin__badge"
              :class="row.audio === 'recorded' ? 'audio-admin__badge--ok' : ''"
            >
              registro: {{ row.audio === 'recorded' ? 'grabado' : 'pendiente' }}
            </span>
            <span
              v-if="checked"
              class="audio-admin__badge"
              :class="row.file ? 'audio-admin__badge--ok' : 'audio-admin__badge--no'"
            >
              {{
                row.file
                  ? `en Cloudinary (${formatBytes(row.file.bytes)})`
                  : 'no está en Cloudinary'
              }}
            </span>
            <span v-if="row.mismatch" class="audio-admin__badge audio-admin__badge--warn">
              {{ row.file ? 'falta marcarla' : 'marcada pero no existe' }}
            </span>
          </td>
          <td>
            <button
              v-if="row.file || (!checked && row.audio === 'recorded')"
              class="audio-admin__link-button"
              @click="listen(row)"
            >
              {{ isPlaying(row) ? '⏸ parar' : '▶ escuchar' }}
            </button>
            <span v-else class="audio-admin__hint">—</span>
          </td>
          <td>
            <template v-if="recording && recording.key === row.key">
              <span class="audio-admin__rec">● grabando…</span>
              <button class="audio-admin__button" @click="stopRecording">■ Parar</button>
            </template>
            <template v-else-if="draft && draft.key === row.key">
              <audio :src="draft.url" controls preload="auto"></audio>
              <div class="audio-admin__actions">
                <button
                  class="audio-admin__button audio-admin__button--primary"
                  :disabled="uploading"
                  @click="upload"
                >
                  {{ uploading ? 'Subiendo…' : row.file ? 'Subir y reemplazar' : 'Subir' }}
                </button>
                <button class="audio-admin__button" :disabled="uploading" @click="discard">
                  Descartar
                </button>
              </div>
            </template>
            <template v-else>
              <div class="audio-admin__actions">
                <button
                  class="audio-admin__button"
                  :disabled="Boolean(recording || draft) || !canRecord"
                  :title="canRecord ? '' : 'Este navegador no puede grabar'"
                  @click="startRecording(row)"
                >
                  ● Grabar
                </button>
                <label
                  class="audio-admin__button"
                  :class="{ 'audio-admin__button--disabled': Boolean(recording || draft) }"
                >
                  Subir archivo
                  <input
                    type="file"
                    accept="audio/*"
                    hidden
                    :disabled="Boolean(recording || draft)"
                    @change="pickFile(row, $event)"
                  />
                </label>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <nav v-if="pageCount > 1" class="audio-admin__pager">
      <button class="audio-admin__button" :disabled="page === 1" @click="page--">← Anterior</button>
      <span>Página {{ page }} de {{ pageCount }} · {{ filteredRows.length }} palabras</span>
      <button class="audio-admin__button" :disabled="page === pageCount" @click="page++">
        Siguiente →
      </button>
    </nav>
  </div>
</template>

<script>
import registry from '@/data/lexicon/word-registry.json'
import usageFile from '@/data/lexicon/word-usage.json'
import { CLOUDINARY_BASE } from '@/config/external'
import { audioState, play } from '@/services/audioPlayer'
import { formatBytes } from '@/utils/formatBytes'

const ROWS_PER_PAGE = 30
const ENDPOINT = '/__dev/audio'
/** The registry file changes after an upload and the dev server reloads the page: keep the message. */
const MESSAGE_KEY = 'audio-admin:message'

/** The registry as rows; the Cloudinary file of each is joined in once it has been checked. */
function buildRows() {
  return Object.entries(registry.words).map(([key, entry]) => ({
    key,
    word: entry.word,
    audio: entry.audio,
    fileId: entry.audioFile || key,
    usedIn: usageFile.words[key]?.usedIn || []
  }))
}

async function request(path, options) {
  const response = await fetch(`${ENDPOINT}${path}`, options)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || `Error ${response.status}`)
  return body
}

export default {
  name: 'AudiosAdmin',
  data() {
    return {
      baseRows: buildRows(),
      files: {}, // Cloudinary files by id, filled by check()
      usage: null,
      checked: false,
      loading: false,
      cloudError: null,
      search: '',
      filter: 'pending',
      page: 1,
      message: null,
      // Recording: recorder + chunks while recording; draft = the finished take, not yet uploaded
      recording: null,
      draft: null,
      uploading: false,
      canRecord:
        typeof navigator !== 'undefined' &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== 'undefined',
      filterOptions: [
        { value: 'pending', label: 'Sin audio (no está grabado)' },
        { value: 'all', label: 'Todas las palabras' },
        { value: 'recorded', label: 'Con audio grabado' },
        { value: 'mismatch', label: 'Registro distinto a Cloudinary' },
        { value: 'used', label: 'Usadas en la web y sin audio' },
        { value: 'phrases', label: 'Solo frases (varias palabras)' }
      ]
    }
  },
  computed: {
    rows() {
      return this.baseRows.map((row) => {
        const file = this.files[row.fileId] || null
        return {
          ...row,
          file,
          // Only meaningful once Cloudinary has been checked
          mismatch: this.checked && Boolean(file) !== (row.audio === 'recorded')
        }
      })
    },
    stats() {
      return {
        registered: this.rows.filter((row) => row.audio === 'recorded').length,
        inCloudinary: this.rows.filter((row) => row.file).length,
        mismatch: this.rows.filter((row) => row.mismatch).length,
        toMark: this.rows.filter((row) => row.file && row.audio !== 'recorded').length
      }
    },
    filteredRows() {
      const term = this.search.trim().toLowerCase()
      return this.rows.filter((row) => {
        if (!this.matches(row)) return false
        return !term || row.word.toLowerCase().includes(term) || row.key.includes(term)
      })
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredRows.length / ROWS_PER_PAGE))
    },
    pageRows() {
      const start = (this.page - 1) * ROWS_PER_PAGE
      return this.filteredRows.slice(start, start + ROWS_PER_PAGE)
    }
  },
  created() {
    document.title = 'Audios | Admin'
    try {
      const saved = sessionStorage.getItem(MESSAGE_KEY)
      if (saved) this.message = { type: 'success', text: saved }
      sessionStorage.removeItem(MESSAGE_KEY)
    } catch {
      // Storage can be blocked; the message is only a convenience.
    }
    this.check()
  },
  beforeUnmount() {
    this.releaseDraft()
    this.stopStream()
  },
  methods: {
    formatBytes,
    matches(row) {
      switch (this.filter) {
        case 'pending':
          return row.audio !== 'recorded' && !row.file
        case 'recorded':
          return row.audio === 'recorded' || Boolean(row.file)
        case 'mismatch':
          return row.mismatch
        case 'used':
          return row.audio !== 'recorded' && !row.file && row.usedIn.length > 0
        case 'phrases':
          return /\s/.test(row.word.trim())
        default:
          return true
      }
    },
    async check() {
      this.loading = true
      this.cloudError = null
      try {
        const answer = await request('/status')
        if (!answer.configured) {
          this.cloudError = answer.message
          this.checked = false
          return
        }
        this.files = Object.fromEntries(answer.files.map((file) => [file.id, file]))
        this.usage = answer.usage
        this.checked = true
      } catch (error) {
        this.cloudError = error.message
        this.checked = false
      } finally {
        this.loading = false
      }
    },
    async syncRegistry() {
      this.loading = true
      try {
        const result = await request('/sync', { method: 'PUT' })
        this.remember(`Registro actualizado: ${result.updated} palabra(s) marcadas como grabadas.`)
      } catch (error) {
        this.message = { type: 'error', text: error.message }
        this.loading = false
      }
    },
    audioUrl(row) {
      return `${CLOUDINARY_BASE}/${row.fileId}.mp3`
    },
    isPlaying(row) {
      return audioState.url === this.audioUrl(row) && audioState.status !== 'idle'
    },
    listen(row) {
      play(this.audioUrl(row))
    },

    // ---- recording ---------------------------------------------------------------------------
    async startRecording(row) {
      this.message = null
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
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
          this.recording = null
          this.draft = { key: row.key, blob, url: URL.createObjectURL(blob) }
        })
        this.recording = { key: row.key, recorder, stream }
        recorder.start()
      } catch (error) {
        this.recording = null
        this.message = {
          type: 'error',
          text: `No se pudo usar el micrófono: ${error.message}. Permite el acceso en el navegador.`
        }
      }
    },
    stopRecording() {
      if (this.recording && this.recording.recorder.state !== 'inactive') {
        this.recording.recorder.stop()
      }
    },
    stopStream() {
      this.recording?.stream.getTracks().forEach((track) => track.stop())
    },
    pickFile(row, event) {
      const [file] = event.target.files
      event.target.value = ''
      if (!file) return
      this.message = null
      this.draft = { key: row.key, blob: file, url: URL.createObjectURL(file) }
    },
    releaseDraft() {
      if (this.draft) URL.revokeObjectURL(this.draft.url)
      this.draft = null
    },
    discard() {
      this.releaseDraft()
    },
    async upload() {
      const { key, blob } = this.draft
      this.uploading = true
      try {
        const query = new URLSearchParams({ key, type: blob.type || 'audio/webm' })
        const result = await request(`/upload?${query}`, { method: 'PUT', body: blob })
        this.releaseDraft()
        const word = this.baseRows.find((row) => row.key === key)?.word
        // The registry file is rewritten and the dev server may reload this page: keep the text.
        this.remember(
          `Audio de «${word}» subido (${formatBytes(result.bytes)}) y marcado como grabado.`
        )
      } catch (error) {
        this.message = { type: 'error', text: error.message }
      } finally {
        this.uploading = false
      }
    },
    /** Shows a success message and refreshes; it survives the dev-server reload. */
    remember(text) {
      this.message = { type: 'success', text }
      try {
        sessionStorage.setItem(MESSAGE_KEY, text)
      } catch {
        // Storage can be blocked; the message is only a convenience.
      }
      this.check()
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.audio-admin {
  max-width: 100%;

  &__header {
    margin-bottom: $spacing-lg;

    h1 {
      color: $color-primary-dark;
    }
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    padding: 0;
    list-style: none;

    li {
      padding: $spacing-xs $spacing-md;
      background: $color-surface-alt;
      border-radius: $border-radius-sm;
    }
  }

  &__stat--warn {
    background: rgba($color-warning, 0.2) !important;
  }

  &__cloud {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background: $color-surface-alt;
    border-radius: $border-radius;

    h2 {
      margin-top: 0;
    }
  }

  &__meter {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;

    progress {
      width: 100%;
      max-width: 420px;
    }
  }

  &__hint {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  &__search {
    flex: 1 1 260px;
  }

  &__search,
  &__filter {
    padding: $spacing-xs $spacing-sm;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    font: inherit;
  }

  &__button {
    @include button-secondary;
    display: inline-block;
    cursor: pointer;

    &--primary {
      @include button-primary;
    }

    &:disabled,
    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__message {
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-sm;

    &--success {
      background: rgba($color-success, 0.12);
    }

    &--error {
      background: rgba($color-error, 0.12);
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th,
    td {
      padding: $spacing-sm;
      border-bottom: $border-width solid $border-color;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: $color-primary;
      color: $color-text-inverse;
    }
  }

  &__word {
    display: block;
    font-weight: $font-weight-bold;
  }

  &__key {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__unused {
    display: block;
    font-size: $font-size-xs;
    color: $color-warning;
  }

  &__badge {
    display: block;
    width: fit-content;
    margin-bottom: $spacing-xs;
    padding: 2px $spacing-sm;
    border-radius: $border-radius-full;
    background: rgba($color-text-muted, 0.15);
    font-size: $font-size-xs;

    &--ok {
      background: rgba($color-success, 0.2);
    }

    &--no {
      background: rgba($color-error, 0.15);
    }

    &--warn {
      background: rgba($color-warning, 0.3);
    }
  }

  &__rec {
    display: block;
    margin-bottom: $spacing-xs;
    color: $color-error;
    font-weight: $font-weight-bold;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-top: $spacing-xs;
  }

  &__link-button {
    padding: 0;
    border: none;
    background: none;
    color: $color-primary;
    cursor: pointer;
  }

  &__pager {
    @include flex-between;
    margin-top: $spacing-md;
  }
}
</style>
