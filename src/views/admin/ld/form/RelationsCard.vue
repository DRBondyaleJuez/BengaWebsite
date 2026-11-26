<!--
  RelationsCard - card «Relaciones»: links to other entries (synonym, antonym, part of…).
  Search the other word, choose the type (with its explanation), optionally the sense on each
  side, and add. The list can be edited or removed. Stored in entry.relations, sent in phase L5.
  Props: entry (read only), entries (all entries)
  Events: set(path, value)
-->
<template>
  <FormCard
    id="card-relaciones"
    title="Relaciones"
    :badge="String(relations.length)"
    :open="relations.length > 0"
    :summary="summary"
  >
    <ul v-if="relations.length" class="relations__list">
      <li v-for="(relation, index) in relations" :key="index" class="relations__item">
        <span class="relations__type">{{ typeLabel(relation.type) }}</span>
        <span class="relations__target">
          <router-link v-if="byId.get(relation.to)" :to="entryPath(relation.to)" class="ld-benga">{{
            byId.get(relation.to).lexeme
          }}</router-link>
          <em v-else>palabra desconocida</em>
          <small
            v-if="
              senseText(entry, relation.fromSense) ||
              senseText(byId.get(relation.to), relation.toSense)
            "
          >
            ({{ senseText(entry, relation.fromSense) || 'todos los sentidos' }} →
            {{ senseText(byId.get(relation.to), relation.toSense) || 'todos los sentidos' }})
          </small>
        </span>
        <button type="button" class="ld-btn ld-btn--danger" @click="remove(index)">Quitar</button>
      </li>
    </ul>
    <p v-else class="ld-help">Esta palabra no tiene relaciones con otras.</p>

    <fieldset class="relations__add">
      <legend>Añadir relación</legend>
      <div v-if="target" class="relations__picked">
        <span
          >Con <strong class="ld-benga">{{ target.lexeme }}</strong></span
        >
        <button type="button" class="ld-btn" @click="targetId = ''">Cambiar</button>
      </div>
      <SearchPicker
        v-else
        :items="items"
        :exclude="[entry.id]"
        label="Buscar la otra palabra"
        placeholder="Buscar la otra palabra…"
        @pick="targetId = $event"
      />

      <template v-if="target">
        <div class="ld-grid">
          <label class="ld-field">
            Tipo de relación
            <select v-model="type">
              <option v-for="item in types" :key="item.type" :value="item.type">
                {{ item.es }}
              </option>
            </select>
          </label>
          <label class="ld-field">
            Sentido de esta palabra
            <select v-model="fromSense">
              <option value="">Todos los sentidos</option>
              <option v-for="(sense, index) in entry.senses" :key="sense.id" :value="sense.id">
                {{ senseTitle(sense, index) }}
              </option>
            </select>
          </label>
          <label class="ld-field">
            Sentido de la otra palabra
            <select v-model="toSense">
              <option value="">Todos los sentidos</option>
              <option v-for="(sense, index) in target.senses" :key="sense.id" :value="sense.id">
                {{ senseTitle(sense, index) }}
              </option>
            </select>
          </label>
        </div>
        <p class="ld-help">
          <strong>{{ typeInfo.es }}:</strong> {{ typeInfo.help?.es }}
          <template v-if="typeInfo.inverse">
            Desde la otra palabra se verá «{{ typeLabel(typeInfo.inverse) }}».
          </template>
        </p>
        <button type="button" class="ld-btn" :disabled="exists" @click="add">
          {{ exists ? 'Ya existe esta relación' : 'Añadir relación' }}
        </button>
      </template>
    </fieldset>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SearchPicker from './SearchPicker.vue'
import { RELATION_TYPES } from '../vocab'

export default {
  name: 'RelationsCard',
  components: { FormCard, SearchPicker },
  props: {
    entry: { type: Object, required: true },
    entries: { type: Array, default: () => [] }
  },
  emits: ['set'],
  data() {
    return { types: RELATION_TYPES, targetId: '', type: 'synonym', fromSense: '', toSense: '' }
  },
  computed: {
    relations() {
      return this.entry.relations || []
    },
    byId() {
      return new Map(this.entries.map((entry) => [entry.id, entry]))
    },
    target() {
      return this.byId.get(this.targetId) || null
    },
    typeInfo() {
      return this.types.find((item) => item.type === this.type) || {}
    },
    items() {
      return this.entries.map((entry) => ({
        id: entry.id,
        label: entry.lexeme,
        hint: entry.senses
          .map((sense) => sense.glosses?.es)
          .filter(Boolean)
          .join(' · ')
      }))
    },
    exists() {
      return this.relations.some(
        (relation) =>
          relation.type === this.type &&
          relation.to === this.targetId &&
          (relation.fromSense || '') === this.fromSense &&
          (relation.toSense || '') === this.toSense
      )
    },
    summary() {
      return this.relations.length
        ? this.relations
            .map(
              (relation) =>
                `${this.typeLabel(relation.type)}: ${this.byId.get(relation.to)?.lexeme ?? '?'}`
            )
            .join('; ')
        : 'Sin relaciones'
    }
  },
  methods: {
    typeLabel(type) {
      return this.types.find((item) => item.type === type)?.es || type
    },
    entryPath(id) {
      return { path: `/admin/living-dictionary/entrada/${id}` }
    },
    senseTitle(sense, index) {
      return `Sentido ${index + 1}${sense.glosses?.es ? ` · ${sense.glosses.es}` : ''}`
    },
    senseText(entry, senseId) {
      if (!entry || !senseId) return ''
      const index = entry.senses.findIndex((sense) => sense.id === senseId)
      return index < 0 ? '' : this.senseTitle(entry.senses[index], index)
    },
    add() {
      const relation = { id: null, type: this.type, to: this.targetId }
      if (this.fromSense) relation.fromSense = this.fromSense
      if (this.toSense) relation.toSense = this.toSense
      this.$emit('set', 'relations', [...this.relations, relation])
      this.targetId = ''
      this.fromSense = ''
      this.toSense = ''
    },
    remove(index) {
      this.$emit(
        'set',
        'relations',
        this.relations.filter((_, position) => position !== index)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.relations {
  &__list {
    margin: 0 0 $spacing-md;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm $spacing-md;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $color-surface-alt;

    .ld-btn {
      margin-left: auto;
    }
  }

  &__type {
    min-width: 8rem;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  &__add {
    margin: 0;
    padding: $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;

    legend {
      padding: 0 $spacing-xs;
      font-weight: $font-weight-semibold;
    }
  }

  &__picked {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }
}
</style>
