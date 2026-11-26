<!--
  ChipSelect - multi-select with search. Chosen values are removable chips; the dropdown lists
  the options grouped by `group`, filtered by the typed text (ignoring accents and case).
  Props:
    modelValue   array of chosen values (v-model)
    options      [{ value, label, group?, help?, count? }]   (about 100 options are fine)
    placeholder  text of the empty search box
    max          maximum number of chosen values (optional)
    label        accessible name of the control (default 'Seleccionar')
  Events: update:modelValue (array)
  Keys: ArrowDown/ArrowUp move, Enter chooses, Escape closes, Backspace in an empty box
        removes the last chip.
  Usage:
    <ChipSelect v-model="pos" :options="posOptions" placeholder="Buscar categoría…" />
-->
<template>
  <div ref="root" class="chip-select" :class="{ 'chip-select--open': open }">
    <div class="chip-select__box" @click="focusInput">
      <span v-for="v in modelValue" :key="v" class="chip-select__chip">
        <span class="chip-select__chip-text">{{ labelOf(v) }}</span>
        <button
          type="button"
          class="chip-select__chip-remove"
          :aria-label="`Quitar ${labelOf(v)}`"
          @click.stop="remove(v)"
        >
          ×
        </button>
      </span>
      <input
        ref="input"
        v-model="query"
        class="chip-select__input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-label="label"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="listId"
        :aria-activedescendant="open && active >= 0 ? optionId(active) : null"
        :placeholder="modelValue.length ? '' : placeholder"
        @focus="open = true"
        @input="onInput"
        @keydown="onKeydown"
      />
    </div>
    <ul
      v-show="open"
      :id="listId"
      class="chip-select__list"
      role="listbox"
      aria-multiselectable="true"
      :aria-label="label"
    >
      <template v-for="item in rows" :key="item.key">
        <li v-if="item.header" class="chip-select__group" role="presentation">{{ item.header }}</li>
        <li
          v-else
          :id="optionId(item.index)"
          class="chip-select__option"
          :class="{
            'chip-select__option--active': item.index === active,
            'chip-select__option--selected': isChosen(item.option.value),
            'chip-select__option--disabled': isBlocked(item.option.value)
          }"
          role="option"
          :aria-selected="isChosen(item.option.value) ? 'true' : 'false'"
          :aria-disabled="isBlocked(item.option.value) ? 'true' : null"
          @mousedown.prevent
          @mousemove="active = item.index"
          @click="toggle(item.option.value)"
        >
          <span class="chip-select__check" aria-hidden="true">{{
            isChosen(item.option.value) ? '✓' : ''
          }}</span>
          <span class="chip-select__text">
            <span class="chip-select__label">{{ item.option.label }}</span>
            <span v-if="item.option.help" class="chip-select__help">{{ item.option.help }}</span>
          </span>
          <span v-if="item.option.count != null" class="chip-select__count">{{
            item.option.count
          }}</span>
        </li>
      </template>
      <li v-if="!flat.length" class="chip-select__empty" role="presentation">Sin resultados</li>
    </ul>
  </div>
</template>

<script>
import { normalizeText } from './searchText'

let uid = 0

export default {
  name: 'ChipSelect',
  props: {
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Buscar…' },
    max: { type: Number, default: null },
    label: { type: String, default: 'Seleccionar' }
  },
  emits: ['update:modelValue'],
  data() {
    uid += 1
    return { uid, query: '', open: false, active: 0 }
  },
  computed: {
    listId() {
      return `chip-select-list-${this.uid}`
    },
    flat() {
      const q = normalizeText(this.query)
      if (!q) return this.options
      return this.options.filter((o) =>
        normalizeText(`${o.label} ${o.help || ''} ${o.value}`).includes(q)
      )
    },
    // Rows for the template: group headers and options, in order of the first appearance of a group.
    rows() {
      const groups = new Map()
      this.flat.forEach((option, index) => {
        const g = option.group || ''
        if (!groups.has(g)) groups.set(g, [])
        groups.get(g).push({ option, index })
      })
      const out = []
      for (const [g, items] of groups) {
        if (g) out.push({ key: `g:${g}`, header: g })
        items.forEach((it) => out.push({ key: `o:${it.option.value}`, ...it }))
      }
      return out
    },
    // Visual order differs from `flat` when groups interleave, so navigate in visual order.
    visual() {
      return this.rows.filter((r) => !r.header).map((r) => r.index)
    }
  },
  watch: {
    flat() {
      this.active = this.visual[0] ?? -1
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.onOutside)
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.onOutside)
  },
  methods: {
    optionId(i) {
      return `chip-select-${this.uid}-opt-${i}`
    },
    labelOf(value) {
      const o = this.options.find((x) => x.value === value)
      return o ? o.label : String(value)
    },
    isChosen(value) {
      return this.modelValue.includes(value)
    },
    isBlocked(value) {
      return this.max != null && this.modelValue.length >= this.max && !this.isChosen(value)
    },
    focusInput() {
      this.$refs.input.focus()
    },
    onOutside(e) {
      if (this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false
    },
    onInput() {
      this.open = true
    },
    toggle(value) {
      if (this.isChosen(value)) return this.remove(value)
      if (this.isBlocked(value)) return
      this.$emit('update:modelValue', [...this.modelValue, value])
      this.query = ''
      this.focusInput()
    },
    remove(value) {
      this.$emit(
        'update:modelValue',
        this.modelValue.filter((v) => v !== value)
      )
    },
    move(step) {
      if (!this.visual.length) return
      const pos = this.visual.indexOf(this.active)
      const next = (pos + step + this.visual.length) % this.visual.length
      this.active = this.visual[next]
      this.$nextTick(() => {
        const el = document.getElementById(this.optionId(this.active))
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
      })
    },
    onKeydown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!this.open) this.open = true
        else this.move(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.open = true
        this.move(-1)
      } else if (e.key === 'Enter') {
        if (this.open && this.flat[this.active]) {
          e.preventDefault()
          this.toggle(this.flat[this.active].value)
        }
      } else if (e.key === 'Escape') {
        if (this.open) {
          e.stopPropagation()
          this.open = false
        }
      } else if (e.key === 'Backspace' && !this.query && this.modelValue.length) {
        this.remove(this.modelValue[this.modelValue.length - 1])
      } else if (e.key === 'Tab') {
        this.open = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.chip-select {
  position: relative;
  min-width: 0;

  &__box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
    min-height: 2.5rem;
    padding: $spacing-xs $spacing-sm;
    background: $color-surface;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    cursor: text;

    &:focus-within {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.3);
    }
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    max-width: 100%;
    padding: 0.1rem 0.25rem 0.1rem 0.6rem;
    background: $color-benga-word-bg;
    color: $color-benga-word;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
  }

  &__chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__chip-remove {
    @include focus-ring;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font-size: $font-size-base;
    line-height: 1;
    cursor: pointer;

    &:hover {
      background: rgba($color-benga-word, 0.18);
    }
  }

  &__input {
    flex: 1 1 6rem;
    min-width: 6rem;
    padding: $spacing-xs;
    border: none;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: $font-size-sm;
  }

  &__list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: $z-dropdown;
    max-height: 18rem;
    margin: 0;
    padding: $spacing-xs 0;
    overflow-y: auto;
    list-style: none;
    background: $color-surface;
    border: $border-width solid $border-color;
    border-radius: $border-radius-sm;
    box-shadow: $shadow-lg;
  }

  &__group {
    padding: $spacing-sm $spacing-md $spacing-xs;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $color-text-muted;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
    cursor: pointer;

    &--active {
      background: $color-benga-word-bg;
    }
    &--selected .chip-select__label {
      font-weight: $font-weight-semibold;
    }
    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__check {
    flex: 0 0 1rem;
    color: $color-primary;
    font-weight: $font-weight-bold;
  }

  &__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  &__help {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  &__count {
    flex-shrink: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__empty {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}
</style>
