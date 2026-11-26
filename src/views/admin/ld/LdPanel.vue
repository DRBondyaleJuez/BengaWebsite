<template>
  <section class="ld-panel">
    <p v-if="error" class="ld-panel__error" role="alert">{{ error }}</p>
    <p v-else-if="!summary" class="ld-panel__loading">Cargando…</p>

    <template v-else>
      <div class="ld-panel__stats">
        <router-link
          v-for="stat in stats"
          :key="stat.label"
          :to="stat.to"
          class="ld-panel__stat"
          :class="`ld-panel__stat--${stat.tone || 'plain'}`"
        >
          <span class="ld-panel__stat-value">{{ stat.value }}</span>
          <span class="ld-panel__stat-label">{{ stat.label }}</span>
        </router-link>
      </div>

      <div class="ld-panel__columns">
        <section class="ld-panel__card">
          <h2>
            Sincronizar
            <InfoTip
              text="Nada se envía ni se trae solo: cada sincronización empieza cuando pulsas un botón, muestra antes qué va a cambiar y queda registrada."
            />
          </h2>
          <p class="ld-panel__muted">
            Última lectura del diccionario: <strong>{{ pulledAt }}</strong>
          </p>
          <ul class="ld-panel__actions">
            <li v-for="action in actions" :key="action.text">
              <router-link v-if="action.to" :to="action.to" class="ld-panel__action">
                <span aria-hidden="true">{{ action.icon }}</span> {{ action.text }}
              </router-link>
              <button v-else type="button" class="ld-panel__action" disabled :title="action.when">
                <span aria-hidden="true">{{ action.icon }}</span> {{ action.text }}
              </button>
              <span class="ld-panel__muted">
                {{ action.when
                }}<template v-if="action.command">
                  · por ahora: <code>{{ action.command }}</code></template
                >
              </span>
            </li>
          </ul>
        </section>

        <section class="ld-panel__card">
          <h2>Qué hacer ahora</h2>
          <EmptyState
            v-if="!todo.length"
            icon="🎉"
            title="Nada pendiente"
            text="Todas las entradas tienen traducción, categoría y dominio."
          />
          <ul v-else class="ld-panel__todo">
            <li v-for="item in todo" :key="item.text">
              <router-link :to="item.to">
                <strong>{{ item.count }}</strong> {{ item.text }}
              </router-link>
            </li>
          </ul>
          <p class="ld-panel__muted">
            <router-link to="/admin/living-dictionary/entradas?nueva=1"
              >+ Añadir una palabra</router-link
            >
          </p>
        </section>
      </div>
    </template>
  </section>
</template>

<script>
/**
 * Panel of /admin/living-dictionary: counts of the workspace, sync buttons (they become active in
 * phases L5/L6) and "what to do next" links that open the entries table already filtered.
 */
import InfoTip from '@/components/admin/InfoTip.vue'
import EmptyState from '@/components/admin/EmptyState.vue'
import { getSummary } from './ldApi'

const ENTRIES = '/admin/living-dictionary/entradas'
const SENTENCES = '/admin/living-dictionary/oraciones'

export default {
  name: 'LdPanel',
  components: { InfoTip, EmptyState },
  data() {
    return {
      summary: null,
      error: '',
      actions: [
        {
          icon: '⬇️',
          text: 'Traer de Living Dictionaries',
          when: 'Muestra antes qué cambiaría',
          command: 'npm run ld:pull',
          to: '/admin/living-dictionary/sincronizacion#traer'
        },
        {
          icon: '⬆️',
          text: 'Enviar cambios',
          when: 'Con vista previa y confirmación',
          command: 'npm run ld:push',
          to: '/admin/living-dictionary/sincronizacion#enviar'
        },
        { icon: '☁️', text: 'Copiar audios a Cloudinary', when: 'Fase L6' }
      ]
    }
  },
  computed: {
    pulledAt() {
      if (!this.summary?.pulledAt) return 'nunca (ejecuta npm run ld:pull)'
      return new Date(this.summary.pulledAt).toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short'
      })
    },
    stats() {
      const s = this.summary
      const changed = (s.byState['local-changes'] || 0) + (s.byState.new || 0)
      const problems = (s.byState.conflict || 0) + (s.byState.error || 0)
      return [
        { value: s.entries, label: 'entradas', to: ENTRIES },
        { value: s.senses, label: 'sentidos', to: ENTRIES },
        { value: s.sentences, label: 'oraciones', to: SENTENCES },
        {
          value: changed,
          label: 'con cambios sin enviar',
          to: `${ENTRIES}?estado=local-changes,new`,
          tone: changed ? 'info' : 'plain'
        },
        {
          value: s.needsReview,
          label: 'necesitan revisión',
          to: `${ENTRIES}?revision=si`,
          tone: s.needsReview ? 'warn' : 'plain'
        },
        {
          value: problems,
          label: 'con conflicto o error',
          to: `${ENTRIES}?estado=conflict,error`,
          tone: problems ? 'error' : 'plain'
        },
        { value: s.linkedToSite, label: 'enlazadas con la web', to: `${ENTRIES}?web=si` }
      ]
    },
    todo() {
      const s = this.summary
      const items = [
        ...['es', 'en', 'fr'].map((lang) => ({
          count: s.missingGloss[lang],
          text: `sentidos sin traducción (${{ es: 'español', en: 'inglés', fr: 'francés' }[lang]})`,
          to: `${ENTRIES}?falta=${lang}`
        })),
        {
          count: s.withoutPartOfSpeech,
          text: 'sentidos sin categoría gramatical',
          to: `${ENTRIES}?falta=pos`
        },
        {
          count: s.withoutDomain,
          text: 'sentidos sin dominio semántico',
          to: `${ENTRIES}?falta=dominio`
        },
        { count: s.entriesWithoutAudio, text: 'palabras sin audio', to: `${ENTRIES}?audio=no` },
        {
          count: s.sentencesWithoutAudio,
          text: 'oraciones sin audio',
          to: `${SENTENCES}?audio=no`
        },
        { count: s.suggestions, text: 'sugerencias por revisar', to: `${ENTRIES}?sugerencias=si` }
      ]
      return items.filter((item) => item.count > 0)
    }
  },
  async created() {
    try {
      this.summary = await getSummary()
    } catch (error) {
      this.error = `No se pudo leer el diccionario local: ${error.message}`
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.ld-panel {
  &__error {
    padding: $spacing-md;
    background: rgba($color-error, 0.1);
    border-left: 4px solid $color-error;
  }

  &__loading,
  &__muted {
    color: $color-text-muted;
    font-size: $font-size-sm;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    padding: $spacing-md;
    background: $color-surface;
    border: 1px solid $color-surface-alt;
    border-left: 4px solid $color-primary-light;
    border-radius: $border-radius;
    color: $color-text-primary;
    text-decoration: none;
    transition: transform $transition-fast;

    &:hover {
      transform: translateY(-2px);
      text-decoration: none;
      color: $color-text-primary;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--info {
      border-left-color: #1f6fb2;
    }

    &--warn {
      border-left-color: #e08a00;
    }

    &--error {
      border-left-color: $color-error;
    }
  }

  &__stat-value {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-primary-dark;
  }

  &__stat-label {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;
  }

  &__card {
    @include card-base;
    padding: $spacing-lg;

    h2 {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-top: 0;
      font-size: $font-size-xl;
      color: $color-primary-dark;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }
  }

  &__action {
    @include button-primary;
    align-self: flex-start;
    font-size: $font-size-base;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__todo {
    padding: 0;
    list-style: none;

    li {
      padding: $spacing-sm 0;
      border-bottom: 1px solid $color-surface-alt;
    }

    strong {
      display: inline-block;
      min-width: 2.5rem;
      color: $color-secondary;
    }
  }
}
</style>
