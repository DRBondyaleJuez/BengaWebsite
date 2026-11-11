<template>
  <div class="word-admin">
    <header class="word-admin__header">
      <h1>Registro de palabras</h1>
      <p>
        Herramienta solo para desarrollo (no existe en la web publicada). Aquí conectas cada palabra
        benga con su entrada del <strong>Living Dictionary</strong> y marcas qué audios ya están
        grabados en Cloudinary. Guía: <code>docs/WORD-REGISTRY.md</code>
      </p>
      <ul class="word-admin__stats">
        <li>
          <strong>{{ stats.total }}</strong> palabras
        </li>
        <li>
          <strong>{{ stats.withDictionary }}</strong> con enlace al diccionario
        </li>
        <li>
          <strong>{{ stats.recorded }}</strong> con audio grabado
        </li>
        <li>
          <strong>{{ stats.unused }}</strong> sin usar en ninguna página
        </li>
      </ul>
    </header>

    <section class="word-admin__toolbar">
      <input
        v-model="search"
        class="word-admin__search"
        type="search"
        placeholder="Buscar palabra, clave o nota…"
        @input="page = 1"
      />
      <select v-model="filter" class="word-admin__filter" @change="page = 1">
        <option v-for="option in filterOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <button
        class="word-admin__button word-admin__button--primary"
        :disabled="!changedKeys.length || saving"
        @click="save"
      >
        {{ saving ? 'Guardando…' : `Guardar cambios (${changedKeys.length})` }}
      </button>
      <button class="word-admin__button" @click="downloadJson">Descargar JSON</button>
      <button class="word-admin__button" @click="downloadCsv">Exportar CSV</button>
    </section>

    <p v-if="message" class="word-admin__message" :class="`word-admin__message--${message.type}`">
      {{ message.text }}
    </p>

    <table class="word-admin__table">
      <thead>
        <tr>
          <th>Palabra / clave</th>
          <th>Living Dictionary</th>
          <th>Audio</th>
          <th>Notas</th>
          <th>Aparece en</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in pageRows"
          :key="row.key"
          :class="{ 'word-admin__row--changed': changedKeys.includes(row.key) }"
        >
          <td>
            <input v-model="row.word" class="word-admin__input" @input="markChanged(row)" />
            <code class="word-admin__key">{{ row.key }}</code>
          </td>
          <td>
            <input
              v-model="row.livingDictionaryId"
              class="word-admin__input word-admin__input--mono"
              placeholder="pega aquí el id o la URL de la entrada"
              @input="onDictionaryInput(row)"
            />
            <div class="word-admin__links">
              <a :href="searchUrl(row)" target="_blank" rel="noopener noreferrer">Buscar</a>
              <a
                v-if="row.livingDictionaryId"
                :href="entryUrl(row)"
                target="_blank"
                rel="noopener noreferrer"
                >Ver entrada</a
              >
            </div>
          </td>
          <td>
            <select v-model="row.audio" class="word-admin__input" @change="markChanged(row)">
              <option value="missing">pendiente</option>
              <option value="recorded">grabado</option>
            </select>
            <input
              v-model="row.audioFile"
              class="word-admin__input word-admin__input--mono"
              :placeholder="`archivo: ${row.key}`"
              title="Solo si el archivo en Cloudinary tiene otro nombre"
              @input="markChanged(row)"
            />
            <button
              v-if="row.audio === 'recorded'"
              class="word-admin__link-button"
              @click="playAudio(row)"
            >
              ▶ probar
            </button>
          </td>
          <td>
            <textarea
              v-model="row.notes"
              class="word-admin__input"
              rows="2"
              @input="markChanged(row)"
            />
          </td>
          <td class="word-admin__used-in">
            <span v-if="!row.usedIn.length" class="word-admin__unused">sin usar</span>
            <span v-for="file in row.usedIn" :key="file" :title="file">{{
              shortFileName(file)
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <nav v-if="pageCount > 1" class="word-admin__pager">
      <button class="word-admin__button" :disabled="page === 1" @click="page--">← Anterior</button>
      <span>Página {{ page }} de {{ pageCount }} · {{ filteredRows.length }} palabras</span>
      <button class="word-admin__button" :disabled="page === pageCount" @click="page++">
        Siguiente →
      </button>
    </nav>
  </div>
</template>

<script>
import registry from '@/data/lexicon/word-registry.json'
import usage from '@/data/lexicon/word-usage.json'
import {
  CLOUDINARY_BASE,
  LIVING_DICTIONARY_ENTRY,
  LIVING_DICTIONARY_SEARCH
} from '@/config/external'

const ROWS_PER_PAGE = 50
const EDITABLE_FIELDS = ['word', 'livingDictionaryId', 'audio', 'audioFile', 'notes']
const LIVING_DICTIONARY_ID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
/** Address of the save endpoint added to the dev server in vue.config.js. */
const SAVE_ENDPOINT = '/__dev/word-registry'
/**
 * Saving rewrites the registry file, and the dev server then reloads this page.
 * The confirmation is kept here for a moment so it is still visible after the reload.
 */
const SAVED_MESSAGE_KEY = 'word-admin:saved-message'

/** Turns the registry file into an editable list of rows. */
function buildRows() {
  return Object.entries(registry.words).map(([key, entry]) => ({
    key,
    ...entry,
    usedIn: (usage.words[key] && usage.words[key].usedIn) || []
  }))
}

export default {
  name: 'WordRegistryAdmin',
  data() {
    const rows = buildRows()
    return {
      rows,
      // Frozen copy of the values as saved in the file, to know which rows changed.
      savedValues: Object.freeze(Object.fromEntries(rows.map((row) => [row.key, this.pick(row)]))),
      changedKeys: [],
      search: '',
      filter: 'all',
      page: 1,
      saving: false,
      message: null,
      filterOptions: [
        { value: 'all', label: 'Todas las palabras' },
        { value: 'no-dictionary', label: 'Sin enlace al diccionario' },
        { value: 'dictionary', label: 'Con enlace al diccionario' },
        { value: 'recorded', label: 'Audio grabado' },
        { value: 'missing', label: 'Audio pendiente' },
        { value: 'unused', label: 'No usadas en ninguna página' },
        { value: 'changed', label: 'Con cambios sin guardar' }
      ]
    }
  },
  computed: {
    stats() {
      return {
        total: this.rows.length,
        withDictionary: this.rows.filter((row) => row.livingDictionaryId).length,
        recorded: this.rows.filter((row) => row.audio === 'recorded').length,
        unused: this.rows.filter((row) => !row.usedIn.length).length
      }
    },
    filteredRows() {
      const term = this.search.trim().toLowerCase()
      return this.rows.filter((row) => {
        if (!this.matchesFilter(row)) return false
        if (!term) return true
        return [row.word, row.key, row.notes].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(term)
        )
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
    document.title = 'Registro de palabras | Admin'
    try {
      const savedMessage = sessionStorage.getItem(SAVED_MESSAGE_KEY)
      if (savedMessage) this.message = { type: 'success', text: savedMessage }
      sessionStorage.removeItem(SAVED_MESSAGE_KEY)
    } catch (error) {
      // Storage can be blocked (private mode); the message is only a convenience.
    }
  },
  methods: {
    /** Only the fields stored in the registry file. */
    pick(row) {
      return Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, row[field] || null]))
    },
    matchesFilter(row) {
      switch (this.filter) {
        case 'no-dictionary':
          return !row.livingDictionaryId
        case 'dictionary':
          return Boolean(row.livingDictionaryId)
        case 'recorded':
          return row.audio === 'recorded'
        case 'missing':
          return row.audio !== 'recorded'
        case 'unused':
          return !row.usedIn.length
        case 'changed':
          return this.changedKeys.includes(row.key)
        default:
          return true
      }
    },
    markChanged(row) {
      const isChanged = JSON.stringify(this.savedValues[row.key]) !== JSON.stringify(this.pick(row))
      const index = this.changedKeys.indexOf(row.key)
      if (isChanged && index === -1) this.changedKeys.push(row.key)
      if (!isChanged && index !== -1) this.changedKeys.splice(index, 1)
    },
    /** Accepts a bare id or a full entry URL copied from the browser. */
    onDictionaryInput(row) {
      const match = String(row.livingDictionaryId || '').match(LIVING_DICTIONARY_ID)
      if (match) row.livingDictionaryId = match[0].toLowerCase()
      this.markChanged(row)
    },
    searchUrl(row) {
      const query = JSON.stringify({ query: String(row.word).toLowerCase() })
      return `${LIVING_DICTIONARY_SEARCH}?q=${encodeURIComponent(query)}`
    },
    entryUrl(row) {
      return `${LIVING_DICTIONARY_ENTRY}/${row.livingDictionaryId}`
    },
    playAudio(row) {
      new Audio(`${CLOUDINARY_BASE}/${row.audioFile || row.key}.mp3`).play().catch(() => {
        this.message = {
          type: 'error',
          text: `No se encontró el audio de «${row.word}» en Cloudinary (${row.audioFile || row.key}.mp3).`
        }
      })
    },
    shortFileName(file) {
      return file.split('/').pop()
    },
    registryWords() {
      return Object.fromEntries(this.rows.map((row) => [row.key, this.pick(row)]))
    },
    async save() {
      this.saving = true
      this.message = null
      try {
        const response = await fetch(SAVE_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ words: this.registryWords() })
        })
        if (!response.ok) throw new Error(await response.text())
        const text = `Guardado en src/data/lexicon/word-registry.json (${this.changedKeys.length} palabras). Revisa el cambio con git y haz commit.`
        this.message = { type: 'success', text }
        try {
          sessionStorage.setItem(SAVED_MESSAGE_KEY, text)
        } catch (error) {
          // Ignore: see SAVED_MESSAGE_KEY.
        }
        this.savedValues = Object.freeze(this.registryWords())
        this.changedKeys = []
      } catch (error) {
        this.message = {
          type: 'error',
          text: `No se pudo guardar (${error.message}). Usa «Descargar JSON» y reemplaza el archivo a mano.`
        }
      } finally {
        this.saving = false
      }
    },
    download(fileName, content, type) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(new Blob([content], { type }))
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    },
    downloadJson() {
      const content = JSON.stringify(
        { _about: registry._about, words: this.registryWords() },
        null,
        2
      )
      this.download('word-registry.json', `${content}\n`, 'application/json')
    },
    /** Same columns that `npm run words:import` reads. */
    downloadCsv() {
      const columns = ['key', 'word', 'livingDictionaryId', 'audio', 'audioFile', 'notes']
      const quote = (value) =>
        `"${String(value === null || value === undefined ? '' : value).replace(/"/g, '""')}"`
      const lines = [columns.join(',')].concat(
        this.rows.map((row) => columns.map((column) => quote(row[column])).join(','))
      )
      // The BOM (\uFEFF) makes Excel read the accents (â, ē, ū) correctly.
      this.download('word-registry.csv', `\uFEFF${lines.join('\n')}\n`, 'text/csv')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.word-admin {
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
  &__filter,
  &__input {
    padding: $spacing-xs $spacing-sm;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    font: inherit;
  }

  &__input {
    width: 100%;
    margin-bottom: $spacing-xs;

    &--mono {
      font-family: $font-family-mono;
      font-size: $font-size-xs;
    }
  }

  &__button {
    @include button-secondary;

    &--primary {
      @include button-primary;
    }

    &:disabled {
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

  &__row--changed {
    background: rgba($color-warning, 0.12);
  }

  &__key {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__links {
    display: flex;
    gap: $spacing-sm;
  }

  &__link-button {
    padding: 0;
    border: none;
    background: none;
    color: $color-primary;
    cursor: pointer;
  }

  &__used-in {
    display: flex;
    flex-direction: column;
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  &__unused {
    color: $color-warning;
  }

  &__pager {
    @include flex-between;
    margin-top: $spacing-md;
  }
}
</style>
