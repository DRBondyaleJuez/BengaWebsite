<template>
  <section class="sentence-form">
    <nav class="sentence-form__top" aria-label="Ficha">
      <router-link :to="backPath" class="sentence-form__back">‹ Volver</router-link>
    </nav>

    <p v-if="loading" class="sentence-form__loading">Cargando…</p>
    <p v-else-if="loadError" class="sentence-form__error" role="alert">{{ loadError }}</p>

    <!-- A new sentence: text, optional Spanish translation and word -->
    <form v-else-if="isNew" class="sentence-form__new" @submit.prevent="create">
      <h2>Añadir oración</h2>
      <SymbolInput
        v-model="newSentence.text"
        label="Oración en benga"
        multiline
        required
        :warnings="orthographyWarnings(newSentence.text)"
      />
      <div v-if="sameText" class="ld-warning" role="status">
        Ya existe esta oración:
        <router-link :to="sentencePath(sameText.id)" target="_blank">{{
          sameText.text
        }}</router-link
        >.
      </div>
      <label class="ld-field">
        <span>Traducción al español <small>(opcional)</small></span>
        <input v-model="newSentence.es" lang="es" />
      </label>
      <div class="ld-field">
        <span>Palabra de la que es ejemplo <small>(opcional)</small></span>
        <p v-if="newSentence.senseId" class="sentence-form__picked">
          {{ senseLabel(newSentence.senseId) }}
          <button type="button" class="ld-btn" @click="newSentence.senseId = ''">Quitar</button>
        </p>
        <SearchPicker
          v-else
          :items="senseItems"
          label="Palabra"
          placeholder="Buscar palabra…"
          @pick="newSentence.senseId = $event"
        />
      </div>
      <p v-if="actionError" class="sentence-form__error" role="alert">{{ actionError }}</p>
      <button
        type="submit"
        class="sentence-form__primary"
        :disabled="saving || !newSentence.text.trim()"
      >
        Crear y seguir editando
      </button>
      <p class="sentence-form__hint">
        Se guarda en la copia local; no se envía al diccionario hasta «Enviar cambios».
      </p>
    </form>

    <template v-else-if="draft">
      <header class="sentence-form__header">
        <h2 class="sentence-form__title ld-benga">{{ draft.text }}</h2>
        <StatusBadge :status="draft.sync?.state || 'synced'" />
        <StatusBadge v-if="draft.review" status="review" />
      </header>

      <FormAlerts
        :conflict="conflict"
        :error="actionError"
        :details="errorDetails"
        @reload="load"
      />

      <FormCard id="card-oracion" title="Oración" :summary="draft.text">
        <SymbolInput
          :model-value="draft.text"
          label="Oración en benga"
          multiline
          required
          :warnings="orthographyWarnings(draft.text)"
          @update:model-value="set('text', $event)"
        />
      </FormCard>

      <TranslationsCard :sentence="draft" @set="set" />

      <AudioCard :audio="draft.audio || []" :upload="uploadMedia" :remove="removePendingMedia" />

      <LinkedWordsCard
        :sense-ids="draft.senseIds || []"
        :sense-words="senseWords"
        :back-path="$route.fullPath"
        @set="set"
      />

      <FormCard
        id="card-citas"
        title="Citas"
        :open="Boolean(draft.citations?.length)"
        :summary="citationsSummary"
      >
        <CitationsEditor :citations="draft.citations || []" @update="set('citations', $event)" />
      </FormCard>

      <ReviewCard
        :record="draft"
        kind="oración"
        @set="set"
        @accept="onAcceptSuggestion"
        @reject="onRejectSuggestion"
      />

      <FormBar
        :dirty="dirty"
        :saving="saving"
        :can-save="Boolean(draft.text.trim())"
        @discard="discard"
        @save="save"
      />
    </template>
  </section>
</template>

<script>
/**
 * Sentence form of /admin/living-dictionary (phase L4): `…/oracion/:id` edits one example sentence,
 * `…/oracion/nueva` creates one. Same working-copy mechanics as the word form (form/formMixin.js).
 * Saving a sentence also updates the sentenceIds of the senses it links (done by the server).
 */
import formMixin from './form/formMixin'
import FormCard from './form/FormCard.vue'
import SymbolInput from './form/SymbolInput.vue'
import SearchPicker from './form/SearchPicker.vue'
import TranslationsCard from './form/TranslationsCard.vue'
import AudioCard from './form/AudioCard.vue'
import ReviewCard from './form/ReviewCard.vue'
import LinkedWordsCard from './form/LinkedWordsCard.vue'
import CitationsEditor from './form/CitationsEditor.vue'
import FormBar from './form/FormBar.vue'
import FormAlerts from './form/FormAlerts.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { toast } from '@/components/admin/toast'
import {
  getSentence,
  getSentences,
  getEntries,
  createSentence,
  saveSentence,
  addMedia,
  removeMedia
} from './ldApi'
import { plain } from '@/utils/dictionaryFilters'
import { orthographyWarnings } from '@/utils/dictionaryChecks'

export default {
  name: 'SentenceForm',
  components: {
    FormCard,
    SymbolInput,
    SearchPicker,
    TranslationsCard,
    AudioCard,
    ReviewCard,
    LinkedWordsCard,
    CitationsEditor,
    FormBar,
    FormAlerts,
    StatusBadge
  },
  mixins: [formMixin],
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      entries: [],
      sentences: [],
      newSentence: { text: '', es: '', senseId: '' }
    }
  },
  computed: {
    isNew() {
      return this.id === 'nueva'
    },
    backPath() {
      const back = this.$route.query.volver
      return typeof back === 'string' && back.startsWith('/admin/living-dictionary/')
        ? back
        : '/admin/living-dictionary/oraciones'
    },
    senseWords() {
      const map = {}
      for (const entry of this.entries) {
        entry.senses.forEach((sense, index) => {
          map[sense.id] = {
            entryId: entry.id,
            lexeme: entry.lexeme,
            gloss: sense.glosses?.es || '',
            index
          }
        })
      }
      return map
    },
    senseItems() {
      return Object.entries(this.senseWords).map(([id, word]) => ({
        id,
        label: word.lexeme,
        hint: `sentido ${word.index + 1}${word.gloss ? ` · ${word.gloss}` : ''}`
      }))
    },
    sameText() {
      const text = plain(this.newSentence.text)
      return text ? this.sentences.find((sentence) => plain(sentence.text) === text) : null
    },
    citationsSummary() {
      return (this.draft.citations || [])
        .map((citation) => [citation.slug, citation.locator].filter(Boolean).join(' '))
        .join('; ')
    }
  },
  watch: {
    id: { immediate: true, handler: 'load' }
  },
  beforeRouteLeave() {
    return this.confirmLeave()
  },
  beforeRouteUpdate() {
    return this.confirmLeave()
  },
  methods: {
    sentencePath(id) {
      return { path: `/admin/living-dictionary/oracion/${id}` }
    },
    senseLabel(id) {
      const word = this.senseWords[id]
      return word ? `${word.lexeme} · sentido ${word.index + 1}` : id
    },
    orthographyWarnings,
    async load() {
      this.loading = true
      this.resetMessages()
      this.draft = null
      this.saved = null
      try {
        const [entries, sentences] = await Promise.all([getEntries(), getSentences()])
        this.entries = entries
        this.sentences = sentences
        if (!this.isNew) this.adoptRecord((await getSentence(this.id)).record)
      } catch (error) {
        this.loadError =
          error.status === 404
            ? 'Esta oración no existe en la copia local.'
            : `No se pudo leer la oración: ${error.message}`
      } finally {
        this.loading = false
      }
    },
    async sendRecord(draft) {
      return (await saveSentence(draft)).sentence
    },
    adoptMedia(fresh) {
      this.adoptServerFields(fresh, (target, server) => {
        target.audio = JSON.parse(JSON.stringify(server.audio || []))
      })
    },
    /** @returns {Promise<boolean>} whether the file was saved */
    async uploadMedia(payload) {
      try {
        this.adoptMedia((await addMedia('sentences', this.id, payload)).sentence)
        toast('Guardado como «pendiente de enviar» (se envía en la fase L6)', { type: 'success' })
        return true
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
        return false
      }
    },
    async removePendingMedia(mediaId) {
      if (!window.confirm('¿Quitar este archivo? Aún no se había enviado al diccionario.')) return
      try {
        this.adoptMedia((await removeMedia('sentences', this.id, mediaId)).sentence)
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
      }
    },
    async create() {
      this.saving = true
      this.actionError = ''
      try {
        const { text, es, senseId } = this.newSentence
        const { sentence } = await createSentence({
          text: text.trim(),
          translations: es.trim() ? { es: es.trim() } : null,
          senseIds: senseId ? [senseId] : []
        })
        toast('Oración guardada en la copia local', { type: 'success' })
        this.$router.replace({
          path: `/admin/living-dictionary/oracion/${sentence.id}`,
          query: this.$route.query
        })
      } catch (error) {
        this.actionError = error.message
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
@use './form/ld-fields' as *;

.sentence-form {
  max-width: 62rem;
  @include ld-fields;

  &__top {
    margin-bottom: $spacing-md;
  }

  &__back {
    font-size: $font-size-sm;
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__title {
    margin: 0;
    font-size: $font-size-2xl;
    overflow-wrap: anywhere;
  }

  &__new {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    max-width: 40rem;
    padding: $spacing-lg;
    background: $color-surface;
    border: 1px solid $border-color;
    border-radius: $border-radius;

    h2 {
      margin: 0;
    }
  }

  &__picked {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin: 0;
    font-weight: normal;
  }

  &__loading,
  &__hint {
    margin: 0;
    color: $color-text-muted;
    font-size: $font-size-sm;
  }

  &__error {
    margin: 0;
    color: $color-error;
  }

  &__primary {
    align-self: flex-start;
    @include button-primary;
  }
}
</style>
