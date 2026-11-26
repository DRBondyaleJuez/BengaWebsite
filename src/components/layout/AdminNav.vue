<template>
  <nav class="admin-nav" aria-label="Herramientas de administración">
    <span class="admin-nav__label">Admin (solo desarrollo)</span>
    <router-link v-for="link in links" :key="link.to" :to="link.to" class="admin-nav__link">
      {{ link.text }}
    </router-link>
    <router-link to="/" class="admin-nav__link admin-nav__link--site"
      >← Volver a la web</router-link
    >
  </nav>
</template>

<script>
/**
 * Bar with the developer pages (shown by App.vue on every /admin/… page, which exist only during
 * `npm run serve`). To add a page: add its route in src/router/index.js and a line here.
 */
export default {
  name: 'AdminNav',
  data() {
    return {
      links: [
        { to: '/admin/living-dictionary', text: 'Living Dictionary' },
        { to: '/admin/palabras', text: 'Palabras' },
        { to: '/admin/audios', text: 'Audios' },
        { to: '/admin/translations', text: 'Traducciones' },
        { to: '/admin/ocr', text: 'OCR' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  padding: $spacing-xs $spacing-md;
  background: $color-primary-dark;
  border-radius: $border-radius-sm;

  &__label {
    margin-right: $spacing-sm;
    font-size: $font-size-xs;
    color: $color-text-inverse;
    opacity: 0.75;
  }

  &__link {
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    color: $color-text-inverse;
    text-decoration: none;
    @include focus-ring;

    &:hover,
    &.router-link-active:not(&--site) {
      background: rgba(255, 255, 255, 0.2);
    }

    &--site {
      margin-left: auto;
    }
  }
}
</style>
