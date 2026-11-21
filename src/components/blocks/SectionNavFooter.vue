<template>
  <nav v-if="prevLink || nextLink" class="section-nav" :aria-label="$t('nav.pageNavigation')">
    <router-link
      v-if="prevLink"
      :to="prevLink.to"
      class="section-nav__button section-nav__button--prev"
    >
      ← {{ prevLink.label }}
    </router-link>
    <router-link
      v-if="nextLink"
      :to="nextLink.to"
      class="section-nav__button section-nav__button--next"
    >
      {{ nextLink.label }} →
    </router-link>
  </nav>
</template>

<script>
import chaptersIndex from '@/data/chapters-index.json'

/**
 * The footer of every chapter page: ← previous page · next page →
 *
 *   <SectionNavFooter />
 *
 * Both buttons come from src/data/chapters-index.json, read as ONE path through the book:
 *
 *   Capítulo 1 → Alfabeto → Diptongos → Triptongos → Consonantes → Capítulo 2 → Clasificación… → …
 *   (chapter index page, then its sections, then the next chapter's index page…)
 *
 * so the last section of a chapter leads to the next chapter, and the labels are the sidebar
 * titles. Adding a section to chapters-index.json updates every footer. `prev` / `next`
 * ({ to, label }) can override one button, but normally they are left out.
 */
export default {
  name: 'SectionNavFooter',
  props: {
    prev: { type: Object, default: null },
    next: { type: Object, default: null }
  },
  computed: {
    /** Every chapter index page and section, in reading order: [{ to, label }] */
    readingOrder() {
      return chaptersIndex.chapters.flatMap((chapter) => [
        { to: chapter.path, label: this.$t(chapter.titleKey) },
        ...chapter.sections.map((section) => ({
          to: section.path,
          label: this.$t(section.titleKey)
        }))
      ])
    },
    here() {
      return this.readingOrder.findIndex((page) => page.to === this.$route.path)
    },
    prevLink() {
      if (this.prev) return this.prev
      return this.here > 0 ? this.readingOrder[this.here - 1] : null
    },
    nextLink() {
      if (this.next) return this.next
      return this.here >= 0 ? this.readingOrder[this.here + 1] || null : null
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.section-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  &__button {
    @include button-base;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: $border-radius-base;
    transition: all $transition-base;

    // Only a "next" button (first page of the book): keep it on the right
    &--next:only-child {
      margin-left: auto;
    }

    &--prev {
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
}
</style>
