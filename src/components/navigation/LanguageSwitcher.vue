<template>
  <div class="language-switcher">
    <select
      class="language-switcher__select"
      :value="currentLocale"
      @change="changeLanguage"
      :aria-label="$t('accessibility.selectLanguage')"
    >
      <option value="es" lang="es">Español</option>
      <option value="en" lang="en">English</option>
      <option value="fr" lang="fr">Français</option>
    </select>
  </div>
</template>

<script>
/**
 * The language menu in the header. Changing it is enough: src/main.js remembers the choice
 * (localStorage) and updates <html lang>; every $t() / $localized() text updates by itself.
 */
export default {
  name: 'LanguageSwitcher',
  computed: {
    currentLocale() {
      return this.$i18n.locale
    }
  },
  methods: {
    changeLanguage(event) {
      this.$i18n.locale = event.target.value
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.language-switcher {
  &__select {
    padding: $spacing-xs $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
    background: $color-surface;
    color: $color-text-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      border-color: $color-primary;
      background: $color-surface-alt;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
    }
  }
}
</style>
