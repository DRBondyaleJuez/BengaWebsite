<!--
  UiKitDemo - dev-only page that shows every admin UI-kit component (src/components/admin/)
  with Benga dictionary sample data. Route (added by the main session):
  /admin/living-dictionary/kit
-->
<template>
  <div class="kit">
    <h1 class="kit__title">Kit de interfaz del administrador</h1>
    <p class="kit__intro">
      Componentes de <code>src/components/admin/</code> con datos de ejemplo.
    </p>

    <section class="kit__section">
      <h2>StatusBadge</h2>
      <div class="kit__row">
        <StatusBadge v-for="s in statuses" :key="s" :status="s" />
        <StatusBadge status="new" label="Nueva (3)" />
        <StatusBadge v-for="s in statuses" :key="`c-${s}`" :status="s" compact />
      </div>
    </section>

    <section class="kit__section">
      <h2>InfoTip</h2>
      <p>
        Categoría gramatical
        <InfoTip text="Palabra que nombra personas, animales, cosas o ideas." /> · Dominio semántico
        <InfoTip>Tema general del significado, p. ej. <em>Plantas</em>.</InfoTip>
      </p>
    </section>

    <section class="kit__section">
      <h2>DataTable, FilterPanel y FilterGroup</h2>
      <div class="kit__layout">
        <FilterPanel :active-count="activeFilters" @clear="clearFilters">
          <FilterGroup title="Estado" :count="statusFilter.length">
            <ChipSelect
              v-model="statusFilter"
              :options="statusOptions"
              label="Estado"
              placeholder="Estado…"
            />
          </FilterGroup>
          <FilterGroup title="Categoría gramatical" :count="posFilter.length">
            <ChipSelect
              v-model="posFilter"
              :options="posOptions"
              label="Categoría gramatical"
              placeholder="Buscar categoría…"
            />
          </FilterGroup>
        </FilterPanel>
        <div class="kit__table">
          <DataTable
            v-model:selected="selected"
            :columns="columns"
            :rows="sortedRows"
            :sort-key="sortKey"
            :sort-dir="sortDir"
            selectable
            :loading="loading"
            empty-text="Ninguna entrada coincide con los filtros."
            @sort="onSort"
            @row-click="openRow"
          >
            <template #cell-word="{ row }">
              <strong class="kit__benga">{{ row.word }}</strong>
            </template>
            <template #cell-status="{ row }"><StatusBadge :status="row.status" /></template>
            <template #empty>
              <EmptyState icon="🔍" title="Sin resultados" text="Prueba con otros filtros.">
                <button type="button" class="kit__btn" @click="clearFilters">Quitar filtros</button>
              </EmptyState>
            </template>
          </DataTable>
          <p class="kit__note">Seleccionadas: {{ selected.length }}</p>
          <div class="kit__row">
            <button type="button" class="kit__btn" @click="simulateLoading">Simular carga</button>
          </div>
        </div>
      </div>
    </section>

    <section class="kit__section">
      <h2>ChipSelect (91 categorías gramaticales)</h2>
      <ChipSelect
        v-model="posChosen"
        :options="posOptions"
        label="Categorías gramaticales"
        placeholder="Buscar: sustantivo, verbo…"
      />
      <p class="kit__note">Valores: {{ posChosen.join(', ') || '(ninguno)' }}</p>
    </section>

    <section class="kit__section">
      <h2>TreeSelect (dominios semánticos)</h2>
      <TreeSelect
        v-model="domainsChosen"
        :options="domainOptions"
        label="Dominios semánticos"
        placeholder="Buscar dominio: plantas, mano…"
      />
    </section>

    <section class="kit__section">
      <h2>AdminModal, AdminDrawer, ToastHost</h2>
      <div class="kit__row">
        <button type="button" class="kit__btn" @click="modalOpen = true">Abrir diálogo</button>
        <button type="button" class="kit__btn" @click="drawerOpen = true">
          Abrir panel lateral
        </button>
        <button
          type="button"
          class="kit__btn"
          @click="toast('Entrada guardada', { type: 'success' })"
        >
          Éxito
        </button>
        <button
          type="button"
          class="kit__btn"
          @click="toast('No se pudo enviar', { type: 'error' })"
        >
          Error
        </button>
        <button
          type="button"
          class="kit__btn"
          @click="toast('Hay 3 cambios sin enviar', { type: 'warning' })"
        >
          Aviso
        </button>
        <button type="button" class="kit__btn" @click="toast('Sincronizando…')">Info</button>
      </div>
    </section>

    <section class="kit__section">
      <h2>EmptyState</h2>
      <EmptyState icon="📚" title="Aún no hay frases" text="Añade la primera frase de ejemplo.">
        <button type="button" class="kit__btn">Añadir frase</button>
      </EmptyState>
    </section>

    <AdminModal v-model:open="modalOpen" title="Editar entrada: Ele">
      <p>
        <strong class="kit__benga">Ele</strong> — Árbol. Pulsa Escape, la X o fuera del diálogo para
        cerrar.
      </p>
      <label class="kit__field"
        >Significado
        <input v-model="meaning" type="text" />
      </label>
      <template #footer>
        <button type="button" class="kit__btn" @click="modalOpen = false">Cancelar</button>
        <button type="button" class="kit__btn kit__btn--primary" @click="save">Guardar</button>
      </template>
    </AdminModal>

    <AdminDrawer v-model:open="drawerOpen" :title="`Entrada: ${current ? current.word : ''}`">
      <p v-if="current">
        <strong class="kit__benga">{{ current.word }}</strong> — {{ current.meaning }}
      </p>
      <p v-if="current"><StatusBadge :status="current.status" /></p>
    </AdminDrawer>

    <ToastHost />
  </div>
</template>

<script>
import DataTable from '@/components/admin/DataTable.vue'
import FilterPanel from '@/components/admin/FilterPanel.vue'
import FilterGroup from '@/components/admin/FilterGroup.vue'
import ChipSelect from '@/components/admin/ChipSelect.vue'
import TreeSelect from '@/components/admin/TreeSelect.vue'
import InfoTip from '@/components/admin/InfoTip.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminDrawer from '@/components/admin/AdminDrawer.vue'
import ToastHost from '@/components/admin/ToastHost.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import EmptyState from '@/components/admin/EmptyState.vue'
import { toast } from '@/components/admin/toast'
import partsOfSpeech from '@/data/dictionary/vocab/parts-of-speech.json'
import semanticDomains from '@/data/dictionary/vocab/semantic-domains.json'

const STATUSES = ['synced', 'local-changes', 'new', 'conflict', 'error', 'review', 'no-audio']
const STATUS_LABELS = {
  synced: 'Sincronizada',
  'local-changes': 'Cambios sin enviar',
  new: 'Nueva',
  conflict: 'Conflicto',
  error: 'Error',
  review: 'Revisar',
  'no-audio': 'Sin audio'
}

const ROWS = [
  {
    id: 'ele',
    word: 'Ele',
    meaning: 'Árbol',
    pos: 'n',
    domain: 'Plantas, árboles y otra vegetación',
    status: 'synced'
  },
  {
    id: 'ena',
    word: 'Enâ',
    meaning: 'La mano',
    pos: 'n',
    domain: 'Cuerpo',
    status: 'local-changes'
  },
  { id: 'enga', word: 'Enga', meaning: 'Cantar', pos: 'v', domain: 'Música', status: 'new' },
  { id: 'mbua', word: 'Mbūa', meaning: 'Perros', pos: 'n', domain: 'Animales', status: 'review' },
  {
    id: 'ndala',
    word: 'Ndâlâ',
    meaning: 'Sueño, desvarío',
    pos: 'n',
    domain: 'Dormir y soñar',
    status: 'no-audio'
  },
  { id: 'bobe', word: 'Bobe', meaning: 'Malo', pos: 'adj', domain: 'Calidad', status: 'conflict' },
  { id: 'mabe', word: 'Mabē', meaning: 'Maldades', pos: 'n', domain: 'Calidad', status: 'error' }
]

export default {
  name: 'UiKitDemo',
  components: {
    DataTable,
    FilterPanel,
    FilterGroup,
    ChipSelect,
    TreeSelect,
    InfoTip,
    AdminModal,
    AdminDrawer,
    ToastHost,
    StatusBadge,
    EmptyState
  },
  data() {
    return {
      statuses: STATUSES,
      columns: [
        { key: 'word', label: 'Palabra', sortable: true, width: '8rem' },
        { key: 'meaning', label: 'Significado', sortable: true },
        { key: 'pos', label: 'Categoría', sortable: true, width: '7rem' },
        { key: 'domain', label: 'Dominio', hidden: false },
        { key: 'status', label: 'Estado', sortable: true, align: 'center' }
      ],
      rows: ROWS,
      sortKey: 'word',
      sortDir: 'asc',
      selected: [],
      loading: false,
      statusFilter: [],
      posFilter: [],
      posChosen: ['n', 'v'],
      domainsChosen: [],
      modalOpen: false,
      drawerOpen: false,
      current: null,
      meaning: 'Árbol'
    }
  },
  computed: {
    activeFilters() {
      return this.statusFilter.length + this.posFilter.length
    },
    statusOptions() {
      return STATUSES.map((s) => ({
        value: s,
        label: STATUS_LABELS[s],
        count: ROWS.filter((r) => r.status === s).length
      }))
    },
    posOptions() {
      const out = []
      for (const g of partsOfSpeech.groups) {
        for (const code of g.codes) {
          const item = partsOfSpeech.items.find((i) => i.code === code)
          if (!item) continue
          out.push({
            value: item.code,
            label: item.es,
            group: g.label.es,
            help: item.help && item.help.es
          })
        }
      }
      // items that belong to no group
      const seen = new Set(out.map((o) => o.value))
      for (const item of partsOfSpeech.items) {
        if (!seen.has(item.code)) {
          out.push({
            value: item.code,
            label: item.es,
            group: 'Otras',
            help: item.help && item.help.es
          })
        }
      }
      return out
    },
    domainOptions() {
      return semanticDomains.items.map((d) => ({ value: d.key, label: d.es, parent: d.parent }))
    },
    filteredRows() {
      return this.rows.filter(
        (r) =>
          (!this.statusFilter.length || this.statusFilter.includes(r.status)) &&
          (!this.posFilter.length || this.posFilter.includes(r.pos))
      )
    },
    sortedRows() {
      const k = this.sortKey
      const dir = this.sortDir === 'desc' ? -1 : 1
      return [...this.filteredRows].sort(
        (a, b) => String(a[k]).localeCompare(String(b[k]), 'es') * dir
      )
    }
  },
  methods: {
    toast,
    onSort({ key, dir }) {
      this.sortKey = key
      this.sortDir = dir
    },
    openRow(row) {
      this.current = row
      this.drawerOpen = true
    },
    clearFilters() {
      this.statusFilter = []
      this.posFilter = []
    },
    simulateLoading() {
      this.loading = true
      setTimeout(() => (this.loading = false), 1200)
    },
    save() {
      this.modalOpen = false
      toast(`Guardado: ${this.meaning}`, { type: 'success' })
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.kit {
  max-width: $max-page-width;
  margin: 0 auto;
  padding: $spacing-md;
  overflow-x: hidden;

  &__title {
    margin: 0 0 $spacing-xs;
    color: $color-heading-dark;
  }

  &__intro {
    margin: 0 0 $spacing-lg;
    color: $color-text-secondary;
  }

  &__section {
    margin-bottom: $spacing-xl;
    padding: $spacing-md;
    background: $color-surface;
    border: $border-width solid $border-color;
    border-radius: $border-radius;

    h2 {
      margin: 0 0 $spacing-md;
      font-size: $font-size-lg;
      color: $color-primary;
    }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
  }

  &__layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: $spacing-md;
    align-items: start;

    @include respond-below('md') {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__table {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    min-width: 0;
  }

  &__note {
    margin: $spacing-sm 0 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__benga {
    font-family: $font-family-benga;
    color: $color-benga-word;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    font-size: $font-size-sm;

    input {
      @include focus-ring;
      padding: $spacing-sm;
      border: $border-width solid $border-color;
      border-radius: $border-radius-sm;
      font: inherit;
    }
  }

  &__btn {
    @include button-secondary;
    @include focus-ring;

    &--primary {
      @include button-primary;
    }
  }
}
</style>
