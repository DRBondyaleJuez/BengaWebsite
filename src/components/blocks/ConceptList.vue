<template>
  <div class="concepts-list">
    <div v-for="(item, idx) in items" :key="`concept-${idx}`" class="concept-item">
      <h4>{{ item.title }}</h4>
      <p>{{ item.text }}</p>
    </div>
  </div>
</template>

<script>
/**
 * Key ideas as green cards.
 *
 *   <ConceptList :items="[{ title: 'Patrón e → be', text: 'Todos los nombres…' }]" />
 *
 * Section-file block: { "type": "concepts", "title"?, "items": [{ "title": {…}, "text": {…} }] }
 */
export default {
  name: 'ConceptList',
  props: {
    /** [{ title, text }] as plain strings (already in the visitor's language). */
    items: { type: Array, required: true }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.concepts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: $spacing-lg;

  .concept-item {
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid $color-primary;

    h4 {
      margin: 0 0 $spacing-sm 0;
      color: $color-primary;
    }

    p {
      margin: 0;
      color: $color-text-secondary;
      font-size: 0.95rem;
    }
  }
}
</style>
