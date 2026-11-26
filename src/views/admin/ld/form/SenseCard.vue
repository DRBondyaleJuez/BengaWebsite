<!--
  SenseCard - one meaning of the word: glosses and definition in es/en/fr, parts of speech,
  semantic domains, noun class, plural and variant.
  Props: sense (read only), index, canRemove, warnings (orthography of plural/variant)
  Events: set(path, value) with the path relative to the entry (senses[i].…), remove
-->
<template>
  <FormCard :id="`sentido-${index + 1}`" :title="`Sentido ${index + 1}`" :summary="summary">
    <template #actions>
      <button
        type="button"
        class="ld-btn ld-btn--danger"
        :disabled="!canRemove"
        :title="canRemove ? '' : removeBlockedReason"
        @click="$emit('remove')"
      >
        Quitar sentido
      </button>
    </template>

    <h3 class="sense-card__subtitle">Traducción</h3>
    <div class="ld-grid">
      <label v-for="lang in languages" :key="lang.code" class="ld-field">
        {{ lang.label }}
        <input
          :value="sense.glosses?.[lang.code] ?? ''"
          :lang="lang.code"
          @input="setLanguage('glosses', lang.code, $event.target.value)"
        />
      </label>
    </div>

    <details class="sense-card__definition" :open="hasDefinition">
      <summary>Definición (opcional)</summary>
      <div class="ld-grid">
        <label v-for="lang in languages" :key="lang.code" class="ld-field">
          {{ lang.label }}
          <textarea
            rows="2"
            :value="sense.definition?.[lang.code] ?? ''"
            :lang="lang.code"
            @input="setLanguage('definition', lang.code, $event.target.value)"
          ></textarea>
        </label>
      </div>
    </details>

    <div class="sense-card__row">
      <span class="sense-card__label">
        Categoría gramatical
        <InfoTip
          text="Qué tipo de palabra es (nombre, verbo, adjetivo…). Puedes elegir varias. Escribe para buscar entre las categorías."
        />
      </span>
      <ChipSelect
        :model-value="sense.partsOfSpeech || []"
        :options="posOptions"
        label="Categoría gramatical"
        placeholder="Buscar categoría…"
        @update:model-value="$emit('set', path('partsOfSpeech'), $event)"
      />
    </div>

    <div class="sense-card__row">
      <span class="sense-card__label">
        Dominio semántico
        <InfoTip
          text="El tema del significado (cuerpo, naturaleza, familia…), según la lista de Living Dictionaries. Sirve para agrupar las palabras."
        />
      </span>
      <TreeSelect
        :model-value="sense.semanticDomains || []"
        :options="domainOptions"
        label="Dominio semántico"
        placeholder="Buscar dominio…"
        max-height="14rem"
        @update:model-value="$emit('set', path('semanticDomains'), $event)"
      />
    </div>

    <div class="ld-grid sense-card__forms">
      <div class="ld-field">
        <label :for="`${uid}-class`">
          Clase nominal
          <InfoTip label="¿Qué es la clase nominal?">
            Los nombres benga se reparten en siete clases según su prefijo y el prefijo de su plural
            (por ejemplo la clase 1 hace el plural con <em>be-</em>). El libro de Salvado y Cos las
            describe en el capítulo 2; elige la clase del nombre o «otra» si no encaja.
          </InfoTip>
        </label>
        <select :id="`${uid}-class`" :value="choice" @change="onClassChoice($event.target.value)">
          <option value="">Sin clase</option>
          <option v-for="n in nounClasses" :key="n" :value="n">Clase {{ n }}</option>
          <option value="otra">Otra…</option>
        </select>
        <input
          v-if="choice === 'otra'"
          :value="customClass"
          aria-label="Otra clase nominal"
          placeholder="Escribe la clase"
          @input="onCustomClass($event.target.value)"
        />
        <small class="sense-card__classes">
          Ver en la web:
          <a
            v-for="n in nounClasses"
            :key="n"
            :href="`${base}capitulo-2/clase-${n}`"
            target="_blank"
            rel="noopener"
            >{{ n }}</a
          >
        </small>
      </div>
      <SymbolInput
        :model-value="sense.pluralForm"
        label="Plural"
        :warnings="warnings.pluralForm || []"
        @update:model-value="$emit('set', path('pluralForm'), $event)"
      />
      <SymbolInput
        :model-value="sense.variant"
        label="Variante"
        help="otra forma de decir lo mismo"
        :warnings="warnings.variant || []"
        @update:model-value="$emit('set', path('variant'), $event)"
      />
    </div>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SymbolInput from './SymbolInput.vue'
import ChipSelect from '@/components/admin/ChipSelect.vue'
import TreeSelect from '@/components/admin/TreeSelect.vue'
import InfoTip from '@/components/admin/InfoTip.vue'
import { POS_OPTIONS, DOMAIN_OPTIONS, posLabel } from '../vocab'
import { NOUN_CLASSES, nounClassChoice } from '@/utils/dictionaryForm'
import { withLanguage } from '@/utils/dictionaryPaths'

let uid = 0

export default {
  name: 'SenseCard',
  components: { FormCard, SymbolInput, ChipSelect, TreeSelect, InfoTip },
  props: {
    sense: { type: Object, required: true },
    index: { type: Number, required: true },
    removeBlockedReason: { type: String, default: '' },
    warnings: { type: Object, default: () => ({}) }
  },
  emits: ['set', 'remove'],
  data() {
    uid += 1
    return {
      uid: `sense-${uid}`,
      languages: [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'Inglés' },
        { code: 'fr', label: 'Francés' }
      ],
      posOptions: POS_OPTIONS,
      domainOptions: DOMAIN_OPTIONS,
      nounClasses: NOUN_CLASSES,
      base: import.meta.env.BASE_URL,
      // «Otra…» chosen with the box still empty
      pickedOther: false
    }
  },
  computed: {
    canRemove() {
      return !this.removeBlockedReason
    },
    choice() {
      return this.pickedOther ? 'otra' : nounClassChoice(this.sense.nounClass)
    },
    customClass() {
      return nounClassChoice(this.sense.nounClass) === 'otra' ? this.sense.nounClass : ''
    },
    hasDefinition() {
      return Object.values(this.sense.definition || {}).some(Boolean)
    },
    summary() {
      return [
        this.sense.glosses?.es,
        (this.sense.partsOfSpeech || []).map(posLabel).join(', '),
        this.sense.nounClass && `clase ${this.sense.nounClass}`
      ]
        .filter(Boolean)
        .join(' · ')
    }
  },
  methods: {
    path(field) {
      return `senses[${this.index}].${field}`
    },
    setLanguage(field, lang, text) {
      this.$emit('set', this.path(field), withLanguage(this.sense[field], lang, text))
    },
    onClassChoice(value) {
      this.pickedOther = value === 'otra'
      this.$emit('set', this.path('nounClass'), value === 'otra' ? '' : value)
    },
    onCustomClass(value) {
      this.$emit('set', this.path('nounClass'), value.trim())
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.sense-card {
  &__subtitle {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  &__definition {
    margin-bottom: $spacing-md;

    summary {
      margin-bottom: $spacing-sm;
      color: $color-primary;
      cursor: pointer;
    }
  }

  &__row {
    margin-bottom: $spacing-md;
  }

  &__label {
    display: block;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-semibold;
  }

  &__classes a {
    margin-left: $spacing-xs;
  }
}
</style>
