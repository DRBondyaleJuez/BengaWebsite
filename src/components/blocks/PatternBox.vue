<template>
  <!-- Compact: the small purple box of a variant pattern (e.g. "y- → bi-" in class 1) -->
  <div v-if="compact" class="variant-pattern">
    <span class="pattern-value">{{ from }}</span>
    <span>→</span>
    <span class="pattern-value">{{ to }}</span>
  </div>

  <template v-else>
    <div class="pattern-box">
      <div class="pattern-item">
        <span class="pattern-label">{{ fromLabel || $t('content.singular') }}:</span>
        <span class="pattern-value singular">{{ from }}</span>
      </div>
      <div class="pattern-arrow">→</div>
      <div class="pattern-item">
        <span class="pattern-label">{{ toLabel || $t('content.plural') }}:</span>
        <span class="pattern-value plural">{{ to }}</span>
      </div>
    </div>
    <p v-if="description" class="pattern-description">{{ description }}</p>
  </template>
</template>

<script>
/**
 * A transformation pattern: how the singular becomes the plural.
 *
 *   <PatternBox from="e-" to="be-" description="La vocal inicial 'e' se reemplaza…" />
 *     ┌──────────────────────────────┐
 *     │ Singular:  [e-]  →  Plural: [be-] │
 *     └──────────────────────────────┘
 *     La vocal inicial 'e' se reemplaza…
 *
 *   <PatternBox from="y-" to="bi-" compact />     small purple box:  [y-] → [bi-]
 *
 * Section-file block: { "type": "pattern", "from", "to", "fromLabel"?, "toLabel"?, "description"? }
 */
export default {
  name: 'PatternBox',
  props: {
    from: { type: String, required: true },
    to: { type: String, required: true },
    /** Defaults: «Singular» / «Plural» in the visitor's language (content.singular / content.plural) */
    fromLabel: { type: String, default: null },
    toLabel: { type: String, default: null },
    description: { type: String, default: null },
    compact: { type: Boolean, default: false }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.pattern-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  background: $color-surface-light;
  padding: 2rem;
  border-radius: $border-radius;
  margin-bottom: $spacing-md;

  .pattern-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;

    .pattern-label {
      font-weight: bold;
      color: $color-text-secondary;
      font-size: 0.9rem;
    }

    .pattern-value {
      font-size: 1.8rem;
      font-weight: bold;
      font-family: $font-mono;
      padding: $spacing-md $spacing-lg;
      border-radius: $border-radius;

      &.singular {
        background: #e8f5e9;
        color: #1b5e20;
      }

      &.plural {
        background: #fff3e0;
        color: #e65100;
      }
    }
  }

  .pattern-arrow {
    font-size: 2rem;
    color: $color-accent;
    font-weight: bold;
  }

  // Phones: singular above plural, smaller boxes, so the pattern never needs a wider screen (R-031)
  @include respond-below('sm') {
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-md;

    .pattern-item .pattern-value {
      font-size: 1.4rem;
      padding: $spacing-sm $spacing-md;
    }

    .pattern-arrow {
      transform: rotate(90deg);
    }
  }
}

.pattern-description {
  text-align: center;
  color: $color-text-secondary;
  font-style: italic;
}

.variant-pattern {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  padding: $spacing-lg;
  background: #f3e5f5;
  border-radius: $border-radius;
  font-size: 1.5rem;
  font-weight: bold;

  .pattern-value {
    background: white;
    padding: $spacing-md $spacing-lg;
    border-radius: $border-radius;
    font-family: $font-mono;
    color: $color-primary;
  }
}
</style>
