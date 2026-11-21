<template>
  <div class="chapter-three">
    <div v-if="$route.name === 'Chapter3Index'">
      <div class="chapter-three__header">
        <h1>{{ $t('pages.chapter3Index.capitulo3NombreAdjetivo') }}</h1>
        <p>{{ $t('pages.chapter3Index.adjetivosVariablesInvariablesComparativos') }}</p>
      </div>

      <section class="chapter-three__overview">
        <h2 class="overview-title">{{ $t('pages.chapter3Index.aprenderasEsteCapitulo') }}</h2>

        <p class="overview-lead">
          {{ $t('pages.chapter3Index.adjetivosBenga') }}
          <strong>{{ $t('pages.chapter3Index.noVarianSegunGenero') }}</strong
          >{{ $t('pages.chapter3Index.peroDeben') }}
          <strong>{{ $t('pages.chapter3Index.concordarFormaRadicalEstrictamente') }}</strong> en
          <em>{{ $t('pages.chapter3Index.clase') }}</em> y
          <em>{{ $t('pages.chapter3Index.numero') }}</em>
          {{ $t('pages.chapter3Index.singularPluralConSustantivo') }}
          <router-link to="/capitulo-3/introduccion" class="overview-link">{{
            $t('pages.chapter3Index.clasesNominales')
          }}</router-link>
          {{ $t('pages.chapter3Index.condicionanPorTantoTodas') }}
        </p>

        <div class="overview-highlights">
          <router-link to="/capitulo-3/adjetivos-regulares" class="highlight-card">
            <span class="highlight-card__icon">🌿</span>
            <h3>{{ $t('pages.chapter3Index.adjetivosVariables') }}</h3>
            <p v-html="$t('pages.chapter3Index.partenFormaBaseSe')"></p>
          </router-link>

          <router-link to="/capitulo-3/adjetivos-invariables" class="highlight-card">
            <span class="highlight-card__icon">🔒</span>
            <h3>{{ $t('pages.chapter3Index.adjetivosInvariables') }}</h3>
            <p v-html="$t('pages.chapter3Index.conservanFormaUnicaCualquier')"></p>
          </router-link>

          <router-link to="/capitulo-3/comparativos-superlativos" class="highlight-card">
            <span class="highlight-card__icon">⚖️</span>
            <h3>{{ $t('pages.chapter3Index.comparativosSuperlativos') }}</h3>
            <p v-html="$t('pages.chapter3Index.bengaCareceGradosFormales')"></p>
          </router-link>

          <router-link to="/capitulo-3/numerales-ordinales" class="highlight-card">
            <span class="highlight-card__icon">🔢</span>
            <h3>{{ $t('pages.chapter3Index.numeralesOrdinales') }}</h3>
            <p v-html="$t('pages.chapter3Index.cincoPrimerosNumerosConcuerdan')"></p>
          </router-link>
          <p class="overview-note">
            <span class="overview-note__icon">✓</span>
            {{ $t('pages.chapter3Index.dominarEstasVariacionesE') }}
          </p>
        </div>
      </section>

      <section class="chapter-three__sections">
        <h2>{{ $t('pages.chapter3Index.seccionesCapitulo') }}</h2>
        <div class="sections-grid">
          <router-link to="/capitulo-3/introduccion" class="section-card">
            <h3>{{ $t('pages.chapter3Index.introduccion') }}</h3>
            <p>{{ $t('pages.chapter3Index.conceptosFundamentalesAdjetivos') }}</p>
          </router-link>
          <router-link to="/capitulo-3/adjetivos-regulares" class="section-card">
            <h3>{{ $t('pages.chapter3Index.adjetivosRegulares') }}</h3>
            <p>{{ $t('pages.chapter3Index.adjetivosVariablesConcordancia') }}</p>
          </router-link>
          <router-link to="/capitulo-3/adjetivos-invariables" class="section-card">
            <h3>{{ $t('pages.chapter3Index.adjetivosInvariables2') }}</h3>
            <p>{{ $t('pages.chapter3Index.formasFijasSinCambio') }}</p>
          </router-link>
          <router-link to="/capitulo-3/comparativos-superlativos" class="section-card">
            <h3>{{ $t('pages.chapter3Index.comparativosSuperlativos2') }}</h3>
            <p>{{ $t('pages.chapter3Index.expresionComparacionGrado') }}</p>
          </router-link>
          <router-link to="/capitulo-3/numerales-ordinales" class="section-card">
            <h3>{{ $t('pages.chapter3Index.numeralesOrdinales2') }}</h3>
            <p>{{ $t('pages.chapter3Index.sistemaDecimalNumerosOrdinales') }}</p>
          </router-link>
        </div>
      </section>

      <section class="chapter-three__progress">
        <h2>{{ $t('pages.chapter3Index.miProgreso') }}</h2>
        <div class="progress-items">
          <div class="progress-item" v-for="(value, key) in progress" :key="key">
            <input type="checkbox" :id="`ch3-${key}`" v-model="progress[key]" />
            <label :for="`ch3-${key}`">{{ formatLabel(key) }}</label>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </section>

      <div class="chapter-three__cta">
        <router-link to="/capitulo-3/introduccion" class="cta-button">{{
          $t('pages.chapter3Index.comenzar')
        }}</router-link>
      </div>
      <SectionNavFooter />
    </div>

    <!-- key: every section gets a fresh page, even when two sections share SectionPage.vue -->
    <router-view v-else :key="$route.path" />
  </div>
</template>

<script>
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
export default {
  name: 'ChapterThreeIndex',
  components: { SectionNavFooter },
  data() {
    return {
      progress: {
        introduccion: false,
        regulares: false,
        invariables: false,
        comparativos: false,
        numerales: false
      }
    }
  },
  computed: {
    progressPercentage() {
      const completed = Object.values(this.progress).filter((v) => v).length
      return Math.round((completed / Object.keys(this.progress).length) * 100)
    }
  },
  methods: {
    formatLabel(key) {
      return this.$t(`pages.chapter3Index.progressLabels.${key}`)
    }
  },
  watch: {
    progress: {
      handler: function (newVal) {
        localStorage.setItem('chapter3Progress', JSON.stringify(newVal))
      },
      deep: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('chapter3Progress')
    if (saved) {
      this.progress = JSON.parse(saved)
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.chapter-three {
  @include page-container;

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid $color-primary;

    h1 {
      font-size: 2.5rem;
      color: $color-primary;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.1rem;
      color: $color-text-secondary;
    }
  }

  &__sections {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: $color-heading-dark;
    }
  }

  &__overview {
    background: $color-background-light;
    border-left: 4px solid $color-primary;
    border-radius: $border-radius-base;
    padding: $spacing-xl;
    margin-bottom: $spacing-2xl;

    .overview-title {
      font-size: 1.6rem;
      color: $color-primary;
      margin: 0 0 $spacing-md 0;
    }

    .overview-lead {
      font-size: 1.1rem;
      line-height: 1.8;
      color: $color-text-primary;
      margin: 0 0 $spacing-xl 0;

      :deep(strong) {
        color: $color-primary-dark;
      }

      :deep(em) {
        color: $color-secondary-dark;
      }
    }
  }
}

.overview-link {
  color: $color-primary;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  border-bottom: 2px solid rgba($color-primary, 0.3);
  transition: all $transition-fast;

  &:hover {
    color: $color-primary-dark;
    border-bottom-color: $color-primary;
  }
}

.overview-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.highlight-card {
  @include card-base;
  display: block;
  border-top: 3px solid $color-primary;
  text-decoration: none;
  color: $color-text-primary;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba($color-primary, 0.15);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.4rem;
    border-radius: $border-radius-full;
    background: rgba($color-primary, 0.1);
    margin-bottom: $spacing-sm;
  }

  h3 {
    font-size: 1.1rem;
    color: $color-primary;
    margin: 0 0 $spacing-sm 0;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: $color-text-secondary;
    margin: 0;

    :deep(strong) {
      color: $color-text-primary;
    }

    :deep(em) {
      color: $color-secondary-dark;
    }
  }
}

.overview-note {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: $spacing-sm;
  margin: 0;
  padding: $spacing-md $spacing-lg;
  background: rgba($color-primary, 0.87);
  border-radius: $border-radius-base;
  font-size: 1rem;
  color: $color-text-inverse;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    border-radius: 50%;
    background: $color-success;
    color: white;
    font-weight: $font-weight-bold;
    font-size: 0.85rem;
  }
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  .section-card {
    @include card-base;
    padding: 1.5rem;
    transition: all $transition-base;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba($color-primary, 0.15);
    }

    h3 {
      color: $color-primary;
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: $color-text-secondary;
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
}

.chapter-three__progress {
  background: $color-background-light;
  padding: 2rem;
  border-radius: $border-radius-base;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: $color-heading-dark;
  }
}

.progress-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  input[type='checkbox'] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    accent-color: $color-primary;
  }

  label {
    cursor: pointer;
    color: $color-text-primary;
    font-weight: 500;
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary, $color-primary-light);
  transition: width 0.3s ease;
}

.chapter-three__cta {
  text-align: center;
  margin-top: 2rem;
}

.cta-button {
  @include button-base;
  background-color: $color-primary;
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;

  &:hover {
    background-color: $color-primary-dark;
  }
}
</style>
