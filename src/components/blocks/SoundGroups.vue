<template>
  <!-- No wrapper element: the groups sit directly in the page part -->
  <div v-for="item in items" :key="item.label" class="sound-groups__group">
    <h3 class="sound-groups__title">{{ item.label }}</h3>

    <p class="sound-groups__pronunciation">
      <strong>{{ $t('content.pronunciation') }}:</strong><br />
      {{ item.pronunciation }}
    </p>

    <div class="sound-groups__examples-grid">
      <div v-for="example in item.examples" :key="example.word" class="sound-groups__example">
        <BengaWord :word="example.word" :meaning="example.meaning" block />
      </div>
    </div>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

/**
 * A group of letters (e.g. a consonant combination) with how to pronounce it and examples:
 *
 *   ▌Mb
 *   ▌ Pronunciación: considerar su primera consonante como muda…
 *   ▌ [mbambai 🔇 (en verdad)] [mbeya 🔇 (marmita)] …
 *
 *   <SoundGroups :items="[{ label: 'Mb', pronunciation: '…', examples: [{ word, meaning }] }]" />
 *
 * Section-file block: { "type": "soundGroups", "items": [{ "label", "pronunciation", "examples" }] }
 */
export default {
  name: 'SoundGroups',
  components: { BengaWord },
  props: {
    /** [{ label, pronunciation, examples: [{ word, meaning }] }] (texts already localized). */
    items: { type: Array, required: true }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sound-groups {
  &__group {
    padding: $spacing-lg;
    background: $color-surface;
    border-left: 4px solid $color-secondary;
    border-radius: 8px;
    margin-bottom: $spacing-lg;
  }

  &__title {
    @include heading-style;
    font-size: $font-size-xl;
    margin: 0 0 $spacing-md 0;
    color: $color-secondary;
    font-family: $font-family-benga;
  }

  &__pronunciation {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background: rgba($color-secondary, 0.05);
    border-radius: 6px;

    strong {
      color: $color-secondary;
    }
  }

  &__examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
  }

  &__example {
    padding: $spacing-md;
    background: $color-surface-alt;
    border-radius: 6px;
    border: 1px solid $border-color;
  }
}
</style>
