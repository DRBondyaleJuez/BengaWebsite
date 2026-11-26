<!--
  CitationsEditor - list of citations { slug, locator }: where a word or sentence comes from.
  The default source is the book (LD_BOOK_SOURCE); the locator is the page, e.g. «p. 14».
  Props: citations (array, read only), label
  Events: update(citations) with the whole new list
-->
<template>
  <div class="citations">
    <p v-if="!citations.length" class="ld-help">Sin citas.</p>
    <ul v-else class="citations__list">
      <li v-for="(citation, index) in citations" :key="index" class="citations__item">
        <label class="ld-field">
          Fuente
          <input
            :value="citation.slug"
            list="citations-sources"
            @input="change(index, { slug: $event.target.value })"
          />
        </label>
        <label class="ld-field">
          Página o lugar
          <input
            :value="citation.locator ?? ''"
            placeholder="p. 14"
            @input="change(index, { locator: $event.target.value })"
          />
        </label>
        <button type="button" class="ld-btn ld-btn--danger" @click="remove(index)">Quitar</button>
      </li>
    </ul>
    <datalist id="citations-sources">
      <option :value="bookSlug">{{ bookName }}</option>
    </datalist>
    <button type="button" class="ld-btn" @click="add">+ Añadir cita</button>
  </div>
</template>

<script>
import { LD_BOOK_SOURCE } from '@/config/ld'

export default {
  name: 'CitationsEditor',
  props: {
    citations: { type: Array, default: () => [] }
  },
  emits: ['update'],
  data() {
    return { bookSlug: LD_BOOK_SOURCE.slug, bookName: LD_BOOK_SOURCE.abbreviation }
  },
  methods: {
    emitList(list) {
      this.$emit('update', list)
    },
    change(index, patch) {
      const list = this.citations.map((citation, position) =>
        position === index ? { ...citation, ...patch } : citation
      )
      // an empty locator is not stored
      this.emitList(list.map(({ locator, ...rest }) => (locator ? { ...rest, locator } : rest)))
    },
    add() {
      this.emitList([...this.citations, { slug: this.bookSlug }])
    },
    remove(index) {
      this.emitList(this.citations.filter((_, position) => position !== index))
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.citations {
  &__list {
    margin: 0 0 $spacing-sm;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;
    gap: $spacing-sm;
    align-items: end;
    margin-bottom: $spacing-sm;

    @media (max-width: 600px) {
      grid-template-columns: minmax(0, 1fr);
      align-items: stretch;
    }
  }
}
</style>
