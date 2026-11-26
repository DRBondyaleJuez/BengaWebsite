<template>
  <span v-if="text" class="gloss-cell">{{ text }}</span>
  <span v-else class="gloss-cell gloss-cell--missing" title="Falta la traducción">falta</span>
</template>

<script>
/** A translation in the entries table, or a visible «falta» when there is none. */
export default {
  name: 'GlossCell',
  props: {
    text: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.gloss-cell {
  font-size: $font-size-sm;

  &--missing {
    color: $color-error;
    font-size: $font-size-xs;
    font-style: italic;
  }
}
</style>
