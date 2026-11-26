<!--
  ReviewCard - card «Revisión y sugerencias» of the word and sentence forms.
  · «Necesita revisión»: a flag with a category and a plain-language question (who and when).
    The note is NOT secret: with «Enviar esta marca…» it travels to Living Dictionaries, where
    the public snapshot shows it, so write it as a question about the word, no personal data.
  · Suggestions (usually from Claude): each shows the field, the current value, the proposed value
    and the reason, with Aceptar / Editar y aceptar / Rechazar. Nothing changes until a person
    chooses; accepting only changes the form (Guardar saves it) and leaves a line in the history.
  Props: record (the draft, read only), kind ('palabra' | 'oración')
  Events: set(path, value), accept(suggestionId, value), reject(suggestionId)
-->
<template>
  <FormCard
    id="card-revision"
    title="Revisión y sugerencias"
    :open="Boolean(record.review) || suggestions.length > 0"
    :badge="suggestions.length ? `${suggestions.length} sugerencia(s)` : ''"
    :summary="summary"
  >
    <div class="review__flag">
      <label class="review__check">
        <input type="checkbox" :checked="on" @change="toggle($event.target.checked)" />
        Necesita revisión
        <InfoTip
          text="Marca la palabra con una duda para que alguien la mire. Escribe una pregunta clara."
        />
      </label>
      <template v-if="on">
        <div class="ld-grid">
          <label class="ld-field">
            Motivo
            <select :value="category" @change="onCategory($event.target.value)">
              <option v-for="item in categories" :key="item.id" :value="item.id">
                {{ item.es }}
              </option>
            </select>
          </label>
        </div>
        <p v-if="categoryHelp" class="ld-help">{{ categoryHelp }}</p>
        <label class="ld-field">
          Nota (una pregunta sobre {{ kind === 'palabra' ? 'la palabra' : 'la oración' }})
          <textarea
            rows="3"
            :value="record.review?.note ?? ''"
            @input="onNote($event.target.value)"
          ></textarea>
        </label>
        <p v-if="!record.review" class="ld-help">Escribe la nota para que se guarde la marca.</p>
        <p v-else class="review__by">
          Marcada por {{ byName }}<template v-if="record.review.at"> el {{ atText }}</template
          >.
        </p>
        <label class="review__check review__send">
          <input
            type="checkbox"
            :checked="Boolean(record.review?.sendToLd)"
            :disabled="!record.review"
            @change="$emit('set', 'review.sendToLd', $event.target.checked)"
          />
          Enviar esta marca a Living Dictionaries
        </label>
        <p class="ld-help">
          La nota se vería en el archivo público del diccionario: sin datos personales, solo la duda
          sobre {{ kind === 'palabra' ? 'la palabra' : 'la oración' }}.
        </p>
      </template>
      <p v-if="record.ldReview" class="ld-help">
        En Living Dictionaries ya hay una marca: {{ reviewLabel(record.ldReview.category) }} —
        {{ record.ldReview.note }}
      </p>
    </div>

    <h3 class="review__title">Sugerencias</h3>
    <p v-if="!suggestions.length" class="ld-help">No hay sugerencias pendientes.</p>
    <ul v-else class="review__list">
      <li v-for="item in suggestions" :key="item.id" class="review__suggestion">
        <p class="review__field">{{ fieldLabel(item.field) }}</p>
        <dl class="review__values">
          <dt>Ahora</dt>
          <dd :class="{ review__empty: isEmpty(item.field) }">
            {{ current(item.field) }}
          </dd>
          <dt>Propuesta</dt>
          <dd class="review__proposed">{{ show(item.field, item.value) }}</dd>
          <template v-if="item.reason">
            <dt>Motivo</dt>
            <dd>{{ item.reason }}</dd>
          </template>
          <dt>De</dt>
          <dd>
            {{ item.by || 'desconocido' }}<template v-if="item.at"> · {{ day(item.at) }}</template>
          </dd>
        </dl>
        <p v-if="problemOf(item)" class="review__problem">{{ problemOf(item) }}</p>
        <div v-if="editing === item.id" class="review__edit">
          <label class="ld-field">
            Valor que se guardará
            <textarea v-model="editText" rows="2"></textarea>
          </label>
          <p v-if="editError" class="review__problem" role="alert">{{ editError }}</p>
          <button type="button" class="ld-btn" @click="acceptEdited(item)">
            Guardar y aceptar
          </button>
          <button type="button" class="ld-btn" @click="editing = ''">Cancelar</button>
        </div>
        <p v-else class="review__buttons">
          <button
            type="button"
            class="ld-btn"
            :disabled="Boolean(problemOf(item))"
            @click="$emit('accept', item.id, item.value)"
          >
            Aceptar
          </button>
          <button
            type="button"
            class="ld-btn"
            :disabled="Boolean(problemOf(item))"
            @click="startEdit(item)"
          >
            Editar y aceptar
          </button>
          <button type="button" class="ld-btn ld-btn--danger" @click="$emit('reject', item.id)">
            Rechazar
          </button>
        </p>
      </li>
    </ul>
    <p v-if="suggestions.length" class="ld-help">
      Aceptar cambia la ficha (no se guarda hasta pulsar «Guardar»).
    </p>

    <details v-if="history.length" class="review__history">
      <summary>Historial local ({{ history.length }})</summary>
      <ul>
        <li v-for="(line, index) in history" :key="index">
          {{ day(line.at) }} · {{ fieldLabel(line.field) }} ·
          {{
            line.action === 'rejected-suggestion' ? 'sugerencia rechazada' : 'sugerencia aceptada'
          }}
          <template v-if="line.action !== 'rejected-suggestion'"
            >({{ show(line.field, line.from) || '—' }} →
            {{ show(line.field, line.to) || '—' }})</template
          >
        </li>
      </ul>
    </details>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import InfoTip from '@/components/admin/InfoTip.vue'
import { REVIEW_CATEGORIES, reviewLabel, posLabel, domainLabel } from '../vocab'
import { getPath } from '@/utils/dictionaryPaths'
import {
  fieldLabel,
  editableText,
  parseEditedValue,
  suggestionProblem
} from '@/utils/dictionarySuggestions'

const WHO = { claude: 'Claude', human: 'una persona', ld: 'Living Dictionaries' }

export default {
  name: 'ReviewCard',
  components: { FormCard, InfoTip },
  props: {
    record: { type: Object, required: true },
    kind: { type: String, default: 'palabra' }
  },
  emits: ['set', 'accept', 'reject'],
  data() {
    return {
      categories: REVIEW_CATEGORIES,
      // «Necesita revisión» ticked but the note is still empty (nothing to save yet)
      enabling: false,
      pickedCategory: 'other',
      editing: '',
      editText: '',
      editError: ''
    }
  },
  computed: {
    suggestions() {
      return this.record.suggestions || []
    },
    history() {
      return this.record.history || []
    },
    on() {
      return Boolean(this.record.review) || this.enabling
    },
    category() {
      return this.record.review?.category || this.pickedCategory
    },
    categoryHelp() {
      return this.categories.find((item) => item.id === this.category)?.help?.es || ''
    },
    byName() {
      return WHO[this.record.review?.by] || 'alguien'
    },
    atText() {
      return this.day(this.record.review?.at)
    },
    summary() {
      const parts = []
      if (this.record.review) parts.push(`Revisar: ${reviewLabel(this.record.review.category)}`)
      if (this.suggestions.length) parts.push(`${this.suggestions.length} sugerencia(s)`)
      return parts.join(' · ') || 'Sin marca ni sugerencias'
    }
  },
  methods: {
    reviewLabel,
    fieldLabel,
    day(iso) {
      return iso ? String(iso).slice(0, 10) : ''
    },
    toggle(checked) {
      if (checked) this.enabling = true
      else {
        this.enabling = false
        this.$emit('set', 'review', null)
      }
    },
    newReview(patch) {
      return {
        category: this.category,
        note: this.record.review?.note ?? '',
        by: 'human',
        at: new Date().toISOString(),
        sendToLd: Boolean(this.record.review?.sendToLd),
        ...patch
      }
    },
    onCategory(category) {
      this.pickedCategory = category
      if (this.record.review) this.$emit('set', 'review', this.newReview({ category }))
    },
    onNote(note) {
      if (note.trim()) {
        this.enabling = false
        this.$emit('set', 'review', this.newReview({ note }))
      } else if (this.record.review) {
        this.enabling = true
        this.$emit('set', 'review', null)
      }
    },
    current(field) {
      const value = getPath(this.record, field)
      return this.show(field, value) || 'vacío'
    },
    isEmpty(field) {
      return !this.show(field, getPath(this.record, field))
    },
    /** A value as text, with the Spanish labels of parts of speech and domains. */
    show(field, value) {
      if (value == null || value === '') return ''
      if (Array.isArray(value)) {
        const label = /partsOfSpeech$/.test(field)
          ? posLabel
          : /semanticDomains$/.test(field)
            ? domainLabel
            : (item) => String(item)
        return value.map(label).join(', ')
      }
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    },
    problemOf(item) {
      return suggestionProblem(this.record, item.field)
    },
    startEdit(item) {
      this.editing = item.id
      this.editText = editableText(item.value)
      this.editError = ''
    },
    acceptEdited(item) {
      try {
        this.$emit('accept', item.id, parseEditedValue(this.editText, item.value))
        this.editing = ''
      } catch {
        this.editError = 'El texto no tiene el formato esperado (JSON no válido).'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.review {
  &__flag {
    margin-bottom: $spacing-lg;
  }

  &__check {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    font-weight: $font-weight-semibold;
  }

  &__send {
    display: flex;
    font-weight: normal;
  }

  &__by {
    margin: $spacing-xs 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__suggestion {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: $color-surface-alt;
    border-left: 4px solid $color-accent;
    border-radius: $border-radius-sm;
  }

  &__field {
    margin: 0 0 $spacing-xs;
    font-weight: $font-weight-semibold;
  }

  &__values {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 2px $spacing-md;
    margin: 0 0 $spacing-sm;
    font-size: $font-size-sm;

    dt {
      color: $color-text-muted;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
  }

  &__empty {
    color: $color-text-muted;
    font-style: italic;
  }

  &__proposed {
    font-weight: $font-weight-semibold;
  }

  &__problem {
    margin: 0 0 $spacing-sm;
    color: $color-error;
    font-size: $font-size-sm;
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin: 0;
  }

  &__edit {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: $spacing-sm;

    .ld-field {
      flex-basis: 100%;
    }
  }

  &__history {
    margin-top: $spacing-md;
    font-size: $font-size-sm;

    summary {
      cursor: pointer;
      color: $color-primary;
    }
  }
}
</style>
