<!--
  FilterPanel - side panel for filters. Always open on wide screens; on narrow screens it is a
  block that collapses behind a "Filtros" button.
  Props: title (default 'Filtros'), activeCount (number shown in the toggle on narrow screens),
         collapsed (initial state on narrow screens, default true).
  Slot: default = FilterGroup components.
  Events: clear (the "Quitar filtros" button).
  Usage:
    <FilterPanel :active-count="n" @clear="reset">
      <FilterGroup title="Categoría gramatical">…</FilterGroup>
    </FilterPanel>
-->
<template>
  <aside class="filter-panel" :class="{ 'filter-panel--open': isOpen }" :aria-label="title">
    <div class="filter-panel__bar">
      <button
        type="button"
        class="filter-panel__toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="bodyId"
        @click="isOpen = !isOpen"
      >
        <span aria-hidden="true">{{ isOpen ? '▾' : '▸' }}</span>
        {{ title }}
        <span v-if="activeCount > 0" class="filter-panel__badge">{{ activeCount }}</span>
      </button>
      <h2 class="filter-panel__title">{{ title }}</h2>
      <button type="button" class="filter-panel__clear" @click="$emit('clear')">
        Quitar filtros
      </button>
    </div>
    <div :id="bodyId" class="filter-panel__body"><slot /></div>
  </aside>
</template>

<script>
let uid = 0

export default {
  name: 'FilterPanel',
  props: {
    title: { type: String, default: 'Filtros' },
    activeCount: { type: Number, default: 0 },
    collapsed: { type: Boolean, default: true }
  },
  emits: ['clear'],
  data() {
    uid += 1
    return { isOpen: !this.collapsed, bodyId: `filter-panel-${uid}` }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.filter-panel {
  min-width: 0;
  padding: $spacing-md;
  background: $color-surface;
  border: $border-width solid $border-color;
  border-radius: $border-radius;

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }

  &__title {
    margin: 0;
    font-size: $font-size-base;
    color: $color-heading-dark;
  }

  &__toggle {
    display: none;
    @include focus-ring;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    border: $border-width solid $color-primary;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-primary;
    font: inherit;
    font-weight: $font-weight-medium;
    cursor: pointer;
  }

  &__badge {
    padding: 0 0.45rem;
    border-radius: $border-radius-full;
    background: $color-accent;
    color: $color-heading-dark;
    font-size: $font-size-xs;
  }

  &__clear {
    @include focus-ring;
    padding: $spacing-xs $spacing-sm;
    border: none;
    background: transparent;
    color: $color-benga-word;
    font: inherit;
    font-size: $font-size-sm;
    text-decoration: underline;
    cursor: pointer;
    border-radius: $border-radius-sm;
  }

  @include respond-below('md') {
    &__toggle {
      display: inline-flex;
    }
    &__title {
      display: none;
    }
    &__body {
      display: none;
    }
    &--open &__body {
      display: block;
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}
</style>
