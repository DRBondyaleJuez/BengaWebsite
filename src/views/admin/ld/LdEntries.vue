<template>
  <section class="ld-entries">
    <div class="ld-entries__toolbar">
      <label class="ld-entries__search">
        <span class="visually-hidden">Buscar</span>
        <input
          ref="search"
          :value="filters.q"
          type="search"
          placeholder="Buscar palabra o traducción (sin importar acentos)…"
          @input="setFilter('q', $event.target.value)"
        />
      </label>
      <label class="ld-entries__inline">
        Tolerancia
        <select :value="filters.tol" @change="setFilter('tol', Number($event.target.value))">
          <option v-for="n in [0, 1, 2, 3]" :key="n" :value="n">{{ n }}</option>
        </select>
        <InfoTip
          text="Cuántas letras equivocadas se aceptan en la búsqueda (1 desde 4 letras, 2 desde 7, 3 desde 10). 0 = solo coincidencias exactas."
        />
      </label>
      <label class="ld-entries__inline">
        Orden
        <select :value="filters.orden" @change="setFilter('orden', $event.target.value)">
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="recientes">Cambios locales primero</option>
          <option value="revision">Por revisar primero</option>
        </select>
      </label>
      <div class="ld-entries__views" role="group" aria-label="Vista">
        <button
          v-for="option in viewOptions"
          :key="option.value"
          type="button"
          :aria-pressed="view === option.value"
          :class="{ 'ld-entries__view--on': view === option.value }"
          @click="setView(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <details v-if="view === 'tabla'" class="ld-entries__columns">
        <summary>Columnas</summary>
        <label v-for="column in allColumns" :key="column.key">
          <input
            type="checkbox"
            :checked="!hiddenColumns.includes(column.key)"
            :disabled="column.key === 'lexeme'"
            @change="toggleColumn(column.key)"
          />
          {{ column.label }}
        </label>
      </details>
      <button type="button" class="ld-entries__add" @click="openNew">+ Añadir palabra</button>
    </div>

    <div class="ld-entries__layout">
      <FilterPanel :active-count="activeCount" @clear="clearFilters">
        <FilterGroup title="Estado" :count="filters.estado.length">
          <label v-for="state in states" :key="state.value" class="ld-entries__check">
            <input
              type="checkbox"
              :checked="filters.estado.includes(state.value)"
              @change="toggleInList('estado', state.value)"
            />
            <StatusBadge :status="state.value" />
            <span class="ld-entries__count">{{ countBy((r) => r.state === state.value) }}</span>
          </label>
        </FilterGroup>

        <FilterGroup title="Revisión" :count="filters.revision ? 1 : 0">
          <select
            class="ld-entries__select"
            :value="filters.revision"
            @change="setFilter('revision', $event.target.value)"
          >
            <option value="">Todas</option>
            <option value="si">Necesitan revisión ({{ countBy((r) => r.review) }})</option>
            <option value="no">Sin revisión pendiente</option>
            <option v-for="category in reviewCategories" :key="category.id" :value="category.id">
              {{ category.es }} ({{ countBy((r) => r.review?.category === category.id) }})
            </option>
          </select>
          <label class="ld-entries__check">
            <input
              type="checkbox"
              :checked="filters.sugerencias === 'si'"
              @change="setFilter('sugerencias', $event.target.checked ? 'si' : '')"
            />
            Con sugerencias pendientes
            <span class="ld-entries__count">{{ countBy((r) => r.suggestions) }}</span>
          </label>
        </FilterGroup>

        <FilterGroup title="Le falta" :count="filters.falta.length">
          <label v-for="item in missingOptions" :key="item.value" class="ld-entries__check">
            <input
              type="checkbox"
              :checked="filters.falta.includes(item.value)"
              @change="toggleInList('falta', item.value)"
            />
            {{ item.label }}
            <span class="ld-entries__count">{{ countBy((r) => r.missing[item.value]) }}</span>
          </label>
        </FilterGroup>

        <FilterGroup title="Categoría gramatical" :count="filters.pos.length">
          <ChipSelect
            :model-value="filters.pos"
            :options="posOptions"
            label="Categoría gramatical"
            placeholder="Buscar categoría…"
            @update:model-value="setFilter('pos', $event)"
          />
        </FilterGroup>

        <FilterGroup title="Dominio semántico" :count="filters.dom.length" :open="false">
          <TreeSelect
            :model-value="filters.dom"
            :options="domainOptions"
            @update:model-value="setFilter('dom', $event)"
          />
        </FilterGroup>

        <FilterGroup title="Clase nominal" :count="filters.nc.length">
          <div class="ld-entries__classes">
            <label v-for="value in nounClasses" :key="value" class="ld-entries__pill">
              <input
                type="checkbox"
                :checked="filters.nc.includes(value)"
                @change="toggleInList('nc', value)"
              />
              {{ value === 'ninguna' ? 'Sin clase' : value }}
            </label>
          </div>
        </FilterGroup>

        <FilterGroup
          v-for="flag in yesNoFilters"
          :key="flag.key"
          :title="flag.title"
          :count="filters[flag.key] ? 1 : 0"
        >
          <div class="ld-entries__radios">
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
        </FilterGroup>
      </FilterPanel>

      <div class="ld-entries__results">
        <p class="ld-entries__summary" aria-live="polite">
          <strong>{{ filtered.length }}</strong> de {{ rows.length }} entradas
          <template v-if="page.pages > 1"> · página {{ page.page }} de {{ page.pages }}</template>
        </p>
        <p v-if="error" class="ld-entries__error" role="alert">{{ error }}</p>

        <div
          v-if="view === 'tabla'"
          class="ld-entries__bulk"
          :class="{ 'ld-entries__bulk--on': selected.length }"
        >
          <template v-if="selected.length">
            <strong>{{ selected.length }} seleccionadas</strong>
            <button
              v-for="action in bulkActions"
              :key="action.id"
              type="button"
              @click="openBulk(action)"
            >
              {{ action.label }}
            </button>
            <button type="button" @click="exportCsv">⬇ Exportar CSV</button>
            <button type="button" class="ld-entries__link" @click="selected = []">
              Deseleccionar
            </button>
          </template>
          <template v-else>
            <span>Marca filas para cambiar varias a la vez.</span>
            <button
              v-if="filtered.length"
              type="button"
              class="ld-entries__link"
              @click="selected = filtered.map((row) => row.id)"
            >
              Seleccionar las {{ filtered.length }} filtradas
            </button>
          </template>
        </div>

        <DataTable
          v-if="view === 'tabla'"
          :columns="columns"
          :rows="page.rows"
          :loading="loading"
          :sort-key="sortKey"
          :sort-dir="sortDir"
          region-label="Entradas del diccionario"
          selectable
          v-model:selected="selected"
          @sort="onSort"
          @row-click="openDetail"
        >
          <template #cell-lexeme="{ row }">
            <span class="ld-entries__word">{{ row.lexeme }}</span
            ><sup v-if="row.homograph">{{ row.homograph }}</sup>
          </template>
          <template #cell-es="{ row }"><GlossCell :text="row.es" /></template>
          <template #cell-en="{ row }"><GlossCell :text="row.en" /></template>
          <template #cell-fr="{ row }"><GlossCell :text="row.fr" /></template>
          <template #cell-pos="{ row }">
            <span v-for="code in row.pos" :key="code" class="ld-entries__tag">{{
              posLabel(code)
            }}</span>
          </template>
          <template #cell-domains="{ row }">
            <span
              v-for="key in row.domains.slice(0, 2)"
              :key="key"
              class="ld-entries__tag ld-entries__tag--domain"
              >{{ domainLabel(key) }}</span
            >
            <span v-if="row.domains.length > 2" class="ld-entries__more"
              >+{{ row.domains.length - 2 }}</span
            >
          </template>
          <template #cell-nounClasses="{ row }">{{ row.nounClasses.join(', ') }}</template>
          <template #cell-audioCount="{ row }">
            <span :class="{ 'ld-entries__none': !row.audioCount }">
              {{ row.audioCount ? `🔊 ${row.audioCount}` : '—' }}
            </span>
          </template>
          <template #cell-exampleCount="{ row }">{{ row.exampleCount || '—' }}</template>
          <template #cell-state="{ row }">
            <span class="ld-entries__badges">
              <StatusBadge :status="row.state" compact />
              <StatusBadge v-if="row.review" status="review" compact />
              <span v-if="row.suggestions" class="ld-entries__more" title="Sugerencias"
                >💡{{ row.suggestions }}</span
              >
            </span>
          </template>
          <template #empty>
            <EmptyState icon="🔍" title="Ninguna entrada" text="Prueba con otros filtros.">
              <button type="button" class="ld-entries__link" @click="clearFilters">
                Quitar filtros
              </button>
            </EmptyState>
          </template>
        </DataTable>

        <ul v-else class="ld-entries__list">
          <li v-for="row in page.rows" :key="row.id">
            <button type="button" class="ld-entries__card" @click="openDetail(row)">
              <span class="ld-entries__card-head">
                <span class="ld-entries__word">{{ row.lexeme }}</span
                ><sup v-if="row.homograph">{{ row.homograph }}</sup>
                <StatusBadge v-if="row.state !== 'synced'" :status="row.state" />
                <StatusBadge v-if="row.review" status="review" />
                <StatusBadge v-if="!row.audioCount" status="no-audio" />
              </span>
              <span class="ld-entries__card-line">
                <em v-if="row.pos.length">{{ row.pos.map(posLabel).join(', ') }}</em>
                {{ [row.es, row.en, row.fr].filter(Boolean).join(' · ') || 'Sin traducción' }}
              </span>
              <span v-if="row.plural" class="ld-entries__card-line">Plural: {{ row.plural }}</span>
              <span v-if="row.domains.length" class="ld-entries__card-line">
                <span
                  v-for="key in row.domains"
                  :key="key"
                  class="ld-entries__tag ld-entries__tag--domain"
                  >{{ domainLabel(key) }}</span
                >
              </span>
            </button>
          </li>
          <li v-if="!page.rows.length && !loading">
            <EmptyState icon="🔍" title="Ninguna entrada" text="Prueba con otros filtros." />
          </li>
        </ul>

        <nav v-if="page.pages > 1" class="ld-entries__pages" aria-label="Páginas">
          <button type="button" :disabled="page.page === 1" @click="goTo(page.page - 1)">
            ‹ Anterior
          </button>
          <span>{{ page.page }} / {{ page.pages }}</span>
          <button type="button" :disabled="page.page === page.pages" @click="goTo(page.page + 1)">
            Siguiente ›
          </button>
        </nav>
      </div>
    </div>

    <AdminModal v-model:open="bulkOpen" :title="bulk ? bulk.label : ''">
      <form v-if="bulk" id="ld-bulk" class="ld-entries__form" @submit.prevent="runBulk">
        <p>
          Se cambiarán <strong>{{ selected.length }}</strong> entradas en la copia local. Nada se
          envía al diccionario hasta «Enviar cambios».
        </p>
        <template v-if="bulk.id === 'review-set'">
          <label>
            Motivo
            <select v-model="bulkValue.category" required>
              <option v-for="category in reviewCategories" :key="category.id" :value="category.id">
                {{ category.es }}
              </option>
            </select>
          </label>
          <label>
            Nota (una pregunta clara)
            <textarea v-model="bulkValue.note" rows="3" required></textarea>
          </label>
        </template>
        <label v-else-if="bulk.id === 'domain-add'">
          Dominio semántico (se añade a todos los sentidos)
          <select v-model="bulkValue.key" required>
            <option v-for="option in domainOptions" :key="option.value" :value="option.value">
              {{ option.parent ? '— ' : '' }}{{ option.label }}
            </option>
          </select>
        </label>
        <label v-else-if="bulk.id === 'pos-set'">
          Categoría gramatical (solo palabras con un sentido)
          <select v-model="bulkValue.code" required>
            <optgroup v-for="group in posGroups" :key="group.label" :label="group.label">
              <option v-for="option in group.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </optgroup>
          </select>
        </label>
        <label v-else-if="bulk.id === 'tag-add'">
          Etiqueta
          <input v-model="bulkValue.name" required placeholder="p. ej. Salvado y Cos 1891" />
        </label>
        <p v-else>Se quitará la marca «Necesita revisión» de estas entradas.</p>
      </form>
      <template #footer>
        <button type="button" class="ld-entries__link" @click="bulkOpen = false">Cancelar</button>
        <button type="submit" form="ld-bulk" class="ld-entries__add" :disabled="saving">
          Aplicar a {{ selected.length }}
        </button>
      </template>
    </AdminModal>
  </section>
</template>

<script>
/**
 * Entries table of /admin/living-dictionary (task L3.3): search (accents ignored, typo
 * tolerance), filters in a side panel, sorting, table or list view, column chooser, pages of 50,
 * filters kept in the URL (the Panel links here with them). Logic: src/utils/dictionaryFilters.js.
 * Clicking a row opens its form (EntryForm.vue, `…/entrada/:id`); «Volver» keeps the filters.
 */
import DataTable from '@/components/admin/DataTable.vue'
import FilterPanel from '@/components/admin/FilterPanel.vue'
import FilterGroup from '@/components/admin/FilterGroup.vue'
import ChipSelect from '@/components/admin/ChipSelect.vue'
import TreeSelect from '@/components/admin/TreeSelect.vue'
import InfoTip from '@/components/admin/InfoTip.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import EmptyState from '@/components/admin/EmptyState.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import { toast } from '@/components/admin/toast'
import GlossCell from './GlossCell.vue'
import { getEntries, bulkEntries } from './ldApi'
import { POS_OPTIONS, DOMAIN_OPTIONS, REVIEW_CATEGORIES, posLabel, domainLabel } from './vocab'
import {
  entryRow,
  filtersFromQuery,
  queryFromFilters,
  activeFilterCount,
  filterRows,
  sortRows,
  paginate
} from '@/utils/dictionaryFilters'

const COLUMNS = [
  { key: 'lexeme', label: 'Palabra', sortable: true },
  { key: 'es', label: 'Español', width: '8rem' },
  { key: 'en', label: 'Inglés', width: '8rem' },
  { key: 'fr', label: 'Francés', width: '8rem' },
  { key: 'pos', label: 'Categoría', width: '8rem' },
  { key: 'domains', label: 'Dominios', width: '11rem' },
  { key: 'nounClasses', label: 'Clase', align: 'center' },
  { key: 'audioCount', label: 'Audio', align: 'center' },
  { key: 'exampleCount', label: 'Ejemplos', align: 'center' },
  { key: 'state', label: 'Estado', align: 'center' }
]
const STORAGE = 'ld-entries-settings'

function readSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || {}
  } catch {
    return {}
  }
}

export default {
  name: 'LdEntries',
  components: {
    DataTable,
    FilterPanel,
    FilterGroup,
    ChipSelect,
    TreeSelect,
    InfoTip,
    StatusBadge,
    EmptyState,
    AdminModal,
    GlossCell
  },
  data() {
    const settings = readSettings()
    return {
      entries: [],
      loading: true,
      error: '',
      view: settings.view || 'tabla',
      hiddenColumns: settings.hiddenColumns || [],
      allColumns: COLUMNS,
      viewOptions: [
        { value: 'tabla', label: 'Tabla' },
        { value: 'lista', label: 'Lista' }
      ],
      states: [
        { value: 'synced' },
        { value: 'local-changes' },
        { value: 'new' },
        { value: 'conflict' },
        { value: 'error' }
      ],
      missingOptions: [
        { value: 'es', label: 'Traducción al español' },
        { value: 'en', label: 'Traducción al inglés' },
        { value: 'fr', label: 'Traducción al francés' },
        { value: 'pos', label: 'Categoría gramatical' },
        { value: 'dominio', label: 'Dominio semántico' }
      ],
      nounClasses: ['1', '2', '3', '4', '5', '6', '7', 'ninguna'],
      yesNoFilters: [
        { key: 'audio', title: 'Audio' },
        { key: 'ejemplo', title: 'Oración de ejemplo' },
        { key: 'web', title: 'Enlazada con la web' }
      ],
      yesNo: [
        { value: '', label: 'Todas' },
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' }
      ],
      reviewCategories: REVIEW_CATEGORIES,
      domainOptions: DOMAIN_OPTIONS,
      selected: [],
      bulk: null,
      bulkOpen: false,
      bulkValue: {},
      bulkActions: [
        { id: 'review-set', label: '⚑ Marcar revisión' },
        { id: 'review-clear', label: '✓ Quitar revisión' },
        { id: 'domain-add', label: '+ Dominio' },
        { id: 'pos-set', label: '+ Categoría' },
        { id: 'tag-add', label: '+ Etiqueta' }
      ],
      saving: false
    }
  },
  computed: {
    filters() {
      return filtersFromQuery(this.$route.query)
    },
    rows() {
      return this.entries.map(entryRow)
    },
    filtered() {
      return sortRows(filterRows(this.rows, this.filters), this.filters.orden)
    },
    page() {
      return paginate(this.filtered, this.filters.pagina, 50)
    },
    activeCount() {
      return activeFilterCount(this.filters)
    },
    columns() {
      return COLUMNS.filter((column) => !this.hiddenColumns.includes(column.key))
    },
    sortKey() {
      return 'lexeme'
    },
    sortDir() {
      return this.filters.orden === 'za' ? 'desc' : 'asc'
    },
    posOptions() {
      const counts = new Map()
      for (const row of this.rows)
        for (const code of row.pos) counts.set(code, (counts.get(code) || 0) + 1)
      return POS_OPTIONS.map((option) => ({ ...option, count: counts.get(option.value) || 0 }))
    },
    posGroups() {
      const groups = []
      for (const option of POS_OPTIONS) {
        let group = groups.find((item) => item.label === option.group)
        if (!group) {
          group = { label: option.group, options: [] }
          groups.push(group)
        }
        group.options.push(option)
      }
      return groups
    }
  },
  watch: {
    '$route.query.nueva': {
      immediate: true,
      handler(value) {
        // the Panel links here with ?nueva=1 («Añadir palabra»): go straight to the new-word form
        if (value) {
          this.$router.replace({
            path: '/admin/living-dictionary/entrada/nueva',
            query: { volver: '/admin/living-dictionary/entradas' }
          })
        }
      }
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    posLabel,
    domainLabel,
    async load() {
      this.loading = true
      try {
        this.entries = await getEntries()
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
    clearFilters() {
      this.$router.replace({ query: {} })
    },
    goTo(page) {
      this.setFilter('pagina', page)
    },
    onSort({ key, dir }) {
      if (key === 'lexeme') this.setFilter('orden', dir === 'desc' ? 'za' : 'az')
    },
    saveSettings() {
      try {
        localStorage.setItem(
          STORAGE,
          JSON.stringify({ view: this.view, hiddenColumns: this.hiddenColumns })
        )
      } catch {
        // private window or storage blocked: the settings just aren't remembered
      }
    },
    setView(view) {
      this.view = view
      this.saveSettings()
    },
    toggleColumn(key) {
      this.hiddenColumns = this.hiddenColumns.includes(key)
        ? this.hiddenColumns.filter((item) => item !== key)
        : [...this.hiddenColumns, key]
      this.saveSettings()
    },
    /** Opens the form of an entry; «Volver» returns to this list with the same filters. */
    openDetail(row) {
      this.$router.push({
        path: `/admin/living-dictionary/entrada/${row.id}`,
        query: { volver: this.$route.fullPath }
      })
    },
    openBulk(action) {
      this.bulk = action
      this.bulkValue = action.id === 'review-set' ? { category: 'other', note: '' } : {}
      this.bulkOpen = true
    },
    async runBulk() {
      this.saving = true
      try {
        const { changed, skipped } = await bulkEntries(this.selected, this.bulk.id, this.bulkValue)
        const notes = skipped
          .filter((item) => item.word)
          .map((item) => `${item.word}: ${item.reason}`)
        const message =
          `${changed.length} entradas cambiadas` +
          (notes.length ? ` · sin cambiar: ${notes.join('; ')}` : '')
        toast(message, {
          type: changed.length ? 'success' : 'info',
          timeout: notes.length ? 10000 : 4000
        })
        this.bulkOpen = false
        await this.load()
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
      } finally {
        this.saving = false
      }
    },
    exportCsv() {
      const rows = this.rows.filter((row) => this.selected.includes(row.id))
      const header = [
        'palabra',
        'homografo',
        'espanol',
        'ingles',
        'frances',
        'categoria',
        'dominios',
        'clase',
        'plural',
        'audios'
      ]
      const cell = (value) => '"' + String(value ?? '').replace(/"/g, '""') + '"'
      const lines = rows.map((row) =>
        [
          row.lexeme,
          row.homograph,
          row.es,
          row.en,
          row.fr,
          row.pos.map(posLabel).join(', '),
          row.domains.map(domainLabel).join(', '),
          row.nounClasses.join(', '),
          row.plural,
          row.audioCount
        ]
          .map(cell)
          .join(';')
      )
      // ";" and a BOM so Excel in Spanish opens it in columns with the accents right
      const text = '\ufeff' + [header.join(';'), ...lines].join('\r\n')
      const link = document.createElement('a')
      link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
      link.download = `palabras-benga-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    openNew() {
      this.$router.push({
        path: '/admin/living-dictionary/entrada/nueva',
        query: { volver: this.$route.fullPath }
      })
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

.ld-entries {
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

  &__views {
    display: inline-flex;
    border: 1px solid $color-primary;
    border-radius: $border-radius-sm;
    overflow: hidden;

    button {
      padding: $spacing-xs $spacing-md;
      background: $color-surface;
      border: none;
      cursor: pointer;
    }
  }

  &__view--on {
    background: $color-primary !important;
    color: $color-text-inverse;
  }

  &__columns {
    position: relative;
    font-size: $font-size-sm;

    summary {
      cursor: pointer;
    }

    label {
      display: block;
      white-space: nowrap;
    }

    &[open] > :not(summary) {
      background: $color-surface;
    }

    &[open] {
      padding: $spacing-xs $spacing-sm;
      background: $color-surface;
      border: 1px solid $color-surface-alt;
      border-radius: $border-radius-sm;
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
    grid-template-columns: 280px minmax(0, 1fr);
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

  &__select {
    width: 100%;
    margin-bottom: $spacing-xs;
  }

  &__classes {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__pill {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px $spacing-sm;
    border: 1px solid $color-surface-alt;
    border-radius: 999px;
    font-size: $font-size-sm;
  }

  &__radios {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-sm;
  }

  &__summary {
    margin: 0 0 $spacing-sm;
    color: $color-text-secondary;
  }

  &__error {
    color: $color-error;
  }

  &__word {
    @include benga-word-style;
    font-weight: $font-weight-bold;
  }

  &__tag {
    display: inline-block;
    margin: 1px 2px 1px 0;
    padding: 0 $spacing-xs;
    background: $color-surface-alt;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    white-space: nowrap;

    &--domain {
      background: rgba($color-primary, 0.08);
    }
  }

  &__more {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__none {
    color: $color-text-muted;
  }

  &__badges {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: 0;
    list-style: none;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    padding: $spacing-md;
    background: $color-surface;
    border: 1px solid $color-surface-alt;
    border-radius: $border-radius;
    text-align: left;
    cursor: pointer;

    &:hover {
      border-color: $color-primary-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__card-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-lg;
  }

  &__card-line {
    font-size: $font-size-sm;
    color: $color-text-secondary;

    em {
      margin-right: $spacing-xs;
    }
  }

  &__bulk {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs $spacing-sm;
    min-height: 2.5rem;
    margin-bottom: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    color: $color-text-muted;
    font-size: $font-size-sm;

    &--on {
      background: rgba($color-primary, 0.08);
      color: $color-text-primary;
    }

    button:not(.ld-entries__link) {
      padding: 2px $spacing-sm;
      background: $color-surface;
      border: 1px solid $color-primary;
      border-radius: $border-radius-sm;
      color: $color-primary-dark;
      cursor: pointer;

      &:hover {
        background: $color-primary;
        color: $color-text-inverse;
      }
    }
  }

  &__pages {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-md;
    margin-top: $spacing-md;
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

    input {
      padding: $spacing-sm;
      border: 1px solid #c9c2b5;
      border-radius: $border-radius-sm;
      font-size: $font-size-base;
    }
  }

  &__letters {
    margin: -$spacing-sm 0 0;
    font-size: $font-size-sm;

    button {
      margin-left: $spacing-xs;
      padding: 0 $spacing-sm;
      font-size: $font-size-base;
      cursor: pointer;
    }
  }

  &__warning {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-warning, 0.15);
    border-left: 4px solid $color-warning;
    font-size: $font-size-sm;
  }
}
</style>
