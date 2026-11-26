<!--
  LinkedWordsCard - card «Palabras» of the sentence form: the senses this sentence is an example
  of. Search a word to link it, remove a link. Saving the sentence also updates the word's side.
  Props: senseIds (read only), senseWords (map senseId → { entryId, lexeme, gloss, index }),
         backPath (where «Volver» of the word form returns to)
  Events: set(path, value)
-->
<template>
  <FormCard id="card-palabras" title="Palabras" :badge="String(senseIds.length)" :summary="summary">
    <p class="ld-help">
      La oración sale como ejemplo en las palabras que enlaces. Sin ninguna palabra enlazada queda
      suelta.
    </p>
    <ul v-if="senseIds.length" class="linked__list">
      <li v-for="id in senseIds" :key="id" class="linked__item">
        <template v-if="senseWords[id]">
          <router-link :to="entryPath(senseWords[id].entryId)" class="ld-benga">{{
            senseWords[id].lexeme
          }}</router-link>
          <span class="linked__gloss"
            >sentido {{ senseWords[id].index + 1
            }}<template v-if="senseWords[id].gloss"> · {{ senseWords[id].gloss }}</template></span
          >
        </template>
        <span v-else class="linked__gloss">Sentido desconocido ({{ id }})</span>
        <button type="button" class="ld-btn" @click="remove(id)">Quitar</button>
      </li>
    </ul>
    <SearchPicker
      :items="items"
      :exclude="senseIds"
      label="Enlazar una palabra"
      placeholder="Enlazar una palabra (buscar)…"
      @pick="add"
    />
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import SearchPicker from './SearchPicker.vue'

export default {
  name: 'LinkedWordsCard',
  components: { FormCard, SearchPicker },
  props: {
    senseIds: { type: Array, default: () => [] },
    senseWords: { type: Object, default: () => ({}) },
    backPath: { type: String, default: '' }
  },
  emits: ['set'],
  computed: {
    items() {
      return Object.entries(this.senseWords).map(([id, word]) => ({
        id,
        label: word.lexeme,
        hint: `sentido ${word.index + 1}${word.gloss ? ` · ${word.gloss}` : ''}`
      }))
    },
    summary() {
      const words = this.senseIds.map((id) => this.senseWords[id]?.lexeme).filter(Boolean)
      return words.length ? words.join(', ') : 'Sin palabras enlazadas'
    }
  },
  methods: {
    entryPath(id) {
      return { path: `/admin/living-dictionary/entrada/${id}`, query: { volver: this.backPath } }
    },
    add(id) {
      this.$emit('set', 'senseIds', [...this.senseIds, id])
    },
    remove(id) {
      this.$emit(
        'set',
        'senseIds',
        this.senseIds.filter((item) => item !== id)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.linked {
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

  &__gloss {
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}
</style>
