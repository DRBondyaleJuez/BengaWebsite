<template>
  <!-- Vue 3 mounts this inside <div id="app"> of index.html, so no id here (avoids a duplicate id) -->
  <div class="app">
    <a href="#main-content" class="skip-link">
      {{ $t('accessibility.skipToContent') }}
    </a>

    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="app__body" :class="{ 'app__body--admin': isAdmin }">
      <!-- The chapter list is not needed on the developer pages: they use the whole width -->
      <AppSidebar v-if="!isAdmin" :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <main id="main-content" class="app__main" :class="{ 'app__main--wide': isAdmin }">
        <AdminNav v-if="isAdmin" />
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
import AdminNav from '@/components/layout/AdminNav.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    AdminNav
  },
  data() {
    return {
      sidebarOpen: false
    }
  },
  computed: {
    /** Developer pages (/admin/…, only during npm run serve). */
    isAdmin() {
      return this.$route.path.startsWith('/admin')
    }
  },
  watch: {
    $route(to) {
      // Close sidebar on route change (mobile)
      this.sidebarOpen = false
      // Browser-tab title from chapters-index.json (route meta). Runs before the new page is
      // created, so a page that sets its own document.title still wins.
      if (to.meta.titleKey) document.title = `${this.$t(to.meta.titleKey)} | Portal Benga`
      else if (to.meta.title) document.title = to.meta.title
    },
    // New language: the tab title follows (pages only set theirs when they open)
    '$i18n.locale'() {
      if (this.$route.meta.titleKey) {
        document.title = `${this.$t(this.$route.meta.titleKey)} | Portal Benga`
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__body {
    display: flex;
    flex: 1;
    padding-top: $header-height;

    // From 992 px the sidebar is always visible (fixed on the left): keep its width free, so the
    // page is centred in the space next to it instead of under it. Below 992 px the sidebar is
    // hidden and opens with the menu button in the header.
    @include respond-to('lg') {
      padding-left: $sidebar-width;
    }

    &--admin {
      padding-left: 0 !important;
    }
  }

  &__main {
    // --page-gutter: inner side padding of the page wrappers (views use var(--page-gutter)).
    --page-gutter: #{$spacing-lg};
    flex: 1;
    padding: $spacing-xl;
    max-width: $max-content-width;
    margin: 0 auto;
    width: 100%;
    min-width: 0;

    // Below 992 px the menu is folded into the header button: use less side space (R-031)
    @include respond-below('lg') {
      --page-gutter: #{$spacing-xs};
      padding: $spacing-md;
    }

    @include respond-below('sm') {
      --page-gutter: 0;
      padding: $spacing-md $spacing-sm;
    }

    // Developer pages (/admin/…, only during npm run serve) use the whole width
    &--wide {
      max-width: none;
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
