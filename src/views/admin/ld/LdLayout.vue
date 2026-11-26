<template>
  <div class="ld-admin">
    <header class="ld-admin__header">
      <div class="ld-admin__title">
        <h1>Living Dictionary · Benga</h1>
        <p>
          Copia local del diccionario
          <a :href="dictionaryUrl" target="_blank" rel="noopener">livingdictionaries.app/benga ↗</a
          >. Lo que cambies aquí no se envía hasta que pulses «Enviar cambios» (fase L5).
        </p>
      </div>
      <nav class="ld-admin__tabs" aria-label="Secciones del diccionario">
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="ld-admin__tab"
          :class="{ 'ld-admin__tab--active': isActive(tab) }"
        >
          <span aria-hidden="true">{{ tab.icon }}</span> {{ tab.text }}
        </router-link>
        <span
          v-for="tab in soon"
          :key="tab.text"
          class="ld-admin__tab ld-admin__tab--soon"
          :title="`Llega en la ${tab.phase}`"
        >
          <span aria-hidden="true">{{ tab.icon }}</span> {{ tab.text }}
          <small>{{ tab.phase }}</small>
        </span>
      </nav>
    </header>

    <router-view />
    <ToastHost />
  </div>
</template>

<script>
/**
 * Frame of /admin/living-dictionary (dev only): title, tabs and the page of the chosen tab.
 * Pages: LdPanel (Panel), LdEntries (Entradas), LdSentences (Oraciones) and their forms EntryForm /
 * SentenceForm (`entrada/:id`, `oracion/:id`). Plan: docs/LD-ROADMAP.md.
 */
import ToastHost from '@/components/admin/ToastHost.vue'
import { LIVING_DICTIONARY_HOME } from '@/config/external'

export default {
  name: 'LdLayout',
  components: { ToastHost },
  data() {
    return {
      dictionaryUrl: LIVING_DICTIONARY_HOME,
      tabs: [
        { to: '/admin/living-dictionary', text: 'Panel', icon: '🏠', exact: true },
        { to: '/admin/living-dictionary/entradas', text: 'Entradas', icon: '📖', also: 'entrada/' },
        {
          to: '/admin/living-dictionary/oraciones',
          text: 'Oraciones',
          icon: '💬',
          also: 'oracion/'
        }
      ],
      soon: [
        { text: 'Sincronización', icon: '🔄', phase: 'fase L5' },
        { text: 'Grabar', icon: '🎙️', phase: 'fase L6' }
      ]
    }
  },
  methods: {
    isActive(tab) {
      const path = this.$route.path.replace(/\/$/, '')
      if (tab.exact) return path === tab.to
      return (
        path.startsWith(tab.to) ||
        (tab.also && path.startsWith(`/admin/living-dictionary/${tab.also}`))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.ld-admin {
  &__header {
    margin-bottom: $spacing-lg;
    border-bottom: 2px solid $color-accent;
  }

  &__title {
    h1 {
      margin: 0 0 $spacing-xs;
      color: $color-primary-dark;
    }

    p {
      margin: 0 0 $spacing-md;
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-sm $border-radius-sm 0 0;
    color: $color-text-secondary;
    font-weight: $font-weight-semibold;
    text-decoration: none;

    &:hover {
      background: $color-surface-alt;
      text-decoration: none;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--active {
      background: $color-primary;
      color: $color-text-inverse;

      &:hover {
        background: $color-primary-dark;
        color: $color-text-inverse;
      }
    }

    &--soon {
      color: $color-text-muted;
      cursor: default;

      small {
        font-weight: normal;
        font-size: $font-size-xs;
      }

      &:hover {
        background: none;
      }
    }
  }
}
</style>
