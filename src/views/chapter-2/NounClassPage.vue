<template>
  <div class="noun-class">
    <div class="noun-class__header">
      <h1>{{ $localized(content.title) }}</h1>
      <p v-if="content.subtitle" class="subtitle">{{ $localized(content.subtitle) }}</p>
    </div>

    <!-- One <section> per heading of the section file (see `pageSections` below) -->
    <section
      v-for="(part, partIdx) in pageSections"
      :key="`part-${partIdx}`"
      :class="`noun-class__${part.id}`"
    >
      <h2 v-if="part.title">{{ part.title }}</h2>
      <template v-for="(block, idx) in part.blocks" :key="`${part.id}-${idx}`">
        <PatternBox
          v-if="block.type === 'pattern'"
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
          :key-prefix="`${part.id}-${idx}`"
        />
        <p v-else-if="block.type === 'paragraph'">{{ $localized(block.text) }}</p>
        <NoteBox
          v-else-if="block.type === 'note'"
          :kind="noteKind(block, idx)"
          :text="$localized(block.text)"
        />
        <TableBlock
          v-else-if="block.type === 'table'"
          :columns="block.columns.map((column) => $localized(column))"
          :rows="tableRows(block)"
        />
        <ConceptList
          v-else-if="block.type === 'concepts'"
          :items="
            block.items.map((item) => ({
              title: $localized(item.title),
              text: $localized(item.text)
            }))
          "
        />
        <PracticeList
          v-else-if="block.type === 'practice'"
          :items="block.items.map((item) => $localized(item))"
        />
        <p v-else-if="isDev" class="unknown-block">Bloque desconocido: «{{ block.type }}»</p>
      </template>
    </section>

    <section class="noun-class__nav">
      <SectionNavFooter :prev="navLink('prev')" :next="navLink('next')" />
    </section>
  </div>
</template>

<script>
import PatternBox from '@/components/blocks/PatternBox.vue'
import ExampleGrid from '@/components/blocks/ExampleGrid.vue'
import NoteBox from '@/components/blocks/NoteBox.vue'
import TableBlock from '@/components/blocks/TableBlock.vue'
import ConceptList from '@/components/blocks/ConceptList.vue'
import PracticeList from '@/components/blocks/PracticeList.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
import nouns from '@/data/lexicon/nouns.json'

/** Every noun-class section file, e.g. { 'class-1': {…}, 'class-2': {…} } */
const SECTION_FILES = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/data/sections/ch-2/class-*.json', { eager: true, import: 'default' })
  ).map(([path, content]) => [path.split('/').pop().replace('.json', ''), content])
)

/**
 * ONE page for the seven noun classes. What it shows comes from a section file:
 *
 *   src/data/sections/ch-2/class-1.json            the router passes section="class-1"
 *   { "title", "subtitle", "nav"?, "blocks": [
 *       { "type": "heading", "id": "examples", "text": { "es": "Ejemplos Principales" } },
 *       { "type": "examples", "entries": ["epokolo", "en_a_"] },   ← ids of lexicon/nouns.json
 *       …
 *   ] }
 *
 * Each "heading" starts a <section class="noun-class__<id>"> with an <h2>; the blocks after it
 * go inside that section, drawn by the block components (src/components/blocks/).
 * To change a class page, edit its JSON file; to change how a block looks, edit its component.
 * Guide: docs/CONTENT-GUIDE.md
 */
export default {
  name: 'NounClassPage',
  components: {
    PatternBox,
    ExampleGrid,
    NoteBox,
    TableBlock,
    ConceptList,
    PracticeList,
    SectionNavFooter
  },
  props: {
    /** Section file name without .json, e.g. "class-1" */
    section: { type: String, required: true }
  },
  data() {
    return { isDev: import.meta.env.DEV }
  },
  computed: {
    content() {
      return SECTION_FILES[this.section]
    },
    /** The blocks grouped by heading: [{ id, title, blocks: [...] }] */
    pageSections() {
      const parts = []
      for (const block of this.content.blocks) {
        if (block.type === 'heading') {
          parts.push({ id: block.id || 'part', heading: block, blocks: [] })
        } else {
          if (!parts.length) parts.push({ id: 'intro', heading: null, blocks: [] })
          parts[parts.length - 1].blocks.push(block)
        }
      }
      return parts.map((part) => ({ ...part, title: this.headingText(part) }))
    }
  },
  watch: {
    section: {
      immediate: true,
      handler() {
        document.title = `${this.$localized(this.content.title)} | Portal Benga`
      }
    }
  },
  methods: {
    /** "Ejemplos del libro ({count})" → "Ejemplos del libro (88)" */
    headingText(part) {
      if (!part.heading) return null
      const examples = part.blocks.find((block) => block.type === 'examples')
      const count = examples ? examples.entries.length : 0
      return this.$localized(part.heading.text).replace('{count}', count)
    },
    /** Lexicon ids → the { singular, plural } cards ExampleGrid draws. */
    examplesFor(block) {
      const form = (entry, number) => {
        const meaning = number === 'plural' ? entry.meaningPlural || entry.meaning : entry.meaning
        return (
          entry[number] && {
            word: entry[number].word,
            meaning: meaning ? this.$localized(meaning) : null
          }
        )
      }
      return block.entries.map((id) => {
        const entry = nouns.entries[id]
        if (!entry) return { singular: { word: `?? ${id}`, meaning: null }, plural: null }
        return { singular: form(entry, 'singular'), plural: form(entry, 'plural') }
      })
    },
    /** A note right under the heading is a section note; a later one sits under the content. */
    noteKind(block, idx) {
      if (block.variant === 'small') return 'small'
      return idx === 0 ? 'section' : 'after'
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

// Page frame shared by all noun classes (blocks bring their own styles).
.noun-class {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c4e 100%);
    color: white;
    padding: 2.5rem $spacing-lg;
    border-radius: $border-radius;
    margin-bottom: $spacing-xl;
    text-align: center;

    h1 {
      margin: 0 0 $spacing-sm 0;
      font-size: 2rem;
      font-family: $font-heading;
    }

    .subtitle {
      margin: 0;
      opacity: 0.95;
      font-size: 1.1rem;
    }
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: $color-primary;
      margin-top: 0;
      margin-bottom: $spacing-lg;
      font-size: 1.5rem;
      border-bottom: 2px solid $color-accent;
      padding-bottom: $spacing-md;
    }
  }

  &__practice {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    margin-top: $spacing-xl;
  }

  .unknown-block {
    padding: $spacing-md;
    border: 2px dashed #c0392b;
    color: #c0392b;
  }

  @include respond-below('md') {
    padding: $spacing-md;

    &__header {
      padding: 1.5rem $spacing-md;

      h1 {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }

    &__nav {
      flex-direction: column;
    }
  }
}
</style>
