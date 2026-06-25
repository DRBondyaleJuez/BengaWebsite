<template>
  <nav class="chapter-nav" aria-label="Chapter navigation">
    <ul class="chapter-nav__list">
      <li 
        v-for="chapter in chapters" 
        :key="chapter.id"
        class="chapter-nav__item"
      >
        <button
          class="chapter-nav__chapter"
          :class="{ 'chapter-nav__chapter--active': isChapterActive(chapter) }"
          @click="toggleChapter(chapter.id)"
          :aria-expanded="openChapters.includes(chapter.id)"
        >
          <router-link :to="chapter.path" class="home-page__chapter-link">
            <span class="chapter-nav__chapter-title">
              {{ $t(`chapters.${chapter.id}.title`) }}
            </span>
          </router-link>
          <BaseIcon 
            :name="openChapters.includes(chapter.id) ? 'chevron-up' : 'chevron-down'" 
            class="chapter-nav__icon"
          />
        </button>

        <transition name="slide">
          <ul 
            v-if="openChapters.includes(chapter.id)" 
            class="chapter-nav__sections"
          >
            <li 
              v-for="section in chapter.sections" 
              :key="section.id"
              class="chapter-nav__section"
            >
              <router-link
                :to="section.path"
                class="chapter-nav__link"
                :class="{ 'chapter-nav__link--active': $route.path === section.path }"
              >
                {{ $t(`chapters.${chapter.id}.sections.${section.id}`) }}
              </router-link>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </nav>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'

export default {
  name: 'ChapterNav',
  components: {
    BaseIcon
  },
  props: {
    chapters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      openChapters: []
    }
  },
  mounted() {
    // Auto-open current chapter
    this.openCurrentChapter()
  },
  watch: {
    $route() {
      this.openCurrentChapter()
    }
  },
  methods: {
    toggleChapter(chapterId) {
      const index = this.openChapters.indexOf(chapterId)
      if (index > -1) {
        this.openChapters.splice(index, 1)
      } else {
        this.openChapters.push(chapterId)
      }
    },
    isChapterActive(chapter) {
      return chapter.sections.some(section => 
        this.$route.path.startsWith(section.path.split('/').slice(0, 2).join('/'))
      )
    },
    openCurrentChapter() {
      const currentChapter = this.chapters.find(chapter => 
        this.isChapterActive(chapter)
      )
      if (currentChapter && !this.openChapters.includes(currentChapter.id)) {
        this.openChapters.push(currentChapter.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.chapter-nav {
  padding: $spacing-md 0;

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    border-bottom: $border-width solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  &__chapter {
    @include flex-between;
    width: 100%;
    padding: $spacing-md $spacing-lg;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    transition: background-color $transition-fast;

    &:hover {
      background-color: $color-surface-alt;
    }

    &--active {
      color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &-title {
      flex: 1;
      padding-right: $spacing-sm;
    }
  }

  &__icon {
    flex-shrink: 0;
    color: $color-text-muted;
  }

  &__sections {
    list-style: none;
    margin: 0;
    padding: 0 0 $spacing-sm;
    background-color: $color-surface-alt;
  }

  &__section {
    margin: 0;
  }

  &__link {
    display: block;
    padding: $spacing-sm $spacing-lg $spacing-sm $spacing-2xl;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    text-decoration: none;
    transition: all $transition-fast;

    &:hover {
      color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &--active {
      color: $color-primary;
      font-weight: $font-weight-medium;
      border-left: 3px solid $color-primary;
      padding-left: calc(#{$spacing-2xl} - 3px);
    }
  }
}

// Slide transition
.slide-enter-active,
.slide-leave-active {
  transition: all $transition-fast;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave {
  max-height: 500px;
}
</style>
