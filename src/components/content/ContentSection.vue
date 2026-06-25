<template>
  <section :id="id" class="content-section">
    <header v-if="title || $slots.header" class="content-section__header">
      <slot name="header">
        <h2 class="content-section__title">{{ title }}</h2>
        <p v-if="subtitle" class="content-section__subtitle">{{ subtitle }}</p>
      </slot>
    </header>

    <div class="content-section__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="content-section__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script>
export default {
  name: 'ContentSection',
  props: {
    id: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.content-section {
  margin-bottom: $spacing-2xl;

  &__header {
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 2px solid $color-primary;
  }

  &__title {
    @include heading-style;
    font-size: $font-size-2xl;
    margin: 0 0 $spacing-xs;
  }

  &__subtitle {
    color: $color-text-secondary;
    font-size: $font-size-lg;
    margin: 0;
  }

  &__body {
    line-height: $line-height-loose;

    p {
      margin-bottom: $spacing-md;
    }

    ul, ol {
      margin: $spacing-md 0;
      padding-left: $spacing-xl;
    }

    li {
      margin-bottom: $spacing-sm;
    }
  }

  &__footer {
    margin-top: $spacing-lg;
    padding-top: $spacing-md;
    border-top: $border-width solid $border-color;
  }
}
</style>
