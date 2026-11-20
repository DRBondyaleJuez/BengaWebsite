<template>
  <ol class="practice-list">
    <li v-for="(item, idx) in items" :key="`practice-${idx}`">{{ item }}</li>
  </ol>
</template>

<script>
/**
 * A numbered list of things to practise.
 *
 *   <PracticeList :items="['Cubre la columna plural…', 'Escucha la pronunciación…']" />
 *
 * The grey box around it is the page section (`noun-class__practice`), not this component.
 * Section-file block: { "type": "practice", "title"?, "items": [{ "es": … }] }
 */
export default {
  name: 'PracticeList',
  props: {
    /** Plain strings, already in the visitor's language. */
    items: { type: Array, required: true }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.practice-list {
  margin: 0;
  padding-left: $spacing-lg;

  li {
    margin-bottom: $spacing-md;
    line-height: 1.6;
  }
}
</style>
