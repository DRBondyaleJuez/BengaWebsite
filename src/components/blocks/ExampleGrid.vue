<template>
  <div class="examples-grid">
    <div v-for="(item, idx) in items" :key="`${keyPrefix}-${idx}`" class="example-card">
      <!-- pairs: green singular above orange plural · single: one green word -->
      <div v-if="layout !== 'plural-only' && item.singular" class="example-singular">
        <BengaWord :word="item.singular.word" :meaning="item.singular.meaning" block />
      </div>
      <div v-if="layout !== 'single' && item.plural" class="example-plural">
        <BengaWord :word="item.plural.word" :meaning="item.plural.meaning" block />
      </div>
      <span v-if="layout === 'plural-only'" class="plural-only-tag">{{ badge }}</span>
    </div>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

/**
 * A grid of example cards.
 *
 *   items = [{ singular: { word: 'Epokolo', meaning: 'Sombrero' },
 *              plural:   { word: 'Bepokolo', meaning: 'Sombreros' } }, …]
 *
 *   layout="pairs"        ┌──────────────┐   singular (green) above plural (orange)
 *                         │ Epokolo  …   │
 *                         │ Bepokolo …   │
 *                         └──────────────┘
 *   layout="single"       one green word per card (class 7: singular = plural)
 *   layout="plural-only"  the plural + a «Solo plural» badge (liquids)
 *
 * Section-file block: { "type": "examples", "layout"?, "entries": [lexicon ids] } — the page turns
 * the lexicon entries into `items` (see src/views/chapter-2/NounClassPage.vue).
 */
export default {
  name: 'ExampleGrid',
  components: { BengaWord },
  props: {
    items: { type: Array, required: true },
    layout: {
      type: String,
      default: 'pairs',
      validator: (value) => ['pairs', 'single', 'plural-only'].includes(value)
    },
    badge: { type: String, default: 'Solo plural' },
    /** Prefix of the cards' keys, so two grids on one page never share keys. */
    keyPrefix: { type: String, default: 'ex' }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

.example-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: $border-radius;
  padding: $spacing-md;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .example-singular {
    .benga-word--block {
      background: #e8f5e9;
    }

    :deep(.benga-word__text) {
      color: #1b5e20;
    }
  }

  .example-plural {
    .benga-word--block {
      background: #fff3e0;
    }

    :deep(.benga-word__text) {
      color: #e65100;
    }
  }

  :deep(.benga-word__meaning) {
    max-width: 100%;
    min-width: 50%;
    flex: 1;
  }
}

.plural-only-tag {
  display: inline-block;
  margin-top: $spacing-sm;
  padding: 2px $spacing-sm;
  background: #fffde7;
  border: 1px solid $color-accent;
  border-radius: $border-radius-full;
  color: $color-accent-dark;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
