<!--
  WebCard - card «En la web» of the word form (read only): the words of the website this entry is
  linked to (entry.siteKeys → word registry), the pages of the site that show them, and the
  book's gloss next to the dictionary's. Nothing here writes to the site's files.
  Props: entry (read only)
-->
<template>
  <FormCard id="card-web" title="En la web" :open="false" :summary="summary">
    <p v-if="!keys.length" class="ld-help">
      Esta palabra no está enlazada con ninguna palabra de la web. Se enlaza sola al guardar si se
      escribe como una palabra del libro.
    </p>
    <template v-else>
      <h3 class="web__title">Palabras de la web enlazadas</h3>
      <ul class="web__list">
        <li v-for="row in rows" :key="row.key" class="web__item">
          <span class="ld-benga">{{ row.word }}</span>
          <span class="web__badge" :class="row.recorded ? 'web__badge--ok' : ''">{{
            row.recorded ? 'con audio en la web' : 'sin audio en la web'
          }}</span>
          <small v-if="row.notes">{{ row.notes }}</small>
          <ul v-if="row.pages.length" class="web__pages">
            <li v-for="page in row.pages" :key="page.path">
              <a :href="`${base}${page.path.slice(1)}`" target="_blank" rel="noopener">{{
                page.title
              }}</a>
            </li>
          </ul>
          <small v-else>No sale en ninguna página todavía.</small>
        </li>
      </ul>
      <p class="ld-help">
        El enlace sale del registro de palabras:
        <router-link to="/admin/palabras" target="_blank">abrir el registro</router-link>.
      </p>
    </template>

    <h3 class="web__title">Traducción del libro y del diccionario</h3>
    <p v-if="!book" class="ld-help">
      No se encontró esta palabra en las listas del libro (sustantivos del capítulo 2, adjetivos del
      capítulo 3).
    </p>
    <template v-else>
      <p class="ld-help">
        Libro: <strong class="ld-benga">{{ book.word }}</strong> ({{
          book.kind === 'noun' ? 'sustantivo' : 'adjetivo'
        }}{{ book.plural ? ', plural' : '' }}). Solo lectura: lo del libro no se cambia desde aquí.
      </p>
      <table class="web__table">
        <thead>
          <tr>
            <th scope="col">Idioma</th>
            <th scope="col">Libro</th>
            <th scope="col">Diccionario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in glossRows" :key="row.lang" :class="{ web__differs: row.differs }">
            <th scope="row">{{ row.label }}</th>
            <td>{{ row.book || '—' }}</td>
            <td>{{ row.dictionary || '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="glossRows.some((row) => row.differs)" class="ld-help">
        Las filas resaltadas no coinciden: puede ser solo otra forma de decirlo. Si crees que hay un
        error, no lo cambies a ciegas: anótalo en la revisión.
      </p>
    </template>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import registry from '@/data/lexicon/word-registry.json'
import usage from '@/data/lexicon/word-usage.json'
import nouns from '@/data/lexicon/nouns.json'
import adjectives from '@/data/lexicon/adjectives.json'
import chaptersIndex from '@/data/chapters-index.json'
import es from '@/locales/es.json'
import { bookGloss, dictionaryGloss, sameGloss, sitePages } from '@/utils/dictionaryChecks'

const lexicons = { nouns: nouns.entries, adjectives: adjectives.entries }

const textOf = (key) => key.split('.').reduce((node, part) => node?.[part], es)

/** Every page of the site: { path, title (Spanish), sectionFile?, component? }. */
const SECTIONS = chaptersIndex.chapters.flatMap((chapter) => [
  {
    path: chapter.path,
    title: textOf(chapter.titleKey) || chapter.path,
    component: chapter.component
  },
  ...chapter.sections.map((section) => ({
    path: section.path,
    title: textOf(section.titleKey) || section.path,
    sectionFile: section.sectionFile,
    component: section.component
  }))
])

export default {
  name: 'WebCard',
  components: { FormCard },
  props: {
    entry: { type: Object, required: true }
  },
  data() {
    return {
      base: import.meta.env.BASE_URL,
      languages: [
        { lang: 'es', label: 'Español' },
        { lang: 'en', label: 'Inglés' },
        { lang: 'fr', label: 'Francés' }
      ]
    }
  },
  computed: {
    keys() {
      return this.entry.siteKeys || []
    },
    rows() {
      return this.keys.map((key) => {
        const registered = registry.words[key] || {}
        const word = registered.word || key
        const found = bookGloss({ lexeme: word, senses: [] }, lexicons, [key])
        return {
          key,
          word,
          recorded: registered.audio === 'recorded',
          notes: registered.notes || '',
          pages: sitePages(usage.words[key]?.usedIn, {
            sections: SECTIONS,
            noun: found?.kind === 'noun' ? lexicons.nouns[found.id] : null,
            adjective: found?.kind === 'adjective' ? lexicons.adjectives[found.id] : null
          })
        }
      })
    },
    book() {
      return bookGloss(this.entry, lexicons, this.keys)
    },
    glossRows() {
      return this.languages.map(({ lang, label }) => {
        const book = this.book?.meaning?.[lang] || ''
        const dictionary = dictionaryGloss(this.entry, lang)
        return {
          lang,
          label,
          book,
          dictionary,
          differs: Boolean(book && dictionary) && !sameGloss(book, dictionary)
        }
      })
    },
    summary() {
      if (!this.keys.length) return 'No enlazada con la web'
      const pages = new Set(this.rows.flatMap((row) => row.pages.map((page) => page.path)))
      return `${this.keys.length} palabra(s) de la web · ${pages.size} página(s)`
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.web {
  &__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  &__list {
    margin: 0 0 $spacing-md;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: $spacing-xs $spacing-md;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $color-surface-alt;
  }

  &__pages {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs $spacing-md;
    flex-basis: 100%;
    margin: 0;
    padding: 0 0 0 $spacing-md;
    list-style: none;
    font-size: $font-size-sm;
  }

  &__badge {
    padding: 0 $spacing-sm;
    background: $color-surface-alt;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;

    &--ok {
      background: rgba($color-success, 0.15);
      color: #1c6b2d;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th,
    td {
      padding: $spacing-xs $spacing-sm;
      border-bottom: 1px solid $color-surface-alt;
      text-align: left;
      overflow-wrap: anywhere;
    }
  }

  &__differs {
    background: rgba($color-warning, 0.15);
  }
}
</style>
