<!--
  AdminModal - accessible dialog (focus trap, Escape and backdrop close, focus restored).
  Props: open (Boolean, use v-model:open), title, persistent (Boolean: Escape/backdrop do not
         close), variant ('center' | 'drawer'; AdminDrawer.vue is the 'drawer' one),
         width (CSS width of the panel, optional).
  Slots: default (body), footer (buttons).
  Events: update:open (Boolean), close.
  Usage:
    <AdminModal v-model:open="show" title="Editar entrada">
      <p>…</p>
      <template #footer><button @click="show = false">Cerrar</button></template>
    </AdminModal>
-->
<template>
  <Teleport to="body">
    <Transition :name="`admin-modal--${variant}`">
      <div v-if="open" class="admin-modal" :class="`admin-modal--${variant}`" @keydown="onKeydown">
        <div class="admin-modal__backdrop" @click="onBackdrop"></div>
        <div
          ref="panel"
          class="admin-modal__panel"
          :style="width ? { width } : null"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <header class="admin-modal__header">
            <h2 :id="titleId" class="admin-modal__title">{{ title }}</h2>
            <button type="button" class="admin-modal__close" aria-label="Cerrar" @click="close">
              ×
            </button>
          </header>
          <div class="admin-modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="admin-modal__footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
let uid = 0

export default {
  name: 'AdminModal',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    persistent: { type: Boolean, default: false },
    variant: {
      type: String,
      default: 'center',
      validator: (v) => ['center', 'drawer'].includes(v)
    },
    width: { type: String, default: '' }
  },
  emits: ['update:open', 'close'],
  data() {
    uid += 1
    return { titleId: `admin-modal-title-${uid}`, opener: null }
  },
  watch: {
    open: {
      immediate: true,
      handler(isOpen) {
        if (isOpen) {
          this.opener = document.activeElement
          document.body.style.overflow = 'hidden'
          this.$nextTick(() => this.focusFirst())
        } else {
          this.release()
        }
      }
    }
  },
  beforeUnmount() {
    this.release()
  },
  methods: {
    release() {
      document.body.style.overflow = ''
      if (this.opener && typeof this.opener.focus === 'function') this.opener.focus()
      this.opener = null
    },
    focusables() {
      const panel = this.$refs.panel
      if (!panel) return []
      return [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    },
    focusFirst() {
      const body = this.$refs.panel && this.$refs.panel.querySelector('.admin-modal__body')
      const inBody = body && [...body.querySelectorAll(FOCUSABLE)][0]
      const target = inBody || this.focusables()[0] || this.$refs.panel
      if (target) target.focus()
    },
    close() {
      this.$emit('update:open', false)
      this.$emit('close')
    },
    onBackdrop() {
      if (!this.persistent) this.close()
    },
    onKeydown(e) {
      if (e.key === 'Escape') {
        if (e.defaultPrevented) return
        e.stopPropagation()
        if (!this.persistent) this.close()
        return
      }
      if (e.key !== 'Tab') return
      const items = this.focusables()
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === this.$refs.panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-modal {
  position: fixed;
  inset: 0;
  z-index: $z-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(26, 58, 24, 0.45);
  }

  &__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(560px, 100%);
    max-height: calc(100vh - #{$spacing-xl});
    background: $color-surface;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-xl;
    outline: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
    padding: $spacing-md;
    border-bottom: $border-width solid $border-color;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-heading-dark;
  }

  &__close {
    @include focus-ring;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: $border-radius-full;
    background: transparent;
    font-size: $font-size-2xl;
    line-height: 1;
    cursor: pointer;
    color: $color-text-secondary;

    &:hover {
      background: $color-surface-alt;
    }
  }

  &__body {
    flex: 1;
    padding: $spacing-md;
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: $spacing-sm;
    padding: $spacing-md;
    border-top: $border-width solid $border-color;
  }

  // Drawer variant: full-height panel docked to the right.
  &--drawer {
    align-items: stretch;
    justify-content: flex-end;
    padding: 0;

    .admin-modal__panel {
      width: min(480px, 100%);
      max-height: none;
      height: 100%;
      border-radius: $border-radius-lg 0 0 $border-radius-lg;
    }
  }
}

.admin-modal--center-enter-active,
.admin-modal--center-leave-active,
.admin-modal--drawer-enter-active,
.admin-modal--drawer-leave-active {
  transition: opacity $transition-base;

  .admin-modal__panel {
    transition:
      transform $transition-base,
      opacity $transition-base;
  }
}

.admin-modal--center-enter-from,
.admin-modal--center-leave-to,
.admin-modal--drawer-enter-from,
.admin-modal--drawer-leave-to {
  opacity: 0;
}

.admin-modal--center-enter-from .admin-modal__panel,
.admin-modal--center-leave-to .admin-modal__panel {
  transform: translateY(12px);
}

.admin-modal--drawer-enter-from .admin-modal__panel,
.admin-modal--drawer-leave-to .admin-modal__panel {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .admin-modal--center-enter-active,
  .admin-modal--center-leave-active,
  .admin-modal--drawer-enter-active,
  .admin-modal--drawer-leave-active {
    transition: none;

    .admin-modal__panel {
      transition: none;
    }
  }
}
</style>
