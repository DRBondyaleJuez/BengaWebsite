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

      <div v-if="conflict" class="entry-form__alert" role="alert">
        <p>{{ conflict }}</p>
        <button type="button" class="ld-btn" @click="reload">Recargar y perder mis cambios</button>
      </div>
      <div v-if="actionError" class="entry-form__alert" role="alert">
        <p>{{ actionError }}</p>
        <ul v-if="errorDetails.length">
          <li v-for="detail in errorDetails.slice(0, 5)" :key="detail">{{ detail }}</li>
        </ul>
      </div>

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

      <div class="entry-form__bar" :class="{ 'entry-form__bar--dirty': dirty }">
        <span class="entry-form__status" aria-live="polite">
          {{ dirty ? 'Hay cambios sin guardar' : 'Todo guardado' }}
        </span>
        <button type="button" class="ld-btn" :disabled="!dirty || saving" @click="discard">
          Descartar cambios
        </button>
        <button
          type="button"
          class="entry-form__primary"
          :disabled="!dirty || saving || !draft.lexeme.trim()"
          @click="save"
        >
          {{ saving ? 'Guardando…' : 'Guardar' }}
        </button>
      </div>
    </template>
  </section>
</template>

<script>
/**
 * Word form of /admin/living-dictionary (phase L4): `…/entrada/:id` edits one entry, `…/entrada/nueva`
 * creates one. The page keeps a working copy (`draft`) of the record, the cards send
 * `set(path, value)` and this page applies it. Saving is a PUT with the record's version (409 if
 * another tab saved first). Leaving with unsaved changes asks first (route guard + beforeunload).
 * Nothing here talks to Living Dictionaries.
 */
import WordCard from './form/WordCard.vue'
import SenseCard from './form/SenseCard.vue'
import SymbolInput from './form/SymbolInput.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { toast } from '@/components/admin/toast'
import { LIVING_DICTIONARY_ENTRY } from '@/config/external'
import { getEntry, getEntries, createEntry, saveEntry } from './ldApi'
import { setField, canonicalJson } from '@/utils/dictionaryPaths'
import { findSimilar, emptySense } from '@/utils/dictionaryForm'

const LEAVE_QUESTION = 'Hay cambios sin guardar en esta ficha. ¿Salir y perderlos?'
const clone = (value) => JSON.parse(JSON.stringify(value))

export default {
  name: 'EntryForm',
  components: { WordCard, SenseCard, SymbolInput, StatusBadge },
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      loading: true,
      loadError: '',
      draft: null,
      // the record as last loaded or saved (not reactive: only compared and copied)
      saved: null,
      base: null,
      entries: [],
      saving: false,
      actionError: '',
      errorDetails: [],
      conflict: '',
      newEntry: { lexeme: '', homograph: '', es: '' }
    }
  },
  computed: {
    isNew() {
      return this.id === 'nueva'
    },
    dirty() {
      return (
        Boolean(this.draft && this.saved) && canonicalJson(this.draft) !== canonicalJson(this.saved)
      )
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
    }
  },
  watch: {
    id: { immediate: true, handler: 'load' }
  },
  created() {
    window.addEventListener('beforeunload', this.warnBeforeUnload)
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.warnBeforeUnload)
  },
  beforeRouteLeave() {
    if (this.dirty && !window.confirm(LEAVE_QUESTION)) return false
  },
  beforeRouteUpdate() {
    if (this.dirty && !window.confirm(LEAVE_QUESTION)) return false
  },
  methods: {
    warnBeforeUnload(event) {
      if (!this.dirty) return
      event.preventDefault()
      event.returnValue = ''
    },
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
      this.loadError = ''
      this.actionError = ''
      this.errorDetails = []
      this.conflict = ''
      this.draft = null
      this.saved = null
      try {
        if (this.isNew) {
          this.entries = await getEntries()
        } else {
          const [{ record, base }, entries] = await Promise.all([getEntry(this.id), getEntries()])
          this.adoptRecord(record)
          this.base = base
          this.entries = entries
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
    adoptRecord(record) {
      this.saved = clone(record)
      this.draft = clone(record)
    },
    reload() {
      this.load()
    },
    discard() {
      if (this.dirty && !window.confirm('¿Descartar los cambios sin guardar?')) return
      this.adoptRecord(this.saved)
    },
    set(path, value) {
      setField(this.draft, this.saved, path, value)
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
    async save() {
      this.saving = true
      this.actionError = ''
      this.errorDetails = []
      try {
        const { entry } = await saveEntry(this.draft)
        this.adoptRecord(entry)
        this.conflict = ''
        toast('Guardado en la copia local (aún no enviado al diccionario)', { type: 'success' })
      } catch (error) {
        if (error.status === 409) this.conflict = error.message
        else {
          this.actionError = error.message
          this.errorDetails = (error.details || []).map((detail) =>
            typeof detail === 'string' ? detail : JSON.stringify(detail)
          )
        }
      } finally {
        this.saving = false
      }
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

  &__alert {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-error, 0.08);
    border-left: 4px solid $color-error;

    p {
      margin: 0 0 $spacing-sm;
    }
  }

  &__add-sense {
    margin: 0 0 $spacing-lg;
  }

  &__primary {
    @include button-primary;
  }

  &__bar {
    position: sticky;
    bottom: 0;
    z-index: 5;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: $spacing-sm $spacing-md;
    margin-top: $spacing-lg;
    padding: $spacing-sm $spacing-md;
    background: $color-surface;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

    &--dirty {
      border-color: $color-accent;
      background: #fff8e1;
    }
  }

  &__status {
    margin-right: auto;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
}
</style>
