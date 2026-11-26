<!--
  FormAlerts - messages of the dictionary forms: the «otra pestaña guardó» conflict (with a reload
  button) and a save error with the schema details.
  Props: conflict (text), error (text), details (array of texts)
  Events: reload
-->
<template>
  <div>
    <div v-if="conflict" class="form-alerts__box" role="alert">
      <p>{{ conflict }}</p>
      <button type="button" class="form-alerts__button" @click="$emit('reload')">
        Recargar y perder mis cambios
      </button>
    </div>
    <div v-if="error" class="form-alerts__box" role="alert">
      <p>{{ error }}</p>
      <ul v-if="details.length">
        <li v-for="detail in details.slice(0, 5)" :key="detail">{{ detail }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormAlerts',
  props: {
    conflict: { type: String, default: '' },
    error: { type: String, default: '' },
    details: { type: Array, default: () => [] }
  },
  emits: ['reload']
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.form-alerts {
  &__box {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-error, 0.08);
    border-left: 4px solid $color-error;

    p {
      margin: 0 0 $spacing-sm;
    }

    ul {
      margin: 0;
      padding-left: $spacing-lg;
      font-size: $font-size-sm;
    }
  }

  &__button {
    padding: $spacing-xs $spacing-md;
    background: $color-surface;
    border: 1px solid $color-error;
    border-radius: $border-radius-sm;
    cursor: pointer;
  }
}
</style>
