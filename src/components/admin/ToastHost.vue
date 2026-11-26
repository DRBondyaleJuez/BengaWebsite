<!--
  ToastHost - renders the stack of toasts from toast.js, bottom right.
  Props: none. Events: none.
  Mount it once per admin page (aria-live polite).
  Usage:  <ToastHost />   and elsewhere   toast('Guardado', { type: 'success' })
-->
<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast-host__toast"
      :class="`toast-host__toast--${t.type}`"
      :role="t.type === 'error' ? 'alert' : 'status'"
    >
      <span class="toast-host__message">{{ t.message }}</span>
      <button
        type="button"
        class="toast-host__close"
        aria-label="Cerrar aviso"
        @click="dismissToast(t.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script>
import { toasts, dismissToast } from './toast'

export default {
  name: 'ToastHost',
  data() {
    return { toasts }
  },
  methods: { dismissToast }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.toast-host {
  position: fixed;
  right: $spacing-md;
  bottom: $spacing-md;
  z-index: $z-tooltip + 10;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: min(360px, calc(100vw - #{$spacing-md * 2}));
  pointer-events: none;

  &__toast {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: $color-surface;
    border: $border-width solid $border-color;
    border-left: 4px solid $color-info;
    border-radius: $border-radius-sm;
    box-shadow: $shadow-lg;
    font-size: $font-size-sm;
    color: $color-text-primary;
    pointer-events: auto;

    &--success {
      border-left-color: $color-success;
    }
    &--error {
      border-left-color: $color-error;
    }
    &--warning {
      border-left-color: $color-warning;
    }
  }

  &__message {
    flex: 1;
    overflow-wrap: anywhere;
  }

  &__close {
    @include focus-ring;
    border: none;
    background: transparent;
    font-size: $font-size-xl;
    line-height: 1;
    cursor: pointer;
    color: $color-text-secondary;
    border-radius: $border-radius-sm;
  }
}
</style>
