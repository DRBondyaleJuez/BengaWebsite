<template>
  <div ref="grid">
    <template v-for="(item, index) in shownItems" :key="`${keyPrefix}-${index}`">
      <slot :item="item" :index="index" />
    </template>

    <!-- Only when the cards would fill more than two rows: first row + this button -->
    <button
      v-if="collapsible"
      type="button"
      class="card-grid__toggle"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="expanded = !expanded"
    >
      <BaseIcon :name="expanded ? 'chevron-up' : 'chevron-down'" />
      <span>
        {{ expanded ? $t('content.showFewer') : $t('content.showAll', { count: items.length }) }}
      </span>
    </button>
  </div>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'

/**
 * A grid of word cards that doesn't overwhelm: when the cards would fill more than two rows,
 * only the first row is shown, with a ▾ button to open the rest (and ▴ to close them again).
 *
 *   <CardGrid :items="words" class="examples-grid" key-prefix="ex" v-slot="{ item }">
 *     <div class="example-card">…{{ item.word }}…</div>
 *   </CardGrid>
 *
 * - The component IS the grid element: give it the page's grid class; the page's CSS decides
 *   the columns. CardGrid counts them (they change with the screen width) to know what "one
 *   row" and "two rows" are.
 * - Use it for word lists, not for practice exercises (they must show everything).
 */
export default {
  name: 'CardGrid',
  components: { BaseIcon },
  props: {
    items: { type: Array, required: true },
    /** Prefix of the cards' keys, so two grids on one page never share keys. */
    keyPrefix: { type: String, default: 'card' }
  },
  data() {
    return { columns: 1, expanded: false }
  },
  computed: {
    collapsible() {
      return Math.ceil(this.items.length / this.columns) > 2
    },
    shownItems() {
      return this.collapsible && !this.expanded ? this.items.slice(0, this.columns) : this.items
    }
  },
  mounted() {
    this.measure()
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.measure())
      this.observer.observe(this.$refs.grid)
    }
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    /** Number of columns the page's CSS gives the grid right now (e.g. "200px 200px 200px" → 3). */
    measure() {
      const tracks = getComputedStyle(this.$refs.grid).gridTemplateColumns
      const count = tracks && tracks !== 'none' ? tracks.trim().split(/\s+/).length : 1
      if (count !== this.columns) this.columns = Math.max(1, count)
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.card-grid__toggle {
  grid-column: 1 / -1; // a full row under the cards
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: $color-surface-light;
  color: $color-primary;
  border: 1px solid $color-primary;
  border-radius: $border-radius-full;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-fast;
  @include focus-ring;

  &:hover {
    background: $color-primary;
    color: $color-text-inverse;
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
  }
}
</style>
