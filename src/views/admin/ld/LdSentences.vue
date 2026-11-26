<template>
  <section class="ld-sentences">
    <div class="ld-sentences__toolbar">
      <label class="ld-sentences__search">
        <span class="visually-hidden">Buscar</span>
        <input
          :value="filters.q"
          type="search"
          placeholder="Buscar en la oración, sus traducciones o sus palabras…"
          @input="setFilter('q', $event.target.value)"
        />
      </label>
      <label class="ld-sentences__inline">
        Orden
        <select :value="filters.orden" @change="setFilter('orden', $event.target.value)">
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="recientes">Cambios locales primero</option>
          <option value="revision">Por revisar primero</option>
        </select>
      </label>
      <button type="button" class="ld-sentences__add" @click="openNew">+ Añadir oración</button>
    </div>

    <div class="ld-sentences__layout">
      <FilterPanel :active-count="activeCount" @clear="$router.replace({ query: {} })">
        <FilterGroup title="Le falta la traducción" :count="filters.falta.length">
          <label v-for="lang in languages" :key="lang.code" class="ld-sentences__check">
            <input
              type="checkbox"
              :checked="filters.falta.includes(lang.code)"
              @change="toggleInList('falta', lang.code)"
            />
            {{ lang.label }}
            <span class="ld-sentences__count">{{ countBy((r) => r.missing[lang.code]) }}</span>
          </label>
        </FilterGroup>
        <FilterGroup title="Estado" :count="filters.estado.length">
          <label v-for="state in states" :key="state" class="ld-sentences__check">
            <input
              type="checkbox"
              :checked="filters.estado.includes(state)"
              @change="toggleInList('estado', state)"
            />
            <StatusBadge :status="state" />
            <span class="ld-sentences__count">{{ countBy((r) => r.state === state) }}</span>
          </label>
        </FilterGroup>
        <FilterGroup
          v-for="flag in yesNoFilters"
          :key="flag.key"
          :title="flag.title"
          :count="filters[flag.key] ? 1 : 0"
        >
          <div class="ld-sentences__radios">
            <label v-for="option in yesNo" :key="option.value">
              <input
                type="radio"
                :name="flag.key"
                :checked="filters[flag.key] === option.value"
                @change="setFilter(flag.key, option.value)"
              />
              {{ option.label }}
            </label>
          </div>
          <p v-if="flag.help" class="ld-sentences__help">{{ flag.help }}</p>
        </FilterGroup>
      </FilterPanel>

      <div class="ld-sentences__results">
        <p class="ld-sentences__summary" aria-live="polite">
          <strong>{{ filtered.length }}</strong> de {{ rows.length }} oraciones
        </p>
        <p v-if="error" class="ld-sentences__error" role="alert">{{ error }}</p>
        <DataTable
          :columns="columns"
          :rows="page.rows"
          :loading="loading"
          sort-key="text"
          :sort-dir="filters.orden === 'za' ? 'desc' : 'asc'"
          region-label="Oraciones del diccionario"
          @sort="({ dir }) => setFilter('orden', dir === 'desc' ? 'za' : 'az')"
          @row-click="openDetail"
        >
          <template #cell-text="{ row }">
            <span class="ld-sentences__benga">{{ row.text }}</span>
          </template>
          <template v-for="lang in languages" :key="lang.code" #[`cell-${lang.code}`]="{ row }">
            <GlossCell :text="row[lang.code]" />
            <span
              v-if="row.machine.includes(lang.code)"
              class="ld-sentences__machine"
              title="Traducción automática sin revisar"
              >🤖</span
            >
          </template>
          <template #cell-wordsText="{ row }">
            <span v-if="row.words.length" class="ld-sentences__words">{{ row.wordsText }}</span>
            <span v-else class="ld-sentences__none">sin enlazar</span>
          </template>
          <template #cell-audioCount="{ row }">{{
            row.audioCount ? `🔊 ${row.audioCount}` : '—'
          }}</template>
          <template #cell-state="{ row }">
            <span class="ld-sentences__badges">
              <StatusBadge :status="row.state" compact />
              <StatusBadge v-if="row.review" status="review" compact />
            </span>
          </template>
          <template #empty>
            <EmptyState icon="🔍" title="Ninguna oración" text="Prueba con otros filtros." />
          </template>
        </DataTable>
        <nav v-if="page.pages > 1" class="ld-sentences__pages" aria-label="Páginas">
          <button
            type="button"
            :disabled="page.page === 1"
            @click="setFilter('pagina', page.page - 1)"
          >
            ‹ Anterior
          </button>
          <span>{{ page.page }} / {{ page.pages }}</span>
          <button
            type="button"
            :disabled="page.page === page.pages"
            @click="setFilter('pagina', page.page + 1)"
          >
            Siguiente ›
          </button>
        </nav>
      </div>
    </div>

    <AdminDrawer v-model:open="detailOpen" title="Oración">
      <div v-if="detail" class="ld-sentences__detail">
        <p class="ld-sentences__benga ld-sentences__big">{{ detail.text }}</p>
        <StatusBadge :status="detail.state" />
        <div v-if="detail.review" class="ld-sentences__review" role="note">
          <strong>Necesita revisión</strong>
          <p>{{ detail.review.note }}</p>
        </div>
        <dl>
          <template v-for="lang in languages" :key="lang.code">
            <dt>{{ lang.label }}</dt>
            <dd>
              <GlossCell :text="detail[lang.code]" />
              <small v-if="detail.machine.includes(lang.code)"> (automática, sin revisar)</small>
            </dd>
          </template>
          <dt>Palabras</dt>
          <dd>{{ detail.wordsText || 'sin enlazar' }}</dd>
          <dt>Audios</dt>
          <dd>{{ detail.audioCount }}</dd>
        </dl>
        <p class="ld-sentences__help">La ficha para editar oraciones llega en la fase L4.</p>
      </div>
    </AdminDrawer>

    <AdminModal v-model:open="newOpen" title="Añadir oración">
      <form id="ld-new-sentence" class="ld-sentences__form" @submit.prevent="createNew">
        <label>
          Oración en benga
          <textarea v-model="draft.text" required rows="2"></textarea>
        </label>
        <div v-if="sameText" class="ld-sentences__warning" role="status">
          Ya existe esta oración: «{{ sameText.text }}».
        </div>
        <label>
          Traducción al español <small>(opcional)</small>
          <input v-model="draft.es" />
        </label>
        <label>
          Palabra de la que es ejemplo <small>(opcional)</small>
          <ChipSelect
            v-model="draft.senseIds"
            :options="senseOptions"
            :max="3"
            label="Palabra"
            placeholder="Buscar palabra…"
          />
        </label>
      </form>
      <template #footer>
        <button type="button" class="ld-sentences__link" @click="newOpen = false">Cancelar</button>
        <button type="submit" form="ld-new-sentence" class="ld-sentences__add" :disabled="saving">
          Guardar en la copia local
        </button>
      </template>
    </AdminModal>
  </section>
</template>

<script>
/**
 * Sentences table of /admin/living-dictionary (task L3.4): search, filters (missing translation,
 * machine translation, audio, linked word, state, review), sort, pages, «Añadir oración».
 * Logic: src/utils/dictionaryFilters.js (sentenceRow, filterSentenceRows…).
 */
import DataTable from '@/components/admin/DataTable.vue'
import FilterPanel from '@/components/admin/FilterPanel.vue'
import FilterGroup from '@/components/admin/FilterGroup.vue'
import ChipSelect from '@/components/admin/ChipSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import EmptyState from '@/components/admin/EmptyState.vue'
import AdminDrawer from '@/components/admin/AdminDrawer.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import { toast } from '@/components/admin/toast'
import GlossCell from './GlossCell.vue'
import { getEntries, getSentences, createSentence } from './ldApi'
import {
  plain,
  sentenceRow,
  sentenceFiltersFromQuery,
  filterSentenceRows,
  sortSentenceRows,
  queryFromFilters,
  paginate
} from '@/utils/dictionaryFilters'

export default {
  name: 'LdSentences',
  components: {
    DataTable,
    FilterPanel,
    FilterGroup,
    ChipSelect,
    StatusBadge,
    EmptyState,
    AdminDrawer,
    AdminModal,
    GlossCell
  },
  data() {
    return {
      entries: [],
      sentences: [],
      loading: true,
      error: '',
      languages: [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'Inglés' },
        { code: 'fr', label: 'Francés' }
      ],
      states: ['synced', 'local-changes', 'new', 'conflict', 'error'],
      yesNoFilters: [
        { key: 'audio', title: 'Audio' },
        { key: 'palabra', title: 'Enlazada a una palabra' },
        {
          key: 'maquina',
          title: 'Traducción automática',
          help: 'Traducciones hechas por Claude u otra máquina que una persona aún no revisó.'
        },
        { key: 'revision', title: 'Necesita revisión' }
      ],
      yesNo: [
        { value: '', label: 'Todas' },
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' }
      ],
      columns: [
        { key: 'text', label: 'Oración', sortable: true, width: '14rem' },
        { key: 'es', label: 'Español', width: '10rem' },
        { key: 'en', label: 'Inglés', width: '10rem' },
        { key: 'fr', label: 'Francés', width: '10rem' },
        { key: 'wordsText', label: 'Palabras' },
        { key: 'audioCount', label: 'Audio', align: 'center' },
        { key: 'state', label: 'Estado', align: 'center' }
      ],
      detail: null,
      detailOpen: false,
      newOpen: false,
      draft: { text: '', es: '', senseIds: [] },
      saving: false
    }
  },
  computed: {
    filters() {
      return sentenceFiltersFromQuery(this.$route.query)
    },
    senseWords() {
      const map = {}
      for (const entry of this.entries) {
        entry.senses.forEach((sense, index) => {
          map[sense.id] = {
            entryId: entry.id,
            lexeme: entry.lexeme,
            gloss: sense.glosses?.es || '',
            index
          }
        })
      }
      return map
    },
    senseOptions() {
      return Object.entries(this.senseWords).map(([id, word]) => ({
        value: id,
        label: `${word.lexeme}${word.gloss ? ` (${word.gloss})` : ''}`
      }))
    },
    rows() {
      return this.sentences.map((sentence) => sentenceRow(sentence, this.senseWords))
    },
    filtered() {
      return sortSentenceRows(filterSentenceRows(this.rows, this.filters), this.filters.orden)
    },
    page() {
      return paginate(this.filtered, this.filters.pagina, 50)
    },
    activeCount() {
      const f = this.filters
      return (
        f.falta.length +
        f.estado.length +
        ['audio', 'palabra', 'maquina', 'revision'].filter((key) => f[key]).length
      )
    },
    sameText() {
      const text = plain(this.draft.text)
      return text ? this.rows.find((row) => plain(row.text) === text) : null
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        ;[this.entries, this.sentences] = await Promise.all([getEntries(), getSentences()])
        this.error = ''
      } catch (error) {
        this.error = `No se pudo leer el diccionario local: ${error.message}`
      } finally {
        this.loading = false
      }
    },
    countBy(test) {
      return this.rows.filter((row) => test(row)).length
    },
    setFilter(key, value) {
      const filters = { ...this.filters, [key]: value }
      if (key !== 'pagina') filters.pagina = 1
      this.$router.replace({ query: queryFromFilters(filters) })
    },
    toggleInList(key, value) {
      const current = this.filters[key]
      this.setFilter(
        key,
        current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      )
    },
    openDetail(row) {
      this.detail = row
      this.detailOpen = true
    },
    openNew() {
      this.draft = { text: '', es: '', senseIds: [] }
      this.newOpen = true
    },
    async createNew() {
      this.saving = true
      try {
        await createSentence({
          text: this.draft.text.trim(),
          translations: this.draft.es.trim() ? { es: this.draft.es.trim() } : null,
          senseIds: this.draft.senseIds
        })
        toast('Oración guardada en la copia local (aún no enviada al diccionario)', {
          type: 'success'
        })
        this.newOpen = false
        await this.load()
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
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

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.ld-sentences {
  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__search {
    flex: 1 1 280px;

    input {
      width: 100%;
      padding: $spacing-sm $spacing-md;
      border: 1px solid #c9c2b5;
      border-radius: $border-radius;
      font-size: $font-size-base;

      &:focus-visible {
        @include focus-ring;
      }
    }
  }

  &__inline {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $color-text-secondary;

    select {
      width: auto;
    }
  }

  &__add {
    @include button-primary;
    margin-left: auto;
  }

  &__link {
    background: none;
    border: none;
    color: $color-primary;
    text-decoration: underline;
    cursor: pointer;
  }

  &__layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: $spacing-lg;
    align-items: start;

    @include respond-below('md') {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__check {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: 2px 0;
    font-size: $font-size-sm;
  }

  &__count {
    margin-left: auto;
    color: $color-text-muted;
    font-size: $font-size-xs;
  }

  &__radios {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-sm;
  }

  &__help {
    margin: $spacing-xs 0 0;
    color: $color-text-muted;
    font-size: $font-size-xs;
  }

  &__summary {
    margin: 0 0 $spacing-sm;
    color: $color-text-secondary;
  }

  &__error {
    color: $color-error;
  }

  &__benga {
    @include benga-word-style;
    font-weight: $font-weight-semibold;
  }

  &__big {
    font-size: $font-size-xl;
  }

  &__machine {
    margin-left: 2px;
    font-size: $font-size-xs;
  }

  &__words {
    font-size: $font-size-sm;
  }

  &__none {
    color: $color-text-muted;
    font-size: $font-size-xs;
    font-style: italic;
  }

  &__badges {
    display: inline-flex;
    gap: 4px;
  }

  &__pages {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-md;
    margin-top: $spacing-md;
  }

  &__detail {
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: $spacing-xs $spacing-md;
      font-size: $font-size-sm;
    }

    dt {
      color: $color-text-muted;
    }

    dd {
      margin: 0;
    }
  }

  &__review {
    margin: $spacing-md 0;
    padding: $spacing-sm $spacing-md;
    background: rgba(#e08a00, 0.1);
    border-left: 4px solid #e08a00;
    font-size: $font-size-sm;

    p {
      margin: $spacing-xs 0 0;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    label {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      font-weight: $font-weight-semibold;
    }

    small {
      font-weight: normal;
      color: $color-text-muted;
    }

    input,
    textarea {
      padding: $spacing-sm;
      border: 1px solid #c9c2b5;
      border-radius: $border-radius-sm;
      font: inherit;
    }
  }

  &__warning {
    padding: $spacing-sm $spacing-md;
    background: rgba($color-warning, 0.15);
    border-left: 4px solid $color-warning;
    font-size: $font-size-sm;
  }
}
</style>
