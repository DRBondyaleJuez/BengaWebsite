<!--
  FormBar - sticky bar at the bottom of the dictionary forms: «Todo guardado» / «Hay cambios sin
  guardar», Descartar cambios, Guardar.
  Props: dirty, saving, canSave
  Events: discard, save
-->
<template>
  <div class="form-bar" :class="{ 'form-bar--dirty': dirty }">
    <span class="form-bar__status" aria-live="polite">
      {{ dirty ? 'Hay cambios sin guardar' : 'Todo guardado' }}
    </span>
    <button
      type="button"
      class="form-bar__secondary"
      :disabled="!dirty || saving"
      @click="$emit('discard')"
    >
      Descartar cambios
    </button>
    <button
      type="button"
      class="form-bar__primary"
      :disabled="!dirty || saving || !canSave"
      @click="$emit('save')"
    >
      {{ saving ? 'Guardando…' : 'Guardar' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FormBar',
  props: {
    dirty: { type: Boolean, default: false },
    saving: { type: Boolean, default: false },
    canSave: { type: Boolean, default: true }
  },
  emits: ['discard', 'save']
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.form-bar {
  position: sticky;
  bottom: 0;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-sm $spacing-md;
  margin-top: $spacing-lg;
  padding: $spacing-sm $spacing-md;
  background: $color-surface;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

  &--dirty {
    border-color: $color-accent;
    background: #fff8e1;
  }

  &__status {
    margin-right: auto;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__primary {
    @include button-primary;
  }

  &__secondary {
    @include button-secondary;
  }
}
</style>
