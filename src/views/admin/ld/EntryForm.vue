<template>
  <section class="entry-form">
    <nav class="entry-form__top" aria-label="Ficha">
      <router-link :to="backPath" class="entry-form__back">‹ Volver a la lista</router-link>
    </nav>

    <p v-if="loading" class="entry-form__loading">Cargando…</p>
    <p v-else-if="loadError" class="entry-form__error" role="alert">{{ loadError }}</p>

    <!-- A new word: only the headword is needed, the rest is filled in the full form -->
    <form v-else-if="isNew" class="entry-form__new" @submit.prevent="create">
      <h2>Añadir palabra</h2>
      <div class="ld-grid">
        <SymbolInput v-model="newEntry.lexeme" label="Palabra en benga" required />
        <label class="ld-field">
          <span>
            Homógrafo
            <small>(solo si ya existe otra palabra escrita igual: 1, 2…)</small>
          </span>
          <input v-model="newEntry.homograph" inputmode="numeric" />
        </label>
        <label class="ld-field">
          <span>Traducción al español <small>(opcional)</small></span>
          <input v-model="newEntry.es" lang="es" />
        </label>
      </div>
      <div v-if="similar.length" class="ld-warning" role="status">
        <strong>Ya existe:</strong>
        <ul>
          <li v-for="item in similar" :key="item.entry.id">
            <router-link :to="entryPath(item.entry.id)" target="_blank">
              {{ item.entry.lexeme
              }}<sup v-if="item.entry.homograph">{{ item.entry.homograph }}</sup>
            </router-link>
            ({{ firstGloss(item.entry) }}){{ item.exact ? '' : ' · se escribe casi igual' }}
            <strong v-if="item.duplicate">
              · es la misma palabra: ábrela en lugar de crearla</strong
            >
          </li>
        </ul>
        <small>Si es otra palabra que se escribe igual, pon un número de homógrafo distinto.</small>
      </div>
      <p v-if="actionError" class="entry-form__error" role="alert">{{ actionError }}</p>
      <button type="submit" class="entry-form__primary" :disabled="saving || !canCreate">
        Crear y seguir editando
      </button>
      <p class="entry-form__hint">
        Se guarda en la copia local; no se envía al diccionario hasta «Enviar cambios».
      </p>
    </form>

    <template v-else-if="draft">
      <header class="entry-form__header">
        <h2 class="entry-form__title">
          <span class="ld-benga">{{ draft.lexeme }}</span
          ><sup v-if="draft.homograph">{{ draft.homograph }}</sup>
        </h2>
        <StatusBadge :status="draft.sync?.state || 'synced'" />
        <StatusBadge v-if="draft.review" status="review" />
        <a :href="dictionaryLink" target="_blank" rel="noopener" class="entry-form__ld">
          {{
            draft.sync?.state === 'new'
              ? 'Aún no está en el diccionario'
              : 'Ver en Living Dictionaries ↗'
          }}
        </a>
      </header>

      <FormAlerts
        :conflict="conflict"
        :error="actionError"
        :details="errorDetails"
        @reload="load"
      />

      <WordCard :entry="draft" :entries="entries" @set="set" />

      <SenseCard
        v-for="(sense, index) in draft.senses"
        :key="sense.id"
        :sense="sense"
        :index="index"
        :remove-blocked-reason="removeBlockedReason(sense, index)"
        @set="set"
        @remove="removeSense(index)"
      />
      <p class="entry-form__add-sense">
        <button type="button" class="ld-btn" @click="addSense">+ Añadir sentido</button>
      </p>

      <ExamplesCard
        :senses="draft.senses"
        :sentences="sentences"
        :saved-sense-ids="savedSenseIds"
        :busy="linking"
        :back-path="$route.fullPath"
        @link="linkSentence"
        @unlink="unlinkSentence"
        @create="createExample"
      />

      <MoreFieldsCard :entry="draft" :tag-suggestions="allTags" @set="set" />

      <FormBar
        :dirty="dirty"
        :saving="saving"
        :can-save="Boolean(draft.lexeme.trim())"
        @discard="discard"
        @save="save"
      />
    </template>
  </section>
</template>

<script>
/**
 * Word form of /admin/living-dictionary (phase L4): `…/entrada/:id` edits one entry, `…/entrada/nueva`
 * creates one. The page keeps a working copy (`draft`) of the record (form/formMixin.js), the cards
 * send `set(path, value)` and this page applies it. Saving is a PUT with the record's version (409 if
 * another tab saved first). Leaving with unsaved changes asks first (route guard + beforeunload).
 * Example sentences are their own records: linking one saves the sentence right away and the page
 * takes over the links the server updated (refreshLinks). Nothing here talks to Living Dictionaries.
 */
import formMixin from './form/formMixin'
import WordCard from './form/WordCard.vue'
import SenseCard from './form/SenseCard.vue'
import ExamplesCard from './form/ExamplesCard.vue'
import MoreFieldsCard from './form/MoreFieldsCard.vue'
import SymbolInput from './form/SymbolInput.vue'
import FormBar from './form/FormBar.vue'
import FormAlerts from './form/FormAlerts.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { toast } from '@/components/admin/toast'
import { LIVING_DICTIONARY_ENTRY } from '@/config/external'
import {
  getEntry,
  getEntries,
  createEntry,
  saveEntry,
  getSentences,
  saveSentence,
  createSentence
} from './ldApi'
import { findSimilar, emptySense } from '@/utils/dictionaryForm'

const clone = (value) => JSON.parse(JSON.stringify(value))

export default {
  name: 'EntryForm',
  components: {
    WordCard,
    SenseCard,
    ExamplesCard,
    MoreFieldsCard,
    SymbolInput,
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
      base: null,
      entries: [],
      sentences: [],
      linking: false,
      newEntry: { lexeme: '', homograph: '', es: '' }
    }
  },
  computed: {
    isNew() {
      return this.id === 'nueva'
    },
    dictionaryLink() {
      return `${LIVING_DICTIONARY_ENTRY}/${this.draft.id}`
    },
    backPath() {
      const back = this.$route.query.volver
      return typeof back === 'string' && back.startsWith('/admin/living-dictionary/')
        ? back
        : '/admin/living-dictionary/entradas'
    },
    similar() {
      return findSimilar(this.entries, this.newEntry.lexeme, this.newEntry.homograph.trim() || null)
    },
    canCreate() {
      return Boolean(this.newEntry.lexeme.trim()) && !this.similar.some((item) => item.duplicate)
    },
    allTags() {
      return [...new Set(this.entries.flatMap((entry) => entry.tags || []))].sort()
    },
    savedSenseIds() {
      return (this.saved?.senses || []).map((sense) => sense.id)
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
    entryPath(id) {
      return { path: `/admin/living-dictionary/entrada/${id}` }
    },
    firstGloss(entry) {
      return (
        entry.senses.map((sense) => sense.glosses?.es).find(Boolean) || 'sin traducción al español'
      )
    },
    async load() {
      this.loading = true
      this.resetMessages()
      this.draft = null
      this.saved = null
      try {
        if (this.isNew) {
          this.entries = await getEntries()
        } else {
          const [{ record, base }, entries, sentences] = await Promise.all([
            getEntry(this.id),
            getEntries(),
            getSentences()
          ])
          this.adoptRecord(record)
          this.base = base
          this.entries = entries
          this.sentences = sentences
        }
      } catch (error) {
        this.loadError =
          error.status === 404
            ? 'Esta palabra no existe en la copia local.'
            : `No se pudo leer la palabra: ${error.message}`
      } finally {
        this.loading = false
      }
    },
    async sendRecord(draft) {
      return (await saveEntry(draft)).entry
    },
    addSense() {
      this.draft.senses.push(emptySense(crypto.randomUUID()))
      this.$nextTick(() => {
        document.getElementById(`sentido-${this.draft.senses.length}`)?.scrollIntoView({
          behavior: 'smooth'
        })
      })
    },
    removeBlockedReason(sense) {
      if (this.draft.senses.length === 1) return 'Una palabra necesita al menos un sentido'
      if (sense.sentenceIds?.length) return 'Tiene oraciones de ejemplo: desenlázalas primero'
      return ''
    },
    removeSense(index) {
      const sense = this.draft.senses[index]
      const text = sense.glosses?.es || `sentido ${index + 1}`
      if (!window.confirm(`¿Quitar el sentido «${text}»? Se aplica al guardar.`)) return
      this.draft.senses.splice(index, 1)
    },
    // ---- example sentences: saved right away, the server keeps both sides in step ------------
    async refreshLinks() {
      const [{ record }, sentences] = await Promise.all([getEntry(this.id), getSentences()])
      this.sentences = sentences
      this.adoptServerFields(record, (target, fresh) => {
        for (const sense of target.senses) {
          const server = fresh.senses.find((item) => item.id === sense.id)
          if (server) sense.sentenceIds = clone(server.sentenceIds || [])
        }
      })
    },
    async changeLinks(action) {
      this.linking = true
      try {
        await action()
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
      }
      try {
        await this.refreshLinks()
      } catch (error) {
        toast(`No se pudo releer la palabra: ${error.message}`, { type: 'error' })
      } finally {
        this.linking = false
      }
    },
    changeSentenceSenses(sentenceId, change) {
      return this.changeLinks(() => {
        const sentence = this.sentences.find((item) => item.id === sentenceId)
        return saveSentence({ ...sentence, senseIds: change(sentence.senseIds || []) })
      })
    },
    linkSentence(senseId, sentenceId) {
      return this.changeSentenceSenses(sentenceId, (ids) => [...new Set([...ids, senseId])])
    },
    unlinkSentence(senseId, sentenceId) {
      return this.changeSentenceSenses(sentenceId, (ids) => ids.filter((id) => id !== senseId))
    },
    createExample(senseId, { text, es }) {
      return this.changeLinks(async () => {
        await createSentence({ text, translations: es ? { es } : null, senseIds: [senseId] })
        toast('Oración creada y enlazada', { type: 'success' })
      })
    },
    async create() {
      this.saving = true
      this.actionError = ''
      try {
        const { lexeme, homograph, es } = this.newEntry
        const { entry } = await createEntry({
          lexeme: lexeme.trim(),
          homograph: homograph.trim() || null
        })
        if (es.trim()) {
          entry.senses[0].glosses = { es: es.trim() }
          await saveEntry(entry)
        }
        toast(`«${lexeme.trim()}» guardada en la copia local`, { type: 'success' })
        this.$router.replace({
          path: `/admin/living-dictionary/entrada/${entry.id}`,
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

.entry-form {
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
    font-size: $font-size-3xl;
    color: $color-primary-dark;
  }

  &__ld {
    margin-left: auto;
    font-size: $font-size-sm;
  }

  &__new {
    max-width: 40rem;
    padding: $spacing-lg;
    background: $color-surface;
    border: 1px solid $border-color;
    border-radius: $border-radius;

    h2 {
      margin-top: 0;
    }
  }

  &__loading,
  &__hint {
    color: $color-text-muted;
    font-size: $font-size-sm;
  }

  &__error {
    color: $color-error;
  }

  &__add-sense {
    margin: 0 0 $spacing-lg;
  }

  &__primary {
    @include button-primary;
  }
}
</style>
