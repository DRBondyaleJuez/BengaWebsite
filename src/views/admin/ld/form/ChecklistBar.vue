<!--
  ChecklistBar - what a word still lacks, at the top of the word form: translation es/en/fr,
  category, domain, audio, example. Each missing item is a link that opens and scrolls to the
  card where it is filled in.
  Props: entry (read only; the working copy, so it updates while typing)
-->
<template>
  <nav class="checklist" aria-label="Qué le falta a esta palabra">
    <p class="checklist__summary">
      <strong>{{ done }} de {{ items.length }}</strong> completos
      <span v-if="done === items.length" aria-hidden="true">✓</span>
    </p>
    <ul class="checklist__items">
      <li v-for="item in items" :key="item.id">
        <span v-if="item.ok" class="checklist__item checklist__item--ok">
          <span aria-hidden="true">✓</span> {{ item.label }}
        </span>
        <button
          v-else
          type="button"
          class="checklist__item checklist__item--missing"
          :title="`Falta: ${item.label}. Ir a rellenarlo`"
          @click="jump(item.target)"
        >
          <span aria-hidden="true">✗</span> {{ item.label }}
          <span class="checklist__hint">falta</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { entryChecklist } from '@/utils/dictionaryChecks'
import { openCard } from './cardEvents'

export default {
  name: 'ChecklistBar',
  props: {
    entry: { type: Object, required: true }
  },
  computed: {
    items() {
      return entryChecklist(this.entry)
    },
    done() {
      return this.items.filter((item) => item.ok).length
    }
  },
  methods: {
    jump: openCard
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.checklist {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-sm $spacing-md;
  margin-bottom: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background: $color-surface;
  border: 1px solid $border-color;
  border-radius: $border-radius;

  &__summary {
    margin: 0;
    font-size: $font-size-sm;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: 2px $spacing-sm;
    border: 1px solid transparent;
    border-radius: $border-radius-full;
    font: inherit;
    font-size: $font-size-sm;

    &--ok {
      background: rgba($color-success, 0.12);
      color: #1c6b2d;
    }

    &--missing {
      background: rgba($color-error, 0.08);
      border-color: rgba($color-error, 0.4);
      color: #9c1c2a;
      cursor: pointer;

      &:hover {
        background: rgba($color-error, 0.18);
      }

      &:focus-visible {
        @include focus-ring;
      }
    }
  }

  &__hint {
    font-size: $font-size-xs;
    text-decoration: underline;
  }
}
</style>
