<template>
  <div class="sound-cards" :class="`sound-cards--${color}`">
    <div v-for="item in items" :key="item.label" class="sound-cards__card">
      <div class="sound-cards__card-header">
        <span class="sound-cards__label" :class="{ 'sound-cards__label--wide': wide }">
          {{ item.label }}
        </span>
      </div>

      <p class="sound-cards__sounds-like">
        <strong>{{ $t('content.soundsLike') }}:</strong><br />
        {{ item.soundsLike }}
      </p>

      <div v-if="item.examples.length > 0" class="sound-cards__examples">
        <p class="sound-cards__examples-label">{{ $t('content.examples') }}:</p>
        <div v-for="example in item.examples" :key="example.word" class="sound-cards__example-item">
          <BengaWord :word="example.word" :meaning="example.meaning" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

/**
 * One card per sound (diphthong, triphthong…): the letters in a coloured square, how it
 * sounds, and example words.
 *
 *   ┌──────────────────────┐
 *   │ [ ai ]               │
 *   │ Suena como: ai como en 'gaita'
 *   │ ──────────────────── │
 *   │ EJEMPLOS: tekai 🔇 (cáscara)
 *   └──────────────────────┘
 *
 *   <SoundCards :items="[{ label: 'ai', soundsLike: '…', examples: [{ word, meaning }] }]" />
 *   color="secondary" for the triphthongs; `wide` for longer labels (aia, uai…).
 *
 * Section-file block: { "type": "sounds", "color"?, "wide"?, "items": [{ "label", "soundsLike", "examples" }] }
 */
export default {
  name: 'SoundCards',
  components: { BengaWord },
  props: {
    /** [{ label, soundsLike, examples: [{ word, meaning }] }] (texts already localized). */
    items: { type: Array, required: true },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary'].includes(value)
    },
    wide: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

// The two colour themes: (main colour, light border colour, dark hover colour)
@mixin theme($main, $light) {
  .sound-cards__card {
    border: 2px solid $light;

    &:hover {
      box-shadow: 0 8px 16px rgba($main, 0.15);
      border-color: $main;
    }
  }

  .sound-cards__label {
    background: $main;
  }

  .sound-cards__sounds-like strong,
  .sound-cards__examples-label {
    color: $main;
  }

  .sound-cards__examples {
    border-top: 1px solid rgba($main, 0.2);
  }
}

.sound-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: $spacing-lg;

  @include respond-below('sm') {
    grid-template-columns: 1fr;
  }

  &--primary {
    @include theme($color-primary, $color-primary-light);
  }

  &--secondary {
    @include theme($color-secondary, $color-secondary-light);
  }

  &__card {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 12px;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__card-header {
    margin-bottom: $spacing-lg;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    color: $color-text-inverse;
    border-radius: 12px;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-benga;
    letter-spacing: 0.1em;

    &--wide {
      width: auto;
      min-width: 80px;
      font-size: $font-size-xl;
      letter-spacing: 0.05em;
      padding: 0 $spacing-md;
      text-align: center;
    }
  }

  &__sounds-like {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
    line-height: $line-height-base;
  }

  &__examples {
    padding-top: $spacing-md;
  }

  &__examples-label {
    @include heading-style;
    font-size: $font-size-sm;
    margin: 0 0 $spacing-sm 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__example-item {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
