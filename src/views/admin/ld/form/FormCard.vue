<!--
  FormCard - collapsible card of the dictionary forms.
  Props: id (anchor for the jump links), title, summary (text shown when collapsed),
         open (initial state, default true), badge (small text next to the title).
  Slots: default (body), actions (buttons in the header, e.g. «Quitar sentido»).
  Opens by itself when openCard(id) is called (src/views/admin/ld/form/cardEvents.js).
  Also provides the shared look of the form fields to its content (.ld-field, .ld-grid, …).
-->
<template>
  <section :id="id" class="form-card" :class="{ 'form-card--closed': !isOpen }">
    <header class="form-card__header">
      <button
        type="button"
        class="form-card__toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="`${id}-body`"
        @click="isOpen = !isOpen"
      >
        <span class="form-card__arrow" aria-hidden="true">{{ isOpen ? '▾' : '▸' }}</span>
        <h2 class="form-card__title">{{ title }}</h2>
        <span v-if="badge" class="form-card__badge">{{ badge }}</span>
        <span v-if="!isOpen && summary" class="form-card__summary">{{ summary }}</span>
      </button>
      <div v-if="$slots.actions" class="form-card__actions"><slot name="actions" /></div>
    </header>
    <div v-show="isOpen" :id="`${id}-body`" class="form-card__body"><slot /></div>
  </section>
</template>

<script>
import { OPEN_CARD_EVENT } from './cardEvents'

export default {
  name: 'FormCard',
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    badge: { type: String, default: '' },
    open: { type: Boolean, default: true }
  },
  data() {
    return { isOpen: this.open }
  },
  mounted() {
    window.addEventListener(OPEN_CARD_EVENT, this.onOpenCard)
  },
  beforeUnmount() {
    window.removeEventListener(OPEN_CARD_EVENT, this.onOpenCard)
  },
  methods: {
    onOpenCard(event) {
      if (event.detail === this.id) this.isOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
@use './ld-fields' as *;

.form-card {
  margin-bottom: $spacing-md;
  background: $color-surface;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  scroll-margin-top: 5rem;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding-right: $spacing-md;
  }

  &__toggle {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: baseline;
    gap: $spacing-sm;
    min-width: 0;
    padding: $spacing-md;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__arrow {
    color: $color-primary;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-primary-dark;
  }

  &__badge {
    padding: 0 $spacing-sm;
    background: $color-surface-alt;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  &__summary {
    flex-basis: 100%;
    margin-left: 1.4rem;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: flex;
    gap: $spacing-sm;
  }

  &__body {
    padding: 0 $spacing-md $spacing-md;
  }

  @include ld-fields;
}
</style>
