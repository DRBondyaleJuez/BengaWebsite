<!--
  TagInput - list of short texts as removable chips (scientific names, dialects, tags).
  Type and press Enter (or a comma) to add; Backspace in an empty box removes the last one.
  Props: values (array of strings, read only), label, placeholder, suggestions (array of strings),
         italic (Boolean: scientific names are shown in italics)
  Events: update(values) with the whole new list
-->
<template>
  <div class="tag-input">
    <div class="tag-input__label">
      <label :for="listId + '-input'">{{ label }}</label>
      <span class="tag-input__box">
        <span v-for="value in values" :key="value" class="tag-input__chip">
          <span :class="{ 'tag-input__italic': italic }">{{ value }}</span>
          <button
            type="button"
            class="tag-input__remove"
            :aria-label="`Quitar ${value}`"
            @click="remove(value)"
          >
            ×
          </button>
        </span>
        <input
          :id="listId + '-input'"
          v-model="text"
          class="tag-input__input"
          :list="listId"
          :placeholder="values.length ? '' : placeholder"
          autocomplete="off"
          @keydown.enter.prevent="add"
          @keydown="onKey"
          @blur="add"
        />
      </span>
    </div>
    <datalist :id="listId">
      <option v-for="item in suggestions" :key="item" :value="item"></option>
    </datalist>
  </div>
</template>

<script>
let uid = 0

export default {
  name: 'TagInput',
  props: {
    values: { type: Array, default: () => [] },
    label: { type: String, required: true },
    placeholder: { type: String, default: 'Escribe y pulsa Enter' },
    suggestions: { type: Array, default: () => [] },
    italic: { type: Boolean, default: false }
  },
  emits: ['update'],
  data() {
    uid += 1
    return { text: '', listId: `tag-input-list-${uid}` }
  },
  methods: {
    add() {
      const value = this.text.trim().replace(/,$/, '').trim()
      this.text = ''
      if (value && !this.values.includes(value)) this.$emit('update', [...this.values, value])
    },
    remove(value) {
      this.$emit(
        'update',
        this.values.filter((item) => item !== value)
      )
    },
    onKey(event) {
      if (event.key === ',') {
        event.preventDefault()
        this.add()
      } else if (event.key === 'Backspace' && !this.text && this.values.length) {
        this.remove(this.values[this.values.length - 1])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.tag-input {
  &__label {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    font-weight: $font-weight-semibold;
  }

  &__box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs;
    background: $color-surface;
    border: 1px solid #c9c2b5;
    border-radius: $border-radius-sm;
    font-weight: normal;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: 0 $spacing-sm;
    background: $color-surface-alt;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
  }

  &__italic {
    font-style: italic;
  }

  &__remove {
    padding: 0 2px;
    background: none;
    border: none;
    color: $color-text-muted;
    cursor: pointer;

    &:hover {
      color: $color-error;
    }
  }

  &__input {
    flex: 1 1 8rem;
    width: auto;
    min-width: 6rem;
    padding: 2px $spacing-xs;
    border: none;
  }
}
</style>
