<!--
  TreeSelect - multi-select for a tree (e.g. the semantic domains). Chosen values show as
  removable chips above; groups expand/collapse; the search box (accent- and case-insensitive)
  keeps the matching nodes together with their parents visible.
  Props:
    modelValue   array of chosen values (v-model)
    options      [{ value, label, parent }]  (parent = value of the parent node, or null)
    placeholder  text of the search box
    label        accessible name (default 'Seleccionar')
    maxHeight    CSS max-height of the tree area (default '18rem')
  Events: update:modelValue (array)
  Keys: Tab through the expand buttons and checkboxes, Space toggles a checkbox, Enter or
        Space on an arrow expands/collapses.
  Usage:
    <TreeSelect v-model="domains" :options="domainOptions" placeholder="Buscar dominio…" />
-->
<template>
  <div class="tree-select">
    <div v-if="modelValue.length" class="tree-select__chips">
      <span v-for="v in modelValue" :key="v" class="tree-select__chip">
        <span class="tree-select__chip-text">{{ labelOf(v) }}</span>
        <button
          type="button"
          class="tree-select__chip-remove"
          :aria-label="`Quitar ${labelOf(v)}`"
          @click="toggle(v)"
        >
          ×
        </button>
      </span>
    </div>
    <input
      v-model="query"
      class="tree-select__search"
      type="search"
      autocomplete="off"
      :aria-label="`Buscar en ${label}`"
      :placeholder="placeholder"
    />
    <ul class="tree-select__tree" role="group" :aria-label="label" :style="{ maxHeight }">
      <li
        v-for="row in visibleRows"
        :key="row.node.value"
        class="tree-select__row"
        :style="{ paddingLeft: `${row.depth * 1.25}rem` }"
      >
        <button
          v-if="row.hasChildren"
          type="button"
          class="tree-select__toggle"
          :aria-expanded="row.expanded ? 'true' : 'false'"
          :aria-label="`${row.expanded ? 'Contraer' : 'Expandir'} ${row.node.label}`"
          @click="toggleExpand(row.node.value)"
        >
          {{ row.expanded ? '▾' : '▸' }}
        </button>
        <span v-else class="tree-select__spacer" aria-hidden="true"></span>
        <label class="tree-select__label">
          <input
            type="checkbox"
            :checked="isChosen(row.node.value)"
            @change="toggle(row.node.value)"
          />
          <span class="tree-select__key">{{ row.node.value }}</span>
          <span class="tree-select__text">{{ row.node.label }}</span>
        </label>
      </li>
      <li v-if="!visibleRows.length" class="tree-select__empty">Sin resultados</li>
    </ul>
  </div>
</template>

<script>
import { normalizeText } from './searchText'

export default {
  name: 'TreeSelect',
  props: {
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Buscar…' },
    label: { type: String, default: 'Seleccionar' },
    maxHeight: { type: String, default: '18rem' }
  },
  emits: ['update:modelValue'],
  data() {
    return { query: '', expanded: [] }
  },
  computed: {
    byValue() {
      return new Map(this.options.map((o) => [o.value, o]))
    },
    children() {
      const map = new Map()
      for (const o of this.options) {
        const p = o.parent == null ? null : o.parent
        if (!map.has(p)) map.set(p, [])
        map.get(p).push(o)
      }
      return map
    },
    // Set of values to show while searching: matches plus all their ancestors.
    matchSet() {
      const q = normalizeText(this.query)
      if (!q) return null
      const set = new Set()
      for (const o of this.options) {
        if (!normalizeText(`${o.value} ${o.label}`).includes(q)) continue
        let cur = o
        while (cur && !set.has(cur.value)) {
          set.add(cur.value)
          cur = cur.parent == null ? null : this.byValue.get(cur.parent)
        }
      }
      return set
    },
    visibleRows() {
      const rows = []
      const walk = (parent, depth) => {
        for (const node of this.children.get(parent) || []) {
          if (this.matchSet && !this.matchSet.has(node.value)) continue
          const kids = (this.children.get(node.value) || []).filter(
            (k) => !this.matchSet || this.matchSet.has(k.value)
          )
          const expanded = this.matchSet ? kids.length > 0 : this.expanded.includes(node.value)
          rows.push({ node, depth, hasChildren: kids.length > 0, expanded })
          if (expanded) walk(node.value, depth + 1)
        }
      }
      walk(null, 0)
      return rows
    }
  },
  methods: {
    labelOf(value) {
      const o = this.byValue.get(value)
      return o ? `${o.value} ${o.label}` : String(value)
    },
    isChosen(value) {
      return this.modelValue.includes(value)
    },
    toggle(value) {
      this.$emit(
        'update:modelValue',
        this.isChosen(value)
          ? this.modelValue.filter((v) => v !== value)
          : [...this.modelValue, value]
      )
    },
    toggleExpand(value) {
      this.expanded = this.expanded.includes(value)
        ? this.expanded.filter((v) => v !== value)
        : [...this.expanded, value]
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.tree-select {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  min-width: 0;

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    max-width: 100%;
    padding: 0.1rem 0.25rem 0.1rem 0.6rem;
    background: $color-benga-word-bg;
    color: $color-benga-word;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
  }

  &__chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__chip-remove {
    @include focus-ring;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font-size: $font-size-base;
    line-height: 1;
    cursor: pointer;
  }

  &__search {
    @include focus-ring;
    padding: $spacing-sm;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    font: inherit;
    font-size: $font-size-sm;
  }

  &__tree {
    margin: 0;
    padding: $spacing-xs 0;
    overflow-y: auto;
    list-style: none;
    background: $color-surface;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
  }

  &__row {
    display: flex;
    align-items: flex-start;
    gap: $spacing-xs;
    padding-right: $spacing-sm;
    font-size: $font-size-sm;

    &:hover {
      background: $color-surface-light;
    }
  }

  &__toggle,
  &__spacer {
    flex: 0 0 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  &__toggle {
    @include focus-ring;
    padding: 0;
    border: none;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-primary;
    cursor: pointer;
  }

  &__label {
    display: flex;
    flex: 1;
    align-items: flex-start;
    gap: $spacing-xs;
    min-width: 0;
    padding: 0.3rem 0;
    cursor: pointer;

    input {
      margin-top: 0.15rem;
      accent-color: $color-primary;
    }
    &:focus-within {
      outline: 2px solid $color-primary;
      outline-offset: 1px;
      border-radius: $border-radius-sm;
    }
  }

  &__key {
    flex-shrink: 0;
    font-family: $font-family-mono;
    font-size: $font-size-xs;
    color: $color-text-muted;
    padding-top: 0.15rem;
  }

  &__text {
    overflow-wrap: anywhere;
  }

  &__empty {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}
</style>
