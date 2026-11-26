<!--
  DataTable - admin table: sticky header, zebra rows, sortable columns, optional checkboxes,
  clickable rows. Sorting is done by the parent (this component only emits).
  Props:
    columns   [{ key, label, sortable?, width?, align? ('left'|'center'|'right'), hidden? }]
    rows      array of objects
    rowKey    field with the unique id of a row (default 'id')
    sortKey, sortDir ('asc'|'desc')   current sort, shown in the header
    selectable (Boolean)  adds a checkbox column; selected = array of row keys
    loading, emptyText
  Slots (scoped, receive { row, value, column }): cell-<key>, or default `cell`.
  Slot `empty` replaces the empty text.
  Events: sort ({ key, dir }), row-click (row), update:selected (array of keys).
  Usage:
    <DataTable :columns="cols" :rows="rows" :sort-key="k" :sort-dir="d"
      v-model:selected="sel" selectable @sort="onSort" @row-click="open">
      <template #cell-word="{ row }"><strong>{{ row.word }}</strong></template>
    </DataTable>
-->
<template>
  <div class="data-table" :aria-busy="loading ? 'true' : 'false'">
    <div class="data-table__scroll" tabindex="0" role="region" :aria-label="regionLabel">
      <table class="data-table__table">
        <thead>
          <tr>
            <th v-if="selectable" class="data-table__th data-table__th--check" scope="col">
              <input
                ref="all"
                type="checkbox"
                aria-label="Seleccionar todas las filas"
                :checked="allSelected"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              class="data-table__th"
              :class="`data-table__th--${col.align || 'left'}`"
              :style="col.width ? { width: col.width, minWidth: col.width } : null"
              scope="col"
              :aria-sort="ariaSort(col)"
            >
              <button
                v-if="col.sortable"
                type="button"
                class="data-table__sort"
                @click="onSort(col)"
              >
                {{ col.label }}
                <span class="data-table__arrow" aria-hidden="true">{{ arrow(col) }}</span>
              </button>
              <template v-else>{{ col.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td class="data-table__message" :colspan="colCount">Cargando…</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td class="data-table__message" :colspan="colCount">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="row[rowKey]"
              class="data-table__row"
              :class="{
                'data-table__row--selected': isSelected(row),
                'data-table__row--clickable': clickable
              }"
              :tabindex="clickable ? 0 : null"
              @click="onRowClick(row, $event)"
              @keydown.enter="onRowEnter(row, $event)"
            >
              <td v-if="selectable" class="data-table__td data-table__td--check">
                <input
                  type="checkbox"
                  :aria-label="`Seleccionar fila ${row[rowKey]}`"
                  :checked="isSelected(row)"
                  @click.stop
                  @change="toggleRow(row)"
                />
              </td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                class="data-table__td"
                :class="`data-table__td--${col.align || 'left'}`"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :column="col">
                  <slot name="cell" :row="row" :value="row[col.key]" :column="col">{{
                    row[col.key]
                  }}</slot>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, default: () => [] },
    rowKey: { type: String, default: 'id' },
    sortKey: { type: String, default: '' },
    sortDir: { type: String, default: 'asc' },
    selectable: { type: Boolean, default: false },
    selected: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: 'No hay datos que mostrar.' },
    regionLabel: { type: String, default: 'Tabla de datos' }
  },
  emits: ['sort', 'row-click', 'update:selected'],
  computed: {
    visibleColumns() {
      return this.columns.filter((c) => !c.hidden)
    },
    colCount() {
      return this.visibleColumns.length + (this.selectable ? 1 : 0)
    },
    clickable() {
      const props = this.$.vnode.props || {}
      return !!props.onRowClick
    },
    allSelected() {
      return this.rows.length > 0 && this.rows.every((r) => this.isSelected(r))
    },
    someSelected() {
      return this.rows.some((r) => this.isSelected(r))
    }
  },
  watch: {
    someSelected: 'syncIndeterminate',
    allSelected: 'syncIndeterminate'
  },
  mounted() {
    this.syncIndeterminate()
  },
  methods: {
    syncIndeterminate() {
      this.$nextTick(() => {
        if (this.$refs.all) this.$refs.all.indeterminate = this.someSelected && !this.allSelected
      })
    },
    isSelected(row) {
      return this.selected.includes(row[this.rowKey])
    },
    toggleRow(row) {
      const key = row[this.rowKey]
      const next = this.isSelected(row)
        ? this.selected.filter((k) => k !== key)
        : [...this.selected, key]
      this.$emit('update:selected', next)
    },
    toggleAll() {
      const keys = this.rows.map((r) => r[this.rowKey])
      const next = this.allSelected
        ? this.selected.filter((k) => !keys.includes(k))
        : [...new Set([...this.selected, ...keys])]
      this.$emit('update:selected', next)
    },
    ariaSort(col) {
      if (!col.sortable) return null
      if (col.key !== this.sortKey) return 'none'
      return this.sortDir === 'desc' ? 'descending' : 'ascending'
    },
    arrow(col) {
      if (col.key !== this.sortKey) return '↕'
      return this.sortDir === 'desc' ? '▼' : '▲'
    },
    onSort(col) {
      const dir = col.key === this.sortKey && this.sortDir === 'asc' ? 'desc' : 'asc'
      this.$emit('sort', { key: col.key, dir })
    },
    onRowClick(row, e) {
      if (!this.clickable) return
      if (e.target.closest('a, button, input, select, textarea, label')) return
      this.$emit('row-click', row)
    },
    onRowEnter(row, e) {
      if (!this.clickable || e.target !== e.currentTarget) return
      this.$emit('row-click', row)
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.data-table {
  min-width: 0;
  max-width: 100%;
  background: $color-surface;
  border: $border-width solid $border-color;
  border-radius: $border-radius;

  &__scroll {
    max-width: 100%;
    max-height: 70vh;
    overflow: auto;
    border-radius: $border-radius;
    @include focus-ring;
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: $font-size-sm;
  }

  &__th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: $spacing-sm $spacing-md;
    background: $color-primary;
    color: $color-text-inverse;
    font-weight: $font-weight-semibold;
    white-space: nowrap;
    text-align: left;

    &--center {
      text-align: center;
    }
    &--right {
      text-align: right;
    }
    &--check {
      width: 2.5rem;
    }
  }

  &__sort {
    @include focus-ring;
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    border-radius: $border-radius-sm;

    &:focus-visible {
      box-shadow: 0 0 0 3px $color-accent-light;
    }
  }

  &__arrow {
    font-size: $font-size-xs;
    opacity: 0.8;
  }

  &__td {
    padding: $spacing-sm $spacing-md;
    border-bottom: $border-width solid $border-color;
    vertical-align: middle;
    overflow-wrap: anywhere;

    &--center {
      text-align: center;
    }
    &--right {
      text-align: right;
    }
  }

  &__row {
    &:nth-child(even) {
      background: $color-surface-light;
    }
    &:hover {
      background: $color-benga-word-bg;
    }
    &--selected,
    &--selected:nth-child(even) {
      background: #eaf3e8;
    }
    &--clickable {
      cursor: pointer;
      @include focus-ring;

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: -2px;
        box-shadow: none;
      }
    }
  }

  &__message {
    padding: $spacing-xl $spacing-md;
    text-align: center;
    color: $color-text-secondary;
  }

  input[type='checkbox'] {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: $color-primary;
    cursor: pointer;
  }
}
</style>
