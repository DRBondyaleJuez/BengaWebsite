<!--
  SearchPicker - search box that lists matching items to pick one (accents ignored, typos
  tolerated). Used to link a sentence to a sense, a word to a relation, a sentence to a sense.
  Props: items [{ id, label, hint? }], label (accessible name), placeholder,
         exclude (array of ids not offered), limit (results shown, default 8), disabled
  Events: pick(id)
  Keys: Enter picks the first result, Escape clears.
-->
<template>
  <div class="search-picker">
    <input
      v-model="query"
      type="search"
      class="search-picker__input"
      autocomplete="off"
      :aria-label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown.enter.prevent="pickFirst"
      @keydown.esc="query = ''"
    />
    <ul v-if="query.trim()" class="search-picker__list" role="listbox" :aria-label="label">
      <li v-for="item in results" :key="item.id" role="option" aria-selected="false">
        <button type="button" class="search-picker__option" @click="pick(item)">
          <span class="search-picker__label">{{ item.label }}</span>
          <small v-if="item.hint">{{ item.hint }}</small>
        </button>
      </li>
      <li v-if="!results.length" class="search-picker__empty">Sin resultados</li>
    </ul>
  </div>
</template>

<script>
import { matchesText } from '@/utils/dictionaryFilters'

export default {
  name: 'SearchPicker',
  props: {
    items: { type: Array, default: () => [] },
    label: { type: String, default: 'Buscar' },
    placeholder: { type: String, default: 'Buscar…' },
    exclude: { type: Array, default: () => [] },
    limit: { type: Number, default: 8 },
    disabled: { type: Boolean, default: false }
  },
  emits: ['pick'],
  data() {
    return { query: '' }
  },
  computed: {
    results() {
      const query = this.query.normalize('NFC')
      return this.items
        .filter((item) => !this.exclude.includes(item.id))
        .filter((item) =>
          matchesText(`${item.label} ${item.hint || ''}`.normalize('NFC'), query, 1)
        )
        .slice(0, this.limit)
    }
  },
  methods: {
    pick(item) {
      this.$emit('pick', item.id)
      this.query = ''
    },
    pickFirst() {
      if (this.results[0]) this.pick(this.results[0])
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.search-picker {
  &__input {
    width: 100%;
    padding: $spacing-sm;
    border: 1px solid #c9c2b5;
    border-radius: $border-radius-sm;
    font: inherit;

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__list {
    margin: $spacing-xs 0 0;
    padding: 0;
    list-style: none;
    background: $color-surface;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
  }

  &__option {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: $spacing-xs $spacing-sm;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: $color-surface-alt;
    }

    small {
      color: $color-text-muted;
    }
  }

  &__label {
    overflow-wrap: anywhere;
  }

  &__empty {
    padding: $spacing-xs $spacing-sm;
    color: $color-text-muted;
    font-size: $font-size-sm;
  }
}
</style>
