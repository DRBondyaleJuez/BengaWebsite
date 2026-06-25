<template>
  <div class="adjectives-intro">
    <div class="adjectives-intro__header">
      <h1>Introducción a los Adjetivos</h1>
      <p class="subtitle">Del Nombre Adjetivo - Capítulo 3 de Salvado y Cos</p>
    </div>

    <!-- Overview Section -->
    <section class="adjectives-intro__overview">
      <h2>Conceptos Fundamentales</h2>
      <div class="overview-text">
        <p>
          En la lengua Benga, los adjetivos constan de <strong>número</strong> y <strong>clasificación</strong>, 
          pero no tienen caso ni género. A diferencia del español, carecen de grados de comparación convencionales. 
          Los adjetivos se dividen en dos categorías principales: <strong>variables e invariables</strong>.
        </p>
      </div>
    </section>

    <!-- Key Concepts Grid -->
    <section class="adjectives-intro__concepts">
      <h2>Características Principales</h2>
      <div class="concepts-grid">
        <div class="concept-card" v-for="(concept, idx) in keyGrammaticalConcepts" :key="`concept-${idx}`">
          <div class="concept-card__header">
            <h3>{{ concept.concept }}</h3>
          </div>
          <p class="concept-card__explanation">
            {{ concept.explanation }}
          </p>
          <div class="concept-card__example">
            <strong>Ejemplo:</strong>
            <span class="bengaword">{{ concept.example }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Overview -->
    <section class="adjectives-intro__sections">
      <h2>Secciones del Capítulo</h2>
      <div class="sections-list">
        <div class="section-item" v-for="(section, idx) in sectionOverview" :key="`section-${idx}`">
          <div class="section-item__icon">{{ idx + 1 }}</div>
          <div class="section-item__content">
            <h3>{{ section.title }}</h3>
            <p>{{ section.description }}</p>
            <router-link :to="`/capitulo-3/${section.id}`" class="section-link">
              Aprende más →
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Points -->
    <section class="adjectives-intro__keypoints">
      <h2>Puntos Clave a Recordar</h2>
      <div class="keypoints-box">
        <div class="keypoint" v-for="(note, idx) in notes" :key="`note-${idx}`">
          <span class="keypoint__icon">✓</span>
          <span class="keypoint__text">{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <div class="adjectives-intro__navigation">
      <router-link to="/capitulo-3" class="nav-button nav-button--back">
        ← Volver al Capítulo 3
      </router-link>
      <router-link to="/capitulo-3/adjetivos-regulares" class="nav-button nav-button--next">
        Siguiente: Adjetivos Regulares →
      </router-link>
    </div>
  </div>
</template>

<script>
import adjectivesIntroData from '@/data/chapter-3/adjectives-intro.json';

export default {
  name: 'AdjectivesIntro',
  data() {
    return {
      keyGrammaticalConcepts: [],
      sectionOverview: [],
      notes: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.keyGrammaticalConcepts = adjectivesIntroData.keyGrammaticalConcepts;
      this.sectionOverview = adjectivesIntroData.sectionOverview;
      this.notes = adjectivesIntroData.keyGrammaticalConcepts.map(c => c.explanation);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.adjectives-intro {
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

    .subtitle {
      font-size: 1.1rem;
      color: $color-text-secondary;
    }
  }

  &__overview {
    background: $color-background-light;
    padding: 2rem;
    border-radius: $border-radius-base;
    margin-bottom: 3rem;
    border-left: 4px solid $color-primary;

    h2 {
      font-size: 1.8rem;
      color: $color-primary;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.8;
      color: $color-text-primary;
    }
  }
}

.adjectives-intro__concepts {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    color: $color-heading-dark;
    margin-bottom: 1.5rem;
  }
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  .concept-card {
    @include card-base;
    padding: 1.5rem;
    border-top: 3px solid $color-primary;

    &__header {
      margin-bottom: 1rem;

      h3 {
        color: $color-primary;
        font-size: 1.2rem;
      }
    }

    &__explanation {
      color: $color-text-primary;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    &__example {
      background: #f9f9f9;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.95rem;
      color: $color-text-secondary;

      .bengaword {
        display: block;
        color: $color-primary;
        font-weight: 600;
        margin-top: 0.5rem;
      }
    }
  }
}

.adjectives-intro__sections {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    color: $color-heading-dark;
    margin-bottom: 1.5rem;
  }
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: $color-background-light;
  border-radius: $border-radius-base;
  transition: all $transition-base;

  &:hover {
    box-shadow: 0 4px 12px rgba($color-primary, 0.1);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    min-width: 3rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
  }

  &__content {
    flex: 1;

    h3 {
      color: $color-primary;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: $color-text-primary;
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
  }
}

.section-link {
  display: inline-block;
  color: $color-primary;
  font-weight: 600;
  transition: color $transition-fast;

  &:hover {
    color: $color-primary-dark;
  }
}

.adjectives-intro__keypoints {
  background: #f0f7ff;
  padding: 2rem;
  border-radius: $border-radius-base;
  margin-bottom: 2rem;
  border-left: 4px solid $color-primary;

  h2 {
    font-size: 1.5rem;
    color: $color-primary;
    margin-bottom: 1.5rem;
  }
}

.keypoints-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.keypoint {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
  }

  &__text {
    color: $color-text-primary;
    line-height: 1.6;
  }
}

.adjectives-intro__navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.nav-button {
  @include button-base;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: $border-radius-base;
  transition: all $transition-base;

  &--back {
    background-color: #f0f0f0;
    color: $color-text-primary;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &--next {
    background-color: $color-primary;
    color: white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
</style>
