<template>
  <router-link v-if="prevLink" :to="prevLink.to" :class="classes.prev">
    ← {{ prevLink.label }}
  </router-link>
  <router-link v-if="nextLink" :to="nextLink.to" :class="classes.next">
    {{ nextLink.label }} →
  </router-link>
</template>

<script>
import chaptersIndex from '@/data/chapters-index.json'

/**
 * The two buttons at the bottom of a page: ← previous section · next section →
 *
 *   <SectionNavFooter />                                       both from chapters-index.json
 *   <SectionNavFooter :prev="{ to: '/capitulo-2/clase-1', label: 'Clase 1' }" />   override one
 *
 * Without props, the neighbours of the current URL in src/data/chapters-index.json are used, with
 * their sidebar titles. Put it inside the page's nav container (e.g. <section class="noun-class__nav">).
 *
 * look="bar" (default): two wide coloured bars (noun classes) ·
 * look="buttons": a grey "back" button and a coloured "next" button (chapter-3 pages).
 */
export default {
  name: 'SectionNavFooter',
  props: {
    /** { to, label } — label without the arrow. Default: previous section of the chapter. */
    prev: { type: Object, default: null },
    /** { to, label } — label without the arrow. Default: next section of the chapter. */
    next: { type: Object, default: null },
    look: {
      type: String,
      default: 'bar',
      validator: (value) => ['bar', 'buttons'].includes(value)
    }
  },
  computed: {
    classes() {
      return this.look === 'buttons'
        ? { prev: 'nav-button nav-button--back', next: 'nav-button nav-button--next' }
        : { prev: 'nav-link prev', next: 'nav-link next' }
    },
    /** Every section of every chapter, in reading order. */
    neighbours() {
      const sections = chaptersIndex.chapters.flatMap((chapter) => chapter.sections)
      const here = sections.findIndex((section) => section.path === this.$route.path)
      const link = (section) => section && { to: section.path, label: this.$t(section.titleKey) }
      return here < 0 ? {} : { prev: link(sections[here - 1]), next: link(sections[here + 1]) }
    },
    prevLink() {
      return this.prev || this.neighbours.prev
    },
    nextLink() {
      return this.next || this.neighbours.next
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.nav-link {
  flex: 1;
  padding: $spacing-md $spacing-lg;
  background: $color-primary;
  color: white;
  text-decoration: none;
  border-radius: $border-radius;
  text-align: center;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: darken($color-primary, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.prev {
    background: $color-secondary;

    &:hover {
      background: darken($color-secondary, 10%);
    }
  }
}

.nav-button {
  @include button-base;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: $border-radius-base;
  transition: all $transition-base;

  &--back {
    background-color: #f0f0f0;
    color: $color-text-primary;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &--next {
    background-color: $color-primary;
    color: white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
</style>
