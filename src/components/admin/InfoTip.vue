<!--
  InfoTip - small ⓘ button with a tooltip (hover, focus and click; Escape closes).
  Props: text (string), label (accessible name of the button, default 'Más información').
  Slot: default = tooltip content (used instead of `text` when given).
  Events: none.
  Usage:  <InfoTip text="Código de categoría gramatical." />
-->
<template>
  <span class="info-tip" @mouseenter="hover = true" @mouseleave="hover = false">
    <button
      type="button"
      class="info-tip__button"
      :aria-label="label"
      :aria-describedby="id"
      :aria-expanded="show ? 'true' : 'false'"
      @click="pinned = !pinned"
      @focus="focused = true"
      @blur="onBlur"
      @keydown.esc.stop="close"
    >
      i
    </button>
    <span v-show="show" :id="id" role="tooltip" class="info-tip__bubble">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<script>
let uid = 0

export default {
  name: 'InfoTip',
  props: {
    text: { type: String, default: '' },
    label: { type: String, default: 'Más información' }
  },
  data() {
    uid += 1
    return { id: `info-tip-${uid}`, hover: false, focused: false, pinned: false }
  },
  computed: {
    show() {
      return this.hover || this.focused || this.pinned
    }
  },
  methods: {
    close() {
      this.hover = false
      this.focused = false
      this.pinned = false
    },
    onBlur() {
      this.focused = false
      this.pinned = false
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.info-tip {
  position: relative;
  display: inline-flex;
  vertical-align: middle;

  &__button {
    @include focus-ring;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: 1px solid $color-primary;
    border-radius: 50%;
    background: $color-surface;
    color: $color-primary;
    font-size: 0.75rem;
    font-weight: $font-weight-bold;
    font-style: italic;
    font-family: $font-family-base;
    line-height: 1;
    cursor: help;
  }

  &__bubble {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    z-index: $z-tooltip;
    width: max-content;
    max-width: min(260px, 80vw);
    padding: $spacing-xs $spacing-sm;
    background: $color-heading-dark;
    color: $color-text-inverse;
    border-radius: $border-radius-sm;
    box-shadow: $shadow-md;
    font-size: $font-size-xs;
    font-weight: $font-weight-normal;
    font-style: normal;
    line-height: $line-height-base;
    text-align: left;
    white-space: normal;
  }
}
</style>
