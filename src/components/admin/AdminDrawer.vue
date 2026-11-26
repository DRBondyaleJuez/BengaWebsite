<!--
  AdminDrawer - AdminModal that slides in from the right (detail panels).
  Same props, slots and events as AdminModal (open / v-model:open, title, persistent, width;
  slots default + footer; events update:open, close). Focus trap, Escape, backdrop and
  focus restore come from AdminModal.
  Usage:
    <AdminDrawer v-model:open="show" title="Entrada: Ele">
      <p>…</p>
    </AdminDrawer>
-->
<template>
  <AdminModal
    variant="drawer"
    :open="open"
    :title="title"
    :persistent="persistent"
    :width="width"
    @update:open="$emit('update:open', $event)"
    @close="$emit('close')"
  >
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </AdminModal>
</template>

<script>
import AdminModal from './AdminModal.vue'

export default {
  name: 'AdminDrawer',
  components: { AdminModal },
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    persistent: { type: Boolean, default: false },
    width: { type: String, default: '' }
  },
  emits: ['update:open', 'close']
}
</script>
