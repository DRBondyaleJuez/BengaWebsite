<!--
  TranslationsCard - card «Traducciones» of the sentence form: the sentence in Spanish, English
  and French, each with its status: machine (not reviewed by a person), reviewed, published.
  Props: sentence (read only)
  Events: set(path, value)
-->
<template>
  <FormCard id="card-traducciones" title="Traducciones" :summary="summary">
    <p class="ld-help">
      Indica quién ha comprobado cada traducción. Una traducción automática se envía al diccionario
      marcada como tal hasta que una persona la revise.
    </p>
    <div v-for="lang in languages" :key="lang.code" class="translations__row">
      <label class="ld-field">
        {{ lang.label }}
        <textarea
          rows="2"
          :lang="lang.code"
          :value="sentence.translations?.[lang.code] ?? ''"
          @input="setText(lang.code, $event.target.value)"
        ></textarea>
      </label>
      <label class="ld-field">
        Estado
        <select
          :value="sentence.translationStatus?.[lang.code] ?? ''"
          @change="setStatus(lang.code, $event.target.value)"
        >
          <option value="">Sin indicar</option>
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </label>
    </div>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import { withLanguage } from '@/utils/dictionaryPaths'

export default {
  name: 'TranslationsCard',
  components: { FormCard },
  props: {
    sentence: { type: Object, required: true }
  },
  emits: ['set'],
  data() {
    return {
      languages: [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'Inglés' },
        { code: 'fr', label: 'Francés' }
      ],
      statuses: [
        { value: 'machine', label: 'Traducción automática, sin revisar' },
        { value: 'reviewed', label: 'Revisada por una persona' },
        { value: 'published', label: 'Publicada en una obra' }
      ]
    }
  },
  computed: {
    summary() {
      const done = this.languages.filter((lang) => this.sentence.translations?.[lang.code])
      const machine = done.filter(
        (lang) => this.sentence.translationStatus?.[lang.code] === 'machine'
      )
      return done.length
        ? `${done.map((lang) => lang.code).join(', ')}${machine.length ? ` (automática: ${machine.map((lang) => lang.code).join(', ')})` : ''}`
        : 'Sin traducciones'
    }
  },
  methods: {
    setText(lang, text) {
      this.$emit('set', 'translations', withLanguage(this.sentence.translations, lang, text))
    },
    setStatus(lang, status) {
      const next = { ...(this.sentence.translationStatus || {}) }
      if (status) next[lang] = status
      else delete next[lang]
      this.$emit('set', 'translationStatus', next)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.translations__row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
