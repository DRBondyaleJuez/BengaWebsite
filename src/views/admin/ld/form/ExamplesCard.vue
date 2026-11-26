<!--
  ExamplesCard - card «Ejemplos» of the word form: for each sense, the sentences that are
  examples of it. Link an existing sentence (search), unlink, or write a new one.
  The changes are saved right away through the page (a sentence is its own record), so a sense
  that is not saved yet cannot get examples.
  Props: senses (read only), sentences (all sentences), savedSenseIds (ids that exist on the
         server), busy, backPath (where «Volver» of a sentence form returns to)
  Events: link(senseId, sentenceId), unlink(senseId, sentenceId), create(senseId, { text, es })
-->
<template>
  <FormCard
    id="card-ejemplos"
    title="Ejemplos"
    :badge="String(total)"
    :summary="total ? `${total} oración(es) de ejemplo` : 'Sin oraciones de ejemplo'"
  >
    <p class="ld-help">
      Las oraciones de ejemplo se guardan al momento (cada oración es un registro propio).
    </p>
    <section v-for="(sense, index) in senses" :key="sense.id" class="examples__sense">
      <h3 class="examples__title">
        Sentido {{ index + 1 }}<span v-if="sense.glosses?.es"> · {{ sense.glosses.es }}</span>
      </h3>
      <p v-if="!savedSenseIds.includes(sense.id)" class="ld-help">
        Guarda la palabra para poder añadir ejemplos a este sentido.
      </p>
      <template v-else>
        <ul v-if="linked(sense).length" class="examples__list">
          <li v-for="sentence in linked(sense)" :key="sentence.id" class="examples__item">
            <div class="examples__text">
              <router-link :to="sentencePath(sentence.id)" class="ld-benga examples__benga">{{
                sentence.text
              }}</router-link>
              <span v-for="lang in languages" :key="lang" class="examples__translation">
                <template v-if="sentence.translations?.[lang]">
                  <b>{{ lang }}</b> {{ sentence.translations[lang] }}
                  <em v-if="sentence.translationStatus?.[lang] === 'machine'">
                    (traducción automática, sin revisar)</em
                  >
                </template>
              </span>
            </div>
            <button
              type="button"
              class="ld-btn"
              :disabled="busy"
              @click="$emit('unlink', sense.id, sentence.id)"
            >
              Desenlazar
            </button>
          </li>
        </ul>
        <p v-else class="ld-help">Sin ejemplos todavía.</p>

        <div class="examples__add">
          <SearchPicker
            :items="pickerItems"
            :exclude="sense.sentenceIds || []"
            label="Enlazar una oración que ya existe"
            placeholder="Enlazar una oración que ya existe (buscar)…"
            :disabled="busy"
            @pick="$emit('link', sense.id, $event)"
          />
          <button
            type="button"
            class="ld-btn"
            :disabled="busy"
            :aria-expanded="draftSense === sense.id ? 'true' : 'false'"
            @click="openDraft(sense.id)"
          >
            + Nueva oración
          </button>
        </div>

        <form
          v-if="draftSense === sense.id"
          class="examples__draft"
          @submit.prevent="submitDraft(sense.id)"
        >
          <SymbolInput
            v-model="draft.text"
            label="Oración en benga"
            multiline
            required
            :warnings="textWarnings"
          />
          <label class="ld-field">
            Traducción al español <small>(opcional)</small>
            <input v-model="draft.es" lang="es" />
          </label>
          <p class="examples__buttons">
            <button type="submit" class="ld-btn" :disabled="busy || !draft.text.trim()">
              Crear y enlazar
            </button>
            <button type="button" class="ld-btn" @click="draftSense = ''">Cancelar</button>
          </p>
        </form>
      </template>
    </section>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SymbolInput from './SymbolInput.vue'
import SearchPicker from './SearchPicker.vue'

export default {
  name: 'ExamplesCard',
  components: { FormCard, SymbolInput, SearchPicker },
  props: {
    senses: { type: Array, required: true },
    sentences: { type: Array, default: () => [] },
    savedSenseIds: { type: Array, default: () => [] },
    busy: { type: Boolean, default: false },
    backPath: { type: String, default: '' },
    orthography: { type: Function, default: () => [] }
  },
  emits: ['link', 'unlink', 'create'],
  data() {
    return { languages: ['es', 'en', 'fr'], draftSense: '', draft: { text: '', es: '' } }
  },
  computed: {
    byId() {
      return new Map(this.sentences.map((sentence) => [sentence.id, sentence]))
    },
    total() {
      return this.senses.reduce((sum, sense) => sum + (sense.sentenceIds || []).length, 0)
    },
    pickerItems() {
      return this.sentences.map((sentence) => ({
        id: sentence.id,
        label: sentence.text,
        hint: sentence.translations?.es || ''
      }))
    },
    textWarnings() {
      return this.orthography(this.draft.text)
    }
  },
  methods: {
    linked(sense) {
      return (sense.sentenceIds || []).map((id) => this.byId.get(id)).filter(Boolean)
    },
    sentencePath(id) {
      return { path: `/admin/living-dictionary/oracion/${id}`, query: { volver: this.backPath } }
    },
    openDraft(senseId) {
      this.draft = { text: '', es: '' }
      this.draftSense = senseId
    },
    submitDraft(senseId) {
      this.$emit('create', senseId, { text: this.draft.text.trim(), es: this.draft.es.trim() })
      this.draftSense = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.examples {
  &__sense {
    margin-bottom: $spacing-lg;
  }

  &__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  &__list {
    margin: 0 0 $spacing-sm;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-md;
    padding: $spacing-sm 0;
    border-bottom: 1px solid $color-surface-alt;
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &__benga {
    font-weight: $font-weight-semibold;
  }

  &__translation {
    font-size: $font-size-sm;
    color: $color-text-secondary;

    b {
      color: $color-text-muted;
      text-transform: uppercase;
    }

    em {
      color: $color-warning;
    }
  }

  &__add {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: $spacing-sm;
    align-items: start;
  }

  &__draft {
    margin-top: $spacing-md;
    padding: $spacing-md;
    background: $color-surface-alt;
    border-radius: $border-radius-sm;
  }

  &__buttons {
    display: flex;
    gap: $spacing-sm;
    margin: 0;
  }
}
</style>
