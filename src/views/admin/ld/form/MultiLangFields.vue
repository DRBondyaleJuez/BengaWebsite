<!--
  MultiLangFields - the same text in Spanish, English and French (three boxes).
  Props: value (object { es, en, fr } or null, read only), label, rows, help
  Events: update(value) with the whole new object (null when all are empty)
-->
<template>
  <fieldset class="multilang">
    <legend>
      {{ label }} <small v-if="help">{{ help }}</small>
    </legend>
    <div class="ld-grid">
      <label v-for="lang in languages" :key="lang.code" class="ld-field">
        {{ lang.label }}
        <textarea
          :rows="rows"
          :lang="lang.code"
          :value="value?.[lang.code] ?? ''"
          @input="$emit('update', withLanguage(value, lang.code, $event.target.value))"
        ></textarea>
      </label>
    </div>
  </fieldset>
</template>

<script>
import { withLanguage } from '@/utils/dictionaryPaths'

export default {
  name: 'MultiLangFields',
  props: {
    value: { type: Object, default: null },
    label: { type: String, required: true },
    rows: { type: Number, default: 3 },
    help: { type: String, default: '' }
  },
  emits: ['update'],
  data() {
    return {
      languages: [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'Inglés' },
        { code: 'fr', label: 'Francés' }
      ]
    }
  },
  methods: { withLanguage }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.multilang {
  margin: 0 0 $spacing-md;
  padding: 0;
  border: none;

  legend {
    padding: 0;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-semibold;

    small {
      font-weight: normal;
      color: $color-text-muted;
    }
  }
}
</style>
