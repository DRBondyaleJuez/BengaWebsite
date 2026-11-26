<template>
  <section id="historial" class="sync-history">
    <h2>
      🕓 Historial
      <button type="button" class="sync-history__reload" @click="load">↻ Actualizar</button>
    </h2>
    <p v-if="!runs.length" class="sync-history__muted">Todavía no hay sincronizaciones.</p>
    <div v-else class="sync-history__layout">
      <ul class="sync-history__runs">
        <li v-for="run in runs" :key="run.id">
          <button
            type="button"
            class="sync-history__run"
            :class="{ 'sync-history__run--active': selected?.id === run.id }"
            @click="open(run.id)"
          >
            <span>{{ icon(run) }} {{ kindLabel(run) }}</span>
            <small>{{ when(run.startedAt) }}</small>
            <small>
              {{ run.itemCount }} operaciones<template v-if="run.failedCount">
                ·
                <strong class="sync-history__bad">{{ run.failedCount }} con error</strong></template
              >
            </small>
          </button>
        </li>
      </ul>

      <div v-if="selected" class="sync-history__detail">
        <h3>{{ kindLabel(selected) }} · {{ when(selected.startedAt) }}</h3>
        <p class="sync-history__muted">
          Estado: <strong>{{ statusLabel(selected.status) }}</strong>
          <template v-if="selected.importId">
            · import_id <code>{{ selected.importId }}</code></template
          >
        </p>
        <p v-if="selected.error" class="sync-history__bad">✗ {{ selected.error.message }}</p>

        <div v-for="group in errorGroups" :key="group.category" class="sync-history__errors">
          <h4>✗ {{ group.help.title }} ({{ group.items.length }})</h4>
          <p>{{ group.help.help }}</p>
          <ul>
            <li v-for="(item, index) in group.items" :key="index">
              <router-link :to="linkOf(item)">{{ item.word }}</router-link>
              · {{ item.operation }}<template v-if="item.http"> · HTTP {{ item.http }}</template
              ><template v-if="item.message">: {{ item.message }}</template>
              <template v-if="item.fields?.length"> ({{ item.fields.join(', ') }})</template>
            </li>
          </ul>
        </div>
        <button
          v-if="selected.kind === 'push' && retryIds.length"
          type="button"
          class="sync-history__retry"
          :disabled="busy"
          @click="$emit('retry', retryIds)"
        >
          Reintentar los {{ retryIds.length }} fallidos
        </button>

        <button
          v-if="canUndo"
          type="button"
          class="sync-history__undo"
          :disabled="busy"
          @click="$emit('undo', selected.importId)"
        >
          ↶ Deshacer este envío (borra en LD las {{ createdCount }} palabras que creó)
        </button>

        <details v-if="okItems.length" class="sync-history__ok">
          <summary>✓ {{ okItems.length }} correctas</summary>
          <ul>
            <li v-for="(item, index) in okItems" :key="index">
              <router-link v-if="item.id" :to="linkOf(item)">{{ item.word }}</router-link
              ><span v-else>{{ item.word }}</span> · {{ item.operation }}
              <template v-if="item.fields?.length">({{ item.fields.join(', ') }})</template>
            </li>
          </ul>
        </details>
      </div>
    </div>
  </section>
</template>

<script>
/** History of sync runs (ld-sync/runs/*.json) with errors grouped by category (task L5.4). */
import { errorHelp } from '@/utils/ldErrorHelp'
import { getSyncRuns, getSyncRun } from './ldApi'

const KINDS = {
  'pull-check': 'Vista previa de traer',
  'pull-apply': 'Traer de LD',
  'push-check': 'Vista previa de envío',
  'push-apply': 'Envío a LD',
  'undo-check': 'Recuento para deshacer',
  'undo-apply': 'Deshacer un envío'
}
const STATUS = { running: 'en curso', done: 'terminado', failed: 'falló', halted: 'detenido' }

export default {
  name: 'SyncHistory',
  props: { busy: { type: Boolean, default: false } },
  emits: ['retry', 'undo'],
  data() {
    return { runs: [], selected: null }
  },
  computed: {
    items() {
      return this.selected?.items || []
    },
    okItems() {
      return this.items.filter((item) => item.status === 'ok')
    },
    errorGroups() {
      const groups = new Map()
      for (const item of this.items.filter((entry) => entry.status === 'failed')) {
        const category = item.category || 'unknown'
        if (!groups.has(category)) {
          groups.set(category, { category, help: errorHelp(category), items: [] })
        }
        groups.get(category).items.push(item)
      }
      return [...groups.values()]
    },
    createdCount() {
      return this.items.filter((i) => i.operation === 'create' && i.status === 'ok').length
    },
    canUndo() {
      const run = this.selected
      return run.kind === 'push' && run.mode === 'apply' && run.importId && this.createdCount > 0
    },
    retryIds() {
      return [...new Set(this.items.filter((i) => i.status === 'failed' && i.id).map((i) => i.id))]
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.runs = (await getSyncRuns().catch(() => [])).filter(
        (run) => run.mode === 'apply' || run.status !== 'done'
      )
      if (this.selected) this.open(this.selected.id)
    },
    async open(id) {
      this.selected = await getSyncRun(id)
    },
    kindLabel: (run) => KINDS[`${run.kind}-${run.mode}`] || run.kind,
    statusLabel: (status) => STATUS[status] || status,
    icon: (run) =>
      run.status === 'running' ? '⏳' : run.status !== 'done' || run.failedCount ? '⚠️' : '✓',
    when: (iso) =>
      new Date(iso).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }),
    linkOf(item) {
      return `/admin/living-dictionary/${item.kind === 'sentences' ? 'oracion' : 'entrada'}/${item.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sync-history {
  padding: $spacing-md $spacing-lg;
  background: $color-surface;
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;

  @include respond-below(sm) {
    padding: $spacing-md $spacing-sm;
  }

  h2 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    margin: 0 0 $spacing-sm;
    font-size: $font-size-xl;
    color: $color-primary-dark;
  }

  &__reload {
    padding: 2px $spacing-sm;
    background: none;
    border: 1px solid $color-surface-alt;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
  }

  &__muted {
    color: $color-text-muted;
    font-size: $font-size-sm;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(200px, 280px) 1fr;
    gap: $spacing-md;

    @include respond-below(md) {
      grid-template-columns: 1fr;
    }
  }

  &__runs {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    max-height: 420px;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;
  }

  &__run {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: $spacing-xs $spacing-sm;
    background: $color-surface-light;
    border: 1px solid transparent;
    border-radius: $border-radius-sm;
    text-align: left;
    cursor: pointer;

    &--active {
      border-color: $color-primary;
      background: rgba($color-primary, 0.08);
    }
  }

  &__detail {
    min-width: 0;
    font-size: $font-size-sm;
    overflow-wrap: anywhere;

    h3 {
      margin: 0 0 $spacing-xs;
      font-size: $font-size-lg;
    }
  }

  &__bad {
    color: $color-error;
  }

  &__errors {
    margin: $spacing-sm 0;
    padding: $spacing-xs $spacing-sm;
    border-left: 4px solid $color-error;
    background: rgba($color-error, 0.05);

    h4 {
      margin: 0;
    }

    p {
      margin: $spacing-xs 0;
    }
  }

  &__retry {
    padding: $spacing-xs $spacing-md;
    background: $color-primary;
    border: none;
    border-radius: $border-radius-sm;
    color: $color-text-inverse;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
    }
  }

  &__undo {
    display: block;
    margin-top: $spacing-sm;
    padding: $spacing-xs $spacing-md;
    background: $color-surface;
    border: 1px solid $color-error;
    border-radius: $border-radius-sm;
    color: $color-error;
    cursor: pointer;
  }

  &__ok {
    margin-top: $spacing-sm;
  }
}
</style>
