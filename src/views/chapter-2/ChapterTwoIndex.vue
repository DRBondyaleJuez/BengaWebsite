<template>
  <div class="chapter-two">
    <div v-if="$route.name === 'Chapter2Index'">
      <div class="chapter-two__header">
        <h1>Capítulo 2: Del Nombre Sustantivo</h1>
        <p>Clasificación nominal - El sistema de siete clases del Benga</p>
      </div>

      <section class="chapter-two__sections">
        <h2>Secciones del Capítulo</h2>
        <div class="sections-grid">
          <router-link to="/capitulo-2/introduccion" class="section-card">
            <h3>Introducción</h3>
            <p>Aprende los principios de clasificación</p>
          </router-link>
          <router-link to="/capitulo-2/clase-1" class="section-card">
            <h3>Clase 1: e → be</h3>
            <p>Primera clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-2" class="section-card">
            <h3>Clase 2: i/di → ma</h3>
            <p>Segunda clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-3" class="section-card">
            <h3>Clase 3: u/mú → me/mi</h3>
            <p>Tercera clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-4" class="section-card">
            <h3>Clase 4: bo/ba → mi</h3>
            <p>Cuarta clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-5" class="section-card">
            <h3>Clase 5: mo → ba</h3>
            <p>Quinta clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-6" class="section-card">
            <h3>Clase 6: v → l</h3>
            <p>Sexta clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/clase-7" class="section-card">
            <h3>Clase 7: Invariables</h3>
            <p>Séptima clase nominal</p>
          </router-link>
          <router-link to="/capitulo-2/irregulares" class="section-card">
            <h3>Irregulares</h3>
            <p>Excepciones nominales</p>
          </router-link>
          <router-link to="/capitulo-2/verbales" class="section-card">
            <h3>Nombres Verbales</h3>
            <p>Nominalizaciones</p>
          </router-link>
        </div>
      </section>

      <section class="chapter-two__progress">
        <h2>Mi Progreso</h2>
        <div class="progress-items">
          <div class="progress-item" v-for="(value, key) in progress" :key="key">
            <input type="checkbox" :id="`ch2-${key}`" v-model="progress[key]" />
            <label :for="`ch2-${key}`">{{ key }}</label>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </section>

      <div class="chapter-two__cta">
        <router-link to="/capitulo-2/introduccion" class="cta-button">Comenzar →</router-link>
      </div>
    </div>

    <router-view v-else />
  </div>
</template>

<script>
export default {
  name: 'ChapterTwoIndex',
  data() {
    return {
      progress: {
        intro: false,
        class1: false,
        class2: false,
        class3: false,
        class4: false,
        class5: false,
        class6: false,
        class7: false,
        irregular: false,
        verbal: false
      }
    };
  },
  computed: {
    progressPercentage() {
      const completed = Object.values(this.progress).filter(v => v).length;
      const total = Object.keys(this.progress).length;
      return Math.round((completed / total) * 100);
    }
  },
  watch: {
    progress: {
      handler(newProgress) {
        localStorage.setItem('chapter2Progress', JSON.stringify(newProgress));
      },
      deep: true
    }
  },
  created() {
    const savedProgress = localStorage.getItem('chapter2Progress');
    if (savedProgress) {
      this.progress = JSON.parse(savedProgress);
    }
    document.title = 'Capítulo 2: Del Nombre Sustantivo | Portal Benga';
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.chapter-two {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
    color: white;
    padding: 3rem $spacing-lg;
    border-radius: $border-radius;
    text-align: center;
    margin-bottom: $spacing-xl;

    h1 { font-size: 2.5rem; margin: 0 0 $spacing-md 0; }
    p { font-size: 1.1rem; margin: 0; }
  }

  &__sections {
    margin-bottom: $spacing-xl;

    h2 { color: $color-primary; margin-bottom: $spacing-lg; }

    .sections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-lg;
    }

    .section-card {
      background: white;
      padding: $spacing-lg;
      border-radius: $border-radius;
      text-decoration: none;
      color: $color-text-primary;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      &:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }

      h3 { margin: 0 0 $spacing-sm 0; color: $color-primary; }
      p { margin: 0; color: $color-text-secondary; }
    }
  }

  &__progress {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    margin-bottom: $spacing-xl;

    h2 { color: $color-primary; margin-top: 0; }

    .progress-items { margin-bottom: $spacing-lg; }
    .progress-item { display: flex; align-items: center; margin-bottom: $spacing-sm; }
    input { margin-right: $spacing-md; accent-color: $color-accent; }

    .progress-bar {
      height: 24px;
      background: #e0e0e0;
      border-radius: 12px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $color-accent, $color-primary);
        transition: width 0.3s ease;
      }
    }
  }

  &__cta {
    text-align: center;

    .cta-button {
      display: inline-block;
      background: $color-accent;
      color: white;
      padding: $spacing-md $spacing-lg;
      border-radius: $border-radius;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;

      &:hover {
        background: darken($color-accent, 10%);
        transform: translateY(-2px);
      }
    }
  }
}
</style>