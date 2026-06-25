<template>
  <header class="header">
    <div class="header__container">
      <button 
        class="header__menu-btn"
        @click="$emit('toggle-sidebar')"
        :aria-label="$t('accessibility.openMenu')"
      >
        <BaseIcon name="menu" />
      </button>

      <router-link to="/" class="header__logo">
        <img 
          src="@/assets/images/logo.png" 
          alt="" 
          class="header__logo-img"
        />
        <span class="header__logo-text">
          {{ $t('app.title') }}
        </span>
      </router-link>

      <nav class="header__nav">
        <router-link to="/" class="header__nav-link">
          {{ $t('nav.home') }}
        </router-link>
        <router-link to="/sobre-el-autor" class="header__nav-link">
          {{ $t('nav.about') }}
        </router-link>
        <router-link to="/recursos" class="header__nav-link">
          {{ $t('nav.resources') }}
        </router-link>
      </nav>

      <div class="header__actions">
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher.vue'

export default {
  name: 'AppHeader',
  components: {
    BaseIcon,
    LanguageSwitcher
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-height;
  background: $color-surface;
  border-bottom: $border-width solid $border-color;
  z-index: $z-fixed;

  &__container {
    @include flex-between;
    height: 100%;
    max-width: $max-page-width;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  &__menu-btn {
    @include button-icon;
    display: none;

    @include respond-below('lg') {
      display: flex;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    text-decoration: none;
    color: $color-text-primary;

    &-img {
      height: 36px;
      width: auto;
    }

    &-text {
      font-family: $font-family-heading;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;

      @include respond-below('md') {
        display: none;
      }
    }
  }

  &__nav {
    display: flex;
    gap: $spacing-lg;

    @include respond-below('lg') {
      display: none;
    }

    &-link {
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
      padding: $spacing-sm;
      text-decoration: none;
      transition: color $transition-fast;

      &:hover,
      &.router-link-active {
        color: $color-primary;
      }

      &.router-link-active {
        border-bottom: 2px solid $color-primary;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}
</style>
