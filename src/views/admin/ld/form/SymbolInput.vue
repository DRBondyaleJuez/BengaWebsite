<!--
  SymbolInput - text field (or textarea) with buttons that insert a letter at the caret.
  Props: modelValue, label, letters (array of buttons, default the Benga vowels â ē ū),
         ipa (Boolean: adds an «IPA» button with the keyboard of common symbols),
         multiline, rows, placeholder, required, help (small text under the label),
         warnings (array of strings: orthography warnings shown under the field, never fixed)
  Events: update:modelValue
  The typed text is never changed except by the buttons.
-->
<template>
  <div class="symbol-input">
    <label class="ld-field" :for="inputId">
      <span
        >{{ label }} <small v-if="help">{{ help }}</small></span
      >
      <textarea
        v-if="multiline"
        :id="inputId"
        ref="field"
        :value="modelValue ?? ''"
        :rows="rows"
        :placeholder="placeholder"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
      <input
        v-else
        :id="inputId"
        ref="field"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :required="required"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
    <div v-if="letters.length || ipa" class="symbol-input__buttons">
      <span v-if="letters.length" class="symbol-input__label">Letras:</span>
      <button
        v-for="letter in letters"
        :key="letter"
        type="button"
        class="symbol-input__button"
        :aria-label="`Insertar ${letter}`"
        @click="insert(letter)"
      >
        {{ letter }}
      </button>
      <span v-if="ipa" class="symbol-input__ipa">
        <button
          type="button"
          class="symbol-input__button symbol-input__button--ipa"
          :aria-expanded="ipaOpen ? 'true' : 'false'"
          @click="ipaOpen = !ipaOpen"
        >
          IPA
        </button>
        <IpaKeyboard v-if="ipaOpen" @pick="insert" @close="ipaOpen = false" />
      </span>
    </div>
    <ul v-if="warnings.length" class="symbol-input__warnings" role="status">
      <li v-for="warning in warnings" :key="warning">{{ warning }}</li>
    </ul>
  </div>
</template>

<script>
import IpaKeyboard from './IpaKeyboard.vue'
import { insertAt } from '@/utils/dictionaryForm'

let uid = 0

export default {
  name: 'SymbolInput',
  components: { IpaKeyboard },
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    letters: { type: Array, default: () => ['â', 'ē', 'ū'] },
    ipa: { type: Boolean, default: false },
    multiline: { type: Boolean, default: false },
    rows: { type: Number, default: 2 },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    help: { type: String, default: '' },
    warnings: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue'],
  data() {
    uid += 1
    return { inputId: `symbol-input-${uid}`, ipaOpen: false }
  },
  methods: {
    insert(text) {
      const field = this.$refs.field
      const value = this.modelValue ?? ''
      const { value: next, caret } = insertAt(value, field.selectionStart, field.selectionEnd, text)
      this.$emit('update:modelValue', next)
      this.$nextTick(() => {
        field.focus()
        field.setSelectionRange(caret, caret)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.symbol-input {
  min-width: 0;

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
    margin-top: $spacing-xs;
    font-size: $font-size-sm;
  }

  &__label {
    color: $color-text-muted;
  }

  &__button {
    min-width: 2rem;
    padding: 2px $spacing-sm;
    background: $color-surface;
    border: 1px solid $color-primary;
    border-radius: $border-radius-sm;
    color: $color-primary-dark;
    font-size: $font-size-base;
    cursor: pointer;

    &:hover {
      background: $color-primary;
      color: $color-text-inverse;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--ipa {
      font-size: $font-size-sm;
    }
  }

  &__ipa {
    position: relative;
  }

  &__warnings {
    margin: $spacing-xs 0 0;
    padding: $spacing-xs $spacing-md $spacing-xs $spacing-lg;
    background: rgba($color-warning, 0.15);
    border-left: 4px solid $color-warning;
    font-size: $font-size-sm;
  }
}
</style>
