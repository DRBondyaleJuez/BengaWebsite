<template>
  <div class="tr-admin">
    <header class="tr-admin__header">
      <h1>Traducciones</h1>
      <p>
        Herramienta solo para desarrollo (no existe en la web publicada). Cada fila es un texto del
        sitio con su palabra benga (si la tiene), el español, el inglés y el francés, todo editable.
        «Ver en la web» abre la página donde se usa y «Libro» abre el PDF en la página del libro.
        Los textos amarillos tienen una duda anotada: si ya la resolviste, marca «Resuelta» y se
        borra de <code>docs/translations/doubts.json</code> al guardar. Pulsa «Guardar» para
        escribir todo en <code>src/locales/*.json</code> y en los archivos de <code>src/data</code>.
        Dejar vacío el inglés o el francés lo quita (la web muestra el español). Guía:
        <code>docs/TRANSLATIONS.md</code>
      </p>
      <ul class="tr-admin__stats">
        <li>
          <strong>{{ rows.length }}</strong> textos
        </li>
        <li>
          <strong>{{ stats.missingEn }}</strong> sin inglés
        </li>
        <li>
          <strong>{{ stats.missingFr }}</strong> sin francés
        </li>
        <li>
          <strong>{{ openDoubtCount }}</strong> dudas abiertas
        </li>
        <li>
          <strong>{{ changedRows.length }}</strong> sin guardar
        </li>
      </ul>
    </header>

    <section v-if="generalNotes.length" class="tr-admin__notes">
      <h2>Notas generales</h2>
      <ul>
        <li v-for="note in generalNotes" :key="note.id">
          <span>{{ note.note }}</span>
          <label class="tr-admin__resolve">
            <input v-model="resolvedNotes[note.id]" type="checkbox" />
            Resuelta
          </label>
        </li>
      </ul>
    </section>

    <section class="tr-admin__toolbar">
      <input
        v-model="search"
        class="tr-admin__field tr-admin__search"
        type="search"
        placeholder="Buscar en la palabra benga, el español, el inglés, el francés o la clave…"
        @input="listPage = 1"
      />
      <select v-model="fileFilter" class="tr-admin__field" @change="listPage = 1">
        <option value="">Todos los archivos</option>
        <option value="ui">Interfaz y páginas (locales)</option>
        <option v-for="file in dataFiles" :key="file" :value="file">{{ file }}</option>
      </select>
      <select v-model="routeFilter" class="tr-admin__field" @change="listPage = 1">
        <option value="">Todas las páginas</option>
        <option value="shared">Textos compartidos (varias páginas)</option>
        <option v-for="route in routes" :key="route" :value="route">{{ route }}</option>
      </select>
      <select v-model="statusFilter" class="tr-admin__field" @change="listPage = 1">
        <option value="">Todos</option>
        <option value="doubt">Con duda abierta</option>
        <option value="missing">Falta inglés o francés</option>
        <option value="missing-en">Falta inglés</option>
        <option value="missing-fr">Falta francés</option>
        <option value="changed">Sin guardar</option>
      </select>
      <button
        class="tr-admin__button tr-admin__button--primary"
        :disabled="!canSave || saving"
        @click="save"
      >
        {{ saving ? 'Guardando…' : `Guardar (${changeCount})` }}
      </button>
    </section>

    <p v-if="message" class="tr-admin__message" :class="`tr-admin__message--${message.type}`">
      {{ message.text }}
    </p>

    <div class="tr-admin__list">
      <table class="tr-admin__table">
        <thead>
          <tr>
            <th>Dónde</th>
            <th>Benga</th>
            <th>Español</th>
            <th>English</th>
            <th>Français</th>
          </tr>
        </thead>
        <tbody v-for="row in shownRows" :key="row.id">
          <tr
            :class="{
              'tr-admin__row--changed': isChanged(row),
              'tr-admin__row--doubt': rowDoubts(row).length
            }"
          >
            <td class="tr-admin__where">
              <code class="tr-admin__location" :title="row.file">{{ row.location }}</code>
              <span class="tr-admin__detail">{{ row.kind === 'ui' ? 'interfaz' : row.file }}</span>
              <a
                class="tr-admin__link"
                :href="row.route || '/'"
                target="_blank"
                rel="noopener"
                :title="
                  row.route ? 'Abrir la página donde se usa' : 'Texto compartido: abre el inicio'
                "
              >
                {{ row.route ? `Ver en la web ${row.route}` : 'Ver en la web (compartido)' }}
              </a>
              <a
                v-if="row.pdfPages"
                class="tr-admin__link"
                :href="`${bookUrl}#page=${firstPage(row)}`"
                target="_blank"
                rel="noopener"
                title="Abrir el PDF del libro en esta página"
              >
                Libro: {{ bookLabel(row) }}
              </a>
            </td>
            <td>
              <template v-if="row.benga">
                <input
                  :ref="(element) => (inputs[row.id] = element)"
                  v-model="row.benga.value"
                  class="tr-admin__field tr-admin__benga"
                  type="text"
                  lang="bng"
                  :title="`Palabra benga (${row.benga.field}). No se traduce.`"
                />
                <span class="tr-admin__letters">
                  <button
                    v-for="letter in LETTERS"
                    :key="letter"
                    type="button"
                    class="tr-admin__letter"
                    :title="`Escribir ${letter}`"
                    @mousedown.prevent
                    @click="insertLetter(row, letter)"
                  >
                    {{ letter }}
                  </button>
                </span>
                <span class="tr-admin__detail">{{ row.benga.field }}</span>
              </template>
              <span v-else class="tr-admin__detail">—</span>
            </td>
            <td>
              <textarea v-model="row.texts.es" class="tr-admin__field tr-admin__text" rows="2" />
            </td>
            <td>
              <textarea
                v-model="row.texts.en"
                class="tr-admin__field tr-admin__text"
                :class="{ 'tr-admin__text--missing': !row.texts.en.trim() }"
                rows="2"
                lang="en"
              />
            </td>
            <td>
              <textarea
                v-model="row.texts.fr"
                class="tr-admin__field tr-admin__text"
                :class="{ 'tr-admin__text--missing': !row.texts.fr.trim() }"
                rows="2"
                lang="fr"
              />
            </td>
          </tr>
          <tr v-for="doubt in rowDoubts(row)" :key="doubt.id" class="tr-admin__doubt">
            <td colspan="5">
              <span class="tr-admin__doubt-note">⚠ {{ doubt.note }}</span>
              <label class="tr-admin__resolve">
                <input
                  type="checkbox"
                  :checked="isResolved(doubt, row)"
                  @change="setResolved(doubt, row, $event.target.checked)"
                />
                Resuelta (se borra de las dudas al guardar)
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!filteredRows.length" class="tr-admin__empty">Ningún texto con estos filtros.</p>

      <nav v-if="totalListPages > 1" class="tr-admin__pager">
        <button class="tr-admin__button" :disabled="listPage === 1" @click="listPage--">
          ← Anterior
        </button>
        <span> {{ listPage }} / {{ totalListPages }} · {{ filteredRows.length }} textos </span>
        <button
          class="tr-admin__button"
          :disabled="listPage === totalListPages"
          @click="listPage++"
        >
          Siguiente →
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import esMessages from '@/locales/es.json'
import enMessages from '@/locales/en.json'
import frMessages from '@/locales/fr.json'
import chaptersIndex from '@/data/chapters-index.json'
import doubtsFile from '../../../docs/translations/doubts.json'
import {
  LANGUAGES,
  scanData,
  scanLocales,
  fieldAddress,
  bengaAddress,
  fileRoutes,
  doubtsOfRow,
  resolveDoubts,
  renameInDoubts,
  parsePages,
  printedPage
} from '@/utils/translationRows'
import { BOOK_PDF_URL } from '@/config/external'

const ROWS_PER_PAGE = 20
/** Benga letters that are hard to type on a Spanish keyboard */
const LETTERS = ['â', 'ē', 'ū', 'Â', 'Ē', 'Ū']
const SAVED_MESSAGE_KEY = 'translations-admin-saved-message'

/** Every data file (not the schemas): { 'lexicon/nouns.json': {…parsed…}, … } */
const DATA_FILES = import.meta.glob(['../../data/**/*.json', '!../../data/schemas/**'], {
  eager: true,
  import: 'default'
})

/** The texts as they are saved: compared with the fields to know whether a row changed. */
function snapshot(row) {
  return {
    es: row.texts.es,
    en: row.texts.en,
    fr: row.texts.fr,
    benga: row.benga ? row.benga.value : null
  }
}

/**
 * /admin/translations — see and edit every translatable text of the site.
 *
 *   src/locales/*.json  +  src/data/**\/*.json  ──►  rows (src/utils/translationRows.js)  ──►  this page
 *   this page  ──►  PUT /__dev/translations  ──►  scripts/lib/translations-save.mjs  ──►  the same files
 *
 * Doubts live in docs/translations/doubts.json; ticking «Resuelta» removes them on save.
 * Only exists during `npm run serve`.
 */
export default {
  name: 'TranslationsAdmin',
  data() {
    const routes = fileRoutes(chaptersIndex)
    const rows = scanLocales({ es: esMessages, en: enMessages, fr: frMessages })
    for (const [path, data] of Object.entries(DATA_FILES)) {
      const file = path.replace('../../data/', '')
      rows.push(...scanData(file, data, { routes }))
    }
    for (const row of rows) row.saved = snapshot(row)
    return {
      rows,
      doubts: doubtsFile.doubts,
      search: '',
      fileFilter: '',
      routeFilter: '',
      statusFilter: '',
      listPage: 1,
      saving: false,
      message: null,
      resolved: {}, // 'doubtId|Spanish text' → true
      resolvedNotes: {}, // general note id → true
      inputs: {},
      bookUrl: BOOK_PDF_URL,
      LETTERS
    }
  },
  computed: {
    dataFiles() {
      return [...new Set(this.rows.filter((row) => row.kind === 'data').map((row) => row.file))]
    },
    routes() {
      return [...new Set(this.rows.map((row) => row.route).filter(Boolean))].sort()
    },
    generalNotes() {
      return this.doubts.filter((doubt) => doubt.es === undefined || doubt.es === null)
    },
    changedRows() {
      return this.rows.filter(this.isChanged)
    },
    resolvedCount() {
      return (
        Object.values(this.resolved).filter(Boolean).length +
        Object.values(this.resolvedNotes).filter(Boolean).length
      )
    },
    changeCount() {
      return this.changedRows.length + this.resolvedCount
    },
    canSave() {
      return this.changeCount > 0
    },
    openDoubtCount() {
      return this.doubts.length
    },
    stats() {
      return {
        missingEn: this.rows.filter((row) => !row.saved.en.trim()).length,
        missingFr: this.rows.filter((row) => !row.saved.fr.trim()).length
      }
    },
    filteredRows() {
      const text = this.search.trim().toLowerCase()
      return this.rows.filter((row) => {
        if (this.fileFilter === 'ui' && row.kind !== 'ui') return false
        if (this.fileFilter && this.fileFilter !== 'ui' && row.file !== this.fileFilter)
          return false
        if (this.routeFilter === 'shared' && row.route) return false
        if (this.routeFilter && this.routeFilter !== 'shared' && row.route !== this.routeFilter)
          return false
        if (this.statusFilter === 'doubt' && !this.rowDoubts(row).length) return false
        if (this.statusFilter === 'missing' && row.texts.en.trim() && row.texts.fr.trim())
          return false
        if (this.statusFilter === 'missing-en' && row.texts.en.trim()) return false
        if (this.statusFilter === 'missing-fr' && row.texts.fr.trim()) return false
        if (this.statusFilter === 'changed' && !this.isChanged(row)) return false
        if (!text) return true
        return [
          row.location,
          row.texts.es,
          row.texts.en,
          row.texts.fr,
          row.benga ? row.benga.value : ''
        ].some((value) => String(value).toLowerCase().includes(text))
      })
    },
    totalListPages() {
      return Math.max(1, Math.ceil(this.filteredRows.length / ROWS_PER_PAGE))
    },
    shownRows() {
      const start = (this.listPage - 1) * ROWS_PER_PAGE
      return this.filteredRows.slice(start, start + ROWS_PER_PAGE)
    }
  },
  watch: {
    totalListPages(total) {
      if (this.listPage > total) this.listPage = total
    }
  },
  created() {
    document.title = 'Traducciones | Admin'
    try {
      const savedMessage = sessionStorage.getItem(SAVED_MESSAGE_KEY)
      if (savedMessage) this.message = { type: 'success', text: savedMessage }
      sessionStorage.removeItem(SAVED_MESSAGE_KEY)
    } catch {
      // Storage can be blocked (private mode); the message is only a convenience.
    }
  },
  methods: {
    isChanged(row) {
      const now = snapshot(row)
      return (
        LANGUAGES.some((lang) => now[lang] !== row.saved[lang]) || now.benga !== row.saved.benga
      )
    },
    rowDoubts(row) {
      // Doubts match the SAVED Spanish text, so a doubt does not vanish while the text is edited
      return doubtsOfRow({ texts: { es: row.saved.es } }, this.doubts)
    },
    isResolved(doubt, row) {
      return Boolean(this.resolved[`${doubt.id}|${row.saved.es}`])
    },
    setResolved(doubt, row, value) {
      this.resolved = { ...this.resolved, [`${doubt.id}|${row.saved.es}`]: value }
    },
    firstPage(row) {
      const pages = parsePages(row.pdfPages)
      return pages ? pages.from : 1
    },
    /** 'PDF 8-9 (libro 14-15)' */
    bookLabel(row) {
      const pages = parsePages(row.pdfPages)
      if (!pages) return `PDF ${row.pdfPages}`
      const from = printedPage(pages.from)
      const to = printedPage(pages.to)
      const range = pages.from === pages.to ? pages.from : `${pages.from}-${pages.to}`
      if (from === null) return `PDF ${range}`
      return `PDF ${range} (libro ${from === to ? from : `${from}-${to}`})`
    },
    /** Types â / ē / ū at the cursor of the row's Benga field. */
    insertLetter(row, letter) {
      const input = this.inputs[row.id]
      const value = row.benga.value || ''
      const start = input ? (input.selectionStart ?? value.length) : value.length
      const end = input ? (input.selectionEnd ?? value.length) : value.length
      row.benga.value = value.slice(0, start) + letter + value.slice(end)
      this.$nextTick(() => {
        if (!input) return
        input.focus()
        input.setSelectionRange(start + letter.length, start + letter.length)
      })
    },
    /** The edits to send: one per changed field. Throws a readable error when a row is wrong. */
    buildEdits() {
      const edits = new Map() // 'file|path' → edit (the same Benga word can be shown in two rows)
      const add = (address, value) => {
        const key = `${address.file}|${address.path.join('.')}`
        const known = edits.get(key)
        if (known && known.value !== value) {
          throw new Error(
            `La misma palabra (${address.path.join('.')}) está editada con dos valores distintos.`
          )
        }
        edits.set(key, { ...address, value })
      }
      for (const row of this.changedRows) {
        for (const lang of LANGUAGES) {
          if (row.texts[lang] === row.saved[lang]) continue
          const text = row.texts[lang].trim()
          if (lang === 'es' && !text) {
            throw new Error(`El español no puede quedar vacío (${row.location}).`)
          }
          add(fieldAddress(row, lang), text || null)
        }
        if (row.benga && row.benga.value !== row.saved.benga) {
          const word = row.benga.value.trim()
          if (!word) throw new Error(`La palabra benga no puede quedar vacía (${row.location}).`)
          add(bengaAddress(row), word)
        }
      }
      return [...edits.values()]
    },
    /** The doubts file after the ticked doubts were removed and edited Spanish texts renamed. */
    buildDoubts() {
      const resolved = {}
      for (const [key, done] of Object.entries(this.resolved)) {
        if (!done) continue
        const at = key.indexOf('|')
        const id = key.slice(0, at)
        resolved[id] = [...(resolved[id] || []), key.slice(at + 1)]
      }
      for (const [id, done] of Object.entries(this.resolvedNotes)) if (done) resolved[id] = true
      let doubts = resolveDoubts(this.doubts, resolved)
      // Spanish texts that were edited: the doubts follow the new text, unless another place
      // still uses the old one
      for (const row of this.changedRows) {
        if (row.texts.es === row.saved.es) continue
        const oldStillUsed = this.rows.some(
          (other) =>
            other !== row && other.saved.es === row.saved.es && other.texts.es === row.saved.es
        )
        if (!oldStillUsed) doubts = renameInDoubts(doubts, row.saved.es, row.texts.es.trim())
      }
      return doubts
    },
    async save() {
      this.saving = true
      this.message = null
      try {
        const edits = this.buildEdits()
        const doubts = this.buildDoubts()
        const response = await fetch('/__dev/translations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ edits, doubts })
        })
        if (!response.ok) throw new Error(await response.text())
        const bengaEdited = edits.some((edit) => this.isBengaEdit(edit))
        let text = `Guardado: ${edits.length} campos cambiados y ${this.resolvedCount} dudas resueltas (quedan ${doubts.length}).`
        if (bengaEdited) {
          text +=
            ' Cambiaste palabras benga: ejecuta «npm run words:sync» y después «npm run validate».'
        }
        try {
          sessionStorage.setItem(SAVED_MESSAGE_KEY, text)
        } catch {
          // Ignore: see SAVED_MESSAGE_KEY.
        }
        // The page reads the files when it opens: reload to show exactly what was saved
        window.location.reload()
      } catch (error) {
        this.message = { type: 'error', text: `No se pudo guardar: ${error.message}` }
        this.saving = false
      }
    },
    /** An edit that is not en / fr / es text is a Benga word */
    isBengaEdit(edit) {
      const last = edit.path[edit.path.length - 1]
      return edit.file.startsWith('src/data/') && !LANGUAGES.includes(last)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.tr-admin {
  max-width: 100%;

  &__header h1 {
    color: $color-primary-dark;
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

  &__notes {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-warning, 0.12);
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;

    h2 {
      margin: 0 0 $spacing-xs;
      font-size: $font-size-base;
    }

    ul {
      margin: 0;
      padding-left: $spacing-lg;
    }

    li {
      margin-bottom: $spacing-xs;
    }
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  &__field {
    padding: $spacing-xs $spacing-sm;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    font: inherit;
  }

  &__search {
    flex: 1 1 260px;
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

  &__list {
    min-width: 0;
    overflow-x: auto;
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

  &__row--changed td {
    background: rgba($color-info, 0.12);
  }

  &__row--doubt td {
    border-bottom: 0;
  }

  &__doubt td {
    background: rgba($color-warning, 0.15);
    font-size: $font-size-xs;
  }

  &__doubt-note {
    margin-right: $spacing-md;
  }

  &__resolve {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $color-text-secondary;
    cursor: pointer;
    white-space: nowrap;
  }

  &__where {
    min-width: 11rem;
    max-width: 16rem;
  }

  &__location {
    display: block;
    overflow-wrap: anywhere;
    font-size: $font-size-xs;
  }

  &__detail {
    display: block;
    font-size: $font-size-xs;
    color: $color-text-muted;
    overflow-wrap: anywhere;
  }

  &__link {
    display: block;
    margin-top: $spacing-xs;
    font-size: $font-size-xs;
    overflow-wrap: anywhere;
  }

  &__benga {
    width: 100%;
    min-width: 7rem;
    font-family: $font-family-benga;
  }

  &__text {
    width: 100%;
    min-width: 11rem;
    resize: vertical;

    &--missing {
      background: rgba($color-warning, 0.1);
    }
  }

  &__letters {
    display: flex;
    gap: 2px;
    margin-top: 2px;
  }

  &__letter {
    min-width: 1.8rem;
    padding: 0 $spacing-xs;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
    background: $color-surface-alt;
    font-family: $font-family-benga;
    cursor: pointer;

    &:hover {
      background: $color-accent;
    }
  }

  &__empty {
    color: $color-text-muted;
  }

  &__pager {
    @include flex-between;
    margin-top: $spacing-md;
  }
}
</style>
