<template>
  <div class="sections-list">
    <div v-for="(item, idx) in items" :key="`section-${idx}`" class="section-item">
      <div class="section-item__icon">{{ idx + 1 }}</div>
      <div class="section-item__content">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
        <router-link :to="item.to" class="section-link">
          {{ linkLabel || $t('content.learnMore') }} →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * A numbered list of pages to visit next (e.g. the sections of a chapter).
 *
 *   ( 1 )  Adjetivos Variables
 *          Adjetivos que cambian de forma…
 *          Aprende más →
 *
 *   <SectionLinks :items="[{ title: '…', text: '…', to: '/capitulo-3/adjetivos-regulares' }]" />
 *
 * Section-file block: { "type": "links", "items": [{ "title", "text", "to" }] }
 */
export default {
  name: 'SectionLinks',
  props: {
    /** [{ title, text, to }] — `to` is a site URL. */
    items: { type: Array, required: true },
    /** Default: «Aprende más» in the visitor's language (content.learnMore) */
    linkLabel: { type: String, default: null }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: $color-background-light;
  border-radius: $border-radius-base;
  transition: all $transition-base;

  &:hover {
    box-shadow: 0 4px 12px rgba($color-primary, 0.1);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    min-width: 3rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
  }

  &__content {
    flex: 1;

    h3 {
      color: $color-primary;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: $color-text-primary;
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
  }
}

.section-link {
  display: inline-block;
  color: $color-primary;
  font-weight: 600;
  transition: color $transition-fast;

  &:hover {
    color: $color-primary-dark;
  }
}
</style>
