<template>
  <div class="language-switcher">
    <select 
      class="language-switcher__select"
      :value="currentLocale"
      @change="changeLanguage"
      :aria-label="$t('accessibility.selectLanguage')"
    >
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  </div>
</template>

<script>
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
      // Persist to localStorage for user preference
      localStorage.setItem('app-language', event.target.value)
    }
  },
  mounted() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('app-language')
    if (savedLanguage && ['es', 'en', 'fr'].includes(savedLanguage)) {
      this.$i18n.locale = savedLanguage
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

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
