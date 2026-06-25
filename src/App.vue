<template>
  <div id="app" class="app">
    <a href="#main-content" class="skip-link">
      {{ $t('accessibility.skipToContent') }}
    </a>
    
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <div class="app__body">
      <AppSidebar 
        :is-open="sidebarOpen" 
        @close="sidebarOpen = false"
      />
      
      <main id="main-content" class="app__main">
        <router-view />
      </main>
    </div>
    
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  data() {
    return {
      sidebarOpen: false
    }
  },
  watch: {
    $route() {
      // Close sidebar on route change (mobile)
      this.sidebarOpen = false
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__body {
    display: flex;
    flex: 1;
    padding-top: $header-height;
  }

  &__main {
    flex: 1;
    padding: $spacing-xl;
    max-width: $max-content-width;
    margin: 0 auto;
    width: 100%;

    @include respond-below('md') {
      padding: $spacing-md;
    }
  }
}

.skip-link {
  position: absolute;
  top: -100%;
  left: $spacing-md;
  z-index: $z-tooltip;
  padding: $spacing-sm $spacing-md;
  background: $color-primary;
  color: $color-text-inverse;
  border-radius: $border-radius-sm;
  text-decoration: none;

  &:focus {
    top: $spacing-md;
  }
}
</style>

