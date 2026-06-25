<template>
  <aside 
    class="sidebar" 
    :class="{ 'sidebar--open': isOpen }"
  >
    <div class="sidebar__overlay" @click="$emit('close')" />
    
    <div class="sidebar__content">
      <div class="sidebar__header">
        <h2 class="sidebar__title">{{ $t('nav.chapters') }}</h2>
        <button 
          class="sidebar__close"
          @click="$emit('close')"
          :aria-label="$t('accessibility.closeMenu')"
        >
          <BaseIcon name="close" />
        </button>
      </div>

      <ChapterNav :chapters="chapters" />

      <div class="sidebar__footer">
        <a 
          href="/downloads/salvado-y-cos-gramatica-benga.pdf"
          class="sidebar__download"
          download
        >
          <BaseIcon name="download" />
          {{ $t('nav.download') }}
        </a>
      </div>
    </div>
  </aside>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'
import ChapterNav from '@/components/navigation/ChapterNav.vue'
import chaptersData from '@/data/chapters-index.json'

export default {
  name: 'AppSidebar',
  components: {
    BaseIcon,
    ChapterNav
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chapters: chaptersData.chapters
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.sidebar {
  position: fixed;
  top: $header-height;
  left: 0;
  bottom: 0;
  width: $sidebar-width;
  z-index: $z-fixed;

  @include respond-below('lg') {
    width: 100%;
    pointer-events: none;

    &--open {
      pointer-events: auto;

      .sidebar__overlay {
        opacity: 1;
      }

      .sidebar__content {
        transform: translateX(0);
      }
    }
  }

  &__overlay {
    display: none;

    @include respond-below('lg') {
      display: block;
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity $transition-base;
    }
  }

  &__content {
    position: relative;
    height: 100%;
    width: $sidebar-width;
    background: $color-surface;
    border-right: $border-width solid $border-color;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    @include custom-scrollbar;

    @include respond-below('lg') {
      transform: translateX(-100%);
      transition: transform $transition-base;
    }
  }

  &__header {
    @include flex-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: $border-width solid $border-color;

    @include respond-to('lg') {
      .sidebar__close {
        display: none;
      }
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    margin: 0;
  }

  &__close {
    @include button-icon;
  }

  &__footer {
    margin-top: auto;
    padding: $spacing-lg;
    border-top: $border-width solid $border-color;
  }

  &__download {
    @include button-secondary;
    width: 100%;
    justify-content: center;
  }
}
</style>
