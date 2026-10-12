<template>
  <div class="chapter-three">
    <div v-if="$route.name === 'Chapter3Index'">
    <div class="chapter-three__header">
      <h1>Capítulo 3: Del Nombre Adjetivo</h1>
      <p>Adjetivos variables, invariables, comparativos y numerales</p>
    </div>

    <section class="chapter-three__overview">
      <h2 class="overview-title">¿Qué aprenderás en este capítulo?</h2>

      <p class="overview-lead">
        Los adjetivos en benga <strong>no varían según el género</strong>, pero deben
        <strong>concordar de forma radical estrictamente</strong> en <em>clase</em> y <em>número</em>
        (singular o plural) con el sustantivo al que modifican. Las
        <router-link to="/capitulo-3/introduccion" class="overview-link">clases nominales</router-link>
        condicionan, por tanto, todas las palabras que acompañan al nombre (adjunto).
      </p>

      <div class="overview-highlights">
        <router-link to="/capitulo-3/adjetivos-regulares" class="highlight-card">
          <span class="highlight-card__icon">🌿</span>
          <h3>Adjetivos variables</h3>
          <p>
            Parten de una forma base que se <strong>inflexiona</strong> para adaptarse a las
            <em>siete clases</em> de sustantivos.
          </p>
        </router-link>

        <router-link to="/capitulo-3/adjetivos-invariables" class="highlight-card">
          <span class="highlight-card__icon">🔒</span>
          <h3>Adjetivos invariables</h3>
          <p>
            Conservan una <strong>forma única</strong> en cualquier contexto, sin variar con la
            clase nominal.
          </p>
        </router-link>

        <router-link to="/capitulo-3/comparativos-superlativos" class="highlight-card">
          <span class="highlight-card__icon">⚖️</span>
          <h3>Comparativos y superlativos</h3>
          <p>
            El benga <strong>carece de grados formales</strong> de comparación y recurre a
            <em>circunloquios</em> o giros expresivos.
          </p>
        </router-link>

        <router-link to="/capitulo-3/numerales-ordinales" class="highlight-card">
          <span class="highlight-card__icon">🔢</span>
          <h3>Numerales y ordinales</h3>
          <p>
            Los <strong>cinco primeros números</strong> concuerdan como adjetivos variables; los
            ordinales usan la <em>preposición "de" declinada</em> más el número cardinal.
          </p>
        </router-link>
        <p class="overview-note">
          <span class="overview-note__icon">✓</span>
          Dominar estas variaciones e inflexiones es fundamental para la
          estructura y la concordancia de la lengua benga.
        </p>
      </div>


    </section>

    <section class="chapter-three__sections">
      <h2>Secciones del Capítulo</h2>
      <div class="sections-grid">
        <router-link to="/capitulo-3/introduccion" class="section-card">
          <h3>Introducción</h3>
          <p>Conceptos fundamentales de los adjetivos</p>
        </router-link>
        <router-link to="/capitulo-3/adjetivos-regulares" class="section-card">
          <h3>Adjetivos Regulares</h3>
          <p>Adjetivos variables y concordancia</p>
        </router-link>
        <router-link to="/capitulo-3/adjetivos-invariables" class="section-card">
          <h3>Adjetivos Invariables</h3>
          <p>Formas fijas sin cambio</p>
        </router-link>
        <router-link to="/capitulo-3/comparativos-superlativos" class="section-card">
          <h3>Comparativos y Superlativos</h3>
          <p>Expresión de comparación y grado</p>
        </router-link>
        <router-link to="/capitulo-3/numerales-ordinales" class="section-card">
          <h3>Numerales y Ordinales</h3>
          <p>Sistema decimal y números ordinales</p>
        </router-link>
      </div>
    </section>

    <section class="chapter-three__progress">
      <h2>Mi Progreso</h2>
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
      <router-link to="/capitulo-3/introduccion" class="cta-button">Comenzar →</router-link>
    </div>
    </div>

    <router-view v-else />
  </div>
</template>

<script>
export default {
  name: 'ChapterThreeIndex',
  data() {
    return {
      progress: {
        introduccion: false,
        regulares: false,
        invariables: false,
        comparativos: false,
        numerales: false,
      }
    }
  },
  computed: {
    progressPercentage() {
      const completed = Object.values(this.progress).filter(v => v).length;
      return Math.round((completed / Object.keys(this.progress).length) * 100);
    }
  },
  methods: {
    formatLabel(key) {
      const labels = {
        introduccion: 'Introducción',
        regulares: 'Adjetivos Regulares',
        invariables: 'Adjetivos Invariables',
        comparativos: 'Comparativos y Superlativos',
        numerales: 'Numerales y Ordinales'
      };
      return labels[key] || key;
    }
  },
  watch: {
    progress: {
      handler: function(newVal) {
        localStorage.setItem('chapter3Progress', JSON.stringify(newVal));
      },
      deep: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('chapter3Progress');
    if (saved) {
      this.progress = JSON.parse(saved);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

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

      strong {
        color: $color-primary-dark;
      }

      em {
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

    strong {
      color: $color-text-primary;
    }

    em {
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

  input[type="checkbox"] {
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
