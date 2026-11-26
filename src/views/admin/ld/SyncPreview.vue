<template>
  <div class="sync-preview">
    <p v-if="!groups.length" class="sync-preview__empty">
      ✓ Nada que {{ direction === 'pull' ? 'traer' : 'enviar' }}.
    </p>
    <details
      v-for="group in groups"
      :key="group.status"
      class="sync-preview__group"
      :open="group.open"
    >
      <summary :class="`sync-preview__summary sync-preview__summary--${group.tone}`">
        <strong>{{ group.items.length }}</strong> {{ group.text }}
      </summary>
      <ul class="sync-preview__items">
        <li v-for="item in group.items" :key="item.kind + item.id" class="sync-preview__item">
          <router-link :to="linkOf(item)" class="sync-preview__word">{{ item.label }}</router-link>
          <span v-if="item.kind === 'sentences'" class="sync-preview__kind">oración</span>
          <ul v-if="item.changes?.length" class="sync-preview__changes">
            <li v-for="(change, index) in item.changes" :key="index">
              <span class="sync-preview__field">{{ change.label }}:</span>
              <template v-if="change.note">{{ change.note }}</template>
              <template v-else>
                <del v-if="hasValue(change.before)">{{ show(change.before) }}</del>
                <span v-if="hasValue(change.before)" aria-hidden="true"> → </span>
                <ins>{{ hasValue(change.after) ? show(change.after) : '(vacío)' }}</ins>
              </template>
            </li>
          </ul>
          <span v-else class="sync-preview__fields">{{ fieldsOf(item) }}</span>
          <p v-for="warning in item.warnings || []" :key="warning" class="sync-preview__warning">
            ⚠ {{ warning }}
          </p>
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
/**
 * The list of a sync preview (pull or push), grouped by what will happen to each record.
 * Items: { id, kind, label, status, labels: { remote, local, conflicts }, changes?, warnings? }
 */
const GROUPS = {
  pull: [
    ['conflict', 'en conflicto: el mismo campo cambió aquí y en LD (tú eliges)', 'error'],
    ['changed-in-ld', 'cambiadas en LD: se actualizan aquí', 'info'],
    ['both-changed', 'cambiadas aquí y en LD en campos distintos: se juntan', 'info'],
    ['new-in-ld', 'nuevas en LD: se añaden aquí', 'info'],
    ['deleted-in-ld', 'borradas en LD', 'warn'],
    ['changed', 'con cambios tuyos sin enviar (no se tocan)', 'plain'],
    ['new', 'solo aquí, sin enviar (no se tocan)', 'plain'],
    ['deleted-locally', 'borradas aquí, sin enviar (no se tocan)', 'plain']
  ],
  push: [
    ['blocked', 'no se pueden enviar ahora', 'error'],
    ['delete', 'se borrarán en Living Dictionaries', 'error'],
    ['create', 'nuevas: se crearán en Living Dictionaries', 'info'],
    ['update', 'cambiadas: se enviarán solo los campos cambiados', 'info'],
    ['skipped', 'quedan para otro envío', 'plain']
  ]
}

export default {
  name: 'SyncPreview',
  props: {
    preview: { type: Object, required: true },
    direction: { type: String, default: 'pull' }
  },
  computed: {
    groups() {
      const items = [
        ...(this.preview.entries || []).map((item) => ({ kind: 'entries', ...item })),
        ...(this.preview.sentences || []).map((item) => ({ kind: 'sentences', ...item }))
      ]
      return GROUPS[this.direction]
        .map(([status, text, tone]) => ({
          status,
          text,
          tone,
          open: tone !== 'plain',
          items: items.filter((item) => item.status === status)
        }))
        .filter((group) => group.items.length)
    }
  },
  methods: {
    linkOf(item) {
      const page = item.kind === 'sentences' ? 'oracion' : 'entrada'
      return `/admin/living-dictionary/${page}/${item.id}`
    },
    fieldsOf(item) {
      const labels = item.labels || {}
      const list =
        this.direction === 'pull'
          ? [...(labels.conflicts || []), ...(labels.remote || [])]
          : labels.local || []
      return list.length ? list.join(' · ') : ''
    },
    hasValue: (value) => value !== null && value !== undefined && value !== '',
    show(value) {
      if (Array.isArray(value)) return value.join(', ')
      if (value && typeof value === 'object') return JSON.stringify(value)
      return String(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sync-preview {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-top: $spacing-md;

  &__empty {
    color: $color-success;
    font-weight: $font-weight-semibold;
  }

  &__group {
    border: 1px solid $color-surface-alt;
    border-radius: $border-radius-sm;
  }

  &__summary {
    padding: $spacing-xs $spacing-sm;
    cursor: pointer;
    border-left: 4px solid $color-text-muted;

    &--info {
      border-left-color: $color-primary;
    }

    &--warn {
      border-left-color: #e08a00;
    }

    &--error {
      border-left-color: $color-error;
    }
  }

  &__items {
    margin: 0;
    padding: $spacing-xs $spacing-sm $spacing-sm;
    list-style: none;
  }

  &__item {
    padding: $spacing-xs 0;
    border-bottom: 1px solid $color-surface-alt;
    font-size: $font-size-sm;
    overflow-wrap: anywhere;

    &:last-child {
      border-bottom: none;
    }
  }

  &__word {
    @include benga-word-style;
    margin-right: $spacing-xs;
    font-weight: $font-weight-semibold;
  }

  &__kind {
    margin-right: $spacing-xs;
    color: $color-text-muted;
    font-size: $font-size-xs;
  }

  &__fields {
    color: $color-text-secondary;
  }

  &__changes {
    margin: $spacing-xs 0 0;
    padding-left: $spacing-md;

    del {
      color: $color-error;
    }

    ins {
      color: $color-success;
      text-decoration: none;
      font-weight: $font-weight-semibold;
    }
  }

  &__field {
    color: $color-text-secondary;
  }

  &__warning {
    margin: $spacing-xs 0 0;
    color: #a05a00;
  }
}
</style>
