<!--
  WordCard - card «Palabra» of the word form: lexeme (with â ē ū buttons), homograph, phonetic
  (with the IPA keyboard). Warns «Ya existe» with links while the spelling matches other entries.
  Props: entry (read only), entries (all entries, for the warning), warnings (orthography)
  Events: set(path, value)
-->
<template>
  <FormCard id="card-palabra" title="Palabra" :summary="summary">
    <div class="ld-grid">
      <SymbolInput
        :model-value="entry.lexeme"
        label="Palabra en benga"
        required
        :warnings="warnings.lexeme || []"
        @update:model-value="$emit('set', 'lexeme', $event)"
      />
      <label class="ld-field">
        <span>
          Homógrafo
          <InfoTip
            text="Solo si existe otra palabra escrita exactamente igual pero con otro significado: 1, 2, 3… Déjalo vacío en el resto de casos."
          />
        </span>
        <input
          :value="entry.homograph ?? ''"
          inputmode="numeric"
          @input="$emit('set', 'homograph', $event.target.value)"
        />
      </label>
      <SymbolInput
        :model-value="entry.phonetic"
        label="Pronunciación (IPA)"
        help="opcional"
        :letters="[]"
        ipa
        @update:model-value="$emit('set', 'phonetic', $event)"
      />
    </div>
    <div v-if="similar.length" class="ld-warning" role="status">
      <strong>Ya existe:</strong>
      <ul>
        <li v-for="item in similar" :key="item.entry.id">
          <router-link :to="linkTo(item.entry)" target="_blank">
            {{ item.entry.lexeme }}<sup v-if="item.entry.homograph">{{ item.entry.homograph }}</sup>
          </router-link>
          ({{ firstGloss(item.entry) }}){{ item.exact ? '' : ' · se escribe casi igual' }}
        </li>
      </ul>
      <small>Si es otra palabra que se escribe igual, pon un número de homógrafo distinto.</small>
    </div>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SymbolInput from './SymbolInput.vue'
import InfoTip from '@/components/admin/InfoTip.vue'
import { findSimilar } from '@/utils/dictionaryForm'

export default {
  name: 'WordCard',
  components: { FormCard, SymbolInput, InfoTip },
  props: {
    entry: { type: Object, required: true },
    entries: { type: Array, default: () => [] },
    warnings: { type: Object, default: () => ({}) }
  },
  emits: ['set'],
  computed: {
    similar() {
      return findSimilar(this.entries, this.entry.lexeme, this.entry.homograph, this.entry.id)
    },
    summary() {
      return [this.entry.lexeme, this.entry.phonetic && `/${this.entry.phonetic}/`]
        .filter(Boolean)
        .join(' ')
    }
  },
  methods: {
    linkTo: (entry) => `/admin/living-dictionary/entrada/${entry.id}`,
    firstGloss(entry) {
      return (
        entry.senses.map((sense) => sense.glosses?.es).find(Boolean) || 'sin traducción al español'
      )
    }
  }
}
</script>
