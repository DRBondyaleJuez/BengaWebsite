<template>
  <section
    v-if="conflicts.length"
    id="conflictos"
    class="conflict-card"
    role="region"
    aria-label="Conflictos"
  >
    <h2>⚠ Cambiado aquí y en Living Dictionaries</h2>
    <p v-if="disabled" class="conflict-card__wait" role="note">
      Guarda o descarta tus cambios sin guardar antes de resolver los conflictos.
    </p>
    <p class="conflict-card__intro">
      Estos campos cambiaron en los dos lados desde la última lectura. Elige qué valor queda; lo
      tuyo se enviará con el próximo «Enviar cambios».
    </p>
    <article v-for="conflict in conflicts" :key="conflict.field" class="conflict-card__item">
      <h3>{{ labelOf(conflict.field) }}</h3>
      <p v-if="conflict.field === '*'" class="conflict-card__gone">
        La borraron en Living Dictionaries, pero tú la habías cambiado aquí.
      </p>
      <div v-else class="conflict-card__sides">
        <div class="conflict-card__side">
          <span class="conflict-card__who">En Living Dictionaries</span>
          <span class="conflict-card__value">
            <template v-for="(part, index) in diffOf(conflict).ld" :key="index">
              <mark v-if="part.type === 'del'" class="conflict-card__theirs">{{ part.text }}</mark>
              <template v-else-if="part.type === 'same'">{{ part.text }}</template>
            </template>
            <em v-if="isEmpty(conflict.remote)">(vacío)</em>
          </span>
        </div>
        <div class="conflict-card__side">
          <span class="conflict-card__who">Aquí (tuyo)</span>
          <span class="conflict-card__value">
            <template v-for="(part, index) in diffOf(conflict).mine" :key="index">
              <mark v-if="part.type === 'ins'" class="conflict-card__mine">{{ part.text }}</mark>
              <template v-else-if="part.type === 'same'">{{ part.text }}</template>
            </template>
            <em v-if="isEmpty(conflict.local)">(vacío)</em>
          </span>
        </div>
      </div>
      <p v-if="conflict.field !== '*' && !isEmpty(conflict.base)" class="conflict-card__before">
        Antes (última lectura): {{ show(conflict.base) }}
      </p>

      <div v-if="editing === conflict.field" class="conflict-card__edit">
        <label>
          Valor final
          <input v-model="draft" type="text" />
        </label>
        <button type="button" class="conflict-card__button" @click="resolve(conflict, 'value')">
          Guardar
        </button>
        <button type="button" class="conflict-card__link" @click="editing = null">Cancelar</button>
      </div>
      <div v-else class="conflict-card__buttons">
        <button
          type="button"
          class="conflict-card__button"
          :disabled="busy || disabled"
          @click="resolve(conflict, 'ld')"
        >
          {{ conflict.field === '*' ? 'Borrarla también aquí' : 'Usar la de LD' }}
        </button>
        <button
          type="button"
          class="conflict-card__button"
          :disabled="busy || disabled"
          @click="resolve(conflict, 'mine')"
        >
          {{ conflict.field === '*' ? 'Conservarla y volver a enviarla' : 'Usar la mía' }}
        </button>
        <button
          v-if="canEdit(conflict)"
          type="button"
          class="conflict-card__button"
          :disabled="busy || disabled"
          @click="startEdit(conflict)"
        >
          Editar
        </button>
      </div>
    </article>
  </section>
</template>

<script>
/**
 * Conflicts of one entry or sentence (task L5.5): both values side by side with the differences
 * highlighted, and «Usar la de LD» / «Usar la mía» / «Editar». Saves through
 * POST /__dev/ld/<kind>/resolve and emits `resolved` with the saved record (null = deleted).
 */
import { fieldLabel } from '@/utils/ldFieldLabels'
import { diffText } from '@/utils/textDiff'
import { toast } from '@/components/admin/toast'
import { resolveConflict } from './ldApi'

export default {
  name: 'ConflictCard',
  props: {
    record: { type: Object, required: true },
    /** 'entries' or 'sentences' */
    kind: { type: String, default: 'entries' },
    /** True while the form has unsaved edits (resolving saves the record on the server). */
    disabled: { type: Boolean, default: false }
  },
  emits: ['resolved'],
  data() {
    return { busy: false, editing: null, draft: '' }
  },
  computed: {
    conflicts() {
      return this.record.sync?.conflicts || []
    }
  },
  methods: {
    labelOf(field) {
      return fieldLabel(field, this.record)
    },
    isEmpty: (value) =>
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && !value.length),
    show(value) {
      if (Array.isArray(value)) return value.join(', ')
      if (value && typeof value === 'object') return JSON.stringify(value)
      return value ?? ''
    },
    diffOf(conflict) {
      const parts = diffText(this.show(conflict.remote), this.show(conflict.local))
      return {
        ld: parts.filter((part) => part.type !== 'ins'),
        mine: parts.filter((part) => part.type !== 'del')
      }
    },
    /** Only plain text fields can be typed; lists and whole senses are chosen, not edited. */
    canEdit(conflict) {
      if (conflict.field === '*') return false
      const values = [conflict.local, conflict.remote]
      return values.every((value) => value === null || typeof value === 'string')
    },
    startEdit(conflict) {
      this.editing = conflict.field
      this.draft = this.show(conflict.local)
    },
    async resolve(conflict, choice) {
      this.busy = true
      try {
        const answer = await resolveConflict(this.kind, this.record.id, {
          field: conflict.field,
          choice,
          value: choice === 'value' ? this.draft : undefined
        })
        this.editing = null
        const saved = answer.entry || answer.sentence || null
        toast(saved ? 'Conflicto resuelto' : 'Borrada también aquí', { type: 'success' })
        this.$emit('resolved', saved)
      } catch (error) {
        toast(error.message, { type: 'error', timeout: 8000 })
      } finally {
        this.busy = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.conflict-card {
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  background: rgba($color-error, 0.05);
  border: 1px solid rgba($color-error, 0.4);
  border-left: 4px solid $color-error;
  border-radius: $border-radius-md;

  h2 {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-lg;
    color: $color-error;
  }

  &__wait {
    margin: 0 0 $spacing-xs;
    font-weight: $font-weight-semibold;
  }

  &__intro {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-sm;
  }

  &__item {
    padding: $spacing-sm 0;
    border-top: 1px solid rgba($color-error, 0.2);

    h3 {
      margin: 0 0 $spacing-xs;
      font-size: $font-size-base;
    }
  }

  &__sides {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;

    @include respond-below(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    padding: $spacing-xs $spacing-sm;
    background: $color-surface;
    border-radius: $border-radius-sm;
    overflow-wrap: anywhere;
  }

  &__who {
    color: $color-text-muted;
    font-size: $font-size-xs;
  }

  &__value {
    @include benga-word-style;
  }

  &__theirs {
    background: rgba($color-primary, 0.25);
  }

  &__mine {
    background: rgba($color-warning, 0.5);
  }

  &__before,
  &__gone {
    margin: $spacing-xs 0;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  &__buttons,
  &__edit {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: $spacing-xs;
    margin-top: $spacing-xs;

    label {
      display: flex;
      flex-direction: column;
      flex: 1 1 200px;
      font-size: $font-size-sm;
    }

    input {
      padding: $spacing-xs;
      border: 1px solid $color-text-muted;
      border-radius: $border-radius-sm;
      font-size: $font-size-base;
    }
  }

  &__button {
    padding: $spacing-xs $spacing-sm;
    background: $color-surface;
    border: 1px solid $color-primary;
    border-radius: $border-radius-sm;
    color: $color-primary-dark;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: rgba($color-primary, 0.1);
    }
  }

  &__link {
    background: none;
    border: none;
    color: $color-primary-dark;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
