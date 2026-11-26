<!--
  FilterGroup - one collapsible group of filters inside FilterPanel.
  Props: title, count (number of active filters in the group; badge hidden when 0),
         open (initial state, default true).
  Slot: default = the filter controls.
  Events: none.
  Usage:
    <FilterGroup title="Categoría gramatical" :count="pos.length"><ChipSelect … /></FilterGroup>
-->
<template>
  <section class="filter-group">
    <h3 class="filter-group__heading">
      <button
        type="button"
        class="filter-group__toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="bodyId"
        @click="isOpen = !isOpen"
      >
        <span class="filter-group__caret" aria-hidden="true">{{ isOpen ? '▾' : '▸' }}</span>
        <span class="filter-group__title">{{ title }}</span>
        <span v-if="count > 0" class="filter-group__badge" :aria-label="`${count} activos`">{{
          count
        }}</span>
      </button>
    </h3>
    <div v-show="isOpen" :id="bodyId" class="filter-group__body"><slot /></div>
  </section>
</template>

<script>
let uid = 0

export default {
  name: 'FilterGroup',
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 },
    open: { type: Boolean, default: true }
  },
  data() {
    uid += 1
    return { isOpen: this.open, bodyId: `filter-group-${uid}` }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.filter-group {
  border-bottom: $border-width solid $border-color;

  &__heading {
    margin: 0;
  }

  &__toggle {
    @include focus-ring;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
    padding: $spacing-sm 0;
    border: none;
    background: transparent;
    font: inherit;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-heading-dark;
    text-align: left;
    cursor: pointer;
    border-radius: $border-radius-sm;
  }

  &__title {
    flex: 1;
  }

  &__badge {
    min-width: 1.4rem;
    padding: 0 0.4rem;
    border-radius: $border-radius-full;
    background: $color-accent;
    color: $color-heading-dark;
    font-size: $font-size-xs;
    text-align: center;
  }

  &__body {
    padding: 0 0 $spacing-md;
  }
}
</style>
