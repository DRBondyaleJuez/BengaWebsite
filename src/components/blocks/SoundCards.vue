<template>
  <div class="sound-cards" :class="`sound-cards--${color}`">
    <div v-for="item in items" :key="item.label" class="sound-cards__card">
      <div class="sound-cards__card-header">
        <span class="sound-cards__label" :class="`sound-cards__label--${labelSize}`">
          {{ item.label }}
        </span>
      </div>

      <p class="sound-cards__sounds-like">
        <strong>{{ $t('content.soundsLike') }}:</strong><br />
        {{ item.soundsLike }}
      </p>

      <div v-if="item.note" class="sound-cards__special-note">
        <p class="sound-cards__note-text">
          <strong>{{ $t('content.note') }}:</strong>
          {{ item.note }}
        </p>
      </div>

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
 *   color="secondary" for the triphthongs (label-size="wide" for aia, uai…);
 *   color="accent" + label-size="small" for the consonants, whose cards may have a `note`.
 *
 * Section-file block: { "type": "sounds", "color"?, "labelSize"?, "items": [{ "label", "soundsLike", "note"?, "examples" }] }
 */
export default {
  name: 'SoundCards',
  components: { BengaWord },
  props: {
    /** [{ label, soundsLike, note?, examples: [{ word, meaning }] }] (texts already localized). */
    items: { type: Array, required: true },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
    },
    labelSize: {
      type: String,
      default: 'normal',
      validator: (value) => ['normal', 'wide', 'small'].includes(value)
    }
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

  // Consonants: yellow label with green letters, narrower cards
  &--accent {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

    .sound-cards__card {
      border: 2px solid $color-accent-dark;

      &:hover {
        box-shadow: 0 8px 16px rgba($color-accent-dark, 0.15);
        border-color: $color-accent;
      }
    }

    .sound-cards__label {
      background: $color-accent;
      color: $color-primary;
    }

    .sound-cards__sounds-like strong {
      color: $color-accent-dark;
    }

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
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

    &--small {
      width: 60px;
      height: 60px;
      border-radius: 10px;
    }

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

  &__special-note {
    border-top: 1px solid rgba($color-accent-dark, 0.2);
    padding-top: $spacing-md;
  }

  &__note-text {
    @include body-text;
    font-size: $font-size-xs;
    margin: 0;
    line-height: $line-height-loose;
    color: $color-text-primary;
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
