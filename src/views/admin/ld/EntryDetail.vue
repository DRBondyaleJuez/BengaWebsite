<template>
  <div class="entry-detail">
    <p class="entry-detail__badges">
      <StatusBadge :status="entry.sync?.state || 'synced'" />
      <StatusBadge v-if="!entry.audio?.length" status="no-audio" />
      <a :href="dictionaryLink" target="_blank" rel="noopener" class="entry-detail__link">
        {{
          entry.sync?.state === 'new'
            ? 'Aún no está en el diccionario'
            : 'Ver en Living Dictionaries ↗'
        }}
      </a>
    </p>

    <div v-if="entry.review" class="entry-detail__review" role="note">
      <strong>Necesita revisión · {{ reviewLabel(entry.review.category) }}</strong>
      <p v-for="(paragraph, index) in entry.review.note.split('\n\n')" :key="index">
        {{ paragraph }}
      </p>
    </div>

    <section v-for="(sense, index) in entry.senses" :key="sense.id" class="entry-detail__sense">
      <h3>Sentido {{ index + 1 }}</h3>
      <dl>
        <template v-for="lang in languages" :key="lang.code">
          <dt>{{ lang.label }}</dt>
          <dd :class="{ 'entry-detail__missing': !sense.glosses?.[lang.code] }">
            {{ sense.glosses?.[lang.code] || 'falta' }}
          </dd>
        </template>
        <dt>Categoría</dt>
        <dd>{{ (sense.partsOfSpeech || []).map(posLabel).join(', ') || '—' }}</dd>
        <dt>Dominios</dt>
        <dd>{{ (sense.semanticDomains || []).map(domainLabel).join(' · ') || '—' }}</dd>
        <dt>Clase nominal</dt>
        <dd>{{ sense.nounClass || '—' }}</dd>
        <dt>Plural</dt>
        <dd>{{ sense.pluralForm || '—' }}</dd>
      </dl>
      <div v-if="sense.sentenceIds?.length" class="entry-detail__examples">
        <h4>Ejemplos</h4>
        <blockquote v-for="id in sense.sentenceIds" :key="id">
          <template v-if="sentences[id]">
            <span class="entry-detail__benga">{{ sentences[id].text }}</span>
            <span v-for="(text, lang) in sentences[id].translations || {}" :key="lang">
              {{ lang }}: {{ text }}
            </span>
          </template>
          <template v-else>Oración {{ id }} (no encontrada)</template>
        </blockquote>
      </div>
    </section>

    <section class="entry-detail__more">
      <p v-if="entry.notes?.es"><strong>Notas:</strong> {{ entry.notes.es }}</p>
      <p><strong>Audios:</strong> {{ entry.audio?.length || 0 }}</p>
      <p>
        <strong>En la web:</strong>
        {{ entry.siteKeys?.length ? entry.siteKeys.join(', ') : 'no enlazada' }}
      </p>
      <p v-if="entry.suggestions?.length">
        <strong>Sugerencias pendientes:</strong> {{ entry.suggestions.length }}
      </p>
    </section>

    <p class="entry-detail__soon">La ficha para editar todos los campos llega en la fase L4.</p>
  </div>
</template>

<script>
/** Read-only summary of one dictionary entry, shown in the drawer of the entries table. */
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { LIVING_DICTIONARY_ENTRY } from '@/config/external'
import { posLabel, domainLabel, reviewLabel } from './vocab'

export default {
  name: 'EntryDetail',
  components: { StatusBadge },
  props: {
    entry: { type: Object, required: true },
    /** All sentences by id, to show the examples. */
    sentences: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      languages: [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'Inglés' },
        { code: 'fr', label: 'Francés' }
      ]
    }
  },
  computed: {
    dictionaryLink() {
      return `${LIVING_DICTIONARY_ENTRY}/${this.entry.id}`
    }
  },
  methods: { posLabel, domainLabel, reviewLabel }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.entry-detail {
  &__badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
  }

  &__link {
    margin-left: auto;
    font-size: $font-size-sm;
  }

  &__review {
    margin: $spacing-md 0;
    padding: $spacing-sm $spacing-md;
    background: rgba(#e08a00, 0.1);
    border-left: 4px solid #e08a00;
    font-size: $font-size-sm;

    p {
      margin: $spacing-xs 0 0;
    }
  }

  &__sense {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $color-surface-alt;

    h3 {
      margin: 0 0 $spacing-sm;
      font-size: $font-size-lg;
      color: $color-primary-dark;
    }

    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 2px $spacing-md;
      margin: 0;
      font-size: $font-size-sm;
    }

    dt {
      color: $color-text-muted;
    }

    dd {
      margin: 0;
    }
  }

  &__missing {
    color: $color-error;
    font-style: italic;
  }

  &__examples {
    h4 {
      margin: $spacing-sm 0 $spacing-xs;
      font-size: $font-size-sm;
    }

    blockquote {
      display: flex;
      flex-direction: column;
      margin: 0 0 $spacing-xs;
      padding-left: $spacing-sm;
      border-left: 3px solid $color-accent;
      font-size: $font-size-sm;
    }
  }

  &__benga {
    @include benga-word-style;
    font-weight: $font-weight-semibold;
  }

  &__more p {
    margin: $spacing-xs 0;
    font-size: $font-size-sm;
  }

  &__soon {
    color: $color-text-muted;
    font-size: $font-size-xs;
    font-style: italic;
  }
}
</style>
