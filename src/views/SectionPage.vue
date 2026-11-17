<template>
  <div class="section-page">
    <div class="section-page__header">
      <h1>{{ $localized(content.title) }}</h1>
      <p v-if="content.subtitle" class="subtitle">{{ $localized(content.subtitle) }}</p>
    </div>

    <!-- One <section> per heading of the section file; its "style" picks the look of the part -->
    <section
      v-for="(part, partIdx) in pageSections"
      :key="`part-${partIdx}`"
      :class="['section-page__part', part.style && `section-page__part--${part.style}`]"
    >
      <h2 v-if="part.title">{{ part.title }}</h2>
      <template v-for="(block, idx) in part.blocks" :key="`${partIdx}-${idx}`">
        <div v-if="block.type === 'paragraph'" class="section-page__text">
          <p v-html="markup(block.text)"></p>
        </div>
        <PatternBox
          v-else-if="block.type === 'pattern'"
          :from="block.from"
          :to="block.to"
          :from-label="block.fromLabel ? $localized(block.fromLabel) : undefined"
          :to-label="block.toLabel ? $localized(block.toLabel) : undefined"
          :description="block.description ? $localized(block.description) : null"
          :compact="block.compact"
        />
        <ExampleGrid
          v-else-if="block.type === 'examples'"
          :items="examplesFor(block)"
          :layout="block.layout || 'pairs'"
          :key-prefix="`${partIdx}-${idx}`"
        />
        <NoteBox
          v-else-if="block.type === 'note'"
          :kind="block.variant === 'small' ? 'small' : idx === 0 ? 'section' : 'after'"
          :text="$localized(block.text)"
        />
        <TableBlock
          v-else-if="block.type === 'table'"
          :columns="block.columns.map((column) => $localized(column))"
          :rows="tableRows(block)"
        />
        <ConceptCards
          v-else-if="block.type === 'concepts' && block.look === 'cards'"
          :items="conceptItems(block)"
        />
        <ConceptList v-else-if="block.type === 'concepts'" :items="conceptItems(block)" />
        <PracticeList
          v-else-if="block.type === 'practice'"
          :items="block.items.map((item) => $localized(item))"
        />
        <CheckList
          v-else-if="block.type === 'checklist'"
          :items="block.items.map((item) => $localized(item))"
        />
        <SectionLinks
          v-else-if="block.type === 'links'"
          :items="
            block.items.map((item) => ({
              title: $localized(item.title),
              text: $localized(item.text),
              to: item.to
            }))
          "
        />
        <p v-else-if="isDev" class="section-page__unknown">
          Bloque desconocido: «{{ block.type }}» (añade su componente en SectionPage.vue)
        </p>
      </template>
    </section>

    <div class="section-page__navigation">
      <SectionNavFooter :prev="navLink('prev')" :next="navLink('next')" look="buttons" />
    </div>
  </div>
</template>

<script>
import PatternBox from '@/components/blocks/PatternBox.vue'
import ExampleGrid from '@/components/blocks/ExampleGrid.vue'
import NoteBox from '@/components/blocks/NoteBox.vue'
import TableBlock from '@/components/blocks/TableBlock.vue'
import ConceptList from '@/components/blocks/ConceptList.vue'
import ConceptCards from '@/components/blocks/ConceptCards.vue'
import PracticeList from '@/components/blocks/PracticeList.vue'
import CheckList from '@/components/blocks/CheckList.vue'
import SectionLinks from '@/components/blocks/SectionLinks.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
import { inlineMarkup } from '@/utils/inlineMarkup'

/** Every section file, keyed by its path: { 'ch-3/adjectives-intro': {…}, … } */
const SECTION_FILES = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/data/sections/**/*.json', { eager: true, import: 'default' })
  ).map(([path, content]) => [path.split('/sections/')[1].replace('.json', ''), content])
)

/** Every lexicon entry of every lexicon file (nouns, adjectives…), by id. */
const LEXICON = Object.assign(
  {},
  ...Object.values(
    import.meta.glob(['@/data/lexicon/*.json', '!**/word-*.json'], {
      eager: true,
      import: 'default'
    })
  ).map((file) => file.entries)
)

/**
 * A page made ONLY from a section file: adding a section of the book = adding a JSON file
 * and a route (task 3.6 will generate the routes).
 *
 *   router:  { path: 'introduccion', component: SectionPage, props: { section: 'ch-3/adjectives-intro' } }
 *   file:    src/data/sections/ch-3/adjectives-intro.json
 *
 * Each "heading" block starts a part of the page (an <h2>); its optional "style" gives the part
 * its look: none (plain), "box" (grey box), "highlight" (blue box). The blocks after the heading
 * are drawn by the components of src/components/blocks/. An unknown block type shows a red
 * warning during `npm run serve` and nothing on the published site.
 * The noun classes use NounClassPage.vue (same blocks, the green noun-class frame).
 * Guide: docs/CONTENT-GUIDE.md
 */
export default {
  name: 'SectionPage',
  components: {
    PatternBox,
    ExampleGrid,
    NoteBox,
    TableBlock,
    ConceptList,
    ConceptCards,
    PracticeList,
    CheckList,
    SectionLinks,
    SectionNavFooter
  },
  props: {
    /** Path of the section file under src/data/sections, without .json */
    section: { type: String, required: true }
  },
  data() {
    return { isDev: import.meta.env.DEV }
  },
  computed: {
    content() {
      return SECTION_FILES[this.section]
    },
    /** The blocks grouped by heading: [{ title, style, blocks: [...] }] */
    pageSections() {
      const parts = []
      for (const block of this.content.blocks) {
        if (block.type === 'heading') {
          parts.push({ title: this.$localized(block.text), style: block.style, blocks: [] })
        } else {
          if (!parts.length) parts.push({ title: null, style: null, blocks: [] })
          parts[parts.length - 1].blocks.push(block)
        }
      }
      return parts
    }
  },
  watch: {
    section: {
      immediate: true,
      handler() {
        if (this.content.pageTitle) document.title = this.$localized(this.content.pageTitle)
      }
    }
  },
  methods: {
    markup(text) {
      return inlineMarkup(this.$localized(text))
    },
    conceptItems(block) {
      return block.items.map((item) => ({
        title: this.$localized(item.title),
        text: this.$localized(item.text),
        example: item.example ? this.$localized(item.example) : null
      }))
    },
    examplesFor(block) {
      const form = (entry, number) => {
        const meaning = number === 'plural' ? entry.meaningPlural || entry.meaning : entry.meaning
        const word = entry[number]?.word || (number === 'singular' ? entry.word : null)
        return word && { word, meaning: meaning ? this.$localized(meaning) : null }
      }
      return block.entries.map((id) => {
        const entry = LEXICON[id]
        if (!entry) return { singular: { word: `?? ${id}`, meaning: null }, plural: null }
        return { singular: form(entry, 'singular'), plural: form(entry, 'plural') }
      })
    },
    tableRows(block) {
      return block.rows.map((row) =>
        row.map((cell) => (cell.benga ? { benga: cell.benga } : { text: this.$localized(cell) }))
      )
    },
    navLink(which) {
      const link = this.content.nav && this.content.nav[which]
      return link ? { to: link.to, label: this.$localized(link.label) } : null
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

// The "article" frame (the look of the chapter-3 introduction). Blocks bring their own styles.
.section-page {
  @include page-container;

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid $color-primary;

    h1 {
      font-size: 2.5rem;
      color: $color-primary;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: $color-text-secondary;
    }
  }

  &__part {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.8rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }

    // style "box": grey box with a coloured left border
    &--box {
      background: $color-background-light;
      padding: 2rem;
      border-radius: $border-radius-base;
      border-left: 4px solid $color-primary;

      h2 {
        color: $color-primary;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        line-height: 1.8;
        color: $color-text-primary;
      }
    }

    // style "highlight": light-blue box (points to remember)
    &--highlight {
      background: #f0f7ff;
      padding: 2rem;
      border-radius: $border-radius-base;
      margin-bottom: 2rem;
      border-left: 4px solid $color-primary;

      h2 {
        font-size: 1.5rem;
        color: $color-primary;
        margin-bottom: 1.5rem;
      }
    }
  }

  &__navigation {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  &__unknown {
    padding: 1rem;
    border: 2px dashed #c0392b;
    color: #c0392b;
  }
}
</style>
