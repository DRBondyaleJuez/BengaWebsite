<!--
  EmptyState - friendly block for "nothing here yet" situations.
  Props: icon (emoji, default 📭), title, text.
  Slot: default = action buttons.
  Events: none.
  Usage:
    <EmptyState icon="🔍" title="Sin resultados" text="Prueba otros filtros.">
      <button @click="clear">Quitar filtros</button>
    </EmptyState>
-->
<template>
  <div class="empty-state">
    <span class="empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <p v-if="title" class="empty-state__title">{{ title }}</p>
    <p v-if="text" class="empty-state__text">{{ text }}</p>
    <div v-if="$slots.default" class="empty-state__actions"><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: { type: String, default: '📭' },
    title: { type: String, default: '' },
    text: { type: String, default: '' }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xl $spacing-md;
  text-align: center;
  color: $color-text-secondary;

  &__icon {
    font-size: 2.5rem;
    line-height: 1;
  }
  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
  &__text {
    margin: 0;
    max-width: 40ch;
    font-size: $font-size-sm;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-sm;
    margin-top: $spacing-sm;
  }
}
</style>
