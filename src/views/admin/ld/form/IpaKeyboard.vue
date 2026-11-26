<!--
  IpaKeyboard - popover with common IPA symbols (the ones useful for Bantu languages).
  Events: pick (symbol), close. Escape closes. The combining tone marks are shown on a dotted
  circle but inserted alone.
-->
<template>
  <div
    class="ipa-keyboard"
    role="dialog"
    aria-label="Teclado IPA"
    @keydown.esc.stop="$emit('close')"
  >
    <div v-for="group in groups" :key="group.title" class="ipa-keyboard__group">
      <span class="ipa-keyboard__title">{{ group.title }}</span>
      <button
        v-for="symbol in group.symbols"
        :key="symbol"
        type="button"
        class="ipa-keyboard__key"
        :aria-label="`Insertar ${symbol}`"
        @click="$emit('pick', symbol)"
      >
        {{ isMark(symbol) ? `◌${symbol}` : symbol }}
      </button>
    </div>
    <button type="button" class="ipa-keyboard__close" @click="$emit('close')">Cerrar</button>
  </div>
</template>

<script>
const MARKS = /^[̀-ͯ]$/u

export default {
  name: 'IpaKeyboard',
  emits: ['pick', 'close'],
  data() {
    return {
      groups: [
        { title: 'Vocales', symbols: ['ɛ', 'ɔ', 'ɪ', 'ʊ', 'ə', 'ɑ', 'æ', 'ɨ', 'ʉ'] },
        {
          title: 'Consonantes',
          symbols: ['ŋ', 'ɲ', 'ɱ', 'ʃ', 'ʒ', 'ɡ', 'β', 'ɣ', 'ɓ', 'ɗ', 'ʔ', 'ɾ', 'ɭ', 'ʎ', 'ʋ', 'ɸ']
        },
        { title: 'Prenasales y africadas', symbols: ['ᵐ', 'ⁿ', 'ᵑ', 'ʷ', 'ʲ', '͡', 'ʰ'] },
        { title: 'Longitud y acento', symbols: ['ː', 'ˈ', 'ˌ', '.'] },
        { title: 'Tonos', symbols: ['́', '̀', '̂', '̌', '̄', '̋', '̏'] }
      ]
    }
  },
  methods: {
    isMark: (symbol) => MARKS.test(symbol) || symbol === '͡'
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.ipa-keyboard {
  position: absolute;
  z-index: 20;
  top: 100%;
  left: 0;
  width: min(22rem, 85vw);
  margin-top: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: $color-surface;
  border: 1px solid $color-primary;
  border-radius: $border-radius;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);

  &__group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    margin-bottom: $spacing-xs;
  }

  &__title {
    flex-basis: 100%;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__key {
    min-width: 2rem;
    padding: 2px $spacing-xs;
    background: $color-surface-alt;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
    font-size: $font-size-lg;
    cursor: pointer;

    &:hover {
      background: $color-primary;
      color: $color-text-inverse;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__close {
    margin-top: $spacing-xs;
    background: none;
    border: none;
    color: $color-primary;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
