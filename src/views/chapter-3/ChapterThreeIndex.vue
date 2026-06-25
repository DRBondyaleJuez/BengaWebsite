<template>
  <div class="chapter-three">
    <div class="chapter-three__header">
      <h1>Capítulo 3: Del Nombre Adjetivo</h1>
      <p>Adjetivos variables, invariables, comparativos y numerales</p>
    </div>

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
