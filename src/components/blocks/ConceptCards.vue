<template>
  <div class="concepts-grid">
    <div v-for="(item, idx) in items" :key="`concept-${idx}`" class="concept-card">
      <div class="concept-card__header">
        <h3>{{ item.title }}</h3>
      </div>
      <p class="concept-card__explanation">
        {{ item.text }}
      </p>
      <div v-if="item.example" class="concept-card__example">
        <strong>{{ exampleLabel }}</strong>
        <span class="bengaword">{{ item.example }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Key ideas as white cards with a coloured top border and an optional example
 * (the look of the chapter-3 introduction). For green cards without examples: ConceptList.
 *
 *   <ConceptCards :items="[{ title: 'Ausencia de Género', text: '…', example: '…' }]" />
 *
 * Section-file block: { "type": "concepts", "look": "cards", "items": [{ "title", "text", "example"? }] }
 */
export default {
  name: 'ConceptCards',
  props: {
    /** [{ title, text, example? }] as plain strings. */
    items: { type: Array, required: true },
    exampleLabel: { type: String, default: 'Ejemplo:' }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  .concept-card {
    @include card-base;
    padding: 1.5rem;
    border-top: 3px solid $color-primary;

    &__header {
      margin-bottom: 1rem;

      h3 {
        color: $color-primary;
        font-size: 1.2rem;
      }
    }

    &__explanation {
      color: $color-text-primary;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    &__example {
      background: #f9f9f9;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.95rem;
      color: $color-text-secondary;

      .bengaword {
        display: block;
        color: $color-primary;
        font-weight: 600;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
