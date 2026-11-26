<!--
  StatusBadge - small coloured label for the sync state of a dictionary item.
  Props: status ('synced'|'local-changes'|'new'|'conflict'|'error'|'review'|'no-audio'),
         label (overrides the default text), compact (dot only, text in title/aria-label).
  Events: none.
  Usage:  <StatusBadge status="conflict" />   <StatusBadge status="new" compact />
-->
<template>
  <span
    class="status-badge"
    :class="[`status-badge--${info.cls}`, { 'status-badge--compact': compact }]"
    :title="compact ? text : null"
    :role="compact ? 'img' : null"
    :aria-label="compact ? text : null"
  >
    <span class="status-badge__dot" aria-hidden="true"></span>
    <span v-if="!compact" class="status-badge__text">{{ text }}</span>
  </span>
</template>

<script>
const STATUSES = {
  synced: { label: 'Sincronizada', cls: 'synced' },
  'local-changes': { label: 'Cambios sin enviar', cls: 'local' },
  new: { label: 'Nueva', cls: 'new' },
  conflict: { label: 'Conflicto', cls: 'error' },
  error: { label: 'Error', cls: 'error' },
  review: { label: 'Revisar', cls: 'review' },
  'no-audio': { label: 'Sin audio', cls: 'muted' }
}

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (v) => v in STATUSES
    },
    label: { type: String, default: '' },
    compact: { type: Boolean, default: false }
  },
  computed: {
    info() {
      return STATUSES[this.status] || STATUSES.error
    },
    text() {
      return this.label || this.info.label
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.status-badge {
  --badge-bg: #eef1ee;
  --badge-fg: #3d5a3a;
  --badge-dot: #6a9a63;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.15em 0.6em;
  border-radius: $border-radius-full;
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  line-height: 1.5;
  white-space: nowrap;

  &__dot {
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: var(--badge-dot);
    flex-shrink: 0;
  }

  &--local {
    --badge-bg: #e1eefb;
    --badge-fg: #1b4f86;
    --badge-dot: #2f7fd1;
  }
  &--new {
    --badge-bg: #dff3f0;
    --badge-fg: #0f5f57;
    --badge-dot: #1a9a8c;
  }
  &--error {
    --badge-bg: #fbe3e5;
    --badge-fg: #8f1d29;
    --badge-dot: #{$color-error};
  }
  &--review {
    --badge-bg: #fdebd6;
    --badge-fg: #8a4a05;
    --badge-dot: #e8830c;
  }
  &--muted {
    --badge-bg: #f0eeea;
    --badge-fg: #6b6b6b;
    --badge-dot: #aaa;
  }

  &--compact {
    padding: 0;
    background: transparent;
    .status-badge__dot {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
