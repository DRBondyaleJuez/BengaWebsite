<template>
  <div class="ocr-admin">
    <header class="ocr-admin__header">
      <h1>Revisión del OCR</h1>
      <p>
        Herramienta solo para desarrollo (no existe en la web publicada). Son las palabras del OCR
        mejorado del libro de las que el ordenador no está seguro
        (<code>docs/ocr/ocr-doubts.csv</code>). Pulsa el número de página para ver la palabra
        marcada en el PDF, escribe la forma correcta y un comentario si hace falta, y guarda. Si no
        es una palabra (una mancha, un adorno, un número de página…), marca «No es una palabra»: se
        quita del texto del PDF y de la lista de dudas. Las correcciones se guardan en
        <code>docs/ocr/ocr-corrections.json</code>; para aplicarlas al PDF:
        <code>python scripts/ocr-pdf.py --reuse</code>. Guía: <code>docs/OCR.md</code>
      </p>
      <ul class="ocr-admin__stats">
        <li>
          <strong>{{ rows.length }}</strong> palabras
        </li>
        <li>
          <strong>{{ stats.corrected }}</strong> corregidas
        </li>
        <li>
          <strong>{{ stats.discarded }}</strong> descartadas (no son palabras)
        </li>
        <li>
          <strong>{{ stats.commented }}</strong> con comentario
        </li>
        <li>
          <strong>{{ changedRows.length }}</strong> sin guardar
        </li>
      </ul>
    </header>

    <section class="ocr-admin__toolbar">
      <input
        v-model="search"
        class="ocr-admin__field ocr-admin__search"
        type="search"
        placeholder="Buscar en el OCR, la corrección o el comentario…"
        @input="listPage = 1"
      />
      <label class="ocr-admin__page-filter">
        Página
        <input
          v-model.number="pageFilter"
          class="ocr-admin__field"
          type="number"
          min="1"
          placeholder="todas"
          @input="listPage = 1"
        />
      </label>
      <select v-model="kindFilter" class="ocr-admin__field" @change="listPage = 1">
        <option value="">Todos los tipos</option>
        <option value="benga-accent">Probablemente benga (acentos dudosos)</option>
        <option value="unknown">Desconocidas</option>
        <option value="manual">Añadidas a mano</option>
        <option value="discarded">No están en la lista (descartadas)</option>
      </select>
      <select v-model="statusFilter" class="ocr-admin__field" @change="listPage = 1">
        <option value="">Todas</option>
        <option value="pending">Sin corregir</option>
        <option value="corrected">Corregidas</option>
        <option value="discarded">Descartadas (no son palabras)</option>
        <option value="changed">Sin guardar</option>
      </select>
      <button
        class="ocr-admin__button ocr-admin__button--primary"
        :disabled="!changedRows.length || saving"
        @click="save"
      >
        {{ saving ? 'Guardando…' : `Guardar cambios (${changedRows.length})` }}
      </button>
    </section>

    <p v-if="message" class="ocr-admin__message" :class="`ocr-admin__message--${message.type}`">
      {{ message.text }}
    </p>

    <div class="ocr-admin__layout" :class="{ 'ocr-admin__layout--viewer': viewer }">
      <!-- The list -->
      <div class="ocr-admin__list">
        <table class="ocr-admin__table">
          <thead>
            <tr>
              <th>Pág.</th>
              <th>OCR leyó</th>
              <th>Corrección</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in shownRows"
              :key="row.id"
              :class="{
                'ocr-admin__row--changed': isChanged(row),
                'ocr-admin__row--discarded': row.discard,
                'ocr-admin__row--selected': viewer && viewer.id === row.id
              }"
            >
              <td>
                <button
                  type="button"
                  class="ocr-admin__page-button"
                  :title="`Ver la página ${row.page} del PDF con la palabra marcada`"
                  @click="openViewer(row)"
                >
                  {{ row.page }}
                </button>
              </td>
              <td>
                <span class="ocr-admin__ocr" lang="bng">{{ row.ocr }}</span>
                <span v-if="row.written && row.written !== row.ocr" class="ocr-admin__detail">
                  en el PDF: <span lang="bng">{{ row.written }}</span>
                </span>
                <span class="ocr-admin__detail">
                  {{ kindLabels[row.kind] || row.kind }}
                  <template v-if="row.confidence !== ''">
                    · seguridad {{ row.confidence }} %</template
                  >
                </span>
              </td>
              <td>
                <input
                  :ref="(element) => (inputs[row.id] = element)"
                  v-model="row.correction"
                  class="ocr-admin__field ocr-admin__correction"
                  type="text"
                  lang="bng"
                  :placeholder="row.discard ? 'No es una palabra' : row.written || row.ocr"
                  :disabled="row.discard"
                  @focus="openViewer(row, false)"
                />
                <span v-if="!row.discard" class="ocr-admin__letters">
                  <button
                    v-for="letter in LETTERS"
                    :key="letter"
                    type="button"
                    class="ocr-admin__letter"
                    :title="`Escribir ${letter}`"
                    @mousedown.prevent
                    @click="insertLetter(row, letter)"
                  >
                    {{ letter }}
                  </button>
                </span>
                <label
                  class="ocr-admin__discard"
                  title="Manchas, adornos, números de página…: se quita del texto del PDF y de la lista de dudas"
                >
                  <input v-model="row.discard" type="checkbox" />
                  No es una palabra
                </label>
              </td>
              <td>
                <textarea
                  v-model="row.comment"
                  class="ocr-admin__field ocr-admin__comment"
                  rows="2"
                  placeholder="Comentario (opcional)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="!filteredRows.length" class="ocr-admin__empty">
          Ninguna palabra con estos filtros.
        </p>

        <nav v-if="totalListPages > 1" class="ocr-admin__pager">
          <button class="ocr-admin__button" :disabled="listPage === 1" @click="listPage--">
            ← Anterior
          </button>
          <span> {{ listPage }} / {{ totalListPages }} · {{ filteredRows.length }} palabras </span>
          <button
            class="ocr-admin__button"
            :disabled="listPage === totalListPages"
            @click="listPage++"
          >
            Siguiente →
          </button>
        </nav>
      </div>

      <!-- The PDF page with the word marked -->
      <aside v-if="viewer" class="ocr-admin__viewer">
        <div class="ocr-admin__viewer-bar">
          <button class="ocr-admin__button" :disabled="viewer.page <= 1" @click="showPage(-1)">
            ‹
          </button>
          <strong>PDF pág. {{ viewer.page }}</strong>
          <button
            class="ocr-admin__button"
            title="Alejar"
            :disabled="zoom <= 1"
            @click="setZoom(-0.5)"
          >
            −
          </button>
          <span class="ocr-admin__zoom">{{ zoom * 100 }} %</span>
          <button
            class="ocr-admin__button"
            title="Acercar"
            :disabled="zoom >= 4"
            @click="setZoom(0.5)"
          >
            +
          </button>
          <button class="ocr-admin__button" @click="showPage(1)">›</button>
          <a :href="`${pdfUrl}#page=${viewer.page}`" target="_blank" rel="noopener">
            Abrir el PDF
          </a>
          <button class="ocr-admin__button" title="Cerrar" @click="viewer = null">✕</button>
        </div>
        <p v-if="viewerError" class="ocr-admin__message ocr-admin__message--error">
          {{ viewerError }}
        </p>
        <div ref="pageBox" class="ocr-admin__page">
          <canvas ref="canvas" />
          <div
            v-for="mark in pageMarks"
            :key="mark.id"
            class="ocr-admin__mark"
            :class="{ 'ocr-admin__mark--current': mark.id === viewer.id }"
            :style="mark.style"
            :title="`${mark.ocr}${mark.correction ? ' → ' + mark.correction : ''}`"
          />
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import doubtsCsv from '../../../docs/ocr/ocr-doubts.csv?raw'
import correctionsFile from '../../../docs/ocr/ocr-corrections.json'
import { parseCsv } from '@/utils/csv'
import { IMPROVED_PDF_URL } from '@/config/external'

const ROWS_PER_PAGE = 25
/** Benga letters that are hard to type on a Spanish keyboard */
const LETTERS = ['â', 'ē', 'ū', 'Â', 'Ē', 'Ū']
const SAVED_MESSAGE_KEY = 'ocr-admin-saved-message'

/** What is saved for a row: compared with the fields to know whether it changed. */
function savedState({ correction, comment, discard }) {
  return {
    correction: String(correction || '').trim(),
    comment: String(comment || '').trim(),
    discard: Boolean(discard)
  }
}

/** pdf.js and the open document live outside Vue's reactivity (they are big objects). */
let pdfjs = null
let pdfDocument = null

/**
 * /admin/ocr — review the doubtful words of the improved OCR (REVIEW-LOG R-023).
 *
 *   docs/ocr/ocr-doubts.csv  ──►  this page  ──►  docs/ocr/ocr-corrections.json  ──►  ocr-pdf.py --reuse
 *   (id, page, OCR text, box)     (you correct)     (saved by the dev server)          (new text layer)
 *
 * Each word has a box on its PDF page (points from the top-left corner), so the viewer draws the
 * page with pdf.js and puts a frame on the word. Only exists during `npm run serve`.
 */
export default {
  name: 'OcrReviewAdmin',
  data() {
    const corrections = correctionsFile.corrections || {}
    const rows = parseCsv(doubtsCsv).map((line) => {
      const saved = corrections[line.id] || {}
      return {
        id: line.id,
        page: Number(line.pdf_page),
        ocr: line.ocr_read,
        written: line.written_in_pdf,
        confidence: line.confidence,
        kind: line.kind,
        box: [line.x0, line.y0, line.x1, line.y1].map(Number),
        correction: saved.correction || '',
        comment: saved.comment || '',
        discard: Boolean(saved.discard),
        saved: savedState(saved)
      }
    })
    // Corrections of words that are not in the doubts list (added by hand, e.g. R-029)
    const listed = new Set(rows.map((row) => row.id))
    for (const [id, saved] of Object.entries(corrections)) {
      if (listed.has(id)) continue
      rows.push({
        id,
        page: saved.pdfPage,
        ocr: saved.ocr,
        written: '',
        confidence: '',
        kind: saved.discard ? 'discarded' : 'manual',
        box: saved.box || null,
        correction: saved.correction || '',
        comment: saved.comment || '',
        discard: Boolean(saved.discard),
        saved: savedState(saved)
      })
    }
    rows.sort((a, b) => a.page - b.page || a.id.localeCompare(b.id, 'en', { numeric: true }))

    return {
      rows,
      search: '',
      pageFilter: '',
      kindFilter: '',
      statusFilter: '',
      listPage: 1,
      saving: false,
      message: null,
      viewer: null, // { id, page } — the row shown in the PDF viewer
      viewerError: null,
      pageScale: 1,
      zoom: 2, // 1 = the page as wide as the panel
      inputs: {},
      pdfUrl: IMPROVED_PDF_URL,
      LETTERS,
      kindLabels: {
        'benga-accent': 'probablemente benga',
        unknown: 'desconocida',
        manual: 'añadida a mano',
        discarded: 'descartada: ya no está en la lista de dudas'
      }
    }
  },
  computed: {
    filteredRows() {
      const text = this.search.trim().toLowerCase()
      return this.rows.filter((row) => {
        if (this.pageFilter && row.page !== this.pageFilter) return false
        if (this.kindFilter && row.kind !== this.kindFilter) return false
        if (this.statusFilter === 'pending' && (row.saved.correction || row.saved.discard))
          return false
        if (this.statusFilter === 'corrected' && !row.saved.correction) return false
        if (this.statusFilter === 'discarded' && !row.saved.discard) return false
        if (this.statusFilter === 'changed' && !this.isChanged(row)) return false
        if (!text) return true
        return [row.ocr, row.written, row.correction, row.comment].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(text)
        )
      })
    },
    totalListPages() {
      return Math.max(1, Math.ceil(this.filteredRows.length / ROWS_PER_PAGE))
    },
    shownRows() {
      const start = (this.listPage - 1) * ROWS_PER_PAGE
      return this.filteredRows.slice(start, start + ROWS_PER_PAGE)
    },
    changedRows() {
      return this.rows.filter(this.isChanged)
    },
    stats() {
      return {
        corrected: this.rows.filter((row) => row.saved.correction).length,
        discarded: this.rows.filter((row) => row.saved.discard).length,
        commented: this.rows.filter((row) => row.saved.comment).length
      }
    },
    /** Frames for every listed word on the viewer's page (the selected one stands out). */
    pageMarks() {
      if (!this.viewer) return []
      return this.rows
        .filter((row) => row.page === this.viewer.page && row.box)
        .map((row) => {
          const [x0, y0, x1, y1] = row.box.map((value) => value * this.pageScale)
          return {
            id: row.id,
            ocr: row.ocr,
            correction: row.correction,
            style: {
              left: `${x0 - 3}px`,
              top: `${y0 - 3}px`,
              width: `${x1 - x0 + 6}px`,
              height: `${y1 - y0 + 6}px`
            }
          }
        })
    }
  },
  watch: {
    totalListPages(total) {
      if (this.listPage > total) this.listPage = total
    }
  },
  created() {
    document.title = 'Revisión del OCR | Admin'
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
      return (
        row.correction.trim() !== row.saved.correction ||
        row.comment.trim() !== row.saved.comment ||
        row.discard !== row.saved.discard
      )
    },
    /** Types â / ē / ū at the cursor of the row's correction field. */
    insertLetter(row, letter) {
      const input = this.inputs[row.id]
      const value = row.correction || ''
      const start = input ? (input.selectionStart ?? value.length) : value.length
      const end = input ? (input.selectionEnd ?? value.length) : value.length
      row.correction = value.slice(0, start) + letter + value.slice(end)
      this.$nextTick(() => {
        if (!input) return
        input.focus()
        input.setSelectionRange(start + letter.length, start + letter.length)
      })
    },
    async openViewer(row, scroll = true) {
      if (this.viewer && this.viewer.id === row.id) return
      this.viewer = { id: row.id, page: row.page }
      await this.renderPage(scroll)
    },
    async setZoom(step) {
      this.zoom = Math.min(4, Math.max(1, this.zoom + step))
      await this.renderPage(true)
    },
    async showPage(step) {
      this.viewer = { id: null, page: this.viewer.page + step }
      await this.renderPage(false)
    },
    /** Draws the viewer's page with pdf.js, as wide as the panel. */
    async renderPage(scrollToMark) {
      this.viewerError = null
      await this.$nextTick()
      try {
        if (!pdfjs) {
          pdfjs = await import('pdfjs-dist')
          const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
          pdfjs.GlobalWorkerOptions.workerSrc = worker.default
        }
        if (!pdfDocument) pdfDocument = await pdfjs.getDocument({ url: IMPROVED_PDF_URL }).promise
        const pageNumber = Math.min(Math.max(this.viewer.page, 1), pdfDocument.numPages)
        this.viewer.page = pageNumber
        const page = await pdfDocument.getPage(pageNumber)
        const box = this.$refs.pageBox
        const canvas = this.$refs.canvas
        if (!box || !canvas) return
        const natural = page.getViewport({ scale: 1 })
        this.pageScale = (box.clientWidth * this.zoom) / natural.width
        const viewport = page.getViewport({ scale: this.pageScale })
        const ratio = window.devicePixelRatio || 1
        canvas.width = Math.floor(viewport.width * ratio)
        canvas.height = Math.floor(viewport.height * ratio)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        const context = canvas.getContext('2d')
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        await page.render({ canvasContext: context, viewport, canvas }).promise
        if (scrollToMark) {
          await this.$nextTick()
          // wait one frame: a panel that just opened gets its final size only after layout
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          )
          const mark = box.querySelector('.ocr-admin__mark--current')
          if (mark) {
            // Centre the word inside the page panel (it scrolls in both directions when zoomed)
            box.scrollTo({
              left: mark.offsetLeft - box.clientWidth / 2,
              top: mark.offsetTop - box.clientHeight / 2,
              behavior: 'auto'
            })
          }
        }
      } catch (error) {
        this.viewerError = `No se pudo mostrar el PDF: ${error.message}`
      }
    },
    async save() {
      this.saving = true
      this.message = null
      const corrections = {}
      for (const row of this.rows) {
        const correction = row.discard ? '' : row.correction.trim()
        const comment = row.comment.trim()
        if (!correction && !comment && !row.discard) continue
        const unchanged = !this.isChanged(row)
        corrections[row.id] = {
          ocr: row.ocr,
          correction,
          comment,
          ...(row.discard ? { discard: true } : {}),
          box: row.box,
          ...(unchanged && correctionsFile.corrections[row.id]
            ? { updated: correctionsFile.corrections[row.id].updated }
            : {})
        }
      }
      try {
        const response = await fetch('/__dev/ocr-corrections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ corrections })
        })
        if (!response.ok) throw new Error(await response.text())
        const text = `Guardado (${Object.keys(corrections).length} correcciones/comentarios en docs/ocr/ocr-corrections.json). Para aplicarlas al PDF: python scripts/ocr-pdf.py --reuse`
        for (const row of this.rows) {
          if (row.discard) row.correction = ''
          row.saved = savedState(row)
        }
        this.message = { type: 'success', text }
        try {
          // The dev server may reload the page after the file changes: keep the message.
          sessionStorage.setItem(SAVED_MESSAGE_KEY, text)
        } catch {
          // Ignore: see SAVED_MESSAGE_KEY.
        }
      } catch (error) {
        this.message = { type: 'error', text: `No se pudo guardar: ${error.message}` }
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.ocr-admin {
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

  &__page-filter {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;

    input {
      width: 6rem;
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

  // List and viewer side by side on wide screens, one under the other on small ones
  &__layout {
    display: grid;
    gap: $spacing-lg;

    &--viewer {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

      @include respond-below('lg') {
        grid-template-columns: 1fr;
      }
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

  &__row--changed {
    background: rgba($color-warning, 0.12);
  }

  &__row--discarded {
    opacity: 0.55;

    .ocr-admin__ocr {
      text-decoration: line-through;
    }
  }

  &__discard {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-top: $spacing-xs;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    cursor: pointer;
  }

  &__row--selected {
    outline: 2px solid $color-accent;
  }

  &__page-button {
    min-width: 2.5rem;
    padding: $spacing-xs $spacing-sm;
    border: 1px solid $color-primary;
    border-radius: $border-radius-sm;
    background: $color-surface;
    color: $color-primary;
    font-weight: $font-weight-bold;
    cursor: pointer;

    &:hover {
      background: $color-primary;
      color: $color-text-inverse;
    }
  }

  &__ocr {
    display: block;
    font-family: $font-family-benga;
    font-size: $font-size-base;
  }

  &__detail {
    display: block;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__correction,
  &__comment {
    width: 100%;
  }

  &__correction {
    font-family: $font-family-benga;
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

  &__viewer {
    position: sticky;
    top: calc(#{$header-height} + #{$spacing-md});
    align-self: start;
    max-height: calc(100vh - #{$header-height} - #{$spacing-xl});
    display: flex;
    flex-direction: column;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
    background: $color-surface;
  }

  &__viewer-bar {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm;
    border-bottom: 1px solid $border-color;

    strong {
      flex: 1;
    }
  }

  &__zoom {
    min-width: 3.5rem;
    text-align: center;
    font-size: $font-size-sm;
  }

  &__page {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  &__mark {
    position: absolute;
    border: 2px solid rgba($color-warning, 0.6);
    border-radius: 3px;
    pointer-events: auto;

    &--current {
      border: 3px solid $color-error;
      background: rgba($color-accent, 0.3);
      box-shadow: 0 0 0 4px rgba($color-error, 0.2);
    }
  }
}
</style>
