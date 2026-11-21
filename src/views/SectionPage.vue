<template>
  <div :class="lesson ? 'lesson' : 'section-page'">
    <div v-if="!lesson" class="section-page__header">
      <h1>{{ $localized(content.title) }}</h1>
      <p v-if="content.subtitle" class="subtitle">{{ $localized(content.subtitle) }}</p>
    </div>

    <!-- One part per heading: a <section> (article) or a ContentSection (lesson) -->
    <component
      :is="lesson ? 'ContentSection' : 'section'"
      v-for="(part, partIdx) in pageSections"
      :key="`part-${partIdx}`"
      v-bind="partAttributes(part)"
    >
      <h2 v-if="part.title && !lesson">{{ part.title }}</h2>
      <template v-for="(block, idx) in part.blocks" :key="`${partIdx}-${idx}`">
        <p v-if="block.type === 'paragraph' && lesson" class="lesson__intro">
          {{ $localized(block.text) }}
        </p>
        <div v-else-if="block.type === 'paragraph'" class="section-page__text">
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
        <div
          v-else-if="block.type === 'note' && lesson && block.variant === 'rule'"
          class="lesson__rule-box"
        >
          <BaseIcon name="info" />
          <div class="lesson__info-content">
            <p class="lesson__rule-text">{{ $localized(block.text) }}</p>
          </div>
        </div>
        <div
          v-else-if="block.type === 'note' && lesson && block.variant === 'important'"
          class="lesson__info-box"
        >
          <BaseIcon name="info" />
          <div class="lesson__info-content">
            <p class="lesson__info-text">{{ $localized(block.text) }}</p>
          </div>
        </div>
        <div v-else-if="block.type === 'note' && lesson" class="lesson__note">
          <BaseIcon name="info" />
          <p>{{ $localized(block.text) }}</p>
        </div>
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
        <SoundCards
          v-else-if="block.type === 'sounds'"
          :items="soundItems(block)"
          :color="block.color || 'primary'"
          :label-size="block.labelSize || 'normal'"
        />
        <SoundGroups
          v-else-if="block.type === 'soundGroups'"
          :items="
            block.items.map((item) => ({
              label: item.label,
              pronunciation: $localized(item.pronunciation),
              examples: soundItems({ items: [item] })[0].examples
            }))
          "
        />
        <p v-else-if="isDev" class="section-page__unknown">
          Bloque desconocido: «{{ block.type }}» (añade su componente en SectionPage.vue)
        </p>
      </template>
    </component>

    <SectionNavFooter />
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
import SoundCards from '@/components/blocks/SoundCards.vue'
import SoundGroups from '@/components/blocks/SoundGroups.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
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
 * Two frames, chosen by the file's "layout":
 *   "article" (default)  title on top, parts as plain/box/highlight sections (chapter 3)
 *   "lesson"             chapter-1 look: each part is a ContentSection (title underlined), no page
 *                        title on top, coloured buttons at the bottom; "color": "secondary" on the
 *                        file switches the theme colour.
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
    SectionNavFooter,
    SoundCards,
    SoundGroups,
    ContentSection,
    BaseIcon
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
    lesson() {
      return this.content.layout === 'lesson'
    },
    /** The blocks grouped by heading: [{ title, style, blocks: [...] }] */
    pageSections() {
      const parts = []
      for (const block of this.content.blocks) {
        if (block.type === 'heading') {
          parts.push({
            id: block.id,
            title: block.text ? this.$localized(block.text) : null,
            style: block.style,
            blocks: []
          })
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
    /** Attributes of a part: a ContentSection (lesson) or a <section> (article). */
    partAttributes(part) {
      if (this.lesson) return { id: part.id, title: part.title }
      return { class: ['section-page__part', part.style && `section-page__part--${part.style}`] }
    },
    soundItems(block) {
      return block.items.map((item) => ({
        label: item.label,
        soundsLike: item.soundsLike ? this.$localized(item.soundsLike) : null,
        note: item.note ? this.$localized(item.note) : null,
        examples: (item.examples || []).map((example) => ({
          word: example.word,
          meaning: example.meaning ? this.$localized(example.meaning) : null
        }))
      }))
    },
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
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

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

  &__unknown {
    padding: 1rem;
    border: 2px dashed #c0392b;
    color: #c0392b;
  }
}

// The "lesson" frame (chapter-1 pages)
.lesson {
  padding: $spacing-xl 0;

  &__intro {
    @include body-text;
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }

  &__note {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-info, 0.05);
    border-left: 4px solid $color-info;
    border-radius: 8px;
    margin-top: $spacing-lg;

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
    }
  }

  &__info-box {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-accent, 0.08);
    border-left: 4px solid $color-accent;
    border-radius: 8px;
  }

  &__info-content {
    flex: 1;
  }

  &__rule-box {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-accent, 0.1);
    border-left: 4px solid $color-accent;
    border-radius: 8px;
    margin-bottom: $spacing-xl;
  }

  &__rule-text {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-loose;
  }

  &__info-text {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-loose;
    color: $color-text-primary;
  }
}
</style>
