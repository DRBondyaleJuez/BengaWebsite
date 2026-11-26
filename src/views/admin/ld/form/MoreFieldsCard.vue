<!--
  MoreFieldsCard - card «Más campos» of the word form (closed by default; while closed it lists
  only the fields that have something): notes (markdown), linguistic history, morphology,
  interlinearization, tone class, scientific names, dialects, tags, citations.
  Props: entry (read only), tagSuggestions (tags already used in the dictionary)
  Events: set(path, value)
-->
<template>
  <FormCard
    id="card-mas-campos"
    title="Más campos"
    :open="false"
    :badge="filled.length ? String(filled.length) : ''"
    :summary="filled.length ? '' : 'Ningún campo opcional relleno'"
  >
    <template #collapsed>
      <dl v-if="filled.length" class="more__filled">
        <template v-for="item in filled" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd :class="{ more__italic: item.italic }">{{ item.text }}</dd>
        </template>
      </dl>
    </template>

    <MultiLangFields
      :value="entry.notes"
      label="Notas"
      help="admite Markdown: **negrita**, *cursiva*, listas con «- »"
      @update="$emit('set', 'notes', $event)"
    />
    <MultiLangFields
      :value="entry.linguisticHistory"
      label="Historia lingüística"
      help="origen y cambios de la palabra"
      @update="$emit('set', 'linguisticHistory', $event)"
    />
    <div class="ld-grid">
      <label class="ld-field">
        Morfología <small>(partes de la palabra)</small>
        <input
          :value="entry.morphology ?? ''"
          @input="$emit('set', 'morphology', $event.target.value)"
        />
      </label>
      <SymbolInput
        :model-value="entry.interlinearization"
        label="Interlineal"
        help="glosa palabra por palabra"
        @update:model-value="$emit('set', 'interlinearization', $event)"
      />
      <label class="ld-field">
        Clase tonal <small>(si se conoce)</small>
        <input
          :value="entry.toneClass ?? ''"
          @input="$emit('set', 'toneClass', $event.target.value)"
        />
      </label>
    </div>
    <div class="ld-grid">
      <TagInput
        :values="entry.scientificNames || []"
        label="Nombres científicos"
        italic
        @update="$emit('set', 'scientificNames', $event)"
      />
      <TagInput
        :values="entry.dialects || []"
        label="Dialectos"
        @update="$emit('set', 'dialects', $event)"
      />
      <TagInput
        :values="entry.tags || []"
        label="Etiquetas"
        :suggestions="tagSuggestions"
        @update="$emit('set', 'tags', $event)"
      />
    </div>
    <h3 class="more__subtitle">Citas</h3>
    <CitationsEditor
      :citations="entry.citations || []"
      @update="$emit('set', 'citations', $event)"
    />
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SymbolInput from './SymbolInput.vue'
import MultiLangFields from './MultiLangFields.vue'
import TagInput from './TagInput.vue'
import CitationsEditor from './CitationsEditor.vue'

const languageNames = { es: 'es', en: 'en', fr: 'fr' }
const multi = (value) =>
  Object.entries(value || {})
    .filter(([, text]) => text)
    .map(([lang, text]) => `${languageNames[lang] || lang}: ${text}`)
    .join(' · ')

export default {
  name: 'MoreFieldsCard',
  components: { FormCard, SymbolInput, MultiLangFields, TagInput, CitationsEditor },
  props: {
    entry: { type: Object, required: true },
    tagSuggestions: { type: Array, default: () => [] }
  },
  emits: ['set'],
  computed: {
    /** Only the fields that have something, for the closed card. */
    filled() {
      const entry = this.entry
      return [
        { label: 'Notas', text: multi(entry.notes) },
        { label: 'Historia lingüística', text: multi(entry.linguisticHistory) },
        { label: 'Morfología', text: entry.morphology },
        { label: 'Interlineal', text: entry.interlinearization },
        { label: 'Clase tonal', text: entry.toneClass },
        {
          label: 'Nombres científicos',
          text: (entry.scientificNames || []).join(', '),
          italic: true
        },
        { label: 'Dialectos', text: (entry.dialects || []).join(', ') },
        { label: 'Etiquetas', text: (entry.tags || []).join(', ') },
        {
          label: 'Citas',
          text: (entry.citations || [])
            .map((citation) => [citation.slug, citation.locator].filter(Boolean).join(' '))
            .join('; ')
        }
      ].filter((item) => item.text)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.more {
  &__filled {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 2px $spacing-md;
    margin: 0;

    dt {
      color: $color-text-muted;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
  }

  &__italic {
    font-style: italic;
  }

  &__subtitle {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }
}
</style>
